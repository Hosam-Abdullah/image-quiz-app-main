import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./components/AdminPanel";
import UserQuiz from "./components/UserQuiz";
import SafetyScreen from "./components/SafetyScreen";
import { ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<SafetyScreen />} />
          <Route path="/quiz" element={<UserQuiz />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
