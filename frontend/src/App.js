import React, { useState } from "react";
import axios from "axios";

function App() {
  const API = "http://localhost:8000";

  const [input, setInput] = useState({
    sleep_hours: "",
    steps: "",
    screen_time: ""
  });

  const [state, setState] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const updateState = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API}/update`, {
        sleep_hours: Number(input.sleep_hours),
        steps: Number(input.steps),
        screen_time: Number(input.screen_time),
      });
      setState(res.data);
      setRecommendation(null);
    } catch (err) {
      console.log(err);
      alert("Error updating state");
    }
    setLoading(false);
  };

  const getRecommendation = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/recommend`);
      setRecommendation(res.data);
    } catch (err) {
      alert("Error getting recommendation");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🧠 LifeTwin AI</h1>
      <p style={styles.subtitle}>
        Your personal digital twin for smarter daily health decisions
      </p>

      {/* INPUT SECTION */}
      <div style={styles.card}>
        <h2>📊 Daily Inputs</h2>

        <div style={styles.inputGroup}>
          <input
            name="sleep_hours"
            placeholder="Sleep (hours)"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="steps"
            placeholder="Steps"
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="screen_time"
            placeholder="Screen Time (hours)"
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <button style={styles.button} onClick={updateState}>
          Update State
        </button>
      </div>

      {/* STATE DISPLAY */}
      {state && (
        <div style={styles.card}>
          <h2>📈 Current Health State</h2>

          <p>⚡ Energy: {state.energy.toFixed(2)}</p>
          <p>😰 Stress: {state.stress.toFixed(2)}</p>
          <p>😴 Sleep Debt: {state.sleep_debt.toFixed(2)}</p>
          <p>🏃 Activity: {state.activity_level.toFixed(2)}</p>
        </div>
      )}

      {/* RECOMMENDATION */}
      <div style={styles.card}>
        <button style={styles.buttonPrimary} onClick={getRecommendation}>
          Get AI Recommendation
        </button>

        {loading && <p>⏳ Thinking...</p>}

        {recommendation && (
          <div style={styles.recommendationBox}>
            <h2>🤖 Recommendation</h2>

            <h3 style={styles.action}>
              👉 {recommendation.best_action.action}
            </h3>

            <p style={styles.explanation}>
              {recommendation.ai_explanation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

const styles = {
  container: {
    fontFamily: "Arial",
    padding: "20px",
    maxWidth: "700px",
    margin: "auto",
  },
  title: {
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    color: "gray",
    marginBottom: "20px",
  },
  card: {
    background: "#f9f9f9",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
  },
  inputGroup: {
    display: "flex",
    gap: "10px",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    background: "#ddd",
    cursor: "pointer",
  },
  buttonPrimary: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#4CAF50",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  recommendationBox: {
    marginTop: "15px",
  },
  action: {
    color: "#4CAF50",
  },
  explanation: {
    marginTop: "10px",
    lineHeight: "1.5",
  },
};