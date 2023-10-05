const { Schema, model } = require("mongoose");
//Para hacer una clase unica
const uniqueValidator = require('mongoose-unique-validator')

//Son como los Schemas sql
const userSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  lastname: String,
  passwordHash: String,
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note",
    },
  ],
});

//lo que devuelve el schema. Elimino lo que no quiero
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

//instalo el uniqueValidator en mi Schema
userSchema.plugin(uniqueValidator)

//Mis user seran nuevos modelos de nombre user con este schema
const User = new model("User", userSchema);

module.exports = { User };
