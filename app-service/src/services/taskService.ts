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
            if(!task) throw new Error('Compressing task not found in the database.')
            return {
                id: task?._id.toString(),
                imageId: task?.imageId?.toString() || '',
                status: task?.status
            }
        })
}


export const getCompressingTaskStatusById = async (id: string): Promise<string> => {
    return await CompressingTask.findById(id, { status: 1 })
        .then((task) => {
            if (task && task.status !== undefined) {
                return task.status as string
            } else {
                throw new Error('Compressing task status not found in the database.')
            }
        })
}