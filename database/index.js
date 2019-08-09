const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "Soofa";
const database = {};

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function(err) {
  if (err === null) {
    console.log("Connected successfully to MongoDB");
  } else {
    console.log("Failed to connect to MongoDB");
  }
});

database.create = (data, callback) => {
  const db = client.db(dbName);
  db.collection("qubeans").insertOne(
    {
      paymentStatus: data.status,
      transactionId: data.tid,
      receiptNumber: data.receipt_no,
      senderCurrency: data.sender_currency,
      reference: data.reference,
      amountPaid: data.gross_amount,
      receivedAmount: data.net_amount,
      sender: data.sender
    },
    (err, result) => {
      if (!err && result) {
        callback(false, result.ops);
        client.close();
      } else {
        callback(JSON.stringify(err, undefined, 2));
      }
    }
  );
};

database.read = (email, callback) => {
  db.collection("feedback").findOne(
    {
      email: email
    },
    (err, data) => {
      if (!err && data) {
        const parsedData = JSON.stringify(data);
        callback(false, data);
      } else {
        callback(err, data);
      }
    }
  );
};

database.init = () => {
  database.connection();
};

module.exports = database;
