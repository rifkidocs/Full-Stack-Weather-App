import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Cuaca from "./pages/Cuaca";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/cuaca' element={<Cuaca />} />
    </Routes>
  );
}

export default App;
