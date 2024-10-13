const express = require('express');
const app = express();

// Send API to client!!
const cors = require('cors');
var corsOption = {
    origin: 'http://localhost:3000',
};
app.use(cors(corsOption));

// Checking server to starting.
app.get('/', (req, res) => {
    res.send("Dusit zoo server!!");
})

// Config database
const db = require('./app/models');
db.sequelize.sync({force: false}).then(() => {
    console.log(`Database is syncing...`);
});

app.use(express.json());
app.use(express.urlencoded({extended: true}))

// Routes of api in server
require('./app/routes/animal_route.js')(app);
require('./app/routes/animalType_route.js')(app);
require('./app/routes/auth_route.js')
require('./app/routes/user_rouete.js')

// Check port to running
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is runing on port ${PORT}`);
});