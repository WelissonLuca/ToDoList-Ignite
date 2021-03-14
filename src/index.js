const express = require('express');
const cors = require('cors');

// const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.header;

  const user = users.find(user => user.username === username)

  if(!username)
    return response.status(400).json({error: "user not exists"})
  request.user = user;

  return next();
}

app.post('/users',(request, response) => {
  const {name , username } = request.body;

  const user = users.some(user => user.username === username);

  if(user)
    return response.status(400).json({error: "user already exists!"})
  
    users.push({
    id: 'uuid', // precisa ser um uuid
    name: 'Danilo Vieira', 
    username: 'danilo', 
    todos: []
  });

  return response.status(201).send("Create User Complete");


});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const user = req;

   
  return response.status(201).json(user)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});



module.exports = app;