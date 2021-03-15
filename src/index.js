const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
	const { username } = request.headers;

	const user = users.find((user) => user.username === username);

	if (!user) {return response.status(400).json({ error: "user not exists" })};

	request.user = user;

	return next();
}

app.post("/users", (request, response) => {
	const { name, username } = request.body;

	const userAlredyExists = users.find((user) => user.username === username);

	if (userAlredyExists){
		return response.status(400).json({ error: "user already exists!" });
  }
	const newUser = {
		id: uuidv4(),
		name,
		username,
		todos: [],
	};
	users.push(newUser);

	return response.status(201).json(newUser);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
	const { user } = request;

	return response.status(201).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;


	const todo = {
		id: uuidv4(),
		title,
		done: false,
		deadline: new Date(deadline),
		created_at: new Date(),
	};

	user.todos.push(todo);

	return response.status(201).json(todo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
	const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;
	
	
	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo)
		{return response
			.status(404)
			.json({ error: "Couldnt find todo with the passed ID" });
    }
	todo.title = title;
	todo.deadline = new Date(deadline);

	return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
	const { id } = request.params;

	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo)
		{return response
			.status(404)
			.json({ error: "Couldnt find todo with the passed ID" });
    }
	todo.done = true;

	return response.json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
	const { user } = request;
  const { id } = request.params;
	
	const todo = user.todos.find((todo) => todo.id === id);

	if (!todo)
		{return response
			.status(404)
			.json({ error: "Couldnt find todo with the passed ID" });
    }
	user.todos.splice(todo, 1);

	return response.status(204).json(user.todos);
});

module.exports = app;
