/* eslint-disable @typescript-eslint/no-var-requires */
const ncp = require('ncp').ncp;
const path = require('path');

const sourceDir = path.join(__dirname, 'templates');
const destinationDir = path.join(__dirname, 'dist', 'templates');

ncp(sourceDir, destinationDir, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Templates copied successfully!');
});
