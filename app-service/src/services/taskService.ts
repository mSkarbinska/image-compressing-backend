import {CompressingTask} from '../models/CompressingTask'
import {TaskResponse} from '../types/TaskResponse'
import {logger} from '../utils/logger'

export const saveCompressingTask = async (imageId: string):Promise<string> => {
    logger.info(`Saving compressing task to the database for image ID: ${imageId}`)

    try {
        const compressingTask = new CompressingTask({ imageId })
        return await compressingTask.save().then(task => {
            logger.info(`Compressing task saved to the database for image ID: ${imageId}`)
            return task._id.toString()
        })
    } catch (err) {
        logger.error(err)
        throw new Error('Failed to save compressing task to the database.')
    }
}

export const getCompressingTaskById = async (id: string): Promise<TaskResponse> => {
    logger.info(`Getting compressing task from the database for task ID: ${id}`)

    return await CompressingTask.findById(id)
        .then(task => {
            if(!task) {
                logger.error(`Compressing task not found in the database for task ID: ${id}`)
                throw new Error('Compressing task not found in the database.')
            }
            logger.info(`Compressing task found in the database for task ID: ${id}`)
            return {
                id: task?._id.toString(),
                imageId: task?.imageId?.toString() || '',
                status: task?.status
            }
        })
}

export const getCompressingTaskStatusById = async (id: string): Promise<string> => {
    logger.info(`Getting compressing task status from the database for task ID: ${id}`)

    return await CompressingTask.findById(id, { status: 1 })
        .then((task) => {
            if (task && task.status !== undefined) {
                logger.info(`Compressing task status found in the database for task ID: ${id}`)
                return task.status as string
            } else {
                throw new Error('Compressing task status not found in the database.')
            }
        })
}