import Dropzone, {FileWithPath} from 'react-dropzone'
import {useUploadImage} from '../hooks/useImages.ts'
import './index.css'
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
                    <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        <h3 className="dropzone-text">Drag'n'drop an image here or click to select an image 📷</h3>
                    </div>
                )}
            </Dropzone>
        </div>
    )
}

export default ImageUploadForm
