const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const port = 8000;

// Store merchant credentials securely in the backend
const MERCHANT_ID = "Regal_Car";
const MERCHANT_PASSWORD = "Live@rc24";

// Function to generate a unique order number
function generateOrderNumber() {
  return 'Order-' + crypto.randomBytes(8).toString('hex');
}

app.post("/checkServer", (req, res) => {
  console.log("Check Server API hit");
  console.log("Request: ", req.body);
  console.log("Request: ", req.params);
  console.log("Request: ", req.headers);
  console.log("Request: ", req.method);
  res.send("Success");
});

app.post("/api/create-payment", async (req, res) => {
  const { orderAmount, orderDueDate, customerName, customerEmail, customerMobile, customerAddress } = req.body;

  const payload = [
    {
      "MerchantId": MERCHANT_ID,
      "MerchantPassword": MERCHANT_PASSWORD
    },
    {
      "OrderNumber": generateOrderNumber(),
      "OrderAmount": orderAmount,
      "Currency": "USD",
      "OrderDueDate": orderDueDate,
      "OrderType": "Service",
      "IssueDate": new Date().toISOString().split('T')[0],
      "OrderExpireAfterSeconds": "0",
      "CustomerName": customerName,
      "CustomerMobile": customerMobile,
      "CustomerEmail": customerEmail,
      "CustomerAddress": customerAddress,
    }
  ];

  console.log('Creating payment:', payload)

  try {
    const response = await axios.post('https://api.paypro.com.pk/cpay/co', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Payment created:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).send('Error creating payment');
  }
});

app.listen(port, () => {
  console.log(`App is Listening at http://localhost:${port}`);
});
