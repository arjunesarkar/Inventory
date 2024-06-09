const mongoose = require('mongoose');

const connectdb = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Db connection successfully ${conn.connection.host}`);
    } catch (error) {
        console.log(`Db is not connect ${error}`);
    }
};

module.exports = connectdb;
