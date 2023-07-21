import * as express from 'express'
import * as taskService from '../services/taskService'

export const getTaskById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params

    try {
        const task = await taskService.getCompressingTaskById(id)
        if(!task) {
            return res.status(404).send({ error: 'Task not found.' })
        }
        return res.status(200).send(task)
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Failed to get compressing task.' })
    }
}

export const getTaskStatusById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params

    try {
        const taskStatus = await taskService.getCompressingTaskStatusById(id)
        if(!taskStatus) {
            return res.status(404).send({ error: 'Task not found.' })
        }
        return res.status(200).send({ taskId: id, status: taskStatus })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ error: 'Failed to get compressing task status.' })
    }
}