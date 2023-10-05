// Aqui agrupo los errores posibles y sus respuestas
const ERROR_HANDLERS = {
  CastError: res => res.status(400).send({error: 'id wrong format'}),
  ValidateError: (res, error) => res.status(409).send({error: error.message}),
  JsonWebTokenError: (res) => res.status(401).json({error: 'token missing or invalid'}),
  TokenExpireError: res => res.status(401).json({error: 'token expired'}),
  defaultError: res => res.status(500).end()
}

module.exports = (error, request, response, next) => {
    console.error(error.name)
    console.log(error.name)
    const handler = ERROR_HANDLERS[error.name] || ERROR_HANDLERS.defaultError
    handler(response, error)
}

/*      

  if(error.name === 'CastError'){
      response.status(400).end()
    } else if (error.name === 'ValidationError'){
      response.status(409).send({
        error: error.message
      })
    } else if (error.name === 'JsonWebTokenError') {
      response.status(401).json({error: 'token missing or invalid'})
    } else {
      response.status(500).end()
    }
  } */