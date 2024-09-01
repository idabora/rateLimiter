const express = require("express");
const cluster = require('cluster');
const OS = require('os');
require('./connection')

const port = 2021;

if (cluster.isMaster) {
    console.log(OS.cpus().length);
    console.log(`Master process ${process.pid} is running`);
    for (let i = 0; i < OS.cpus().length; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    app.use(express.json())
    app.use('/api/v1/task',require('./routes/taskRoutes'))

    app.get('/', async (req, res) => {
        res.send("Running fine...........");
    });

    app.listen(port, () => {
        console.log(`Server running on port http://localhost:${port}`);
    })
}
cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
});