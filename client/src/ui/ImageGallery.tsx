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
                <h3>No images 😢 Upload some above! ⬆️</h3>}
        </div>
    )
}

export default ImageGallery
