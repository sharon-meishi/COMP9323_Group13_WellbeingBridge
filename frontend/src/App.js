import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AppContext } from './utils/store';
import HomePage from './pages/HomePage';
import OrganizationApplyPage from './pages/OrganizationApplyPage';
import EventDetailsPage from './pages/EventDetailsPage'
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
    <ThemeProvider>
      <AppContext.Provider value={store}>
        <Switch>
          <Route exact path='/home' component={HomePage} />
          <Route exact path='/:eventid' component={EventDetailsPage} />
          <Route
            exact
            path='/organization/apply'
            component={OrganizationApplyPage}
          />
          <Redirect to='/home' />
        </Switch>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
