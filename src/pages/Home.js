import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { TodoItem } from "../components/TodoItem";

export default function Home() {
  const [todos, setTodos] = useState();

  //AXIOS wczytanie zadan
  const loadTodos = async () => {
    const result = await axios.get("https://to-do-list-hdmj.onrender.com/todos");
    setTodos(result.data);
  };

  //HOOK useEffect wykorzystany do timera pozostalego czasu
  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="container bg-third my-3 mx-1 rounded">
      <div className="fs-1 p-2 font-weight-bold">To do list</div>
      <div className="row mb-2 ms-2 ms-md-5 font-weight-bold">
        <div className="col-8 col-md-5">To do:</div>
        <div className="d-none d-md-block col-2">Deadline:</div>
        <div className="d-none d-md-block col-2">Remain:</div>
        <div className="col-4 col-md-3">Action:</div>
      </div>
      {todos ? (
        todos.map((todo, index) => (
          <TodoItem key={index} todo={todo} loadTodos={loadTodos} />
        ))
      ) : (
        <div className="spinner-border my-5 text-success" role="status" />
      )}

      <div className="py-3">
        <Link className="btn btn-outline-success" to="/addtodo">
          Add new to do
        </Link>
      </div>
    </div>
  );
}
