import dotenv from 'dotenv';

import express from 'express';
import userRoutes from '~/routes/userRoutes';
dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT ?? 3000;
console.log(process.env.PORT);

app.use(express.json());

// Server started
app.get('/', (_, res) => {
  res.send('Backend server running!!');
});

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
