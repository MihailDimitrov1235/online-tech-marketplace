import express from 'express'
import cors from 'cors';
import './loadEnvironments.js';

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());

// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});