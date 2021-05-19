/* eslint-disable no-console */
const express = require("express");
const { v4: generateId } = require("uuid");
const countService = require("./countService");
const database = require("./database");

const app = express();

function requestLogger(req, res, next) {
  res.once("finish", () => {
    const log = [req.method, req.path];
    if (req.body && Object.keys(req.body).length > 0) {
      log.push(JSON.stringify(req.body));
    }
    log.push("->", res.statusCode);
    console.log(log.join(" "));
  });
  next();
}

app.use(requestLogger);
app.use(require("cors")());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const { startIndex, limit } = req.query;
  const todos = database.client.db("todos").collection("todos");
  const response = await todos
    .find({})
    .sort({ order: -1 })
    .skip(parseInt(startIndex))
    .limit(parseInt(limit))
    .toArray();
  res.status(200);
  res.json(response);
});

app.post("/", async (req, res) => {
  const { text, date } = req.body;

  if (typeof text !== "string") {
    res.status(400);
    res.json({ message: "invalid 'text' expected string" });
    return;
  }
  // prepare data
  const countsArray = await countService.getCount();
  const currentCount = countsArray[0].current_count;
  const todo = {
    id: generateId(),
    text,
    date,
    completed: false,
    order: currentCount,
  };
  // update todo db
  await database.client.db("todos").collection("todos").insertOne(todo);
  // increment count
  const newCount = { ...countsArray, ...{ current_count: currentCount + 1 } };
  await countService.updateCount(newCount);
  // send response
  res.status(201);
  res.json(todo);
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  if (typeof completed !== "boolean") {
    res.status(400);
    res.json({ message: "invalid 'completed' expected boolean" });
    return;
  }

  await database.client
    .db("todos")
    .collection("todos")
    .updateOne({ id }, { $set: { completed } });
  res.status(200);
  res.end();
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await database.client.db("todos").collection("todos").deleteOne({ id });
  res.status(203);
  res.end();
});

// bulk update
app.post("/bulkUpdate", async (req, res) => {
  let updateArray = [];
  req.body.forEach((item) => {
    const { id, order } = item;
    updateArray.push({
      updateOne: {
        filter: { id },
        update: { $set: { order: order } },
        upsert: true,
      },
    });
  });
  const updateResponse = await database.client
    .db("todos")
    .collection("todos")
    .bulkWrite(updateArray, { ordered: true, w: 1 });
  res.status(200);
  res.json({ status: "updated successfully" });
});
module.exports = app;
