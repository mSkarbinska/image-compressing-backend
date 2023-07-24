import * as express from 'express'
import * as taskService from '../services/taskService'
import {logger} from '../utils/logger'

export const getTaskById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params

    logger.info(`Compressing task GET request received for task ID: ${id}`)

    try {
        const task = await taskService.getCompressingTaskById(id)
        if(!task) {
            logger.warn(`Compressing task not found for task ID: ${id}`)
            return res.status(404).send({ error: 'Task not found.' })
        }
        logger.info(`Compressing task GET request successful for task ID: ${id}`)
        return res.status(200).send(task)
    }
    catch (error) {
        logger.error(`Compressing task GET request failed for task ID: ${id}`, error)
        return res.status(500).send({ error: 'Failed to get compressing task.' })
    }
}

export const getTaskStatusById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params

    logger.info(`Compressing task status GET request received for task ID: ${id}`)

    try {
        const taskStatus = await taskService.getCompressingTaskStatusById(id)
        if(!taskStatus) {
            logger.warn(`Compressing task status not found for task ID: ${id}`)
            return res.status(404).send({ error: 'Task not found.' })
        }
        logger.info(`Compressing task status GET request successful for task ID: ${id}`)
        return res.status(200).send({ taskId: id, status: taskStatus })
    }
    catch (error) {
        logger.error(`Compressing task status GET request failed for task ID: ${id}`, error)
        return res.status(500).send({ error: 'Failed to get compressing task status.' })
    }
}