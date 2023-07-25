import {FC, useState} from 'react'
import {Category} from "../types/Category.ts";
import {Image} from "../types/Image.ts";
import ImageGrid from "./ImageGrid.tsx";


const ImageGallery: FC = () => {
    const [images] = useState<Image[]>([
        { id: 1, url: './public/image1.jpg', category: Category.FullSize },
        { id: 2, url: './public/image1.jpg', category: Category.FullSize },
        { id: 3, url: './public/image1.jpg', category: Category.FullSize },
        { id: 4, url: './public/image1.jpg', category: Category.Compressed },
    ]);
    const [currentCategory, setCurrentCategory] = useState<Category>(Category.FullSize)

    const changeCategory = (category: Category) => {
        setCurrentCategory(category)
    };

    const filteredImages = images.filter(img => img.category === currentCategory)

    return (
        <div>
            <div>
                <button onClick={() => changeCategory(Category.FullSize)}>{Category.FullSize.toString()}</button>
                <button onClick={() => changeCategory(Category.Compressed)}>{Category.Compressed.toString()}</button>
            </div>
            <ImageGrid filteredImages={filteredImages}/>
        </div>
    );
};

export default ImageGallery
