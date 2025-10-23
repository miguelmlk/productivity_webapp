import "../App.css";
import "../assets/trash-solid-full.svg";
import { useState, useRef, useEffect } from "react";

interface Props {
  todo_id: number;
  todo: string;
  todo_extra?: string;
  date: string;
  important: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
  onToggleImportance: (id: number) => void;
}

const Todo = ({
  todo_id,
  todo,
  todo_extra,
  date,
  important,
  onDelete,
  onEdit,
  onToggleImportance,
}: Props) => {
  const [isChecked, setChecked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null); //??

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editedText.trim() !== "") {
      onEdit(todo_id, editedText.trim());
      setIsEditing(false);
    } else {
      setEditedText(todo);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedText(todo);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`todo-wrapper ${todo_extra && isExpanded ? "has-extra-expanded" : ""}`}>
      <div key={todo_id} className="todo-container">
        {date && <span className="todo-deadline">{formatDate(date)}</span>}
		{important && <span className="important-badge">⭐</span>}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="todo-entry todo-edit-input"
          />
        ) : (
          <h5 className={isChecked ? "todo-entry crossed" : "todo-entry"}>
            {todo}
          </h5>
        )}

        {isEditing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="importance-toggle"
            onMouseDown={() => onToggleImportance(todo_id)}
          >
            <path d="M534.6 182.6C547.1 170.1 547.1 149.8 534.6 137.3L470.6 73.3C461.4 64.1 447.7 61.4 435.7 66.4C423.7 71.4 416 83.1 416 96L416 128L256 128C150 128 64 214 64 320C64 337.7 78.3 352 96 352C113.7 352 128 337.7 128 320C128 249.3 185.3 192 256 192L416 192L416 224C416 236.9 423.8 248.6 435.8 253.6C447.8 258.6 461.5 255.8 470.7 246.7L534.7 182.7zM105.4 457.4C92.9 469.9 92.9 490.2 105.4 502.7L169.4 566.7C178.6 575.9 192.3 578.6 204.3 573.6C216.3 568.6 224 556.9 224 544L224 512L384 512C490 512 576 426 576 320C576 302.3 561.7 288 544 288C526.3 288 512 302.3 512 320C512 390.7 454.7 448 384 448L224 448L224 416C224 403.1 216.2 391.4 204.2 386.4C192.2 381.4 178.5 384.2 169.3 393.3L105.3 457.3z" />
          </svg>
        ) : (
          <>
            <input
              type="checkbox"
              name="checked"
              id=""
              className="check"
              onClick={() => (isChecked ? setChecked(false) : setChecked(true))}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="trashcan"
              onClick={() => onDelete(todo_id)}
            >
              <path d="M232.7 69.9L224 96L128 96C110.3 96 96 110.3 96 128C96 145.7 110.3 160 128 160L512 160C529.7 160 544 145.7 544 128C544 110.3 529.7 96 512 96L416 96L407.3 69.9C402.9 56.8 390.7 48 376.9 48L263.1 48C249.3 48 237.1 56.8 232.7 69.9zM512 208L128 208L149.1 531.1C150.7 556.4 171.7 576 197 576L443 576C468.3 576 489.3 556.4 490.9 531.1L512 208z" />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 640 640"
              className="edit"
              onClick={() => setIsEditing(true)}
            >
              <path d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z" />
            </svg>
          </>
        )}
      </div>
      {todo_extra && (
        <>
          <div className={`todo-extra ${isExpanded ? "expanded" : ""}`}>
            <p className="todo-extra-text">{todo_extra}</p>
          </div>
          <button
            className="todo-expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className={`expand-arrow ${isExpanded ? "rotated" : ""}`}
            >
              <path d="M201.4 342.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 274.7 86.6 137.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
};

export default Todo;
