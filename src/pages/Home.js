import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    loadTodos();
    // Uruchomienie odświeżania co sekundę
    const interval = setInterval(() => {
      refreshRemainingTime();
    }, 1000);

    // Wyczyszczenie interwału po zakończeniu komponentu
    return () => {
      clearInterval(interval);
    };
  }, []);

  const refreshRemainingTime = () => {
    // Odświeżanie pozostałego czasu dla każdego zadania
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => ({
        ...todo,
        remainingTime: calculateRemainingTime(todo.deadline),
      }));
    });
  };

  const loadTodos = async () => {
    const result = await axios.get("http://localhost:8080/todos");
    setTodos(result.data);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`http://localhost:8080/todo/${id}`);
    loadTodos();
  };
  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}/${month}/${year}   ${hours}:${minutes}:${seconds}`;
  };

  const calculateRemainingTime = (fromdate) => {
    const now = new Date();
    const fromDate = new Date(fromdate);

    const diffInMilliseconds = fromDate - now;

    if (diffInMilliseconds <= 0) {
      return "exceeded";
    }

    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const years = Math.floor(diffInSeconds / (365 * 24 * 60 * 60));
    const days = Math.floor(diffInSeconds / (24 * 60 * 60));
    const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
    const seconds = diffInSeconds % 60;

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}`;
    } else if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  };

  //aktualizacja checkboxa
  const toggleComplete = async (id, isCompleted) => {
    const updatedTodo = {
      ...todos.find((todo) => todo.id === id),
      isCompleted: !isCompleted,
    };

    await axios.put(`http://localhost:8080/todo/${id}`, updatedTodo);
    loadTodos();
  };

  return (
    <div className="container">
      <div>
        <div className="bg-third">
          <div className="fs-1 p-2">To do list</div>
          <div className="d-flex fw-bold">
            <div className="p-2 w-10">Done?</div>
            <div className="p-2 w-40 d-flex">To do</div>
            <div className="p-2 w-15">Deadline</div>
            <div className="p-2 w-15">Remain</div>
            <div className="p-2 w-20">Action</div>
          </div>
          {todos.map((todo, index) => (
            <div className="d-flex align-items-center" key={index}>
              <div className="p-2 w-10">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={todo.isCompleted}
                  onChange={() => toggleComplete(todo.id, todo.isCompleted)}
                />
              </div>
              <div className="p-2 w-40 d-flex flex-start text-wrap text-left">{todo.name}</div>
              <div className="p-2 w-15">{formatDateTime(todo.deadline)}</div>
              <div className="p-2 w-15">
                {calculateRemainingTime(todo.deadline)}
              </div>
              <div className="p-2 w-20">
                <Link
                  className="btn btn-outline-primary mx-2 w-40"
                  to={`/edittodo/${todo.id}`}
                >
                  Edit
                </Link>
                <button
                  className="btn btn-danger mx-2 w-40"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="py-3">
        <Link className="btn btn-outline-success" to="/addtodo">
          Nowe zadanie
        </Link>
        </div>
      </div>
    </div>
  );
}
