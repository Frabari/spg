import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Add } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Grid,
  IconButton,
  InputBase,
  MenuItem,
  styled,
  TableSortLabel,
  TextField,
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

const columns: { key: keyof User; title: string; sortable: boolean }[] = [
  {
    key: 'name',
    title: 'Name',
    sortable: true,
  },
  {
    key: 'surname',
    title: 'Surname',
    sortable: true,
  },
  {
    key: 'email',
    title: 'Email',
    sortable: true,
  },
  {
    key: 'role',
    title: 'Role',
    sortable: false,
  },
  {
    key: 'balance',
    title: 'Balance',
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

export const AdminUsers = (props: { handleDrawerToggle: () => void }) => {
  const navigate = useNavigate();
  const { users } = useUsers();
  const [sortedUsers, setSortedUsers] = useState<User[]>([]);
  const [sorting, setSorting] = useState<{
    by: keyof User;
    dir: 'asc' | 'desc';
  }>({ by: null, dir: 'asc' });

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

  const [sortOption, setSortOption] = useState('No sort');
  const sort = [
    'customer',
    'farmer',
    'rider',
    'employee',
    'warehouse_worker',
    'warehouse_manager',
    'manager',
  ];

  const handleFilterByRole = (s: string) => {
    setSortOption(s);
    setSortedUsers(users.filter(u => u.role === s));
    navigate(`/admin/users?role=${s}`);
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
        <IconButton className="add-icon-button" href="/admin/users/new">
          <Add />
        </IconButton>
        <Typography variant="h6" ml={2} display={{ xs: 'none', md: 'inline' }}>
          Create user
        </Typography>
      </AdminAppBar>
      <Grid item xs={12} sm={1} sx={{ pt: { xs: 2, sm: 1 }, pl: 4 }}>
        <TextField
          id="outlined-select-role"
          select
          value={sortOption}
          label="Filter by role"
          size="small"
          sx={{ width: '150px' }}
          onChange={e => handleFilterByRole(e.target.value)}
        >
          {sort.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Box sx={{ p: { xs: 1, sm: 2 }, pt: { sm: 0 }, flexGrow: 1 }}>
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
              {sortedUsers?.map(user => (
                <TableRow
                  hover
                  key={user.id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    cursor: 'pointer',
                  }}
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <TableCell component="th" scope="row">
                    {user.name}
                  </TableCell>
                  <TableCell>{user.surname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
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
