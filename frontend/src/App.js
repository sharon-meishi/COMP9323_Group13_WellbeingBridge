import React from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router} from 'react-router-dom';
import { AppContext } from './utils/store';
import HomePage from './pages/HomePage';
import OrganizationApplyPage from './pages/OrganizationApplyPage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventEditPage from './pages/EventEditPage';
import EventCreatePage from './pages/EventCreatePage';
import ProfilePage from './pages/ProfilePage';
import OrganizationDetailsPage from './pages/OrganizationDetailsPage';
import { ThemeProvider } from '@material-ui/core/styles';
import Theme from './components/theme';

function App() {
  const [isLoginState, setIsLoginState] = React.useState(
    sessionStorage.getItem('token') !== null
  );
  const [userType, setUserType] = React.useState(
    sessionStorage.getItem('userType')
  );

  const store = {
    isLoginState,
    setIsLoginState,
    userType,
    setUserType,
  };

  return (
    <ThemeProvider theme={Theme}>
      <AppContext.Provider value={store}>
        <Route>
        <Switch>
          <Route exact path='/home' component={HomePage} />
          <Route exact path='/event/create' component={EventCreatePage} />
          <Route exact path='/event/edit/:eventId' component={EventEditPage} />
          <Route exact path='/event/:eventId' component={EventDetailsPage} />
          <Route exact path='/profile/:id' component={ProfilePage} />
          <Route
            exact
            path='/organization/apply'
            component={OrganizationApplyPage}
          />
          <Route exact path='/organization/:oId' component={OrganizationDetailsPage} />

          <Redirect to='/home' />
        </Switch>
        </Route>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
