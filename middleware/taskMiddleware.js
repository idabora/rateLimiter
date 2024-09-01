// taskMiddleware.js
const rateLimit = require("express-rate-limit");
const Queue = require('bull');
const winston = require("winston");
const fs = require("fs");


const taskQueue = new Queue('task-queue', 'redis://127.0.0.1:6379');
const delayedTaskQueue = new Queue('delayed-task', 'redis://127.0.0.1:6379');


// Configure Winston logger to log tasks to a file
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: "task_logs.log" })],
});

// Task processing function
async function task(user_id) {
    const logMessage = `${user_id}-task completed at-${Date.now()}`;
    console.log(logMessage);

    // Log the task completion to the file
    logger.info({ user_id, timestamp: Date.now() });

    // Append to the log file
    fs.appendFileSync("task_logs.log", `${logMessage}\n`);
}

// Rate limiter middleware to enforce task limits
const rateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20, // max 20 requests per minute per user
    keyGenerator: (req) => req.body.user_id, // Rate limit based on user_id
    handler: async (req, res) => {
        const { user_id } = req.body;
        if (user_id) {
            await delayedTaskQueue.add({ user_id,statusCode:429} ,{ delay: 1000 }); // Add to delayed queue with 1 second delay
            res.status(429).send("Rate limit exceeded. Your task has been queued.");
        } else {
            res.status(400).send("User ID is required.");
        }
    },
});


module.exports = {
    task,
    rateLimiter,
    taskQueue,
    delayedTaskQueue,
};
