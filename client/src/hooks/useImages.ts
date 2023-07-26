import {useMutation, useQuery, UseQueryResult} from '@tanstack/react-query'
import {getImagesData, uploadImage} from '../api/images.ts'
import {ImageData} from '../model/imageData.ts'

export const useGetImagesData = (): UseQueryResult<ImageData[]> => useQuery(['imagesList'],
        async () => {
            try {
                return await getImagesData().json()
            } catch (error) {
                return Promise.reject(error)
            }
        })



export const useUploadImage = () => {
    return useMutation(async (image: File) => {
        try {
            return await uploadImage(image)
        } catch (error) {
            return Promise.reject(error)
        }
    })
}