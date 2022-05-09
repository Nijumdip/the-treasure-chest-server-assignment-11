const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyyh9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client
      .db("the-treasure-chest")
      .collection("inventory");

    //   get method start
    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = inventoryCollection.find(query);
      const inventories = await cursor.toArray();
      console.log(inventories);
      res.send(inventories);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const cursor = await inventoryCollection.findOne(query);
      // console.log(cursor);
      res.send(cursor);
    });
    //   get method end

    // post method start
    app.post("/addItem", async (req, res) => {
      const item = req.body;
      const result = await inventoryCollection.insertOne(item);
      res.send(result);
      // console.log(result);
    });
    // post method end

    // delete method start
    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await inventoryCollection.deleteOne(query);
      res.send(result);
    });
    // delete method end

    // put method start
    app.put("/editItem/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const options = { upsert: true };
      const query = { _id: ObjectId(id) };
      const updateItem = {
        $set: {
          img: data.img,
          name: data.name,
          description: data.description,
          price: data.price,
          supplier: data.supplier,
          quantity: data.quantity,
        }
      };
      const result = await inventoryCollection.updateOne(query, updateItem, options);
      console.log(result);
      res.send(result);
    });


    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      const options = { upsert: true };
      const query = { _id: ObjectId(id) };
      const updateItem = {
        $set: {
          quantity: data.quantity
        }
      };
      const result = await inventoryCollection.updateOne(query, updateItem, options);
      console.log(result);
      res.send(result);
    });


    // put method end
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
