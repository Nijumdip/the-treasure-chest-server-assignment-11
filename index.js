const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iyyh9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
  try {
    await client.connect();
    const inventoryCollection = client.db("the-treasure-chest").collection("inventory");
    
    //   get method start
      app.get('/inventory', async (req, res) => {
        const query = {};
        const cursor = inventoryCollection.find(query);
        const inventories = await cursor.toArray();
        console.log(inventories);
        res.send(inventories);
      })
    //   get method end
    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);























app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})