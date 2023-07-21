import {CompressingTask, saveCompressingTaskToDb} from '../models/CompressingTask'
import {TaskResponse} from '../types/TaskResponse'

export const saveCompressingTask = async (imageId: string):Promise<string> => {
    return await saveCompressingTaskToDb(imageId)
        .catch((error) => {
            console.log(error)
            throw new Error('Failed to save compressing task to the database.')
        })
}

export const getCompressingTaskById = async (id: string): Promise<TaskResponse> => {
    return await CompressingTask.findById(id)
        .then(task => {
            return {
                id: task._id.toString(),
                imageId: task.imageId?.toString() || '',
                status: task.status
            }
        })
        .catch((error) => {
            console.log(error)
            throw new Error('Failed to get compressing task from the database.')
        })
}


export const getCompressingTaskStatusById = async (id: string): Promise<string> => {
    return await CompressingTask.findById(id, {status: 1})
        .then(task => task.status)
        .catch((error) => {
        console.log(error)
        throw new Error('Failed to get compressing task status from the database.')
    })
}