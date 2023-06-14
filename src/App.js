import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTodo from "./pages/AddTodo";
import EditTodo from "./pages/EditTodo";
import './index.css';

function App() {
  return (
    <div className="App">
      <div className="d-flex justify-content-center align-items-start bg-first min-vh-100 ">
          <Router>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/addtodo" element={<AddTodo />} />
              <Route exact path="/edittodo/:id" element={<EditTodo />} />
            </Routes>
          </Router>
      </div>
    </div>
  );
}

export default App;
