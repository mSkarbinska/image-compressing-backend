import {FC} from 'react'
import ImageGrid from './ImageGrid.tsx'
import {useGetImagesData} from '../hooks/useImages.ts'


const ImageGallery: FC = () => {
    const {data: imagesData} = useGetImagesData()

    return (
        <div>
            <div>
            </div>
            {imagesData && imagesData?.length > 0 ? <ImageGrid images={imagesData}/> :
                <div>No images 😢 Upload some above! ⬆️</div>}
        </div>
    )
}

export default ImageGallery
