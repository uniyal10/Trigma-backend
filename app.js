const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
const port = process.env.PORT || 5000
//Establishing connection to the database

const { MongoClient, ObjectId } = require("mongodb");
const url = "mongodb+srv://uniyal10:dnB00Z35YyyB1t8J@cluster0.qn0gs.mongodb.net/trigma?retryWrites=true&w=majority";
const client = new MongoClient(url);
const databaseName = "trigma";

async function run(){
    try{
        await client.connect();

        //success message
        console.log("connection established successfully");

        //database
        const db = client.db("Trigma");

        //collection in mongodb database
        const collection = db.collection("vehicles");
        
   

        //get information of all vehicles

        app.get('/home',async (req,res)=>{
            const vehicles = await collection.find({}).toArray();
            res.json(vehicles);
        });
     

        //insert information into database

        app.post('/add',async(req,res)=>{
            const vehicle = await collection.insertOne(req.body);
            res.json({message:"success"})
        });
   

        //update information of an perticuler vehicle

        app.patch(`/update/:id`,async(req,res)=>{
            const id = req.params.id;
            const updateData = {
                make:req.body.make,
                model:req.body.model,
                year:req.body.year
            }
            await collection.updateOne({_id:ObjectId(id)},{$set:updateData});
            res.json({message:"success"});
        })


        //delete an object 

        app.delete("/delete/:id",async (req,res)=>{
            const id = req.params.id;
            await collection.deleteOne({_id:ObjectId(id)});
            res.json({message:"success"});
        })
   
   
    }
    catch(err){
        console.log(err);
    }
}
run();


app.listen(port,()=>{
console.log("server running at port 5000");
});
