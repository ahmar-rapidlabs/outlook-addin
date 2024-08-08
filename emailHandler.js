const axios = require('axios');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getEmailInput() {
    return new Promise((resolve) => {
        rl.question('Please enter your email: ', (email) => {
            rl.close();
            resolve(email);
        });
    });
}

async function startPolling() {
    const email = await getEmailInput();
    try {
        const response = await axios.post('http://localhost:5000/start_polling', {
            APP_ID: 'f04d6fd2-727a-4177-8554-c7d52a3cef2a',
            SCOPES: ['User.Read', 'Mail.Read', 'Mail.ReadWrite'],
            email_verification: email
        });
        console.log('Polling started successfully:', response.data);
    } catch (error) {
        console.error('Error starting polling:', error);
    }
}

startPolling();
