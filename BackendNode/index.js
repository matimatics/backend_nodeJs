require("dotenv").config();
require("./mongo.js");

//const http = require('http')
//se instala
const express = require("express");
const app = express();
//se instala, es para usar 2 conexiones en la misma ¿¿maquina??
const cors = require("cors");
const logger = require("./loggerMiddleware.js");
const notFound = require("./middleware/notFound.js");
const handleError = require("./middleware/handleError.js");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login.js");
const notesRouter = require("./controllers/notes.js");

app.use(express.json());
app.use(logger);
app.use(cors());

/* const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify(notes))
}) */

//endpoints
app.get("/", (request, response) => {
  response.send("<h1>Hello Mati</h1>");
});

app.use("/api/notes", notesRouter)
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(notFound);
app.use(handleError);

const PORT = /* esto es para el deploy en heroku */ process.env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server };
