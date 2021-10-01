const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxda5.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());

const port = 4200;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("redOnion").collection("allOrder");
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    // app.delete('/delete/:id', (req, res) => {
    //     console.log(req.params.id);
    //     studentCollection.deleteOne({ _id: ObjectId(req.params.id) })
    //         .then((result) => {
    //             res.send(result.deletedCount > 0);
    //             console.log(res);
    //         })
    // })

    app.get('/allOrder', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // app.get('/students/:department/:roll', (req, res) => {
    //     studentCollection.find({ roll: req.params.roll, department: req.params.department })
    //         .toArray((err, documents) => {
    //             res.send(documents[0]);
    //         })
    // })

    // app.post('/studentsByRoll', (req, res) => {
    //     const roll = req.body;
    //     studentCollection.find({ roll: roll.roll })
    //         .toArray((err, documents) => {
    //             res.send(documents);
    //         })
    // })

    app.patch('/updateOrder/:id', (req, res) => {
        orderCollection.updateOne({ _id: ObjectId(req.params.id) },
            {
                $set: {
                    finalData: req.body
                },
            })
            .then(result => {
                res.send(result.matchedCount > 0);
            })
    })


});


app.listen(process.env.PORT || port)