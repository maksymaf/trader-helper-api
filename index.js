require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route');
const tokenRouter = require('./routes/token.route');
const tradeRouter = require('./routes/trade.route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: 'https://trader-helper.onrender.com', credentials: true }));
app.use('/api', userRouter);
app.use('/api/token', tokenRouter);
app.use('/api/', tradeRouter);

app.listen(PORT, () => {

  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Successfuly connected to the database'))
    .catch((error) => console.error(error.stack));

  console.log(`Server is running on port ${PORT}`);
})