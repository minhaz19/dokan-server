const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dgpqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("dokan").collection("products");
  const orderCollection = client.db("dokan").collection("orders");


  app.post('/addProduct',(req,res) =>{
        const newProduct = req.body;
        productCollection.insertOne(newProduct)
        .then(result =>{
            res.send(result.insertedCount > 0)
        })
  })
  app.get('/products',(req,res) =>{
      productCollection.find()
      .toArray((err,product) =>{
          res.send(product)
      })
  })
  app.get('/products/:id',(req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) =>{
      res.send(documents[0]);
    })
  })
  app.post('/checkout',(req,res) =>{
    const order = req.body;
        orderCollection.insertOne(order)
        .then(result => {
          res.send(result.insertedCount > 0)

      })            
  })
  app.get('/orders',(req,res) =>{
    orderCollection.find()
    .toArray((err,order) =>{
        res.send(order)
    })
})
  app.delete('/delete/:id',(req,res) =>{
    productCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result =>{
      res.send(result.deletedCount > 0)
    })
  })
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port);