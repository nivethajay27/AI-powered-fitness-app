import express from "express";
import pool from "../db.js";

const router = express.Router();

/* CREATE workout */
router.post("/", async (req, res) => {
  try {
    const { date, mileage, avg_hr, sleep, soreness } = req.body;

    const result = await pool.query(
      `INSERT INTO workouts(date, mileage, avg_hr, sleep, soreness)
       VALUES($1,$2,$3,$4,$5) RETURNING *`,
      [date, mileage, avg_hr, sleep, soreness]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
});

/* GET all workouts */
router.get("/", async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM workouts ORDER BY date DESC"
  );

  res.json(result.rows);
});

/* DELETE workout */
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM workouts WHERE id=$1",
      [req.params.id]
    );

    res.json({ message: "Workout deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;