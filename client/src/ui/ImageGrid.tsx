import {ImageList} from '@mui/material'
import Image from './Image.tsx'
import {ImageData} from '../model/imageData.ts'

interface Props {
    images: ImageData[],
}
const ImageGrid = ({images}: Props) =>
    <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((image) => (
            <Image imageData={image}/>
        ))}
    </ImageList>


export default ImageGrid