//Cosas de la libreria mongoose
const {Schema, model} = require('mongoose')   
   
   //schema que le dice a mongoose como debe configurarse
    const noteSchema = new Schema({
        content: String,
        date: Date,
        important: Boolean,
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    })

    //Setear el json para que no aparezca el __v , _id
    noteSchema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id
            delete returnedObject._id
            delete returnedObject.__v
        }
    })

    //ligando el modelo note al schema 
    const Note = new model('Note', noteSchema)
   
    module.exports = Note

    /*  //Test de creacion. ejemplo de nota
    const note = new Note({
        content: 'test mongodb',
        date: new Date(),
        important: true
    })
    
    note.save()
    .then(result => {
        console.log(result)
        //buena practica cerrar la conexion
        mongoose.connection.close()
    })
    .catch(error => {
        console.error(error)
    }) 
    
    */

/*  Note.find({}).then(result => {
           console.log(result)
           mongoose.connection.close()
       }) */
