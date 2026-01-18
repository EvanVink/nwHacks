import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import CallPage from './pages/callPage'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";


function App() {

  return (
    <div>
      <CallPage />
    </div>
  );
}

export default App
