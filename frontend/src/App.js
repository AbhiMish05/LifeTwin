import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend
} from "recharts";

function App() {
  const API = "http://localhost:8000";

  const [input, setInput] = useState({
    sleep_hours: "",
    steps: "",
    screen_time: "",
    goal: "productivity"
  });

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(null);
  const [history, setHistory] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [plan, setPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const updateState = async () => {
    setLoading(true);

    const res = await axios.post(`${API}/update`, {
      sleep_hours: Number(input.sleep_hours) || 7,
      steps: Number(input.steps) || 5000,
      screen_time: Number(input.screen_time) || 3,
      goal: input.goal
    });

    setState(res.data);

    setHistory(prev => [
      ...prev,
      {
        index: prev.length + 1,
        energy: res.data.energy,
        stress: res.data.stress,
        activity: res.data.activity_level
      }
    ]);

    setLoading(false);
  };

  const getRecommendation = async () => {
    setLoading(true);
    const res = await axios.get(`${API}/recommend`);
    setRecommendation(res.data);
    setLoading(false);
  };

  const simulateAction = async (action) => {
    const res = await axios.get(`${API}/simulate/${action}`);
    setSimulation({
      before: state,
      after: res.data.predicted_state,
      action,
      score: res.data.score
    });
  };

  const getPlan = async () => {
    const res = await axios.get(`${API}/plan`);
    setPlan(res.data.plan);
  };

  const formatAction = (a) => a.replace(/_/g, " ");

  const formatLabel = (g) => g.replace("_", " ").toUpperCase();

  return (
    <div style={styles.container}>

      <h1 style={styles.title}>LifeTwin AI</h1>
      <p style={styles.subtitle}>
        Simulating your future to optimize your health decisions
      </p>

      {/* INPUT */}
      <motion.div style={styles.card} whileHover={{ scale: 1.02 }}>
        <h2>Daily Input</h2>

        <div style={styles.row}>
          <input name="sleep_hours" placeholder="Sleep (hrs)" onChange={handleChange} style={styles.input}/>
          <input name="steps" placeholder="Steps" onChange={handleChange} style={styles.input}/>
          <input name="screen_time" placeholder="Screen Time" onChange={handleChange} style={styles.input}/>
        </div>

        {/* CUSTOM DROPDOWN */}
        <div style={styles.dropdown}>
          <div
            style={styles.dropdownSelected}
            onClick={() => setOpen(!open)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              {formatLabel(input.goal)}
              <span style={{ opacity: 0.6 }}>▼</span>
            </div>
          </div>

          {open && (
            <div style={styles.dropdownMenu}>
              {["productivity", "fat_loss", "relaxation"].map((g) => (
              <motion.div
                key={g}
                style={styles.dropdownItem}
                whileHover={{
                  backgroundColor: "#1f1f1f",
                  paddingLeft: "18px",
                  scale: 1.02
                }}
                onClick={() => {
                  setInput({ ...input, goal: g });
                  setOpen(false);
                }}
              >
                {formatLabel(g)}
              </motion.div>
            ))}
            </div>
          )}
        </div>

        <motion.button
          style={styles.button}
          onClick={updateState}
          whileHover={{ scale: 1.08, boxShadow: "0 0 20px #ff512f" }}
          whileTap={{ scale: 0.95 }}
        >
          Update State
        </motion.button>
      </motion.div>

      {/* STATE */}
      {state && (
        <motion.div style={styles.card} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Current State</h2>

          <div style={styles.metrics}>
            <Metric label="Energy" value={state.energy} />
            <Metric label="Stress" value={state.stress} />
            <Metric label="Activity" value={state.activity_level} />
          </div>
        </motion.div>
      )}

      {/* GRAPH */}
      {history.length > 0 && (
        <motion.div style={styles.card}>
          <h2>Trends</h2>

          <LineChart width={700} height={300} data={history}>
            <XAxis dataKey="index" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="energy" stroke="#00ffcc" />
            <Line type="monotone" dataKey="stress" stroke="#ff4d4d" />
            <Line type="monotone" dataKey="activity" stroke="#4da6ff" />
          </LineChart>
        </motion.div>
      )}

      {/* RECOMMENDATION */}
      <motion.div style={styles.card}>
        <motion.button
          style={styles.button}
          onClick={getRecommendation}
          whileHover={{ scale: 1.08 }}
        >
          Get Recommendation
        </motion.button>

        {loading && <p>🤖 Simulating your future...</p>}

        {recommendation && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <h3>{formatAction(recommendation.best_action.action)}</h3>
            <p>{recommendation.ai_explanation}</p>
          </motion.div>
        )}
      </motion.div>

      {/* SIMULATION */}
      <motion.div style={styles.card}>
        <h2>What If</h2>

        <div style={styles.row}>
          {["go_to_gym","take_nap","meditate"].map((a) => (
            <motion.button
              key={a}
              style={styles.buttonAlt}
              whileHover={{ scale: 1.05 }}
              onClick={() => simulateAction(a)}
            >
              {formatAction(a)}
            </motion.button>
          ))}
        </div>

        {simulation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>Energy: {simulation.before.energy.toFixed(2)} → {simulation.after.energy.toFixed(2)}</p>
            <p>Stress: {simulation.before.stress.toFixed(2)} → {simulation.after.stress.toFixed(2)}</p>
          </motion.div>
        )}
      </motion.div>

      {/* PLAN */}
      <motion.div style={styles.card}>
        <h2>Training Plan</h2>

        <motion.button style={styles.button} whileHover={{ scale: 1.05 }} onClick={getPlan}>
          Generate Plan
        </motion.button>

        {plan.map((p, i) => (
          <motion.p key={i} initial={{ x: -20 }} animate={{ x: 0 }}>
            ✅ {p}
          </motion.p>
        ))}
      </motion.div>

    </div>
  );
}

const Metric = ({ label, value }) => (
  <motion.div style={styles.metric} whileHover={{ scale: 1.05 }}>
    <h4>{label}</h4>
    <p style={{ fontSize: "20px", fontWeight: "600" }}>
      {value.toFixed(2)}
    </p>
  </motion.div>
);

export default App;

const styles = {
  container: {
    padding: "40px",
    fontFamily: "'Inter', sans-serif",
    background: "radial-gradient(circle at top, #141414, #000)",
    minHeight: "100vh",
    color: "white"
  },

  title: {
    fontSize: "40px",
    fontWeight: "700",
    textAlign: "center",
    background: "linear-gradient(90deg,#ff512f,#dd2476)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
  },

  subtitle: {
    textAlign: "center",
    color: "#aaa",
    marginBottom: "30px"
  },

  row: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "white"
  },

  dropdown: {
  position: "relative",
  marginTop: "12px",
  width: "220px",
  zIndex: 1000
  },

  dropdownSelected: {
    padding: "12px 14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.15)",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  dropdownMenu: {
    position: "absolute",
    top: "110%",
    left: 0,
    width: "100%",
    background: "rgba(20,20,20,0.95)",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    boxShadow: "0px 10px 30px rgba(0,0,0,0.6)",
    zIndex: 9999   // 👈 VERY IMPORTANT
  },

  dropdownItem: {
    padding: "12px 14px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    //backdropFilter: "blur(12px)",
    padding: "25px",
    // position: "relative",
    borderRadius: "16px",
    marginBottom: "25px",
    overflow: "visible"
  },

  button: {
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#ff512f,#dd2476)",
    color: "white",
    cursor: "pointer",
    marginTop: "10px"
  },

  buttonAlt: {
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white",
    cursor: "pointer"
  },

  metrics: {
    display: "flex",
    justifyContent: "space-around"
  },

  metric: {
    background: "rgba(255,255,255,0.05)",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center"
  }
};