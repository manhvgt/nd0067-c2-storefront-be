import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import customerRoutes from './routes/customerRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import billRoutes from './routes/billRoutes';

const app: express.Application = express();
const host = process.env.SERVER_HOST || 'localhost';
const port = process.env.SERVER_PORT || 3000;

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/bills', billRoutes);

app.listen(3000, function () {
  console.log(`Server is running on http://${host}:${port}`);
});
