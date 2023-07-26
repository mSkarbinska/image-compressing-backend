import * as express from 'express'
import * as taskController from '../controllers/taskController'

export const taskRouter = express.Router()

taskRouter.get('/:id', taskController.getTaskById)
// short polling endpoint
taskRouter.get('/:id/status', taskController.getTaskStatusById)