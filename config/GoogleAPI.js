/**
  * TODO(developer): Uncomment these variables before running the sample.
  */

 const location = 'global';


'use strict';

async function main(
  projectId = 'learning-vocabulary-244016' // Your GCP Project Id
) {
  // [START translate_quickstart]
  // Imports the Google Cloud client library
  const {Translate} = require('@google-cloud/translate');

  // Instantiates a client
  const translate = new Translate({
    projectId: projectId,
    credentials: {
      private_key: process.env['GOOGLE_PRIVATE_KEY'].replace(/\\n/g, '\n'),
      client_email: process.env['GOOGLE_CLIENT_EMAIL']
    }
  });

  // The text to translate
  const text = 'Hello, world!';

  // The target language
  const target = 'ru';

  // Translates some text into Russian
  const [translation] = await translate.translate(text, target);
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
}
// [END translate_quickstart]

const args = process.argv.slice(2);
main(...args).catch(console.error);