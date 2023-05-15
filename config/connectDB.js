const mongoose = require('mongoose');

const url = process.env.MONGODB_URL;
const connectDB = () => {
    mongoose
        .connect(url)
        .then(() => {
            console.log('Connection to DB established');
        })
        .catch((e) => console.log(e.message));
};

connectDB();
