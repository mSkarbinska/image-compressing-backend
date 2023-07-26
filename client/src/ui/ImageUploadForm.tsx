import Dropzone, {FileWithPath} from 'react-dropzone'
import {useUploadImage} from '../hooks/useImages.ts'

const ImageUploadForm = () => {
    const {mutate: uploadImage} = useUploadImage()
    const onDrop = (acceptedFiles: FileWithPath[]) => {
        acceptedFiles.forEach((file) => {
            uploadImage(file)
    })}

    return (
        <div>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag'n'drop an image here or click to select an image 📷</p>
                    </div>
                )}
            </Dropzone>
        </div>
    )
}

export default ImageUploadForm
