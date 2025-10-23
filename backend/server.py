from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todos.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    todo = db.Column(db.String(200), nullable=False)
    todo_extra = db.Column(db.String(10000), nullable=True)
    important = db.Column(db.Boolean, default=False)
    deadline = db.Column(db.String(50), nullable=True)
    
    def to_dict(self):
        return {
			'id': self.id,
			'todo': self.todo,
			'todo_extra': self.todo_extra,
			'deadline': self.deadline,
			'important': self.important
		}

with app.app_context():
    db.create_all()

@app.route("/api/todos", methods=["GET"])
def get_todos():
    important_todos = [todo.to_dict() for todo in Todo.query.filter_by(important=True).all()]
    not_important_todos = [todo.to_dict() for todo in Todo.query.filter_by(important=False).all()]
    return jsonify({
		"important": important_todos,
		"not_important": not_important_todos
	})

@app.route("/api/todos", methods=["POST"])
def add_todo():
	data = request.get_json()
 
	new_todo = Todo(
		todo=data["todo"],
		todo_extra = data.get("todo_extra"),
		important=data.get("important", False),
		deadline=data.get("deadline")
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