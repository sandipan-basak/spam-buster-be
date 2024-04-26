/* eslint-disable import/first */
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import userRoutes from '~/routes/userRoutes';
import spamRoutes from '~/routes/spamRoutes';
import searchRoutes from '~/routes/searchRoutes';

const app = express();
const port = process.env.PORT;

app.use(express.json());

// Server started
app.get('/', (_, res) => {
  res.send('<h5>Deployed serverless express api</h5>');
});

app.use('/user', userRoutes);
app.use('/spam', spamRoutes);
app.use('/search', searchRoutes);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});

export default app;
