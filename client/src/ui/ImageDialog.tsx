import {Dialog, Divider, IconButton, Link, List, ListItem, ListItemText} from '@mui/material'
import { ImageData } from '../model/imageData'
import CloseIcon from '@mui/icons-material/Close'

interface Props {
    imageData: ImageData;
    setIsModalOpen: (isModalOpen: boolean) => void;
    isModalOpen: boolean;
}

const ImageDialog = ({ imageData, setIsModalOpen, isModalOpen }: Props) => {
    const handleCloseModal = () => {
        setIsModalOpen(false)
    }

    return (
        <Dialog open={isModalOpen} onClose={handleCloseModal} >
            <div style={{ position: 'relative', backgroundColor:'#dcc0ed', width: '500px' }}>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseModal}
                    style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}
                >
                    <CloseIcon />
                </IconButton>
                <List>
                    <ListItem>
                        <ListItemText primary="Image ID" secondary={imageData.id}/>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText primary={<Link href={imageData.imageUrl} style={{color: 'black'}}>
                            Full size image
                        </Link>}/>
                    </ListItem>
                    <Divider component="li" />
                    <ListItem>
                        <ListItemText primary={<Link href={imageData.compressedUrl} style={{color: 'black'}}>
                            Compressed image
                        </Link>}/>
                    </ListItem>
                </List>
            </div>
        </Dialog>
    )
}


export default ImageDialog
