import React from "react";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Cuaca from "./pages/Cuaca";
import NotFound from "./components/404";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/cuaca' element={<Cuaca />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default App;
