const express=require('express');
const app=express();
const router = express.Router();
const {addTaskQueue}=require('../controllers/taskController');
const {rateLimiter}=require("../middleware/taskMiddleware")
app.use(express.json());

router.post('/',rateLimiter,addTaskQueue);

module.exports=router;