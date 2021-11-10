import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './App.css';
import Homepage from './pages/Homepage';
import { ThemeProvider} from '@mui/material/styles';
import { themeOptions } from './pages/CustomTheme';

function App() {
  return (
    <ThemeProvider theme={themeOptions}>
      <Router >
        <div className="App" style={{backgroundColor: '#fafafa'}}>

          <Route exact path="/">    
            <Redirect to="/home" />
          </Route>

          <Route exact path="/home">
            <Homepage/>
          </Route>

        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;