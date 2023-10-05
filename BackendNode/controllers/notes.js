const notesRouter = require("express").Router();
const Note = require("../models/Note");
const userExtractor = require("../middleware/userExtractor");
const { User } = require("../models/User");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("userId", {
    username: 1,
    lastname: 1,
  });
  response.json(notes);
});

notesRouter.get("/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
      console.log(error);
    });
  //response.json(note)
});

notesRouter.post("/", userExtractor, async (request, response, next) => {
    const { content, important = false } = request.body;
  
    const { userId } = request;
    const user = await User.findById(userId);
  
    if (!content) {
      return response.status(400).json({
        error: "note.content is missing",
      });
    }
    const newNote = new Note({
      content,
      important,
      date: new Date(),
      userId: user._id,
    });
    /* sin async await
      newNote
        .save()
        .then((savedNote) => {
          response.status(201).json(savedNote);
        })
        .catch((error) => next(error)); */
  
    /* con async await hay que verificar el agregar el try/catch */
    try {
      const savedNote = await newNote.save();
      user.notes = user.notes.concat(savedNote._id);
      await user.save();
      response.json(savedNote);
    } catch (error) {
      next(error);
    }
  
    /* Esto era sin DB para agregar las newNotes en el array
       notes = [...notes, newNote]; */
  });

/*Delete con async await */
notesRouter.delete(":id", userExtractor, async (request, response, next) => {
  const { id } = request.params;
  try {
    const removedNote = await Note.findByIdAndRemove(id);
    if (!removedNote) {
      return next();
    }
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

/*Delete sin async await*/
/* app.delete("/api/notes/:id", (request, response, next) => {
  const { id } = request.params;
  Note.findByIdAndRemove(id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});  */

notesRouter.put(":id", userExtractor, (request, response) => {
  const { id } = request.params;
  console.log(id);
  const note = request.body;
  console.log(note);
  const newNoteInfo = {
      content: note.content,
      important: note.important,
    };
    Note.findByIdAndUpdate(id, newNoteInfo, { new: true }).then((result) => {
        response.json(result);
    });
});



module.exports = notesRouter;
