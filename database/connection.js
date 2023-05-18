const mongoose = require("mongoose");
const DB=process.env.DATABASE;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('MongoDB connected successfully!');
  }).catch((err) => {
    console.log('Error connecting to MongoDB:', err.message);
  });