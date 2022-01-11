import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add, Check, MoveToInbox } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Box,
  Button,
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
  OrderEntryStatus,
  Product,
  Role,
  User,
  StockItem,
} from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { Search } from '../components/Search';
import { useCategories } from '../hooks/useCategories';
import { useDate } from '../hooks/useDate';
import { useProfile } from '../hooks/useProfile';
import { useStock } from '../hooks/useStock';
import { useUpdateProductOrderEntries } from '../hooks/useUpdateProductOrderEntries';
import { useUsers } from '../hooks/useUsers';
import { a11yProps } from '../utils';

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

export const AdminProducts = (props: {
  handleDrawerToggle: () => void;
  profile: User;
}) => {
  const navigate = useNavigate();
  const { data: profile } = useProfile();
  const { data: items } = useStock();
  const { mutateAsync: updateProductOrderEntries } =
    useUpdateProductOrderEntries();
  const [sortedProducts, setSortedProducts] = useState<StockItem[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof Product;
    dir: 'asc' | 'desc';
  }>({ by: null, dir: 'asc' });

  useEffect(() => {
    if (items?.length) {
      const { by, dir } = sorting;
      if (by != null) {
        const mul = dir === 'asc' ? -1 : 1;
        const sorted = [...items].sort((a, b) => (a[by] < b[by] ? mul : -mul));
        setSortedProducts(sorted);
      } else {
        setSortedProducts(items);
      }
    }
  }, [items, sorting]);

  const toggleSorting = (byKey: keyof Product) => () => {
    const { by, dir } = sorting;
    setSorting({
      by: by === byKey && dir === 'desc' ? null : byKey,
      dir: by == null ? 'asc' : dir === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleChange = (value: any) => {
    setSortedProducts(
      items.filter(
        p =>
          p.name.toLowerCase().includes(value.toLowerCase()) ||
          p.category.name.toLowerCase().includes(value.toLowerCase()) ||
          p.category.slug.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };
  const [searchParams, setSearchParams] = useSearchParams({
    category: 'all',
    farmer: 'all',
  });
  const [farmers, setFarmers] = useState(null);
  const { data: users } = useUsers();
  const { data: categories } = useCategories();
  const { data: date } = useDate();

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
  const supplyDeliveryDeadline = toReserved.plus({ hours: 33 });
  const inPreSalesWindow = date >= fromAvailability && date <= toAvailability;
  const inConfirmationWindow = date >= fromReserved && date <= toReserved;
  const inSupplyDeliveryWindow =
    date >= toReserved && date <= supplyDeliveryDeadline;
  const showConfirmEntriesAction =
    profile &&
    inConfirmationWindow &&
    [Role.MANAGER, Role.FARMER].includes(profile.role);
  const showDeliveredEntriesAction =
    profile &&
    inSupplyDeliveryWindow &&
    [Role.MANAGER, Role.WAREHOUSE_MANAGER].includes(profile.role);

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
        <Search sx={{ ml: 'auto', maxWidth: '250px' }}>
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
          <Typography display="inline" fontWeight="bold">
            Create product
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 1, sm: 2 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <Box sx={{ borderBottom: 'none', borderColor: 'divider' }}>
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
                  ) : c.key === 'description' ? null : c.key === 'farmer' &&
                    props.profile.role === 'farmer' ? null : (
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
                                {categories.map(option => (
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
                  <TableCell>Notes</TableCell>
                ) : (
                  <></>
                )}
                <TableCell>Actions</TableCell>
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
                      <TableCell width={300} padding="none">
                        {product.available === 0 && inPreSalesWindow && (
                          <Alert severity="warning" sx={{ py: 0.5 }}>
                            Availability not provided
                          </Alert>
                        )}
                        {inConfirmationWindow && (
                          <Alert severity="warning" sx={{ py: 0.5 }}>
                            Bookings pending confirmation
                          </Alert>
                        )}
                      </TableCell>
                    ) : (
                      <>
                        <TableCell>
                          {product.farmer.name + ' ' + product.farmer.surname}
                        </TableCell>
                      </>
                    )}
                    <TableCell>
                      {showConfirmEntriesAction &&
                        product.orderEntries?.some(
                          e => e.status !== OrderEntryStatus.CONFIRMED,
                        ) && (
                          <Button
                            type="submit"
                            onClick={ev => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              updateProductOrderEntries({
                                productId: product.id,
                                dto: {
                                  status: OrderEntryStatus.CONFIRMED,
                                },
                              });
                            }}
                            startIcon={<Check />}
                            color="info"
                            variant="text"
                          >
                            Confirm entries
                          </Button>
                        )}
                      {showDeliveredEntriesAction &&
                        product.orderEntries?.some(
                          e => e.status !== OrderEntryStatus.DELIVERED,
                        ) && (
                          <Button
                            type="submit"
                            onClick={ev => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              updateProductOrderEntries({
                                productId: product.id,
                                dto: {
                                  status: OrderEntryStatus.DELIVERED,
                                },
                              });
                            }}
                            startIcon={<MoveToInbox />}
                            color="info"
                            variant="text"
                          >
                            Mark as delivered
                          </Button>
                        )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
