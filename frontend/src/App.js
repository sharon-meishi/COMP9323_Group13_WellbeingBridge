// import logo from './logo.svg';
import './App.css';
import {Route, Switch, Redirect} from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Redirect to='/home'/>
      <Switch>
        <Route path='/home' component={HomePage}></Route>
      </Switch>
    </div>
  );
}

export default App;
