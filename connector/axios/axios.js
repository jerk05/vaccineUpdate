'use strict'

const axios = require('axios');

const axiosClient = async (options) => {
    try {
        return new Promise((resolve, reject) => {
            axios(options)
            .then((response) => {                
                resolve(response);
            })
            .catch((error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.log(error);
    }
};


module.exports = axiosClient;

