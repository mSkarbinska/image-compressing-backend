import Dropzone, {FileWithPath} from 'react-dropzone'

const ImageUploadForm = () => {
    const onDrop = (acceptedFiles: FileWithPath[]) => {
        console.log(acceptedFiles)
        // Handle the image upload logic here
    };

    return (
        <div>
            <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag and drop an image here or click to select an image.</p>
                    </div>
                )}
            </Dropzone>
        </div>
    );
};

export default ImageUploadForm
