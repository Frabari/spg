import React, { useState } from 'react';
import NavigationBox from './Navigation';
import { TextField, Grid, Button } from '@material-ui/core';

function UsersInfo() {
  const [edit, setEdit] = React.useState(true);
  const [mail, setmail] = React.useState(true);
  const [nome, setnome] = React.useState(true);
  const [cognome, setcognome] = React.useState(true);

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
      var validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!info.email.match(validRegex)) {
        check = false;
        setmail(false);
      } else setmail(true);
    }
    if (info.surname.length < 2) {
      check = false;
      setcognome(false);
    } else setcognome(true);

    if (info.username.length < 2) {
      check = false;
      setnome(false);
    } else setnome(true);
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
        style={{ width: 250, marginLeft: '10%' }}
      >
        <h2>UserID: {info.userid}</h2>
        <TextField
          id="name"
          error={!nome}
          helperText={nome ? '' : 'invalid name'}
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
          error={!cognome}
          fullWidth={true}
          helperText={cognome ? '' : 'invalid surname'}
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
        <Button
          variant="contained"
          style={{ marginTop: '10%', backgroundColor: '#5dd886' }}
          onClick={handleMouseEvent}
        >
          {edit ? 'Edit info' : 'save'}
        </Button>
      </Grid>
    </>
  );
}

export default UsersInfo;
