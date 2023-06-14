import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

axios.defaults.withCredentials = false;
//funkcja do walidacji formularza daty
const getCurrentDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now;
};

//funkcja dodajaca automatycznie termin na godzine do przodu
const getFutureDateTime = () => {
  const now = getCurrentDateTime();
  now.setMinutes(now.getMinutes() + 60);
  return now.toISOString().slice(0, 16);
};

export default function TodoForm({ title }) {
  const { id } = useParams();

  //hook pozwalajacy zablokowac wybranie daty z przeszlosci
  const [minDate, setMinDate] = useState(
    getCurrentDateTime().toISOString().slice(0, 16)
  );

  //hook pozwalajacy przekierowywac na inne pathe
  let navigate = useNavigate();

  //wypełnienie formularza na start
  const [todo, setTodo] = useState({
    name: "",
    isCompleted: false,
    deadline: getFutureDateTime(),
  });



  useEffect(() => {
    const loadTodo = async () => {
      const result = await axios.get(`https://to-do-list-hdmj.onrender.com/todo/${id}`);
      setTodo(result.data);
    };
    if (id) {
      loadTodo();
    }
  },[id]);

  const { name, isCompleted, deadline } = todo;

  //e to obiekt zdarzenia zmiany (ChangeEvent)
  //e.target to element formularza, który wywołał zdarzenie zmiany
  //e.target.name zawiera nazwę pola, które uległo zmianie
  //e.target.value zawiera nową wartość tego pola

  const onInputChange = (e) => {
    if (e.target.name === "deadline") {
      setMinDate(e.target.value);
    }
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    //zapobiega automatycznemu odswiezeniu strony
    e.preventDefault();
    if (id) await axios.put(`https://to-do-list-hdmj.onrender.com/todo/${id}`, todo);
    else await axios.post("https://to-do-list-hdmj.onrender.com/todo", todo);
    //przekierowanie do home
    navigate("/");
  };

  return (
    <div className="container bg-third my-3 mx-1 rounded">
      <div className="row">
        <div className="col-md-6 offset-md-3 p-4">
          <h2 className="test-center font-weight-bold">{title}</h2>
          <form onSubmit={(e) => onSubmit(e)}>
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
                type="datetime-local"
                className="form-control"
                name="deadline"
                value={deadline}
                onChange={(e) => onInputChange(e)}
                min={minDate}
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
