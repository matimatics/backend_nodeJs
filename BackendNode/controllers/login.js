//para hashear
const bcrypt = require("bcrypt");
// Creacion del router
const loginRouter = require("express").Router();
//Llamada al modelo user
const { User } = require("../models/User");
//json web tokem = npm install jsonwebtoken
const jwt = require('jsonwebtoken')

//creacion del router
loginRouter.post("/", async (request, response) => {
  //Lo que pido es el body
  const { body } = request;
  //el body sera el username y el password
  const { username, password } = body;
  //mi user sera un user que corresponde con el username
  const user = await User.findOne({ username });
  //Verifico si el password es correcto. 
  //Haciendo la comparacion con bcrypt del password puesto y el passHash
  const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);
  console.log(`passwordCorrect ${passwordCorrect}`)
  //Si el usuario o el password no existen, envio un error
  //Se hace los dos, asi si hay un ataque no doy info de que es el user o el pswd que no existen
  if (!user || !passwordCorrect) {
    response.status(401).json({
      error: "invalid user or password",
    });
  }

  //pido los datos del user para el token
  const userForToken = {
    id: user._id,
    username: user.username,
  }
  //creo el token con los datos del user de userForToken y lo firmo con un Secretword en .env
  const token = jwt.sign(
    userForToken, 
    process.env.SECRET
    )

  //envio la respuesta en caso de login
  response.send({
    username: user.username,
    lastname: user.lastname,
    token
  });
});

module.exports = loginRouter;