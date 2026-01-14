import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './database/db.js';
import authRoutes from './routes/authRoutes.js';
import gigRoutes from './routes/gigRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

connectToDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRoutes);
app.use('/api/gigs',gigRoutes);
app.use('/api/bids',bidRoutes);

app.listen(PORT , ()=>{
    console.log(`Server is running on Port ${PORT}`);
});
