import NavigationBox from './Navigation';
import {Typography, Button, IconButton, Modal, Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import React, {useState} from 'react';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

export default function ProductInfo(props: any) {
    const [counter, setCounter] = useState(0);
    const handleClose = () => {
        props.setOpen(false)
        setCounter(0)
    };


    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Modal open={props.open} onClose={handleClose}>
            <Box sx={style}>
                <Grid
                    container
                    direction="column"
                    spacing="2rem"
                    padding="30px"
                    alignItems="center"
                    justifyItems="center"
                >
                    <Grid item xs={12}>
                        <Img width="800" src={props.image}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid
                            container
                            direction="column"
                            spacing={2}
                            alignItems="center"
                            justifyItems="center"
                        >
                            <Grid item xs>
                                <Typography gutterBottom variant="h4" component="div">
                                    {props.name}
                                </Typography>
                                <Typography align="center" variant="body2" color="info">
                                    {props.description}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    align="left"
                                    variant="subtitle1"
                                    component="div"
                                    display="inline"
                                >
                                    {props.product.available} available
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography
                                    align="left"
                                    variant="subtitle1"
                                    component="div"
                                    display="inline"
                                >
                                    € {props.price}
                                </Typography>
                                <Typography
                                    align="left"
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    /kg
                                </Typography>
                            </Grid>
                            <Grid item>
                                <IconButton disabled={counter == 0} onClick={() => setCounter(counter - 1)}>
                                    <RemoveCircleOutlineIcon/>
                                </IconButton>
                                <Typography variant="body2" display="inline">
                                    {counter}
                                </Typography>
                                <IconButton disabled={counter === props.product.available}
                                            onClick={() => setCounter(counter + 1)}>
                                    <AddCircleOutlineIcon/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Button>Add to cart</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
}
