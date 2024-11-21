const express = require('express')
const app = express()
const port = 8081
const indexRouter = require('./routes/app');
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use("/", indexRouter);

app.use(express.static("./public"))
// app.get('/', (req, res) => res.send(''))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))