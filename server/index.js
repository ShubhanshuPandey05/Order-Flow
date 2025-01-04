import express from 'express';
import bodyParser from "body-parser"
import cors from 'cors';
import cookieParser from "cookie-parser";
import orderRoute from "./routes/orderRoute.js"
import authRoute from "./routes/authRoute.js"
import connectionToDatabase from './database/databaseConnection.js';
import dotenv from "dotenv";

const app = express();
app.use(cors({
  origin: ["http://localhost:5173","https://jsrprimesolution.com","https://orderflow.jsrprimesolution.com"],
  credentials: true
}))
app.options('*', cors()); // Allow all preflight requests
app.use(bodyParser.json());
app.use(cookieParser());
dotenv.config();


app.get('/',(req,res)=>{
  res.send("OrderFlow Api")
})

app.use("/api/",orderRoute)
app.use("/api/auth/",authRoute)

// function pingServer() {
//   fetch('https://formsflow.onrender.com/')
//       .then(response => {
//           if (response.ok) {
//               console.log('Server is reachable');
//           } else {
//               console.error('Server responded with an error:', response.status);
//           }
//       })
//       .catch(error => {
//           console.error('Error pinging the server:', error);
//       });
// }

// // Ping the server every 30 seconds
// setInterval(pingServer, 30000);


// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  connectionToDatabase();
  console.log(`Server is running on http://localhost:${PORT}`);
});
