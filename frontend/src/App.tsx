import { useEffect, useState } from "react";
import "./App.css";
import TodoList from "./components/TodoList";
import Sidebar from "./components/Sidebar";
import { API_BASE_URL } from "./api";

interface TodoItem {
  id: number;
  todo: string;
  todo_extra?: string;
  deadline?: string;
  important: boolean;
  position: number;
  list_id: number;
}

interface List {
  id: number;
  name: string;
  todo_count: number;
}

function App() {
  const [lists, setLists] = useState<List[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [newExtraTodoText, setExtraTodoText] = useState("");
  const [isImp, setImp] = useState(false);
  const [date, setDate] = useState("");

  const fetchLists = async () => {
	try {
		const response = await fetch(`${API_BASE_URL}/api/lists`);
		const data = await response.json();
		setLists(data);

		if (data.length > 0 && !selectedListId) {
			setSelectedListId(data[0].id);
		}
	} catch (err) {
		console.log("Error fetching lists: ", err);
	}
  };

  const fetchTodos = async (listId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lists/${listId}/todos`);
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.log("Error fetching Todos: ", err);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  useEffect(() => {
	if (selectedListId) {
		fetchTodos(selectedListId);
	}
  }, [selectedListId]);

  const createList = async () => {
	const listName = prompt("Enter list name: ");
	if (!listName || listName.trim() === "") return;

	try {
		await fetch(`${API_BASE_URL}/api/lists`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: listName.trim() }),
		});
		await fetchLists();
	} catch (error) {
		console.log("Error creating list: ", error);
	}
  };

  const deleteList = async (listId: number) => {
	if (!confirm("Delete this list and all its todos?")) return;

	try {
		await fetch(`${API_BASE_URL}/api/lists/${listId}`, {
			method: "DELETE"
		});

		if (selectedListId === listId && lists.length > 1) {
			const otherList = lists.find((l) => l.id !== listId);
			if (otherList) setSelectedListId(otherList.id);
		}
		await fetchLists();
	} catch (error) {
		console.log("Error deleting list: ", error);
	}
  }

  const renameList = async (listId: number) => {
	const currentName = lists.find((l) => l.id === listId)?.name;
	const newName = prompt("Enter new list name:", currentName);
	if (!newName || newName.trim() === "" || newName === currentName) return;

	try {
		await fetch(`${API_BASE_URL}/api/lists/${listId}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name: newName.trim() }),
		});
		await fetchLists();
	} catch (error) {
		console.log("Error renaming list: ", error);
	}
  };

  const addTodo = async () => {
    if (newTodo === "" || !selectedListId) {
      console.log("Entry Can't be Empty or No List Selected");
      return;
    }
    try {
      await fetch(`${API_BASE_URL}/api/lists/${selectedListId}/todos`, {
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
      await fetchTodos(selectedListId);
	  await fetchLists();
    } catch (error) {
      console.log("Error adding todo: ", error);
    }
  };

  const reorderTodos = async (newOrder: TodoItem[]) => {
	if (!selectedListId) return;

    setTodos(newOrder);

    try {
      await fetch(`${API_BASE_URL}/api/lists/${selectedListId}/todos/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: newOrder.map((t) => t.id),
        }),
      });
    } catch (error) {
      console.error("Error reordering todos: ", error);
      await fetchTodos(selectedListId);
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
		await fetchLists();
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

      if (response.ok && selectedListId) {
        await fetchTodos(selectedListId);
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

      if (response.ok && selectedListId) {
        await fetchTodos(selectedListId);
      }
    } catch (error) {
      console.error("Error toggling importance: ", error);
    }
  };

  const selectedList = lists.find((l) => l.id === selectedListId);

  return (
    <>
      <div className="container-fluid custom-container">
        <div className="row custom-row">
			<Sidebar 
			lists={lists} 
			selectedListId={selectedListId} 
			onSelectList={setSelectedListId} 
			onCreateList={createList} 
			onDeleteList={deleteList} 
			onRenameList={renameList}/>
          <div className="col-4 text-center">
            <h1 className="headers">Create Todo</h1>
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
            title={selectedList?.name || "Todos"}
            todos={todos}
            onDelete={deleteTodo}
            onEdit={editTodo}
            onToggleImportance={toggleImportance}
            onReorder={reorderTodos}
          />
        </div>
      </div>
    </>
  );
}

export default App;
