import {useMutation, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query'
import {getImagesData, uploadImage} from '../api/images.ts'
import {ImageData} from '../model/imageData.ts'

const IMAGES_LIST_KEY = 'imagesListKey'

export const useGetImagesData = (): UseQueryResult<ImageData[]> => useQuery([IMAGES_LIST_KEY],
        async () => {
            try {
                return await getImagesData().json()
            } catch (error) {
                return Promise.reject(error)
            }
        })


export const useUploadImage = () => {
    const queryClient = useQueryClient()

    return useMutation(async (image: File) => {
        try {
            return await uploadImage(image)
        } catch (error) {
            return Promise.reject(error)
        }
    },
        {
            onSuccess: () => {
                console.log('Image uploaded successfully.')
                queryClient.invalidateQueries([IMAGES_LIST_KEY])
            },
        })
}