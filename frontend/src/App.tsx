import { useEffect, useState } from "react";
import "./App.css";
import Alert from "./components/Alert";
import TodoList from "./components/TodoList";
import { API_BASE_URL } from "./api";

interface TodoItem {
  id: number;
  todo: string;
  todo_extra?: string;
  deadline?: string;
  important: boolean;
}

function App() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newExtraTodoText, setExtraTodoText] = useState("");
  const [isImp, setImp] = useState(false);
  const [date, setDate] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const fetchTodo = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos`);
      const data = await response.json();
      setTodos(data);
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
      await fetch(`${API_BASE_URL}/api/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          todo: newTodo,
          todo_extra: newExtraTodoText,
          important: isImp,
          deadline: date || null,
        }),
      });
      setNewTodo("");
      setExtraTodoText("");
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
        setTodos((prev) => prev.filter((todo) => todo.id !== id));
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

  const handleSave = () => {
    if (newTodo.trim() !== "") {
      addTodo();
    } else {
      setNewTodo("");
    }
  };

  const handleCancel = () => {
    setNewTodo("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const toggleImportance = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/todos/${id}/toggle`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        await fetchTodo();
      }
    } catch (error) {
      console.error("Error toggling importance: ", error);
    }
  };

  return (
    <>
      <div className="container custom-container">
        <div className="row custom-row">
          <div className="col-5 text-center">
            <h1 className="headers">Create Todo</h1>
            {showAlert && <Alert setShowAlert={setShowAlert}></Alert>}
            <div className="input-container">
              <input
                type="text"
                className="todoInput"
                placeholder="Todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <textarea
                className="todoExtraInput"
                placeholder="Extra Text"
                value={newExtraTodoText}
                onChange={(e) => setExtraTodoText(e.target.value)}
                rows={3}
              />
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                }}
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
              <button className="btn" onClick={addTodo}>
                Add
              </button>
            </div>
          </div>
          <TodoList
            title="All Todos"
            todos={todos}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onToggleImportance={toggleImportance}
          />
        </div>
      </div>
    </>
  );
}

export default App;
