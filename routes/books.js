const { addNewBook, updateBook, getAllBooks, getParticularBook, deleteBook, searchBooks } = require('../controllers/BookControllers');
const router = require('express').Router();
router.post("/createBook",[],addNewBook)
router.put("/updateBook",[],updateBook)
router.get("/getAllBooks",[],getAllBooks)
router.get("/getSpecificBook/:bookId",[],getParticularBook)
router.delete("/deleteBook/:bookId",[],deleteBook)
router.get("/searchBooks",[],searchBooks)


module.exports = router