import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const API = "http://localhost:8000";

  const [stage, setStage] = useState("landing");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    age: "",
    diet: "vegetarian",
    meal_timing: "",
    routine: "",
    sleep_pattern: "",
  });

  const [input, setInput] = useState({
    sleep_hours: "",
    steps: "",
    screen_time: "",
    goal: "productivity",
  });

  const [open, setOpen] = useState(false);
  const [state, setState] = useState(null);
  const [history, setHistory] = useState([]);
  const [recommendation, setRecommendation] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [plan, setPlan] = useState([]);
  const actionsForWhatIf = ["go_to_gym", "take_nap", "meditate"];

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(`${API}/profile`, {
        ...profile,
        age: Number(profile.age) || 0,
      });

      setStage("dashboard");

      // Show immediate personalized output after onboarding.
      const recRes = await axios.get(`${API}/recommend`);
      setRecommendation(recRes.data);
    } catch {
      setError("Could not save profile right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateState = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/update`, {
        sleep_hours: Number(input.sleep_hours) || 7,
        steps: Number(input.steps) || 5000,
        screen_time: Number(input.screen_time) || 3,
        goal: input.goal,
      });

      setState(res.data);

      setHistory((prev) => [
        ...prev,
        {
          index: prev.length + 1,
          energy: res.data.energy,
          stress: res.data.stress,
          activity: res.data.activity_level,
        },
      ]);
    } catch {
      setError("Could not update daily state. Please check backend and retry.");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendation = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await axios.get(`${API}/recommend`);
      setRecommendation(res.data);
    } catch {
      setError("Could not fetch recommendation right now.");
    } finally {
      setLoading(false);
    }
  };

  const simulateAction = async (action) => {
    setError("");

    try {
      const res = await axios.get(`${API}/simulate/${action}`);
      setSimulation({
        before: state,
        after: res.data.predicted_state,
        action,
        score: res.data.score,
      });
    } catch {
      setError("Simulation failed. Please try another action.");
    }
  };

  const getPlan = async () => {
    setError("");

    try {
      const res = await axios.get(`${API}/plan`);
      setPlan(res.data.plan);
    } catch {
      setError("Could not generate plan right now.");
    }
  };

  const formatAction = (a) => a.replace(/_/g, " ");

  const formatLabel = (g) => g.replace("_", " ").toUpperCase();

  const renderLanding = () => (
    <motion.section
      style={styles.hero}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <h1 style={styles.title}>LifeTwin</h1>
      <p style={styles.subtitle}>
        An AI-driven system that analyzes daily habits like meal timings,
        sleep patterns, and routines to offer personalized, context-aware
        health suggestions.
      </p>
      <p style={styles.disclaimer}>
        LifeTwin supports better everyday decisions and does not replace
        medical advice.
      </p>

      <motion.button
        style={styles.buttonPrimary}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setStage("onboarding")}
      >
        Get Started
      </motion.button>
    </motion.section>
  );

  const renderOnboarding = () => (
    <motion.section
      style={styles.card}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 style={styles.cardTitle}>Tell Us About Your Routine</h2>
      <form style={styles.form} onSubmit={submitProfile}>
        <input
          style={styles.input}
          name="name"
          value={profile.name}
          onChange={handleProfileChange}
          placeholder="Name"
          required
        />
        <input
          style={styles.input}
          name="age"
          type="number"
          min="1"
          value={profile.age}
          onChange={handleProfileChange}
          placeholder="Age"
          required
        />

        <select
          style={styles.input}
          name="diet"
          value={profile.diet}
          onChange={handleProfileChange}
        >
          <option value="vegetarian">Vegetarian</option>
          <option value="non_vegetarian">Non Vegetarian</option>
        </select>

        <input
          style={styles.input}
          name="meal_timing"
          value={profile.meal_timing}
          onChange={handleProfileChange}
          placeholder="Meal timings (e.g. 8am, 1pm, 8pm)"
          required
        />

        <input
          style={styles.input}
          name="sleep_pattern"
          value={profile.sleep_pattern}
          onChange={handleProfileChange}
          placeholder="Sleep pattern (e.g. 11pm to 6am)"
          required
        />

        <textarea
          style={styles.textarea}
          name="routine"
          value={profile.routine}
          onChange={handleProfileChange}
          placeholder="Other routines (workout, work schedule, breaks, etc.)"
          rows={4}
          required
        />

        <div style={styles.buttonRow}>
          <button
            style={styles.buttonGhost}
            type="button"
            onClick={() => setStage("landing")}
          >
            Back
          </button>
          <button style={styles.buttonPrimary} type="submit" disabled={loading}>
            {loading ? "Saving..." : "Continue"}
          </button>
        </div>
      </form>
    </motion.section>
  );

  const renderDashboard = () => (
    <>
      <motion.section style={styles.card} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 style={styles.cardTitle}>Welcome, {profile.name || "User"}</h2>
        <p style={styles.smallText}>
          We use your habits and daily signals to generate practical health suggestions.
        </p>
      </motion.section>

      <motion.section style={styles.card} whileHover={{ scale: 1.01 }}>
        <h2 style={styles.cardTitle}>Daily Input</h2>

        <div style={styles.rowWrap}>
          <input
            name="sleep_hours"
            placeholder="Sleep (hrs)"
            onChange={handleChange}
            style={styles.input}
            value={input.sleep_hours}
          />
          <input
            name="steps"
            placeholder="Steps"
            onChange={handleChange}
            style={styles.input}
            value={input.steps}
          />
          <input
            name="screen_time"
            placeholder="Screen Time (hrs)"
            onChange={handleChange}
            style={styles.input}
            value={input.screen_time}
          />
        </div>

        <div style={styles.dropdown}>
          <div style={styles.dropdownSelected} onClick={() => setOpen(!open)}>
            <div style={styles.dropdownSelectedInner}>
              {formatLabel(input.goal)}
              <span style={{ opacity: 0.7 }}>▼</span>
            </div>
          </div>

          {open && (
            <div style={styles.dropdownMenu}>
              {["productivity", "fat_loss", "relaxation"].map((g) => (
                <motion.div
                  key={g}
                  style={styles.dropdownItem}
                  whileHover={{ backgroundColor: "#e9efe7" }}
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
          style={styles.buttonPrimary}
          onClick={updateState}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
        >
          Update State
        </motion.button>
      </motion.section>

      {state && (
        <motion.section style={styles.card} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={styles.cardTitle}>Current State</h2>

          <div style={styles.metrics}>
            <Metric label="Energy" value={state.energy} />
            <Metric label="Stress" value={state.stress} />
            <Metric label="Activity" value={state.activity_level} />
          </div>
        </motion.section>
      )}

      {history.length > 0 && (
        <motion.section style={styles.card}>
          <h2 style={styles.cardTitle}>Trends</h2>
          <div style={styles.chartWrap}>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={history}>
                <XAxis dataKey="index" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="#5a7f5a" strokeWidth={2} />
                <Line type="monotone" dataKey="stress" stroke="#c06d35" strokeWidth={2} />
                <Line type="monotone" dataKey="activity" stroke="#245f73" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.section>
      )}

      <motion.section style={styles.card}>
        <motion.button
          style={styles.buttonPrimary}
          onClick={getRecommendation}
          whileHover={{ scale: 1.03 }}
        >
          Get Recommendation
        </motion.button>

        {loading && <p style={styles.smallText}>Analyzing your profile and state...</p>}

        {recommendation && (
          <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
            <h3 style={{ marginBottom: 8 }}>{formatAction(recommendation.best_action.action)}</h3>
            <p style={styles.smallText}>{recommendation.ai_explanation}</p>
          </motion.div>
        )}
      </motion.section>

      <motion.section style={styles.card}>
        <h2 style={styles.cardTitle}>What If</h2>

        <div style={styles.rowWrap}>
          {actionsForWhatIf.map((a) => (
            <motion.button
              key={a}
              style={styles.buttonAlt}
              whileHover={{ scale: 1.04 }}
              onClick={() => simulateAction(a)}
              disabled={!state}
            >
              {formatAction(a)}
            </motion.button>
          ))}
        </div>

        {simulation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>
              Energy: {simulation.before.energy.toFixed(2)} to {simulation.after.energy.toFixed(2)}
            </p>
            <p>
              Stress: {simulation.before.stress.toFixed(2)} to {simulation.after.stress.toFixed(2)}
            </p>
          </motion.div>
        )}
      </motion.section>

      <motion.section style={styles.card}>
        <h2 style={styles.cardTitle}>Training Plan</h2>

        <motion.button style={styles.buttonPrimary} whileHover={{ scale: 1.03 }} onClick={getPlan}>
          Generate Plan
        </motion.button>

        {plan.map((p, i) => (
          <motion.p key={i} initial={{ x: -15 }} animate={{ x: 0 }} style={styles.smallText}>
            - {p}
          </motion.p>
        ))}
      </motion.section>
    </>
  );

  return (
    <div style={styles.container}>
      {stage === "landing" && renderLanding()}
      {stage === "onboarding" && renderOnboarding()}
      {stage === "dashboard" && renderDashboard()}
      {error && <p style={styles.error}>{error}</p>}
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
    maxWidth: "1050px",
    margin: "0 auto",
    padding: "36px 18px 60px",
    fontFamily: "'Trebuchet MS', 'Gill Sans', sans-serif",
    background: "radial-gradient(circle at 15% 10%, #eff4e9 0%, #f5efe2 44%, #f8f8f5 100%)",
    minHeight: "100vh",
    color: "#1f2b2e",
  },

  hero: {
    textAlign: "center",
    marginTop: "9vh",
    padding: "28px",
    borderRadius: "20px",
    background: "linear-gradient(145deg, rgba(255,255,255,0.86), rgba(236,245,234,0.8))",
    border: "1px solid #dbe5d5",
    boxShadow: "0 18px 45px rgba(54, 69, 61, 0.12)",
  },

  title: {
    fontSize: "48px",
    letterSpacing: "1px",
    marginBottom: "10px",
    color: "#17392b",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: 1.55,
    maxWidth: "740px",
    margin: "0 auto 14px",
  },

  disclaimer: {
    fontSize: "14px",
    color: "#54645c",
    marginBottom: "24px",
  },

  form: {
    display: "grid",
    gap: "12px",
  },

  rowWrap: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cfd8cf",
    background: "#ffffff",
    color: "#203133",
    minWidth: "160px",
  },

  textarea: {
    borderRadius: "10px",
    border: "1px solid #cfd8cf",
    background: "#ffffff",
    color: "#203133",
    padding: "12px",
    resize: "vertical",
  },

  dropdown: {
    position: "relative",
    marginTop: "12px",
    width: "230px",
    zIndex: 1000,
  },

  dropdownSelected: {
    padding: "12px 14px",
    borderRadius: "12px",
    background: "#ffffff",
    border: "1px solid #cfd8cf",
    cursor: "pointer",
  },

  dropdownSelectedInner: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },

  dropdownMenu: {
    position: "absolute",
    top: "110%",
    left: 0,
    width: "100%",
    background: "#f8f9f4",
    borderRadius: "12px",
    border: "1px solid #cfdbc7",
    overflow: "hidden",
    boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
    zIndex: 9999,
  },

  dropdownItem: {
    padding: "12px 14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  cardTitle: {
    marginTop: 0,
    marginBottom: "12px",
    color: "#17392b",
  },

  card: {
    background: "rgba(255,255,255,0.82)",
    border: "1px solid #d7e0d0",
    padding: "25px",
    borderRadius: "16px",
    marginBottom: "25px",
    overflow: "visible",
    boxShadow: "0 14px 32px rgba(40, 58, 45, 0.1)",
  },

  buttonPrimary: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #27624b, #478064)",
    color: "#f7fff7",
    cursor: "pointer",
    marginTop: "10px",
    fontWeight: 700,
  },

  buttonGhost: {
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1px solid #b5c5b4",
    background: "#eef4ea",
    color: "#2f4a3f",
    cursor: "pointer",
    marginTop: "10px",
  },

  buttonAlt: {
    padding: "10px 12px",
    borderRadius: "10px",
    background: "#edf2ea",
    border: "1px solid #c4d0c2",
    color: "#1f3631",
    cursor: "pointer",
  },

  metrics: {
    display: "flex",
    justifyContent: "space-around",
    gap: "10px",
    flexWrap: "wrap",
  },

  metric: {
    background: "#f2f5ec",
    padding: "15px",
    borderRadius: "12px",
    textAlign: "center",
    minWidth: "120px",
    border: "1px solid #dde5d7",
  },

  chartWrap: {
    width: "100%",
    height: "280px",
  },

  smallText: {
    color: "#486159",
    lineHeight: 1.45,
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  error: {
    color: "#a34733",
    background: "#ffe8de",
    border: "1px solid #f3c9bc",
    borderRadius: "10px",
    padding: "10px 12px",
  },
};