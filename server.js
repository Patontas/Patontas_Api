require('dotenv').config();
require('./config/connectDB');
const express = require('express');
const routes = require('./routes/router.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//PayPal API
app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb ');
});

//Routes
app.use('/api', routes);

const port = process.env.PORT || 10000;
app.listen(port, () =>
    console.log(`Server Running on  http://localhost:${port}`)
);
