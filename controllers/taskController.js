const { taskQueue, delayedTaskQueue, task } = require("../middleware/taskMiddleware");

module.exports.addTaskQueue = async (req, res) => {
    const { user_id } = req.body;
    if (!user_id) {
        return res.status(400).send("User ID is required.");
    }

    try {
        // Add the task to the main processing queue
        await taskQueue.add({ user_id });
        res.send("Task added to the queue");
    } catch (error) {
        res.status(500).send("Failed to add task to the queue");
    }
};

// Process tasks from the main task queue
taskQueue.process(async (job) => {
    try {
        const { user_id } = job.data;
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay to ensure rate limit
        await task(user_id);
    } catch (error) {
        console.error("Error processing task:", error);
    }
});

// Process tasks from the delayed task queue
delayedTaskQueue.process(async (job) => {
    try {
        const { user_id ,statusCode} = job.data;
        console.log("your task has been pushed into queue")

        await new Promise((resolve) => setTimeout(resolve, 60000)); // Delay processing
        await task(user_id);
    } catch (error) {
        console.error("Error processing delayed task:", error);
    }
});

