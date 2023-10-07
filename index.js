const express = require("express");
const cors = require('cors')
// const cookieParser = require('cookie-parser')
const app = express();
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// app.use(cookieParser())
app.use(function (req, res, next) {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(
    cors({
        origin: [
            "http://127.0.0.1:5173",
            "http://localhost:5173",
        ],
        methods: ["POST", "PUT", "GET", "OPTIONS", "DELETE", "PATCH"],
    }),
);
const port = process.env.PORT || 4068;
app.use("/appApis", require("./routes"));

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

