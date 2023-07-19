import * as express from 'express'
import * as taskController from '../controllers/taskController'

export const taskRouter = express.Router()

taskRouter.get('/task/:id', taskController.getTaskById)