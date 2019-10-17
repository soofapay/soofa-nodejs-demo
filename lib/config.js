/*
 * Create and export configuration variables
 *
 */

//Container for the environments
const environments = {};
let date = Date().split(" ");
//Staging (default) environment
environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: "staging",
  templateGlobals: {
    appName: "Soofa NodeJs Demo",
    companyName: "Soofa",
    yearCreated: date[3],
    baseUrl: "http://localhost:3000/"
  }
};

//Determine which environment was passed as a command-line argument
const currentEnv =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

//Check that the current environment is one of the environments above, if not, default to staging
const environmentToExport =
  typeof environments[currentEnv] === "object"
    ? environments[currentEnv]
    : environments.staging;

//Export the module
module.exports = environmentToExport;
