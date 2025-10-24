from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class TodoList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    
    todos = db.relationship('Todo', backref='list', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
			'id': self.id,
			'name': self.name,
			'todo_count': len(self.todos)
		}

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    todo = db.Column(db.String(200), nullable=False)
    todo_extra = db.Column(db.String(10000), nullable=True)
    important = db.Column(db.Boolean, default=False)
    deadline = db.Column(db.String(50), nullable=True)
    position = db.Column(db.Integer, default=0)
    list_id = db.Column(db.Integer, db.ForeignKey('todo_list.id'), nullable=False)
    
    def to_dict(self):
        return {
			'id': self.id,
			'todo': self.todo,
			'todo_extra': self.todo_extra,
			'deadline': self.deadline,
			'important': self.important,
			'position': self.position,
   			'list_id': self.list_id
		}

with app.app_context():
    db.create_all()
    
    if TodoList.query.count() == 0:
        default_list = TodoList(name="My Tasks")
        db.session.add(default_list)
        db.session.commit()
        
@app.route("/api/lists", methods=["GET"])
def get_lists():
    lists = [lst.to_dict() for lst in TodoList.query.all()]
    return jsonify(lists)

@app.route("/api/lists", methods=["POST"])
def create_list():
    data = request.get_json()
    new_list = TodoList(name=data["name"])
    db.session.add(new_list)
    db.session.commit()
    return jsonify({'message': "List created", "list": new_list.to_dict()}), 201

@app.route("/api/lists/<int:list_id>", methods=["DELETE"])
def delete_list(list_id):
    lst = TodoList.query.get(list_id)
    if lst:
        db.session.delete(lst)
        db.session.commit()
        return jsonify({'message': f"List {list_id} deleted"}), 200
    return jsonify({'message': f"List {list_id} not found"}), 404

@app.route("/api/lists/<int:list_id>", methods=["PUT"])
def rename_list(list_id):
    lst = TodoList.query.get(list_id)
    if not lst:
        return jsonify({'message': f"List {list_id} not found"}), 404
    
    data = request.get_json()
    lst.name = data.get("name", lst.name)
    db.session.commit()
    return jsonify({'message': f"List {list_id} renamed", "list": lst.to_dict()}), 200

@app.route("/api/lists/<int:list_id>/todos", methods=["GET"])
def get_todos(list_id):
    todos = [todo.to_dict() for todo in Todo.query.filter_by(list_id=list_id).order_by(Todo.position).all()]
    return jsonify(todos)

@app.route("/api/lists/<int:list_id>/todos/reorder", methods=["POST"])
def reorder_todos(list_id):
    data = request.get_json()
    todo_order = data.get("order")
    
    for index, todo_id in enumerate(todo_order):
        todo = Todo.query.get(todo_id)
        if todo and todo.list_id == list_id:
            todo.position = index
    
    db.session.commit()
    return jsonify({'message': 'Todos reordered'}), 200

@app.route("/api/lists/<int:list_id>/todos", methods=["POST"])
def add_todo(list_id):
	data = request.get_json()
 
	new_todo = Todo(
		todo=data["todo"],
		todo_extra = data.get("todo_extra"),
		important=data.get("important", False),
		deadline=data.get("deadline"),
  		list_id=list_id 
	)

	db.session.add(new_todo)
	db.session.commit()
 
	return jsonify({'message':"Todo created", "todo": new_todo.to_dict()}), 201

@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    
    if todo:
        db.session.delete(todo)
        db.session.commit()
        return jsonify({'message': f"Todo: {todo_id} deleted"}), 200
    
    return jsonify({'message': f"Todo: {todo_id} not found"}), 404

@app.route("/api/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
	todo = Todo.query.get(todo_id)
    
	if not todo:
		return jsonify({'message': f"Todo: {todo_id} not found"}), 404
    
	data = request.get_json()
	todo.todo = data.get("todo", todo.todo)
	todo.deadline = data.get("deadline", todo.deadline)
 
	db.session.commit()
 
	return jsonify({'message': f"Todo: {todo_id} updated", "todo": todo.to_dict()})

@app.route("/api/todos/<int:todo_id>/toggle", methods=["PATCH"])
def toggle_importance(todo_id):
    todo = Todo.query.get(todo_id)
    
    if not todo:
        return jsonify({'message': f"Todo: {todo_id} not found"}), 404
    
    todo.important = not todo.important
    
    db.session.commit()
    
    return jsonify({
		'message': f"Todo: {todo_id} importance toggled",
		"todo": todo.to_dict()
	}), 200
    

if __name__ == "__main__":
    app.run(debug=True)