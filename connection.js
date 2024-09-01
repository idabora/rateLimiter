const mongoose=require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/replicadb')
    .then(()=>{
        console.log("DB Connected....");
    })
    .catch((err)=>{
        console.error(err);
        console.log("Something went wrong......")
    })