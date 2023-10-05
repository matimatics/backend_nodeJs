const { app } = require("../index");
const supertest = require("supertest");
const api = supertest(app);
const { User } = require("../models/User");

const initialNotes = [
  {
    content: "note 1",
    date: new Date(),
    important: true,
  },
  {
    content: "note 2",
    date: new Date(),
    important: false,
  },
  {
    content: "note 3",
    date: new Date(),
    important: false,
  },
];

const getAllContentFromNotes = async () => {
  const response = await api.get("/api/notes");
  return {
    contents: response.body.map((note) => note.content),
    response,
  };
};

const getUsers = async () => {
  const usersDB = await User.find({});
  return usersDB.map((user) => user.toJSON());
};

module.exports = { getAllContentFromNotes, api, supertest, initialNotes, getUsers };