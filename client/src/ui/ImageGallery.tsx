import {FC, useState} from 'react'
import {Category} from '../model/Category.ts'
import ImageGrid from './ImageGrid.tsx'
import {useGetImagesData} from '../hooks/useImages.ts'


const ImageGallery: FC = () => {
    const {data: imagesData} = useGetImagesData()

    const [currentCategory, setCurrentCategory] = useState<Category>(Category.FullSize)

    const changeCategory = (category: Category) => {
        setCurrentCategory(category)
    }

    return (
        <div>
            <div>
                <button onClick={() => changeCategory(Category.FullSize)}>{Category.FullSize.toString()} 💯</button>
                <button onClick={() => changeCategory(Category.Compressed)}>{Category.Compressed.toString()} ✨</button>
            </div>
            {imagesData && imagesData?.length > 0 ? <ImageGrid images={imagesData} category={currentCategory}/> :
                <div>No images 😢 Upload some above! ⬆️</div>}
        </div>
    )
}

export default ImageGallery
