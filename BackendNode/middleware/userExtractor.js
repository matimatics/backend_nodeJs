//Middleware para autorizacion de usuario
//Json web token
const jwt = require('jsonwebtoken')


module.exports = (request, response, next) => {
  //la authorization viene de la request rest. 
  const authorization = request.get("authorization");
  let token = "";

  console.log(`authorization ${authorization}, token ${token}`);

  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
    console.log(`token ${token}`)
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);
  console.log(`decodedToken ${decodedToken}`)

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: "token missing or invalid" });
  }

  const { id: userId } = decodedToken
  request.userId = userId
  console.log(`userId ${userId}`)

  next()
};
