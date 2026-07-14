const mongoose = require("mongoose");

const connectToDatabase = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB...");
    }
    catch (e) {
        console.log("Couldn't connect to MongoDB:", e.message);
    }
}

module.exports = connectToDatabase;