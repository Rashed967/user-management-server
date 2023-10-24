const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;
const {DB_USER_NAME,DB_PASS } = process.env
 

// middleware 
app.use(cors())
app.use(express.json())

// DB_USER_NAME = user-management
// DB_PASS = eJWHv20FgwdUNDYf

// database connect 

const uri = `mongodb+srv://${DB_USER_NAME}:${DB_PASS}@cluster0.kt6fwyn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// crate or connect database 
const database = client.db('user-management')
const userCollection =  database.collection('users')

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // get all user 
    app.get('/users', async (req, res) => {
        const cursor = userCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })

    // crate user 
    app.post('/users', async(req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user)
        res.send(result)
    })


    // delete a user 
    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
        
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// root route 
app.get('/', (req, res) => {
    res.send("server is running")
})

// app listen 
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})
