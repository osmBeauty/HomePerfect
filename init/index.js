const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../Models/listing.js");

const Mongo_URL = 'mongodb://127.0.0.1:27017/homeperfects';

main().then(()=>{
    console.log("Database ki Chaiyan Cahiyan");
}).catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_URL);
}

const initDB = async ()=> {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "678a90315607a5eb301c01e9"}));
    await Listing.insertMany(initData.data);
    console.log("Data A gaya");
}

initDB();
