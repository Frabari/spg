import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Typography,
} from '@mui/material';
import {useProducts} from '../hooks/useProducts';
import AddIcon from '@mui/icons-material/Add';
import {useState} from 'react';
import ProductInfo from '../pages/ProductInfo';
import {Product} from '../api/basil-api';

function ProductCard(props: any) {
    const [open, setOpen] = useState(false);

    const handleInfo = () => {
        if (!props.onSelect) {
            setOpen(true)
        }
    }

    const handleSelect = () => {
        if (props.onSelect) {
            props.onSelect(props.product)
        }
    }

    return (
        <Grid item lg={3} md={4} sm={6} xs={12}>
            <ProductInfo open={open} setOpen={setOpen} {...props} />
            <Card sx={{height: '400'}}>
                <CardMedia
                    component="img"
                    height="200"
                    width="200"
                    image={props.image}
                    onClick={handleInfo}
                />
                <CardContent onClick={handleInfo}>
                    <Typography gutterBottom variant="h5" component="div" align="center">
                        {props.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" align="center">
                        {props.product.available} kg available
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        € {props.price}/kg
                    </Typography>
                </CardContent>
                <CardActions>
                    <Box marginLeft="auto" padding="0.5rem">
                        <IconButton onClick={handleSelect}>
                            <AddIcon/>
                        </IconButton>
                    </Box>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default function ProductsGrid(props: {
    onSelect: (product: Product) => void;
}) {
    const {products} = useProducts();

    return (
        <Grid
            container
            direction="row"
            spacing="2rem"
            padding="1rem"
            alignItems="center"
            justifyItems="center"
            width="auto"
        >
            {products?.map(p => (p.available > 0 ?
                    <ProductCard
                        key={p.id}
                        name={p.name.split(' ')[2]}
                        image={p.image}
                        price={p.price}
                        description={p.description}
                        product={p}
                        onSelect={props.onSelect}
                    /> : <></>
            ))}
        </Grid>
    )
}
