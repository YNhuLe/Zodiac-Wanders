
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage/Homepage";
import CardPage from "./pages/CardPage/CardPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/photos/:id" element={<CardPage />} />
      </Routes>
    </Router>
  );
}

export default App;