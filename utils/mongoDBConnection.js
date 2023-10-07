const mongoose = require('mongoose')
const config = require("../config/default.json")
const mongoConn = mongoose.createConnection(config['Database:'].SharedConnectionString,{
    useNewUrlParser:true,useUnifiedTopology:true,dbName:"calibr_demo"
})


module.exports = {
    mongoConn,
    mongoose
}