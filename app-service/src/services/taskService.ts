import {CompressingTask, saveCompressingTaskToDb} from '../models/CompressingTask'
import {TaskResponse} from '../types/TaskResponse'

interface SaveCompressingTaskResponse {
    taskId: string,
}
export const saveCompressingTask = async (imageId: string):Promise<SaveCompressingTaskResponse> => {
    try {
        const taskId = await saveCompressingTaskToDb(imageId)
        return new Promise((resolve) => {
            resolve({
                taskId
            })
        })
    } catch (error) {
        console.log(error)
        throw new Error('Failed to save compressing task to the database.')
    }
}

export const getCompressingTaskById = async (id: string): Promise<TaskResponse> => {
    try {
        const task = await CompressingTask.findById(id)
        if (!task) {
            throw new Error('Task not found.')
        }
        return new Promise((resolve) => {
            resolve({
                id: task._id.toString(),
                imageId: task.imageId?.toString() || '',
                status: task.status,
            })
        })
    } catch (error) {
        console.log(error)
        throw new Error('Failed to get compressing task from the database.')
    }
}
