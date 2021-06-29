import {Route, Switch, Redirect} from 'react-router-dom';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div>
      <Redirect to='/home'/>
      <Switch>
        <Route path='/home' component={HomePage}/>
        <Route path='/home/:eventid' component={HomePage}/>
      </Switch>
    </div>
  );
}

export default App;
