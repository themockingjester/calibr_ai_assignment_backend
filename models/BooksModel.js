const { mongoConn, mongoose } = require("../utils/mongoDBConnection")

let BooksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

        description: 'must be a string and is required'
    },
    image:{
        type:String,
    },
    author: {
        type: String,
        required: true,
        description: 'must be a string and is required'
    },
    publicationYear : {
        type: Number,
        required: true,
        description: 'must be a number and is required'
    },
    isbn: {
        type: String,
        required: true,
        description: 'must be an number and is required'
    },
    date_created:{
        type:Number,
        required: true,
    },
    description : {
        type: String, //1: active, -1: deleted
        required: true,
        description: 'must be an number and is required',
    }
})

module.exports = {
    BooksModel: mongoConn.model('books', BooksSchema)
}