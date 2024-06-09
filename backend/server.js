const express = require('express');
const app = express();
const dotenv = require('dotenv')
const port = process.env.port || 5000;
const morgan = require('morgan');
const connectDb = require('./config/db.js');
const authRoute = require('./Routes/authRoutes.js');
const cors = require('cors')
dotenv.config();

app.get('/',(req,res)=>{
    res.send({
        message: 'server is  very first'
    })
})

//db connection

connectDb();

//middleware
app.use(cors())
app.use(morgan('combined'));
app.use(express.json());

//controllerr

app.use('/api/route',authRoute)


app.listen(port,()=>{
    console.log(`server is ${process.env.DEV_MODE} running at localhost:${port}`)
})
