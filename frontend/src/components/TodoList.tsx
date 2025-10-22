import Todo from "./Todo";

interface TodoItem {
  id: number;
  todo: string;
  deadline?: string;
}

interface Props {
  title: string;
  todos: TodoItem[];
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

const TodoList = ({ title, todos, onDelete, onEdit }: Props) => (
  <div className="col-3 text-center">
    <h1 className="headers">{title}</h1>
    <div className="todo-list-container">
      {todos.map((t) => (
        <Todo
          key={t.id}
          todo_id={t.id}
          todo={t.todo}
		  date={t.deadline || ""}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  </div>
);

export default TodoList;
