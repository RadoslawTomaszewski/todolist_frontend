import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AddTodo from "./todos/AddTodo";
import EditTodo from "./todos/EditTodo";
import './index.css';

function App() {
  return (
    <div className="App">
      <div className="d-flex justify-content-center align-items-start bg-first min-vh-100 ">
        <div className="d-flex flex-column w-75 p-3 m-5 bg-third rounded">
          <Router>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/addtodo" element={<AddTodo />} />
              <Route exact path="/edittodo/:id" element={<EditTodo />} />
            </Routes>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
