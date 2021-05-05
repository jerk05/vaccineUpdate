# vaccineUpdate
Application to check Vaccine Availability 

1. Clone the project to you machine.
2. Navigate to the project folder.
3. Initialize the project with command 'npm install'.
4. open the config.js file and configure smtp mail account. Ex Gmail. 
(https://myaccount.google.com/lesssecureapps) mention your email and password in the config file under smtpDetails (user: 'abc@gmail.com', pass: 'abcdef').

5. Now Open the server.js file and mention the pincode and email to be notified on in the file. Examples have been commented. You can also check availability by district_id.

In the config.js mention the number of weeks you want to check the availability for. Default is 1


Once all the settings are done. run the program using the command 'npm run dev' of 'node server.js'