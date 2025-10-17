import dotenv from "dotenv";
import express from "express";
import cors from 'cors';
import router from "./routes/index.routes";

dotenv.config();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const PORT = process.env.PORT || 3333;

const app = express()
app.use(express.json())
app.use(cors(corsOptions))
app.use(router)

app.listen(PORT, () => {
  console.log(`Application started on port ${PORT}!`);
});
