import {ImageListItem} from '@mui/material'

interface Props {
    url: string,
    id: string
}


const Image = ({url, id}: Props) => <ImageListItem key = {id}>
    <img
        src={url}
        loading="lazy"
        alt={id}
    />
</ImageListItem>


export default Image