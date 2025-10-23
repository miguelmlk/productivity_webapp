import Todo from "./Todo";

interface TodoItem {
  id: number;
  todo: string;
  todo_extra?: string;
  deadline?: string;
  important: boolean;
}

interface Props {
  title: string;
  todos: TodoItem[];
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onToggleImportance: (id: number) => void;
}

const TodoList = ({ title, todos, onDelete, onEdit, onToggleImportance }: Props) => (
  <div className="col-7 text-center">
    <h1 className="headers">{title}</h1>
    <div className="todo-list-container">
      {todos.map((t) => (
        <Todo
          key={t.id}
          todo_id={t.id}
          todo={t.todo}
		  todo_extra={t.todo_extra}
		  date={t.deadline || ""}
		  important={t.important}
          onDelete={onDelete}
          onEdit={onEdit}
		  onToggleImportance={onToggleImportance}
        />
      ))}
    </div>
  </div>
);

export default TodoList;
