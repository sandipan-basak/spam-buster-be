import dotenv from 'dotenv';

import express from 'express';
// import authRouter from '~/routes/auth';
dotenv.config({ path: './.env.dev' });

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend server running!!');
});

// app.use('/auth', authRouter);
// app.use('/expense', expenseRouter);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
