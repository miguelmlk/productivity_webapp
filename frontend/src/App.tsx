import { useEffect, useState } from "react";
import "./App.css";
import Todo from "./components/Todo";
import Alert from "./components/Alert";
import TodoList from "./components/TodoList";
import { API_BASE_URL } from "./api";

function App() {
  const [impTodo, setImpTodo] = useState([]);
  const [notImpTodo, setNotImpTodo] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [isImp, setImp] = useState(false);
  const [date, setDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`);
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
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo: newTodo,
          important: isImp,
          deadline: date || null,
        }),
      });
      setNewTodo("");
      setImp(false);
	  setDate("");
      await fetchTodo();
    } catch (error) {
      console.log("Error adding todo: ", error);
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
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

  const editTodo = async (id: number, newText: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todo: newText }),
      });

      if (response.ok) {
        await fetchTodo();
      }
    } catch (error) {
      console.error("Error editing todo: ", error);
    }
  };

  return (
    <>
      <div className="container custom-container">
        <div className="row custom-row">
          <TodoList
            title="Important"
            todos={impTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
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
              <div className="important-check-container">
                <h3 className="important-h3">Important:</h3>
                <input
                  type="checkbox"
                  checked={isImp}
                  onChange={(e) => {
                    setImp(e.target.checked);
                  }}
                  name="Important"
                  id=""
                />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
              />
              <button className="btn" onClick={addTodo}>
                Add
              </button>
            </div>
          </div>
          <TodoList
            title="Not Important"
            todos={notImpTodo}
            onDelete={deleteTodo}
            onEdit={editTodo}
          />
        </div>
      </div>
    </>
  );
}

export default App;
