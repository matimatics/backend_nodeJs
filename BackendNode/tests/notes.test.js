/* eslint-env node, jest */
const mongoose = require("mongoose");
const { server } = require("../index");
const Note = require("../models/Note");
const { api, initialNotes, getAllContentFromNotes } = require("./helpers");

//antes de los test, elimino las notas, y creo nuevas para
//tener un standard
beforeEach(async () => {
  await Note.deleteMany({});
  console.log("beforeEach");

  /* Secuencial, en orden */
  for (const note of initialNotes) {
    const noteoBject = new Note(note);
    await noteoBject.save();
    console.log("saved note");
  }

  /* Esto no funciona porque el forEach no esspera 
  
  initialNotes.forEach(async note => {
    const noteObject = new Note(note);
    await noteObject.save();
    console.log("saved note");
  }); */

  /* Paralelo, no hay control de cual se guarda primero

 const notesOBjects = initialNotes.map(note => new Note(note))
  const promises = notesOBjects.map(note => note.save())
  await Promise.all(promises) */
});

describe("Get all notes", () => {
  test("notes are returned as json", async () => {
    console.log("first test");
    await api
      .get("/api/notes")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two notes", async () => {
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(initialNotes.length);
    console.log(`hay ${initialNotes.length} notes`);
  });

  test("there first note is 1", async () => {
    const { contents } = await getAllContentFromNotes();
    expect(contents).toContain("note 1");
    console.log(`${contents} contains note 1`);
  });
});

describe("Post a note", () => {
  test("a valid note can be added", async () => {
    const newNote = {
      content: "test note",
      important: true,
    };
    await api
      .post("/api/notes")
      .send(newNote)
      .expect(200)
      .expect("Content-Type", /application\/json/);
    console.log(`${newNote} succesfully created`);
    const { response, contents } = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(newNote.content);
  });

  test("a note without content cannot be added", async () => {
    const newNote = {
      important: true,
    };
    await api.post("/api/notes").send(newNote).expect(400);
    const response = await api.get("/api/notes");
    expect(response.body).toHaveLength(initialNotes.length);
  });
});

describe("Delete a note", () => {
  test("a note can be deleted", async () => {
    const { response: firstResponse } = await getAllContentFromNotes();
    const { body: notes } = firstResponse;
    const noteToDelete = notes[0];
    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);
    const { contents, response: secondResponse } =
      await getAllContentFromNotes();
    console.log(secondResponse.body.length);
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test("a note can that doesnt exist can not be deleted", async () => {
    await api.delete(`/api/notes/1234`).expect(400);
    const { response } = await getAllContentFromNotes();
    console.log(response.body.length);
    expect(response.body).toHaveLength(initialNotes.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
  server.close();
});
