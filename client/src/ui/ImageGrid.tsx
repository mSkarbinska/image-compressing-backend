import {ImageList} from '@mui/material'
import Image from './Image.tsx'
import {ImageData} from '../model/imageData.ts'
import {Category} from '../model/Category.ts'

interface Props {
    images: ImageData[],
    category: Category
}
const ImageGrid = ({images, category}: Props) =>
    <ImageList variant="masonry" cols={3} gap={8}>
        {images.map((image) => (
            <Image url={category === Category.FullSize ? image?.imageUrl : image?.compressedUrl} id={image?.id}/>
        ))}
    </ImageList>


export default ImageGrid