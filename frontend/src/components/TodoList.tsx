import Todo from "./Todo";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface TodoItem {
  id: number;
  todo: string;
  todo_extra?: string;
  deadline?: string;
  important: boolean;
  position: number;
}

interface Props {
  title: string;
  todos: TodoItem[];
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onToggleImportance: (id: number) => void;
  onReorder: (newOrder: TodoItem[]) => void;
}

const TodoList = ({
  title,
  todos,
  onDelete,
  onEdit,
  onToggleImportance,
  onReorder,
}: Props) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);

      const newOrder = arrayMove(todos, oldIndex, newIndex);
      onReorder(newOrder);
    }
  };
  return (
    <div className="col-7 text-center">
      <h1 className="headers">{title}</h1>
      <div className="todo-list-container">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
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
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
};
export default TodoList;
