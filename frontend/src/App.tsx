import { useEffect, useState } from "react";
import "./App.css";
import Todo from "./components/Todo";
import Alert from "./components/Alert";

function App() {
  const [impTodo, setImpTodo] = useState([]);
  const [notImpTodo, setNotImpTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isImp, setImp] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const fetchTodo = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/todos");
      const data = await response.json();
      setImpTodo(data.important);
      setNotImpTodo(data.not_important);
    } catch (err) {
      console.log("Error fetching Todos: ", err);
    }
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const addTodo = async () => {
    if (newTodo === "") {
      console.log("Entry Can't be Empty");
      return "";
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: newTodo, important: isImp }),
      });
      setNewTodo("");
      setImp(false);
      await fetchTodo();
    } catch (error) {
      console.log("Error adding todo: ", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/todos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setImpTodo((prev) => prev.filter((todo) => todo.id !== id));
        setNotImpTodo((prev) => prev.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  return (
    <>
      <div className="container custom-container">
        <div className="row custom-row">
          <div className="col-3 text-center">
            <h1 className="headers">Important</h1>
            {impTodo.map((t) => (
              <Todo
                key={t.id}
                todo_id={t.id}
                todo={t.todo}
                onDelete={deleteTodo}
              ></Todo>
            ))}
          </div>
          <div className="col-6 text-center">
            <h1 className="headers">Todo Liste</h1>
            {showAlert && <Alert setShowAlert={setShowAlert}></Alert>}
            <div className="input-container">
              <input
                type="text"
                className="todoInput"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <input
                type="checkbox"
                checked={isImp}
                onChange={(e) => {
                  setImp(e.target.checked);
                }}
                name="Important"
                id=""
              />
              <button className="btn" onClick={addTodo}>
                Add
              </button>
            </div>
          </div>
          <div className="col-3 text-center">
            <h1 className="headers">Not important</h1>
            {notImpTodo.map((t) => (
              <Todo
                key={t.id}
                todo_id={t.id}
                todo={t.todo}
                onDelete={deleteTodo}
              ></Todo>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
