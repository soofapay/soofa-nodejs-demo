const server = require("./lib/server");
// Declare the app
const app = {};

// Init the function
app.init = function() {
  // Start the server
  server.init();
};

// Execute
app.init();

// Export the app
module.exports = app;
