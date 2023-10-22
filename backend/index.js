const express = require('express');
const app = express();
const cors = require('cors');

let appPort = process.env.PRESENZE_PORT;//|| 3000;
global.debug = false;

app.use(express.json());
app.use(cors());

const raspRouter = require('./routes/raspRoutes.js');

if (process.argv[2] === '-d') {
    debug = true;
}
app.use('/api/1.0/',raspRouter);

app.listen(appPort,()=>{
    if (debug){
        console.log('Server in attesa sulla porta '+appPort);
    }
})
