import {ImageListItem} from '@mui/material'
import React from 'react'

interface Props {
    url: string,
    id: string
}


const Image = ({url, id}: Props) => {
    const [hasError, setHasError] = React.useState(false)

    const handleImageError = () => {
        setHasError(true)
    }
    return !hasError ?
        <ImageListItem key={id}>
        <img src={url}
            loading="lazy"
            onError={handleImageError}
        />
    </ImageListItem>: null
}

export default Image