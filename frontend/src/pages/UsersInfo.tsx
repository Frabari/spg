import React from 'react';
import { TextField, Grid, Button } from '@mui/material';
import NavigationBox from './Navigation';

function UsersInfo() {
  const [edit, setEdit] = React.useState(true);
  const [mail, setMail] = React.useState(true);
  const [name, setName] = React.useState(true);
  const [surname, setSurname] = React.useState(true);
  const [balance, setBalance] = React.useState(true);

  let info = {
    userid: 'SAMJ22',
    username: 'samuele',
    surname: 'jakupi',
    email: 'samuele.jakupi@outlook.it',
    role: 'Client',
    balance: '0',
  };

  const handleMouseEvent = () => {
    let check = true;
    if (!edit) {
      info.username = (
        document.getElementById('name') as HTMLInputElement
      ).value;
      info.surname = (
        document.getElementById('surname') as HTMLInputElement
      ).value;
      info.email = (document.getElementById('email') as HTMLInputElement).value;
      info.balance = (
        document.getElementById('balance') as HTMLInputElement
      ).value;
      var validEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!info.email.match(validEmailRegex)) {
        check = false;
        setMail(false);
      } else setMail(true);
      var validBalanceRegex = /^[0-9]+/;
      if (!info.balance.match(validBalanceRegex)) {
        check = false;
        setBalance(false);
      } else setBalance(true);
    }
    if (info.surname.length < 2) {
      check = false;
      setSurname(false);
    } else setSurname(true);

    if (info.username.length < 2) {
      check = false;
      setName(false);
    } else setName(true);
    if (info.balance === undefined) info.balance = '0';

    info.balance = (
      document.getElementById('balance') as HTMLInputElement
    ).value;
    if (check) setEdit(!edit);
  };

  return (
    <>
      <NavigationBox.NavBar />
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
        marginX="auto"
        style={{ width: 250 }}
      >
        <h2>UserID: {info.userid}</h2>
        <TextField
          id="name"
          error={!name}
          helperText={name ? '' : 'invalid name'}
          size="medium"
          fullWidth={true}
          label="Name"
          defaultValue={info.username}
          InputProps={{
            readOnly: edit,
          }}
        />
        <TextField
          id="surname"
          label="Surname"
          error={!surname}
          fullWidth={true}
          helperText={surname ? '' : 'invalid surname'}
          defaultValue={info.surname}
          InputProps={{
            readOnly: edit,
          }}
        />
        <TextField
          error={!mail}
          id="email"
          fullWidth={true}
          label="Email"
          type="email"
          helperText={mail ? '' : 'invalid mail'}
          defaultValue={info.email}
          InputProps={{
            readOnly: edit,
          }}
        />
        <TextField
          id="role"
          label="Role"
          fullWidth={true}
          defaultValue={info.role}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          id="balance"
          label="Balance"
          type={'number'}
          fullWidth={true}
          defaultValue={info.balance}
          InputProps={{
            readOnly: edit,
          }}
        >
          $
        </TextField>
        <Button onClick={handleMouseEvent}>
          {edit ? 'Edit info' : 'save'}
        </Button>
      </Grid>
    </>
  );
}

export default UsersInfo;
