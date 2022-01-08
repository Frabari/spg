import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Tab,
  TableSortLabel,
  Tabs,
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
import {
  getProductOrderEntries,
  OrderEntryStatus,
  Product,
  Role,
  User,
} from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useCategories } from '../hooks/useCategories';
import { useProductOrderEntries } from '../hooks/useProductOrderEntries';
import { useProducts } from '../hooks/useProducts';
import { useProfile } from '../hooks/useProfile';
import { useUsers } from '../hooks/useUsers';
import { useVirtualClock } from '../hooks/useVirtualClock';

const columns: {
  key: keyof Product;
  title: string;
  sortable: boolean;
  width: number;
}[] = [
  {
    key: 'image',
    title: 'Image',
    sortable: false,
    width: 50,
  },
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    width: 300,
  },
  {
    key: 'description',
    title: 'Description',
    sortable: true,
    width: 400,
  },
  {
    key: 'price',
    title: 'Price',
    sortable: true,
    width: 100,
  },
  {
    key: 'category',
    title: 'Category',
    sortable: true,
    width: 100,
  },
  {
    key: 'farmer',
    title: 'Farmer',
    sortable: true,
    width: 100,
  },
];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '16px',
  backgroundColor: '#ffffff',
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

const Description = styled(Box)({
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: 300,
});

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const AdminProducts = (props: {
  handleDrawerToggle: () => void;
  profile: User;
}) => {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const [dto, setDto] = useState<Partial<User>>(profile as User);
  const { products } = useProducts(true);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Product;
    dir: 'asc' | 'desc';
  }>({ by: null, dir: 'asc' });

  useEffect(() => {
    if (products.length > 0) {
      products.forEach(p =>
        getProductOrderEntries(p.id)
          // @ts-ignore
          .then(e => (p.productEntryStatus = e.entries[0].status))
          .catch(e => {
            //noop
          }),
      );
    }
  }, [products]);

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

  useEffect(() => {
    setDto(profile as User);
  }, [profile]);

  const toggleSorting = (byKey: keyof Product) => () => {
    const { by, dir } = sorting;
    setSorting({
      by: by === byKey && dir === 'desc' ? null : byKey,
      dir: by == null ? 'asc' : dir === 'asc' ? 'desc' : 'asc',
    });
  };

  const Actions = ({ productId }: { productId: number }) => {
    const { entries, setEntries } = useProductOrderEntries(productId);

    return (
      entries.length > 0 && (
        <Grid item sx={{ p: 2, pt: 0 }}>
          <ButtonGroup variant="outlined" aria-label="outlined button group">
            {(profile as User).role === Role.MANAGER && (
              <Button
                type="submit"
                variant="outlined"
                color="warning"
                sx={{ px: 3 }}
                onClick={ev => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  setEntries({ status: OrderEntryStatus.DRAFT });
                }}
              >
                Draft
              </Button>
            )}
            {((profile as User).role === Role.MANAGER ||
              (profile as User).role === Role.FARMER) && (
              <Button
                type="submit"
                variant="outlined"
                color="error"
                onClick={ev => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  setEntries({ status: OrderEntryStatus.CONFIRMED });
                }}
                sx={{ px: 3 }}
              >
                Confirm
              </Button>
            )}
            {((profile as User).role === Role.MANAGER ||
              (profile as User).role === Role.WAREHOUSE_MANAGER) && (
              <Button
                type="submit"
                variant="outlined"
                sx={{ px: 3 }}
                onClick={ev => {
                  ev.preventDefault();
                  ev.stopPropagation();
                  setEntries({ status: OrderEntryStatus.DELIVERED });
                }}
              >
                Delivered
              </Button>
            )}
          </ButtonGroup>
        </Grid>
      )
    );
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
  const [searchParams, setSearchParams] = useSearchParams({
    category: 'all',
    farmer: 'all',
  });
  const [farmers, setFarmers] = useState(null);
  const { users } = useUsers();
  const sort = useCategories();
  const [date] = useVirtualClock();

  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // category column filter
  const [categoryAnchorEl, categorySetAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const openCategory = Boolean(categoryAnchorEl);
  const categoryHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    categorySetAnchorEl(event.currentTarget);
  };
  const categoryHandleClose = () => {
    categorySetAnchorEl(null);
  };

  // farmer column filter
  const [farmerAnchorEl, farmerSetAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const openFarmer = Boolean(farmerAnchorEl);
  const farmerHandleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    farmerSetAnchorEl(event.currentTarget);
  };
  const farmerHandleClose = () => {
    farmerSetAnchorEl(null);
  };

  useEffect(() => {
    if (users) {
      setFarmers(users.filter(u => u.role === Role.FARMER));
    }
  }, [users]);

  const handleStatusSearchParams = () => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      status: OrderEntryStatus.CONFIRMED,
    });
  };

  const handleCategorySearchParams = (category: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      category: category,
    });
    categoryHandleClose();
  };

  const handleFarmerSearchParams = (f: string) => {
    if (f === 'all') {
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        farmer: f,
      });
    } else {
      const farmer = farmers.find((fa: User) => fa.email === f);
      setSearchParams({
        ...Object.fromEntries(searchParams.entries()),
        farmer: farmer.name + ' ' + farmer.surname,
      });
    }
    farmerHandleClose();
  };

  const fromAvailability = date.set({
    weekday: 1,
    hour: 18,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const toAvailability = date.set({
    weekday: 6,
    hour: 9,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  const fromReserved =
    date.weekday === 1 && date.hour <= 9
      ? date
          .set({
            weekday: 7,
            hour: 23,
            minute: 0,
            second: 0,
            millisecond: 0,
          })
          .minus({ weeks: 1 })
      : date.set({
          weekday: 7,
          hour: 23,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
  const toReserved = fromReserved.plus({ hours: 10 });

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
        <Search sx={{ mr: 'auto', maxWidth: '250px' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onChange={e => handleChange(e.target.value)}
          />
        </Search>
        <IconButton
          sx={{ ml: 1, display: { xs: 'flex', md: 'none' } }}
          className="add-icon-button"
          href="/admin/products/new"
        >
          <Add />
        </IconButton>
        <Button
          sx={{
            display: { xs: 'none', md: 'flex' },
          }}
          variant="contained"
          href="/admin/products/new"
          startIcon={<Add />}
        >
          <Typography display="inline" sx={{ textTransform: 'none' }}>
            Create product
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 1, sm: 2 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: '16px' }}>
          <Tabs
            value={value}
            onChange={handleChangeTab}
            aria-label="basic tabs example"
            variant="scrollable"
          >
            <Tab
              label="Show all"
              {...a11yProps(0)}
              onClick={() =>
                setSearchParams({
                  category: 'all',
                  filter: 'all',
                  status: 'all',
                })
              }
            />
            <Tab
              label="Show products to be delivered"
              {...a11yProps(1)}
              onClick={() => handleStatusSearchParams()}
            />
          </Tabs>
        </Box>

        <TableContainer
          component={Paper}
          sx={{ width: '100%', height: '100%' }}
        >
          <Table aria-label="Products table" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(c =>
                  c.key === 'farmer' && !(props.profile.role === 'farmer') ? (
                    <TableCell
                      key={c.key}
                      sortDirection={sorting.by === c.key ? sorting.dir : false}
                    >
                      <Grid
                        container
                        direction="row"
                        spacing={1}
                        justifyItems="center"
                        alignItems="center"
                      >
                        <Grid item>
                          {c.sortable ? (
                            <TableSortLabel
                              active={sorting.by === c.key}
                              direction={
                                sorting.by === c.key ? sorting.dir : 'asc'
                              }
                              onClick={toggleSorting(c.key)}
                            >
                              {c.title}
                            </TableSortLabel>
                          ) : (
                            c.title
                          )}
                        </Grid>
                        <Grid item>
                          {c.key === 'farmer' && (
                            <>
                              <IconButton onClick={farmerHandleClick}>
                                <FilterAltIcon />
                              </IconButton>
                              <Menu
                                id="farmer-menu"
                                anchorEl={farmerAnchorEl}
                                open={openFarmer}
                                onClose={farmerHandleClose}
                                MenuListProps={{
                                  'aria-labelledby': 'basic-button',
                                }}
                              >
                                <MenuItem
                                  key="all"
                                  value="all"
                                  onClick={() =>
                                    handleFarmerSearchParams('all')
                                  }
                                >
                                  {'All'}
                                </MenuItem>
                                {farmers?.map((option: User) => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.email}
                                    onClick={() =>
                                      handleFarmerSearchParams(option.email)
                                    }
                                  >
                                    {option.name} {option.surname}
                                  </MenuItem>
                                ))}
                              </Menu>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  ) : c.key === 'description' ? (
                    <></>
                  ) : c.key === 'farmer' && props.profile.role === 'farmer' ? (
                    <></>
                  ) : (
                    <TableCell
                      key={c.key}
                      sortDirection={sorting.by === c.key ? sorting.dir : false}
                    >
                      <Grid
                        container
                        direction="row"
                        spacing={1}
                        justifyItems="center"
                        alignItems="center"
                      >
                        <Grid item>
                          {c.sortable ? (
                            <TableSortLabel
                              active={sorting.by === c.key}
                              direction={
                                sorting.by === c.key ? sorting.dir : 'asc'
                              }
                              onClick={toggleSorting(c.key)}
                            >
                              {c.title}
                            </TableSortLabel>
                          ) : (
                            c.title
                          )}
                        </Grid>
                        <Grid item>
                          {c.key === 'category' && (
                            <>
                              <IconButton onClick={categoryHandleClick}>
                                <FilterAltIcon />
                              </IconButton>
                              <Menu
                                id="category-menu"
                                anchorEl={categoryAnchorEl}
                                open={openCategory}
                                onClose={categoryHandleClose}
                                MenuListProps={{
                                  'aria-labelledby': 'basic-button',
                                }}
                              >
                                <MenuItem
                                  key="all"
                                  value="all"
                                  onClick={() =>
                                    handleCategorySearchParams('all')
                                  }
                                >
                                  All
                                </MenuItem>
                                {sort.categories.map(option => (
                                  <MenuItem
                                    key={option.id}
                                    value={option.slug}
                                    onClick={() =>
                                      handleCategorySearchParams(option.slug)
                                    }
                                  >
                                    {option.name}
                                  </MenuItem>
                                ))}
                              </Menu>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </TableCell>
                  ),
                )}
                {props.profile.role === 'farmer' ? (
                  <TableCell>{'Notes'}</TableCell>
                ) : (
                  <></>
                )}
                <TableCell>{'Actions'}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts
                ?.filter(
                  p =>
                    !searchParams.get('category') ||
                    searchParams.get('category') === 'all' ||
                    p.category.slug === searchParams.get('category'),
                )
                ?.filter(
                  p =>
                    !searchParams.get('farmer') ||
                    searchParams.get('farmer') === 'all' ||
                    p.farmer.name + ' ' + p.farmer.surname ===
                      searchParams.get('farmer'),
                )
                ?.filter(
                  p =>
                    !searchParams.get('status') ||
                    searchParams.get('status') === 'all' ||
                    //  @ts-ignore
                    p.productEntryStatus === searchParams.get('status'),
                )
                ?.map(product => (
                  <TableRow
                    hover
                    key={product.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                    }}
                    onClick={ev => {
                      ev.preventDefault();
                      navigate(`/admin/products/${product.id}`);
                    }}
                  >
                    <TableCell sx={{ py: 0, pt: 1 }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                      align="left"
                      sx={{ pr: 0 }}
                    >
                      {product.name}
                    </TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.category.name}</TableCell>
                    {props.profile.role === 'farmer' ? (
                      <>
                        <TableCell>
                          {product.available === 0 &&
                            date >= fromAvailability &&
                            date <= toAvailability && (
                              <Alert severity="warning">
                                {'Remember to update the availability field'}
                              </Alert>
                            )}
                          {date >= fromReserved && date <= toReserved && (
                            <Alert severity="warning">
                              {"Remember to confirm orders' booking"}
                            </Alert>
                          )}
                        </TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell>
                          {product.farmer.name + ' ' + product.farmer.surname}
                        </TableCell>
                      </>
                    )}
                    <TableCell>{<Actions productId={product.id} />}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
