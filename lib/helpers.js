const helpers = {};
const path = require("path");
const fs = require("fs");
const config = require("./config");

helpers.parseJsonToObject = str => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};

// Get the string content of a template, and use provided data for string interpolation
helpers.getTemplate = function(templateName, data, callback) {
  templateName =
    typeof templateName === `string` && templateName.length > 0
      ? templateName
      : false;

  data = typeof data === `object` && data !== null ? data : {};

  if (templateName) {
    const templatesDir = path.join(__dirname, `/../templates/`);
    fs.readFile(`${templatesDir}${templateName}.html`, `utf8`, function(
      err,
      str
    ) {
      if (!err && str && str.length > 0) {
        // Do the interpolation on the string
        let finalString = helpers.interpolate(str, data);
        callback(false, finalString);
      } else {
        callback(`No template could be found`);
      }
    });
  } else {
    callback(`A valid template name was not specified`);
  }
};

// Add the universal header and footer to a string and pass provided data object to the header and footer for interpolation
helpers.addUniversalTemplates = function(str, data, callback) {
  str = typeof str === `string` && str.length > 0 ? str : ``;
  data = typeof data === `object` && data !== null ? data : {};

  // Get the Header
  helpers.getTemplate(`_header`, data, function(err, headerString) {
    if (!err && headerString) {
      let fullString = headerString + str;
      callback(false, fullString);
    } else {
      callback(`Could not find the header template`);
    }
  });
};

// Take a given string and a data object and find/replace all the keys within it
helpers.interpolate = function(str, data) {
  str = typeof str === `string` && str.length > 0 ? str : ``;
  data = typeof data === `object` && data !== null ? data : {};

  // Add the templateGlobals to the data object, prepending their key name with "global"
  for (let keyName in config.templateGlobals) {
    if (config.templateGlobals.hasOwnProperty(keyName)) {
      data[`global.${keyName}`] = config.templateGlobals[keyName];
    }
  }

  // For each key in the data object, insert its value into the string at the corresponding placeholder
  for (let key in data) {
    if (data.hasOwnProperty(key) && typeof data[key] === `string`) {
      let replace = data[key];
      let find = `{${key}}`;
      str = str.replace(find, replace);
    }
  }
  return str;
};

// Get the contents of a static(public) asset
helpers.getStaticAsset = function(fileName, callback) {
  fileName =
    typeof fileName === `string` && fileName.length > 0 ? fileName : false;
  if (fileName) {
    const publicDir = path.join(__dirname, `/../public/`);
    fs.readFile(publicDir + fileName, function(err, data) {
      if (!err && data) {
        callback(false, data);
      } else {
        callback(`No file could be found`);
      }
    });
  } else {
    callback(`A valid file name was not specified`);
  }
};

// Export the module
module.exports = helpers;
