import {client} from './client.ts'

export const getImagesData = () => client.get('images')

export const uploadImage = (image: File) => {
    const formData = new FormData()
    formData.append('image', image)

    return client.post('images/upload',
        {
            body: formData
        })
}