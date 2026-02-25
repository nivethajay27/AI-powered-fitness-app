import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    date: "",
    mileage: "",
    avg_hr: "",
    sleep: "",
    soreness: "",
  });

  const [workouts, setWorkouts] = useState([]);
  const [aiInsights, setAiInsights] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const loadWorkouts = async () => {
    const res = await fetch("http://localhost:5001/api/workouts");
    const data = await res.json();
    setWorkouts(data);
  };

  useEffect(() => {
    loadWorkouts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addWorkout = async () => {
    await fetch("http://localhost:5001/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      date: "",
      mileage: "",
      avg_hr: "",
      sleep: "",
      soreness: "",
    });

    loadWorkouts();
  };

  const deleteWorkout = async (id) => {
    await fetch(`http://localhost:5001/api/workouts/${id}`, {
      method: "DELETE",
    });

    loadWorkouts();
  };

  // const generateInsights = async () => {
  //   if (workouts.length === 0) return;
  
  //   setLoadingAI(true);
  
  //   const latest = workouts[0];
  
  //   const res = await fetch("http://localhost:5001/api/ai/analyze", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(latest),
  //   });
  
  //   const data = await res.json();
  //   console.log(data)
  //   try {
  //     // Convert string JSON from AI into JS object
  //     const parsed = typeof data === "string" ? JSON.parse(data) : data;
  //     setAiInsights(parsed);
  //   } catch (err) {
  //     console.error("Failed to parse AI JSON", err);
  //     setAiInsights({});
  //   }
  
  //   setLoadingAI(false);
  // };
  const generateInsights = async () => {
    if (workouts.length === 0) return;
  
    setLoadingAI(true);
  
    const latest = workouts[0];
  
    try {
      const res = await fetch("http://localhost:5001/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(latest),
      });
  
      const data = await res.json(); // Now it is a proper object
      setAiInsights(data);
    } catch (err) {
      console.error("AI fetch failed:", err);
      setAiInsights({ recovery_score: "N/A", plan: [] });
    } finally {
      setLoadingAI(false);
    }
  };
  return (
    <div className="container">
      <h1>AI Fitness Performance Dashboard</h1>

      {/* Form */}
      <div className="card form-card">
        <h2>Add Workout</h2>

        <input type="date" name="date" value={form.date} onChange={handleChange}/>
        <input name="mileage" placeholder="Mileage" value={form.mileage} onChange={handleChange}/>
        <input name="avg_hr" placeholder="Average Heart Rate" value={form.avg_hr} onChange={handleChange}/>
        <input name="sleep" placeholder="Sleep Hours" value={form.sleep} onChange={handleChange}/>
        <input name="soreness" placeholder="Muscle Soreness (1-10)" value={form.soreness} onChange={handleChange}/>

        <button onClick={addWorkout}>Add Workout</button>
      </div>

      {/* AI Panel
      <div className="card ai-card">
        <div className="ai-header">
          <h2>AI Coaching Insights</h2>
          <button onClick={generateInsights}>
            {loadingAI ? "Analyzing..." : "Generate Insights"}
          </button>
        </div>

        <pre className="ai-output">{aiInsights}</pre>
      </div> */}
      {/* AI Panel */}
<div className="card ai-card">
  <div className="ai-header">
    <h2>AI Coaching Insights</h2>
    <button onClick={generateInsights}>
      {loadingAI ? "Analyzing..." : "Generate Insights"}
    </button>
  </div>

  {aiInsights && (
    <div className="ai-plan">
      <div className="recovery-score">
        <strong>Recovery Score:</strong> {aiInsights.recovery_score || "N/A"}
      </div>

      <h3>5-Day Adaptive Workout Plan</h3>
      <div className="plan-list">
        {aiInsights.plan &&
          aiInsights.plan.map((day, index) => (
            <div key={index} className="day-card">
              <div className="day-header">
                <span className="date">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="activity">{day.activity}</span>
              </div>

              {day.distance && <div>Distance: {day.distance} km</div>}
              {day.exercises && (
                <div>
                  <strong>Exercises:</strong>
                  <ul>
                    {day.exercises.map((ex, i) => (
                      <li key={i}>
                        {ex.name} – {ex.sets}x{ex.reps}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {day.intervals && (
                <div>
                  <strong>Intervals:</strong>
                  <ul>
                    {day.intervals.map((iv, i) => (
                      <li key={i}>
                        {iv.distance} km – {iv.speed} speed
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {day.intensity && <div>Intensity: {day.intensity}</div>}
            </div>
          ))}
      </div>
    </div>
  )}
</div>

      {/* Workout Grid */}
      <div className="grid">
        {workouts.map((w) => (
          <div key={w.id} className="card workout-card">

            <div className="date">{w.date}</div>

            <div className="metrics">
              <span>🏃 Mileage: {w.mileage}</span>
              <span>❤️ HR: {w.avg_hr}</span>
              <span>😴 Sleep: {w.sleep}</span>
              <span>💪 Soreness: {w.soreness}</span>
            </div>

            <button
              className="delete-btn"
              onClick={() => deleteWorkout(w.id)}
            >
              Delete
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}

export default App;