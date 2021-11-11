import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import { ThemeProvider } from '@mui/material/styles';
import { themeOptions } from './pages/CustomTheme';
import Login from './pages/Login';

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <Router>
        <div className="App" style={{ backgroundColor: '#fafafa' }}>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>

          <Route exact path="/home">
            <Homepage />
          </Route>

          <Route exact path="/login">
            <Login />
          </Route>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
