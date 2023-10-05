const logger = (request, response, next) => {
    console.log(request.method)
    console.log(request.path)
    console.log(request.body)
    next()
}

/* Explicacion de middlewares
el use recibe una request, generara una respuesta y seguira.
si no le pongo el next() para que continue, 
se queda aqui esperando. 
*/
module.exports = logger