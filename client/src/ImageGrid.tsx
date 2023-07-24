import Grid from "@mui/material/Grid";
import {Image} from "../types/Image.ts";

interface Props {
    filteredImages: Image[]
}
const ImageGrid = ({filteredImages}: Props) => {
    return (
    <Grid container spacing={2}>
        {filteredImages.map(image => (
            <Grid item xs={12} sm={6} md={4} key={image.id}>
                <img
                    src={image.url}
                    alt={`Image ${image.id}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                />
            </Grid>
        ))}
    </Grid>)
}

export default ImageGrid