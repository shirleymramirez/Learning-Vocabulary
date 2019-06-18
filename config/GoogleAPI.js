/**
  * TODO(developer): Uncomment these variables before running the sample.
  */

 const location = 'global';


'use strict';

async function main(
  projectId = process.env['GOOGLE_PROJECT_ID'] // Your GCP Project Id
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
<<<<<<< HEAD
  console.log(`Text: ${ text } `);
  console.log(`Translation: ${ translation } `);
=======
  console.log(`Text: ${text}`);
  console.log(`Translation: ${translation}`);
>>>>>>> b6b4e22a992eec68b575abb8cbd1096a848f4914
}
// [END translate_quickstart]

const args = process.argv.slice(2);
<<<<<<< HEAD
main(...args).catch(console.error);
=======
main(...args).catch(console.error);
>>>>>>> b6b4e22a992eec68b575abb8cbd1096a848f4914
