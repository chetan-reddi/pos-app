const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
require("colors");

const connectDB = require("./config/config");
const path = require("path");
//dotenv config
dotenv.config();

//db config
connectDB();

// creation of rest object
const app = express();

// create middlwares for project
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// create routes
app.use("/api/items", require("./routes/itemRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/bills", require("./routes/billsRoute"));

//deployment

__dirname=path.resolve()
if(process.env.NODE_ENV==='production'){
  app.use(express.static(path.join(__dirname,"/client/build")));
  app.get('*'),(req,res) => {
    res.sendFile(path.resolve(__dirname,"./client/build/index.html"));
  }

}else{
  app.get("/",(req,res)=>{
    
    res.send("API is running ..");

  });
}

                

// create  Port
const PORT = process.env.PORT || 8080;

// listen Port
app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});
