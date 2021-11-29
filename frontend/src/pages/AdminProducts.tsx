import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  InputBase,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import { Product } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useProducts } from '../hooks/useProducts';

const columns: { key: keyof Product; title: string; sortable: boolean }[] = [
  {
    key: 'image',
    title: 'Image',
    sortable: false,
  },
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'description',
    title: 'Description',
    sortable: true,
  },
  {
    key: 'price',
    title: 'Price',
    sortable: true,
  },
  {
    key: 'category',
    title: 'Category',
    sortable: true,
  },
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: '#f7f7f7',
  '&:hover': {
    backgroundColor: '#f7f7f7',
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

export const AdminProducts = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Product;
    dir: 'asc' | 'desc';
  }>({ by: null, dir: 'asc' });

  useEffect(() => {
    if (products?.length) {
      const { by, dir } = sorting;
      if (by != null) {
        const mul = dir === 'asc' ? -1 : 1;
        const sorted = [...products].sort((a, b) =>
          a[by] < b[by] ? mul : -mul,
        );
        setSortedProducts(sorted);
      } else {
        setSortedProducts(products);
      }
    }
  }, [products, sorting]);

  const toggleSorting = (byKey: keyof Product) => () => {
    const { by, dir } = sorting;
    setSorting({
      by: by === byKey && dir === 'desc' ? null : byKey,
      dir: by == null ? 'asc' : dir === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleChange = (value: any) => {
    setSortedProducts(
      products.filter(
        p =>
          p.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          p.category.name
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()) ||
          p.category.slug
            .toLocaleLowerCase()
            .includes(value.toLocaleLowerCase()),
      ),
    );
  };

  return (
    <>
      <AdminAppBar handleDrawerToggle={props.handleDrawerToggle}>
        <Typography
          variant="h6"
          noWrap
          component="h1"
          color="primary.main"
          fontWeight="bold"
          sx={{ minWidth: '6rem', fontSize: { sm: 28 }, mr: 'auto' }}
        >
          Products
        </Typography>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => handleChange(e.target.value)}
          />
        </Search>
        <Button
          disabled
          sx={{ minWidth: 0, px: { xs: 1, sm: 2 } }}
          variant="contained"
          href="/admin/products/new"
        >
          <Add />
          <Typography
            sx={{
              display: { xs: 'none', sm: 'inline' },
              textTransform: 'none',
            }}
          >
            Create product
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 2, sm: 3 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <TableContainer
          component={Paper}
          sx={{ width: '100%', height: '100%' }}
        >
          <Table aria-label="Products table" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(c => (
                  <TableCell
                    key={c.key}
                    sortDirection={sorting.by === c.key ? sorting.dir : false}
                  >
                    {c.sortable ? (
                      <TableSortLabel
                        active={sorting.by === c.key}
                        direction={sorting.by === c.key ? sorting.dir : 'asc'}
                        onClick={toggleSorting(c.key)}
                      >
                        {c.title}
                      </TableSortLabel>
                    ) : (
                      c.title
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts?.map(product => (
                <TableRow
                  hover
                  key={product.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                >
                  <TableCell sx={{ py: 0 }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {product.name}
                  </TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.category.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
