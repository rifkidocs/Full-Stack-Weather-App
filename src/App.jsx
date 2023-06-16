import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Cuaca from "./pages/Cuaca";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/cuaca' element={<Cuaca />} />
      </Routes>
    </Router>
  );
}

export default App;
