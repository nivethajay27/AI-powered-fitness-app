import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import workoutRoutes from "./routes/workout.js";
import aiRoutes from "./routes/ai.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/workouts", workoutRoutes);
app.use("/api/ai", aiRoutes);

app.listen(5001, () => console.log("Server running on port 5001"));