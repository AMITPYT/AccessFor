require('./connection');
const express = require('express');
var cors = require('cors')
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();


const app = express()
const port = 5000


app.use(cors())
app.use(express.json())
app.use(adminRoutes);
app.use(userRoutes);



app.listen(port, () => {
  console.log(` listening at http://localhost:${port}`)
})