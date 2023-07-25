import { ObjectId } from 'mongodb'
import { saveCompressingTask, getCompressingTaskById, getCompressingTaskStatusById } from '../taskService'
import { CompressingTask } from '../../models/CompressingTask'
import { connect} from '../../../setupTests'

beforeAll(async () => await connect())

describe('saveCompressingTask', () => {
    it('should save a compressing task to the database and return its ID', async () => {
        const imageId = '64b6617748277b450c613b15'
        const task = {
            _id: new ObjectId('605caa0748277b450c613b15'),
            imageId,
        }

        CompressingTask.prototype.save = jest.fn().mockResolvedValue(task)

        const taskId = await saveCompressingTask(imageId)

        expect(taskId).toEqual('605caa0748277b450c613b15')
        expect(CompressingTask.prototype.save).toHaveBeenCalledTimes(1)
        expect(CompressingTask.prototype.save).toHaveBeenCalledWith()
    })

    it('should throw an error if saving the compressing task fails', async () => {
        const imageId = '64b6617748277b450c613b15'

        CompressingTask.prototype.save = jest.fn().mockRejectedValue(new Error('Failed to save to the database.'))

        await expect(saveCompressingTask(imageId)).rejects.toThrowError('Failed to save compressing task to the database.')
        expect(CompressingTask.prototype.save).toHaveBeenCalledTimes(1)
        expect(CompressingTask.prototype.save).toHaveBeenCalledWith()
    })
})

describe('getCompressingTaskById', () => {
    it('should get a compressing task from the database by ID', async () => {
        const taskId = '605caa0748277b450c613b15'
        const imageId = '64b6617748277b450c613b15'
        const status = 'completed'
        const task = {
            _id: new ObjectId(taskId),
            imageId: new ObjectId(imageId),
            status,
        }

        CompressingTask.findById = jest.fn().mockResolvedValue(task)

        const result = await getCompressingTaskById(taskId)

        expect(result).toEqual({
            id: taskId,
            imageId,
            status,
        })
        expect(CompressingTask.findById).toHaveBeenCalledTimes(1)
        expect(CompressingTask.findById).toHaveBeenCalledWith(taskId)
    })

    it('should throw an error if the compressing task is not found in the database', async () => {
        const taskId = '605caa0748277b450c613b15'

        CompressingTask.findById = jest.fn().mockResolvedValue(null)

        await expect(getCompressingTaskById(taskId)).rejects.toThrowError('Compressing task not found in the database.')
        expect(CompressingTask.findById).toHaveBeenCalledTimes(1)
        expect(CompressingTask.findById).toHaveBeenCalledWith(taskId)
    })
})

describe('getCompressingTaskStatusById', () => {
    it('should get the status of a compressing task from the database by ID', async () => {
        const taskId = '605caa0748277b450c613b15'
        const status = 'completed'
        const task = {
            _id: new ObjectId(taskId),
            status,
        }

        CompressingTask.findById = jest.fn().mockResolvedValue(task)

        const result = await getCompressingTaskStatusById(taskId)

        expect(result).toEqual(status)
        expect(CompressingTask.findById).toHaveBeenCalledTimes(1)
        expect(CompressingTask.findById).toHaveBeenCalledWith(taskId, { status: 1 })
    })

    it('should throw an error if the compressing task status is not found in the database', async () => {
        const taskId = '605caa0748277b450c613b15'

        CompressingTask.findById = jest.fn().mockResolvedValue(null)

        await expect(getCompressingTaskStatusById(taskId)).rejects.toThrowError('Compressing task status not found in the database.')
        expect(CompressingTask.findById).toHaveBeenCalledTimes(1)
        expect(CompressingTask.findById).toHaveBeenCalledWith(taskId, { status: 1 })
    })
})
