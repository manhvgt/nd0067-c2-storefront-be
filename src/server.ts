import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import orderProductsRoutes from './routes/orderProductsRoutes';
import billRoutes from './routes/billRoutes';

dotenv.config();

const app: express.Application = express();
const host = process.env.SERVER_HOST || 'localhost';
const portStr = process.env.SERVER_PORT || '3000';
const port = parseInt(portStr, 10);

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/orderProducts', orderProductsRoutes);
app.use('/bills', billRoutes);
app.get('/', (req, res) => {
  res.send(`It works! Server is running on http://${host}:${port}`);
});

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
