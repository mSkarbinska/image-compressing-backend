import { ImageListItem} from '@mui/material'
import React from 'react'
import {ImageData} from '../model/imageData.ts'
import ImageDialog from './ImageDialog.tsx'

interface Props {
    imageData: ImageData,
}

const Image = ({ imageData }: Props) => {
    const [hasError, setHasError] = React.useState(false)
    const [isModalOpen, setIsModalOpen] = React.useState(false)

    const handleImageError = () => {
        setHasError(true)
    }

    const handleImageClick = () => {
        setIsModalOpen(true)
    }


    return (
        <>
            {!hasError && (
                <ImageListItem key={imageData.id} onClick={handleImageClick}>
                    <img src={imageData.imageUrl} loading="lazy" onError={handleImageError}/>
                </ImageListItem>
            )}
            <ImageDialog imageData={imageData} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}/>
        </>
    )
}

export default Image
