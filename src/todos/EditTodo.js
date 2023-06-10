import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function EditTodo() {

  let navigate=useNavigate();

  const {id} = useParams();

  const [todo, setTodo] = useState({
    name: "",
    isCompleted: "",
    deadline: "",
  });

  const { name, isCompleted, deadline } = todo;

  const onInputChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  useEffect(()=>{
    loadTodos()
  },[]);

  const onSubmit =async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8080/todo/${id}`, todo);
    navigate("/");
  };

  const loadTodos=async ()=>{
    const result=await axios.get(`http://localhost:8080/todo/${id}`)
    setTodo(result.data);
  }

  //funkcja do walidacji formularza daty
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 p-4 mt-2">
          <h2 className="test-center m-4">Edit Todo</h2>
          <form onSubmit={(e)=>onSubmit(e)}>
            <div className="mb-3">
            <label htmlFor="Name" className="form-label">
                To do
              </label>
              <input
                type={"text"}
                className="form-control"
                placeholder="Enter your task"
                name="name"
                value={name}
                onChange={(e) => onInputChange(e)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="IsCompleted" className="form-label">
                Is done?
              </label>
              <select
                type={"text"}
                className="form-control"
                name="isCompleted"
                value={isCompleted}
                onChange={(e) => onInputChange(e)}
                required
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="Deadline" className="form-label">
                Deadline
              </label>
              <input
                type={"datetime-local"}
                className="form-control"
                name="deadline"
                value={deadline}
                min={getCurrentDateTime()}
                onChange={(e) => onInputChange(e)}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Submit
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
