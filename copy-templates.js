/* eslint-disable @typescript-eslint/no-var-requires */
const ncp = require('ncp').ncp;
const path = require('path');

const sourceDir = path.join(__dirname, 'templates');
const destinationDir = path.join(__dirname, 'dist', 'templates');

// Resolve the correct paths for deployment environment
if (process.env.LAMBDA_TASK_ROOT) {
  // Running on AWS Lambda
  const rootDir = process.env.LAMBDA_TASK_ROOT;
  const deploymentSourceDir = path.join(rootDir, 'src', 'templates');
  const deploymentDestinationDir = path.join(rootDir, 'dist', 'templates');

  ncp(deploymentSourceDir, deploymentDestinationDir, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Templates copied successfully!');
  });
} else {
  // Running on local or other environment
  ncp(sourceDir, destinationDir, function (err) {
    if (err) {
      return console.error(err);
    }
    console.log('Templates copied successfully!');
  });
}
