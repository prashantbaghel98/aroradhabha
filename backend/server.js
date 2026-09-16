const express = require('express')
const env = require('dotenv/config')
const cookieParser = require('cookie-parser')
const connectDB = require('./config/db')
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
connectDB()
// middleware 
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))





//Checking Routes
app.get('/',(req,res)=>{
    res.send("API Working")
})


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











//Server
app.listen(process.env.PORT,()=>{
    console.log("Server Running on "+process.env.PORT)
}) 