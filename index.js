const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const fileUpload = require('express-fileupload');
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.czzkl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
//mongodb+srv://Abir:<password>@cluster0.czzkl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('food'));
app.use(fileUpload());

const port = 4200;

app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const orderCollection = client.db("redOnion").collection("allOrder");
    const foodCollection = client.db("redOnion").collection("allFood");
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        console.log(order);
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.post('/addFood', (req, res) => {
        const file = req.files.file;
        const image = req.files.file.name;
        const title = req.body.title;
        const price = req.body.price;
        const category = req.body.category;
        const description = req.body.description;
        const shortDescription = req.body.shortDescription;
        // const newImg = file.data;
        // const encImg = newImg.toString('base64');

        // var image = {
        //     contentType: file.mimetype,
        //     size: file.size,
        //     img: Buffer.from(encImg, 'base64')
        // };

        file.mv(`${__dirname}/food/${file.name}`,err=>{
            if(err){
                return res.status(500).send({msg:'Failed to upload Image'});
            }
        })

        foodCollection.insertOne({ title, price, category, description, shortDescription, image })
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })
    app.get('/foods', (req, res) => {
        foodCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
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
    
    app.patch('/updateAmount/:id', (req, res) => {
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