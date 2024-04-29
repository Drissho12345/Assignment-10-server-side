

const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


require("dotenv").config();
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.zbgw6hh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    
    const usersCollection = client.db("usersDB").collection("users");

  

    app.get('/spots',async(req,res)=>{
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // update card
    app.get('/spots/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await usersCollection.findOne(query);
      res.send(result)
    })

    app.get('/singleCard/:id',async(req,res)=>{
      const result = await usersCollection.findOne({_id:new ObjectId(req.params.id)});
      res.send(result)
    })
    app.get('/allSpots/:id',async(req,res)=>{
      const result = await usersCollection.findOne({_id:new ObjectId(req.params.id)});
      res.send(result)
    })

    app.get("/mySpots/:email", async (req, res) => {
      const result = await usersCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    })
    

    app.post('/spots',async(req,res)=>{
      const user = req.body;
      console.log('new user',user);
      const result = await usersCollection.insertOne(user);
      res.send(result)
    })

    // update
    app.put('/spots/:id',async(req,res)=>{
      const id = req.params.id;
      const filter = {_id:new ObjectId(id)}
      const options = {upsert: true};
      const updateSpots =req.body;
      const spots = {
        $set: {
          text:updateSpots.text,
          name:updateSpots.name,
          url:updateSpots.url,
          price:updateSpots.price,
          TravelTime:updateSpots.TravelTime,
          seasonality:updateSpots.seasonality,
          Total:updateSpots.Total,
          Location:updateSpots.Location,
          description:updateSpots.description,
        }
      }
      const result =await usersCollection.updateOne(filter,spots);
      res.send(result)
    })

    app.delete('/myCardDelete/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await usersCollection.deleteOne(query);
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





app.get('/', (req,res)=>{
    res.send('simple assignment project')
});
app.listen(port,()=>{
    console.log(`simple crud is running on port: ${port}`);
})