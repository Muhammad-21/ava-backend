require('dotenv').config()
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const BlendShapeNames = require('./BlendShapeNames');

const key = process.env.KEY;
const region = process.env.REGION;


const textToSpeech = async (text, language) => {
  const ssml = `
  <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="${language === 'ru' ? 'ru-RU-DariyaNeural' : 'en-US-AriaNeural'}">
        <mstts:viseme type="FacialExpression"/>
        ${text}
    </voice>
  </speak>`;

  const randomString = Math.random().toString(36).slice(2, 7);
  const filename = `./public/speech-${randomString}.mp3`;
  const blendData = [];
  const timeStep = 1 / 60;
  let timeStamp = 0;

  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  speechConfig.speechSynthesisOutputFormat = 5;
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  synthesizer.visemeReceived = (s, e) => {
    const animation = JSON.parse(e.animation);
    animation.BlendShapes.forEach((blendArray) => {
      const blend = {};
      BlendShapeNames.forEach((shapeName, i) => {
        blend[shapeName] = blendArray[i];
      });
      blendData.push({
        time: timeStamp,
        blendshapes: blend,
      });
      timeStamp += timeStep;
    });
  };

  return new Promise((resolve, reject) => {
    synthesizer.speakSsmlAsync(
      ssml,
      (result) => {
        synthesizer.close();
        resolve({ blendData, filename: `/speech-${randomString}.mp3`, assistantAnswer: text });
      },
      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
};

module.exports = textToSpeech