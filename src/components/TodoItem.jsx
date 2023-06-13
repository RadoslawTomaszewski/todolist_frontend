import React, { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";

//funkcja obliczajaca pozostaly czas wykonania zadania
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

//funkcja wyswietlajaca sformatowana date
const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return (
    <span>
      {`${day}/${month}/${year}`}
      <br />
      {`${hours}:${minutes}:${seconds}`}
    </span>
  );
};

export const TodoItem = ({ todo, loadTodos }) => {
  const [remainingTime, setRemainingTime] = useState();

  //AXIOS usuniecie zadania
  const deleteTodo = async () => {
    await axios.delete(`http://localhost:8080/todo/${todo.id}`);
    loadTodos();
  };

  //AXIOS aktualizacja checkboxa isComplete
  const toggleComplete = async () => {
    const updatedTodo = {
      ...todo,
      isCompleted: !todo.isCompleted,
    };
    await axios.put(`http://localhost:8080/todo/${todo.id}`, updatedTodo);
    loadTodos();
  };

  useEffect(() => {
    if (todo) {
      // Uruchomienie odświeżania co sekundę
      const interval = setInterval(() => {
        setRemainingTime(() => calculateRemainingTime(todo.deadline));
      }, 1000);
      // Wyczyszczenie interwału po odmontowaniu komponentu
      return () => {
        clearInterval(interval);
      };
    }
  }, [todo]);

  return (
    <div className="row justify-content-start mb-1 ms-2 ms-md-5">
      <div className="col-8 col-md-5">
        <div className="d-flex justify-content-start text-left">
          <input
            style={{ minWidth: "15px" }}
            className="form-check-input me-2 "
            type="checkbox"
            checked={todo.isCompleted}
            onChange={() => toggleComplete(todo.id, todo.isCompleted)}
          />
          {todo.name}
        </div>
      </div>
      <div className="d-none d-md-block col-2 align-items-center">
        {formatDateTime(todo.deadline)}
      </div>
      <div className="d-none d-md-block col-2 my-auto">
        {remainingTime || <div className="spinner-border text-success" role="status"/>}
      </div>
      <div className="col-4 col-md-3">
        <Link
          className="btn btn-outline-primary m-1 min-w-40 text-responsive"
          to={`/edittodo/${todo.id}`}
        >
          <AiFillEdit />
        </Link>
        <button
          className="btn btn-danger m-1 min-w-40 text-responsive"
          onClick={() => deleteTodo(todo.id)}
        >
          <AiFillDelete />
        </button>
      </div>
    </div>
  );
};
