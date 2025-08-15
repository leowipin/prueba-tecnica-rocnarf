import { BrowserRouter, Routes, Route } from "react-router"
import LoginPage from "./pages/LoginPage"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage/>} />
        <Route path="/about" element={<div>About</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
