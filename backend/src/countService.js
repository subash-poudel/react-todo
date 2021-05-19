const database = require("./database");

const TODOS_COUNT_COLLECTION_NAME = "todo_counts";

function initializeCount() {
  return database.client
    .db("todos")
    .collection(TODOS_COUNT_COLLECTION_NAME)
    .insertOne({ current_count: 0 });
}

function currentCount() {
  return database.client
    .db("todos")
    .collection(TODOS_COUNT_COLLECTION_NAME)
    .find({})
    .toArray();
}

async function getCount() {
  const countsArray = await currentCount();
  if (countsArray.length === 0) {
    await initializeCount();
    return await currentCount();
  }
  return countsArray;
}

function updateCount(newCount) {
  const { _id, current_count } = newCount;

  return database.client
    .db("todos")
    .collection(TODOS_COUNT_COLLECTION_NAME)
    .updateOne({ id: _id }, { $set: { current_count: current_count } });
}

module.exports = {
  TODOS_COUNT_COLLECTION_NAME,
  initializeCount,
  getCount,
  updateCount,
};
