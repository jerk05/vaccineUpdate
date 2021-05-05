const config = require('../config');
const axiosClient = require('../connector/axios');
const mailer = require('../connector/mailer');
const logger = require('../logging/logger');

'http:localhost/api/slots/getSlotsByDistrict?district_id=394&date=03-05-2021&email=rawllopes@gmail.com'
exports.getSlotsByDistrict = async (req, res) => {
    try {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        let interval = setInterval(() => {
            checkSlots(req, false, -1).then(slots => {
                res.write("Checking");
                if (slots.length) {
                } else {
                }
            });
        }, 30000);

        res.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    } catch (error) {
        console.log(error);
    }

};

/* exports.checkSlotsbyDistrict = (req) => {
    return new Promise((resolve, reject) => {
        const reqDistrictId = req.query.district_id;
        const reqDate = req.query.date;
        let date = new Date().toLocaleDateString();
        date = date.split('/');
        const month = date[1].length == 1 ? `0${date[1]}` : date[1];
        const day = date[0].length == 1 ? `0${date[0]}` : date[0];
        const year = date[2];

        const formedDate = `${day}-${month}-${year}`;
        const options = {
            method: 'GET',
            baseURL: 'https://cdn-api.co-vin.in',
            url: '/api/v2/appointment/sessions/public/calendarByDistrict',
            params: {district_id: reqDistrictId ? reqDistrictId : '394', date: reqDate ? reqDate : formedDate},
            data: null
        }

        axiosClient(options).then(response => {
            const centers = response.data.centers;
            const slots = [];
            centers.forEach(center => {
                const sessionAvl = center.sessions.filter(session => session.available_capacity > 0);
                if(sessionAvl && sessionAvl.length) {
                    slots.push({
                        centerName: center.name,
                        pincode: center.pincode,
                        sessions: sessionAvl
                    });
                }
            });

            if  (slots && slots.length) {
                mailSlots(req, slots);
                resolve(slots);
            } else {
                logger.info(`No slots on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}  for ${JSON.stringify(req.query)}`);
                resolve([]);
            }
        }).catch(error => {
            console.log(error);
            reject(error);
        });
    });
} */

'http:localhost/api/slots/getSlotsByPincode?pincode=401201&date=03-05-2021&email=abc@gmail.com'
exports.getSlotsByPincode = async (req, res) => {
    try {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        let interval = setInterval(() => {
            checkSlots(req, true, -1).then(slots => {
                res.write("Checking");
            });
        }, 30000);

        res.on('close', () => {
            clearInterval(interval);
            res.end();
        });
    } catch (error) {
        console.log(error);
    }
};


exports.checkSlots = (req, isPincode = false, week = -1) => {
    try {
        return new Promise((resolve, reject) => {
            const reqPincode = req.query.pincode;
            const reqDistrictId = req.query.district_id;
            const reqDate = req.query.date;
            let formedDate = '';
            if (week >= 0) {
                let date = new Date();
                date = new Date(date.setDate(date.getDate() + week * 7)).toLocaleDateString();
                date = date.split('/');
                const month = date[1].length == 1 ? `0${date[1]}` : date[1];
                const day = date[0].length == 1 ? `0${date[0]}` : date[0];
                const year = date[2];
                formedDate = `${day}-${month}-${year}`;
                // console.log(formedDate);
            } else {
                let date = new Date().toLocaleDateString();
                date = date.split('/');
                const month = date[1].length == 1 ? `0${date[1]}` : date[1];
                const day = date[0].length == 1 ? `0${date[0]}` : date[0];
                const year = date[2];
                formedDate = `${day}-${month}-${year}`;
            }
            let options;
            if(isPincode) {
                options = {
                    method: 'GET',
                    baseURL: 'https://cdn-api.co-vin.in',
                    url: '/api/v2/appointment/sessions/public/calendarByPin',
                    params: {pincode: reqPincode ? reqPincode : '401201', date: reqDate ? reqDate : formedDate},
                    data: null,
                    headers: {
                        'x-cache': 'Hit from cloudfront',
                        'x-content-type-options': 'nosniff',
                        'x-dns-prefetch-control': 'off',
                        'x-download-options': 'noopen',
                        'x-frame-options': 'DENY',
                        'x-xss-protection': '1; mode=block'
                    }
                }
            } else {
                options = {
                    method: 'GET',
                    baseURL: 'https://cdn-api.co-vin.in',
                    url: '/api/v2/appointment/sessions/public/calendarByDistrict',
                    params: {district_id: reqDistrictId ? reqDistrictId : '394', date: reqDate ? reqDate : formedDate},
                    data: null,
                    headers: {
                        'x-cache': 'Hit from cloudfront',
                        'x-content-type-options': 'nosniff',
                        'x-dns-prefetch-control': 'off',
                        'x-download-options': 'noopen',
                        'x-frame-options': 'DENY',
                        'x-xss-protection': '1; mode=block'
                    }
                }
            }
    
    
            axiosClient(options).then(response => {
                const centers = response.data.centers;
                const slots = [];
                // console.log(centers);
                centers.forEach(center => {
                    // console.log(center);
                    const sessionAvl = center.sessions.filter(session => session.available_capacity > 0);
                    if(sessionAvl && sessionAvl.length) {
                        slots.push({
                            centerName: center.name,
                            pincode: center.pincode,
                            sessions: sessionAvl.map(sess => {
                                return {
                                    available: sess.available_capacity,
                                    date: sess.date,
                                    age: sess.min_age_limit,
                                    vaccine: sess.vaccine
                                };
                        })
                        });
                    }
                });
    
                if  (slots && slots.length) {
                    mailSlots(req, slots);
                    resolve(slots);
                } else {
                    logger.info(`No slots on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}  for ${JSON.stringify(req.query)}`);
                    resolve([]);
                }
            }).catch(error => {
                console.log(error);
                reject(error);
            });
        });
    } catch (error) {
        console.log(error);
    }
}

mailSlots = (req, slots) => {
    try {
        const subject = '[IMPORTANT] Slots available';
        let body = `Following slots available on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}: ${JSON.stringify(slots)}`;
        
        logger.info(`Following slots available on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}: ${JSON.stringify(slots)}`);
        
        const reqEmail = req.query.email;
        mailer.mailerFunction(
            reqEmail ? [reqEmail] : config.mailer.to,
            config.mailer.from,
            config.mailer.cc,
            reqEmail ? [reqEmail] : config.mailer.bcc,
            subject,
            body
        ).then(response => {
            console.log(response);
        }).catch(err => {
            console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}