'use strict';//normally this should be the first line.

const { Translate } = require('@google-cloud/translate');

// Instantiates a client
const translator = new Translate({
    projectId: process.env['GOOGLE_PROJECT_ID'],
    credentials: {
        private_key: process.env['GOOGLE_PRIVATE_KEY'].replace(/\\n/g, '\n'),
        client_email: process.env['GOOGLE_CLIENT_EMAIL']
    }
});
module.exports = async (text, target) => (await translator.translate(text, target))[0]