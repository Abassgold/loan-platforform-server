import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
import userRouter from './routes/user.routes.js';
import loanRouter from './routes/loan.routes.js';
import cookieParser from 'cookie-parser';
import withdrawalRouter from './routes/withdrawal.routes.js';

// Load environment variables
dotenv.config()

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI
// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
app.use(helmet());
app.use(cookieParser()); 
// app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/auth/', userRouter);
app.use('/api/loans', loanRouter)
app.use('/api/withdrawal', withdrawalRouter)

mongoose.connect(MONGO_URI).then(()=>{
    console.log('Database connected');
app.listen(PORT, e => console.log(`Server running on port ${PORT}`))
}).catch((err)=>{
    console.log(`Error occurred while connecting to the database: ${err}`);
})
