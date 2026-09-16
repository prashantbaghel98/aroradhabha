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
const path = require('path');





 




const app = express();
connectDB()
// middleware 
app.use(cookieParser())
app.use(express.json())
app.use(cors({
    origin:["http://localhost:5173","https://gray-oryx-860646.hostingersite.com"],
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



// ================================
// SERVE REACT FRONTEND
// ================================

const frontendPath = path.join(
    __dirname,
    "../frontend/dist"
);

app.use(express.static(frontendPath));

// ================================
// REACT ROUTER FALLBACK
// ================================

app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
        return next();
    }

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );
});




//Server
app.listen(process.env.PORT,()=>{
    console.log("Server Running on "+process.env.PORT)
}) 