const { BooksModel } = require("../models/BooksModel")
const config = require("../config/default.json")
const { generateResponse } = require("../utils/commonUtils")
const { ElasticSearchClient } = require("../utils/elasticSearchConnection")

const addNewBook = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            let timeNow = new Date().getTime()
            const { title, author, isbn, description, publicationYear, image } = req.body
            // checking wheather similar book also exists in db with same name
            BooksModel.findOne({
                title: title
            }, {}, { lean: true }).then(async (response) => {
                if (response) {
                    // book found
                    return resolve(res.status(405).send(generateResponse(true, `Book already exists`, { book: response }, 405)))
                } else {
                    // not found
                    let insertedDoc = await BooksModel.create({
                        title: title,
                        isbn: isbn,
                        image: image,
                        description: description,
                        author: author,
                        date_created: timeNow,
                        publicationYear: publicationYear,
                    })
                    insertedDoc.save().then(async (response) => {
                        // adding to elastic search also
                        const elasticSearchresponse = await ElasticSearchClient.create({
                            index: config.ElasticSearch.index,

                            document: {
                                title: title,
                                isbn: isbn,
                                image: image,
                                description: description,
                                author: author,
                                date_created: timeNow,

                                publicationYear: publicationYear,

                            },
                            id: response._id.toString()
                        })
                        console.log(elasticSearchresponse)
                        return resolve(res.status(200).send(generateResponse(true, `New book added successfully`, { book: response }, 200)))
                    }).catch(error => {
                        console.log(error)
                        return resolve(res.status(500).send(generateResponse(false, `Failed to add new book`, { stage: 3 }, 500)))
                    })
                }
            }).catch((error) => {
                console.log(error)
                return resolve(res.status(500).send(generateResponse(false, `Failed to add new book`, { stage: 1 }, 500)))
            })
        } catch (error) {
            console.log(error)
            return resolve(res.status(500).send(generateResponse(false, `Failed to add new book`, { stage: 2 }, 500)))

        }
    })
}

const getAllBooks = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            // checking wheather similar book also exists in db with same name
            BooksModel.find({}, {}, { lean: true }).then(async (response) => {
                if (response.length == 0) {
                    // books not found
                    return resolve(res.status(404).send(generateResponse(true, `No books found`, { books: [] }, 404)))
                } else {
                    return resolve(res.status(200).send(generateResponse(true, `Books found`, { books: response }, 200)))
                }
            }).catch((error) => {
                console.log(error)
                return resolve(res.status(500).send(generateResponse(false, `Failed to find books`, { stage: 1 }, 500)))
            })
        } catch (error) {
            console.log(error)
            return resolve(res.status(500).send(generateResponse(false, `Failed to find books`, { stage: 2 }, 500)))

        }
    })
}
const getParticularBook = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { bookId } = req.params
            // checking wheather similar book also exists in db with same name
            BooksModel.findOne({
                _id: bookId
            }, {}, { lean: true }).then(async (response) => {
                if (response) {
                    // book found
                    return resolve(res.status(200).send(generateResponse(true, `Book found`, { book: response }, 200)))
                } else {
                    // not found
                    return resolve(res.status(404).send(generateResponse(true, `Book not found`, { book: [] }, 404)))
                }
            }).catch((error) => {
                console.log(error)
                return resolve(res.status(500).send(generateResponse(false, `Failed to find book`, { stage: 1 }, 500)))
            })
        } catch (error) {
            console.log(error)
            return resolve(res.status(500).send(generateResponse(false, `Failed to find book`, { stage: 2 }, 500)))

        }
    })
}

const deleteBook = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { bookId } = req.params
            // checking wheather similar book also exists in db with same name
            BooksModel.deleteOne({
                _id: bookId
            }, {}, { lean: true }).then(async (response) => {
                if (response.deletedCount > 0) {
                    // book found and deleted

                    // now removing from elastic search also
                    let elasticSearchResponse = await ElasticSearchClient.delete({
                        index: config.ElasticSearch.index,
                        id: bookId,
                    })
                    console.log(elasticSearchResponse)
                    return resolve(res.status(200).send(generateResponse(true, `Book deleted successfully`, {}, 200)))
                } else {
                    // not found
                    return resolve(res.status(404).send(generateResponse(true, `Book not found`, { book: [] }, 404)))
                }
            }).catch((error) => {
                console.log(error)
                return resolve(res.status(500).send(generateResponse(false, `Failed to delete book`, { stage: 1 }, 500)))
            })
        } catch (error) {
            console.log(error)
            return resolve(res.status(500).send(generateResponse(false, `Failed to delete book`, { stage: 2 }, 500)))

        }
    })
}

const updateBook = (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            const { title, author, isbn, description, publicationYear, bookId, image } = req.body
            // checking wheather similar book also exists in db with same name
            BooksModel.findOne({
                _id: bookId
            }, {}, { lean: true }).then(async (response) => {
                if (response) {
                    // book found
                    BooksModel.findOneAndUpdate({
                        _id: bookId
                    },
                        {
                            $set: {
                                title: title,
                                image: image,
                                isbn: isbn,
                                author: author,
                                description: description,
                                publicationYear: publicationYear
                            }
                        }, {
                        new: true, lean: true
                    }).then(async (response) => {
                        if (response._id) {

                            // now updating in elastic search also
                            let elasticSearchResponse = await ElasticSearchClient.update({
                                index: config.ElasticSearch.index,
                                id: bookId,
                                doc: {
                                    title: title,
                                    image: image,
                                    isbn: isbn,
                                    author: author,
                                    description: description,
                                    publicationYear: publicationYear
                                }
                            })
                            console.log(elasticSearchResponse)
                            return resolve(res.status(200).send(generateResponse(true, `Book updated successfully`, { book: response }, 200)))
                        } else {
                            return resolve(res.status(500).send(generateResponse(false, `Failed to update book`, { stage: 1 }, 500)))
                        }
                    }).catch((error) => {
                        console.log(error)
                        return resolve(res.status(500).send(generateResponse(false, `Failed to update book`, { stage: 2 }, 500)))
                    })
                } else {
                    // not found
                    return resolve(res.status(404).send(generateResponse(true, `Book not found`, {}, 404)))
                }
            }).catch((error) => {
                console.log(error)
                return resolve(res.status(500).send(generateResponse(false, `Failed to update book`, { stage: 1 }, 500)))
            })
        } catch (error) {
            console.log(error)
            return resolve(res.status(500).send(generateResponse(false, `Failed to update book`, { stage: 2 }, 500)))

        }
    })
}

const searchBooks = (req, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {query} = req.query
            // Let's search!
            const books = await ElasticSearchClient.search({
                // The name of the index.
                index: config.ElasticSearch.index,
                // Defines the search definition using the Query DSL.
                query: {
                    query_string:{
                        fields:["title","author","description"],
                        query:query
                    }
                },
            });
            console.log(books)
            resolve(res.status(200).send(generateResponse(true, `Books found`, { books: books.hits.hits,totalRecords:books.hits.total.value }, 200)))
        } catch (error) {
            console.log(error)
            return resolve(res.status(500).send(generateResponse(false, `Failed to delete book`, { stage: 2 }, 500)))

        }
    })
}

module.exports = {
    addNewBook,
    getAllBooks,
    getParticularBook,
    deleteBook,
    updateBook,
    searchBooks
}
