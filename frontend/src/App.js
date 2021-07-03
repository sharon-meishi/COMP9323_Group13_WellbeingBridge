import {Route, Switch, Redirect} from 'react-router-dom';
import HomePage from './pages/HomePage';
import OrganizationApplyPage from './pages/OrganizationApplyPage'

function App() {
  return (
    <div>
      <Redirect to='/home'/>
      <Switch>
        <Route exact path='/home' component={HomePage}/>
        <Route exact path='/home/:eventid' component={HomePage}/>
        <Route exact path='/organization/apply' component={OrganizationApplyPage}/>
      </Switch>
    </div>
  );
}

export default App;
