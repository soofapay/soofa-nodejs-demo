const helpers = require("./helpers");
const soofa = require("soofa");

//Define the handlers
const handlers = {};

// index handler
handlers.index = function(data, callback) {
  // Reject any request that isn't a GET
  if (data.method == `get`) {
    // Prepare data for interpolation
    let templateData = {
      "head.title": "Home"
    };

    // Read in a template as a string
    helpers.getTemplate("products", templateData, function(err, str) {
      if (!err && str) {
        // Add the universal header and footer
        helpers.addUniversalTemplates(str, templateData, function(err, str) {
          if (!err && str) {
            // Return that page as HTML
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(500, undefined, `html`);
      }
    });
  } else {
    callback(405, undefined, `html`);
  }
};

// carts page handler
handlers.carted = (data, callback) => {
  if (data.method === "get") {
    let templateData = {
      "head.title": "Carted Items"
    };

    helpers.getTemplate("cart", templateData, (err, str) => {
      if (!err && str) {
        helpers.addUniversalTemplates(str, templateData, (err, str) => {
          if (!err && str) {
            callback(200, str, "html");
          } else {
            callback(500, undefined, "html");
          }
        });
      } else {
        callback(404, undefined, "html");
      }
    });
  } else {
    callback(405, undefined, "html");
  }
};

// checkout handler
handlers.checkout = (data, callback) => {
  if (data.payload.hasOwnProperty("tid")) {
    soofa.init(5005, "1zjmqsomeaxx8j8nqrn3t9oc1ee4ig");
    soofa.find(data.payload["tid"]).then(response => {
      if (response.hasOwnProperty("tid") && response.tid === data.payload.tid) {
        console.log(response);
        callback(200, { success: "Transaction successful" });

        //Save to db
      }
    });
  }
};

// Public assets
handlers.public = function(data, callback) {
  // Reject any request that isn't a GET
  if (data.method == `get`) {
    // Get the filename being requisted
    let trimmedAssetName = data.trimmedPath.replace(`public/`, ``).trim();
    if (trimmedAssetName.length > 0) {
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName, function(err, data) {
        if (!err && data) {
          // Determine the content type(default to plain text)
          let contentType = `plain`;

          if (trimmedAssetName.indexOf(".css") > -1) {
            contentType = `css`;
          }

          if (trimmedAssetName.indexOf(".png") > -1) {
            contentType = `png`;
          }

          if (trimmedAssetName.indexOf(".jpg") > -1) {
            contentType = `jpg`;
          }

          if (trimmedAssetName.indexOf(".ico") > -1) {
            contentType = `favicon`;
          }

          // Callback the data
          callback(200, data, contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }
  } else {
    callback(405);
  }
};
module.exports = handlers;
