const express = require('express')
require("dotenv/config");
const connectDB = require("./config/db");
const cookieParser = require('cookie-parser')
const cors = require('cors')
const userRoute = require('./routes/authRoute')
const foodRoute = require('./routes/foodRoute')
const cartRoute = require('./routes/cartRoute')
const addressRoute = require('./routes/addressRoute')
const orderRoute = require('./routes/orderRoute')
const paymentRoute = require('./routes/paymentRoute')
const reviewRoute = require('./routes/reviewRoute')
const adminRoute = require('./routes/adminRoute')






 




const app = express();


// middleware 
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173","https://arora-frontend.vercel.app"],
    credentials:true
}))






// All Routes 
app.use('/api/user',userRoute)
app.use('/api/admin/food',foodRoute)
app.use('/api/cart',cartRoute)
app.use('/api/address',addressRoute)
app.use('/api/order',orderRoute)
app.use('/api/payment',paymentRoute)
app.use('/api/review',reviewRoute)
app.use("/api/admin", adminRoute);
app.use("/api/food", foodRoute);





// API Test

app.get("/", (req, res) => {
    res.send("API Working");
});



// Local development
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 8080;

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}


// IMPORTANT FOR VERCEL
module.exports = app;