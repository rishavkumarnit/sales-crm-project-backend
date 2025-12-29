const mongoose = require("mongoose");

// mongoose.connect("mongodb://localhost:27017/finalproject").then(()=>{
mongoose
  .connect(`${process.env.MONGO_URI}/finalproject`)
  .then(() => {
    console.log("connection is established");
  })
  .catch((err) => {
    console.log(`Error is: ${err}`);
  });
