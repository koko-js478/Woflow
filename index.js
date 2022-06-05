const express = require("express");
const app = express();
const port = 3000;

const db = [
  {
    id: "ac0e9fe4-8de0-41e6-9656-b07b40194f47",
    child_node_ids: [
      "f1f509be-e589-479e-a2d8-04cddbddc154",
      "9e145221-5a5a-446b-abdd-8092ced6a6cf",
    ],
  },
  {
    id: "59013ddb-d691-43c8-8274-7c87e1d739b4",
    child_node_ids: [],
  },
];

let childMap = {};
let countMap = {};
db.forEach(({ id, child_node_ids }) => {
  if (childMap[id] === undefined) {
    childMap[id] = child_node_ids;
  } else {
    childMap[id] = [...new Set(child_node_ids, ...child_node_ids)];
  }

  [id, ...child_node_ids].forEach((childId) => {
    if (countMap[childId] === undefined) {
      countMap[childId] = 1;
    } else {
      countMap[childId]++;
    }
  });
});

app.get("/", (req, res) => {
  res.send("Please go to the route '/nodes/'!");
});

app.get("/nodes/:ids", (req, res) => {
  const ids = req.params.ids.split(",");

  res.json({
    data: ids.map((id) => ({
      id,
      child_node_ids: childMap[id],
    })),
    total_unique_id: Object.keys(countMap).length,
    most_common_id: Object.entries(countMap).reduce((prev, [key, value]) => {
      return countMap[prev] > value ? prev : key;
    }),
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
