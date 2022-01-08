import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  styled,
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
import { User } from '../api/BasilApi';
import { AdminAppBar } from '../components/AdminAppBar';
import { useUsers } from '../hooks/useUsers';

const columns: {
  key: keyof User;
  title: string;
  sortable: boolean;
  width: number;
}[] = [
  {
    key: 'avatar',
    title: 'Image',
    sortable: false,
    width: 50,
  },
  {
    key: 'name',
    title: 'Name',
    sortable: true,
    width: 100,
  },
  {
    key: 'surname',
    title: 'Surname',
    sortable: true,
    width: 100,
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
    width: 100,
  },
  {
    key: 'role',
    title: 'Role',
    sortable: false,
    width: 100,
  },
  {
    key: 'balance',
    title: 'Balance',
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

export const AdminUsers = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { data: users } = useUsers();
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [searchParams, setSearchParams] = useSearchParams({ role: 'all' });
  const [sorting, setSorting] = useState<{
    by: keyof User;
    dir: 'asc' | 'desc';
  }>({ by: null, dir: 'asc' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (users?.length) {
      const { by, dir } = sorting;
      if (by != null) {
        const mul = dir === 'asc' ? -1 : 1;
        const sorted = [...users].sort((a, b) => (a[by] < b[by] ? mul : -mul));
        setSortedUsers(sorted);
      } else {
        setSortedUsers(users);
      }
    }
  }, [users, sorting]);

  const toggleSorting = (byKey: keyof User) => () => {
    const { by, dir } = sorting;
    setSorting({
      by: by === byKey && dir === 'desc' ? null : byKey,
      dir: by == null ? 'asc' : dir === 'asc' ? 'desc' : 'asc',
    });
  };

  const handleChange = (value: any) => {
    setSortedUsers(
      users.filter(
        u =>
          u.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          u.surname.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          u.email.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
          u.role.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      ),
    );
  };

  const sort = [
    'all',
    'customer',
    'farmer',
    'rider',
    'employee',
    'warehouse_worker',
    'warehouse_manager',
    'manager',
  ];

  const handleRoleSearchParams = (role: string) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      role: role,
    });
    handleClose();
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
          Users
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
          href="/admin/users/new"
        >
          <Add />
        </IconButton>
        <Button
          sx={{
            display: { xs: 'none', md: 'flex' },
          }}
          variant="contained"
          href="/admin/users/new"
          startIcon={<Add />}
        >
          <Typography display="inline" sx={{ textTransform: 'none' }}>
            Create user
          </Typography>
        </Button>
      </AdminAppBar>
      <Box
        sx={{ p: { xs: 1, sm: 2 }, pt: { sm: 0 }, flexGrow: 1, minHeight: 0 }}
      >
        <TableContainer
          component={Paper}
          sx={{ width: '100%', height: '100%' }}
        >
          <Table aria-label="Users table" stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map(c => (
                  <TableCell
                    key={c.key}
                    sortDirection={sorting.by === c.key ? sorting.dir : false}
                  >
                    <Grid
                      container
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyItems="center"
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
                        {c.key === 'role' && (
                          <>
                            <IconButton onClick={handleClick}>
                              <FilterAltIcon />
                            </IconButton>
                            <Menu
                              id="role-menu"
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              MenuListProps={{
                                'aria-labelledby': 'basic-button',
                              }}
                            >
                              {sort.map(option => (
                                <MenuItem
                                  key={option}
                                  value={option}
                                  onClick={() => handleRoleSearchParams(option)}
                                >
                                  {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                                </MenuItem>
                              ))}
                            </Menu>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedUsers
                ?.filter(
                  u =>
                    !searchParams.get('role') ||
                    searchParams.get('role') === 'all' ||
                    u.role === searchParams.get('role'),
                )
                ?.map(user => (
                  <TableRow
                    hover
                    key={user.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                  >
                    <TableCell sx={{ py: 0, pt: 1 }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {user.name}
                    </TableCell>
                    <TableCell>{user.surname}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </TableCell>
                    <TableCell>€ {user.balance}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};
