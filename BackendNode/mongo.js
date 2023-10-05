//no lee .env. Hay que instalarlo
require('dotenv').config()
//se instala. Llama a la 'libreria mongoose'
const mongoose = require("mongoose");
//llamo variables de entorno del .env
const {MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV} = process.env
//condicional de que el connectionString dependiendo del node_env usara una db u otra
const connectionString = NODE_ENV === 'test' 
  ? MONGO_DB_URI_TEST
  : MONGO_DB_URI

//conexion a mongoDB
mongoose.connect(connectionString 
  /* , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModifiy: true,
    useCreateIndex: true

    porsiacaso****
} */
  )
  .then(() => {
    console.log("database connected");
  })
  .catch((error) => {
    console.error(error);
  });

  process.on('uncaughtException', (error) => {
    console.error(error)
    console.log('desconexion')
    mongoose.connection.close()
  })