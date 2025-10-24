import "../App.css";

interface TodoList {
  id: number;
  name: string;
  todo_count: number;
}

interface Props {
  lists: TodoList[];
  selectedListId: number | null;
  onSelectList: (listId: number) => void;
  onCreateList: () => void;
  onDeleteList: (listId: number) => void;
  onRenameList: (listId: number) => void;
}

const Sidebar = ({
  lists,
  selectedListId,
  onSelectList,
  onCreateList,
  onDeleteList,
  onRenameList,
}: Props) => {
  return (
    <div className="col-2 sidebar">
      <h2 className="sidebar-title">My Lists</h2>
      <div className="list-container">
        {lists.map((list) => (
          <div
            key={list.id}
            className={`list-item ${
              selectedListId === list.id ? "active" : ""
            }`}
			onClick={() => onSelectList(list.id)}
          >
            <div className="list-info">
              <span className="list-name">{list.name}</span>
              <span className="list-count">{list.todo_count}</span>
            </div>
            <div className="list-actions">
              <button
                className="list-rename-button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRenameList(list.id);
                }}
                title="Rename List"
              >
                ✎
              </button>
              {lists.length > 1 && (
                <button
                  className="list-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteList(list.id);
                  }}
                  title="Delete List"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
	  <button className="create-list-btn" onClick={onCreateList}>
		+ New List
	  </button>
    </div>
  );
};

export default Sidebar;