import React from 'react';
import 'semantic-ui-css/semantic.min.css'
import {
  Route,
  Switch,
  Redirect,
  BrowserRouter as Router,
} from 'react-router-dom';
import Theme from './components/theme';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppContext } from './utils/store';
import HomePage from './pages/HomePage';
import EventDetailsPage from './pages/EventDetailsPage';
import EventEditPage from './pages/EventEditPage';
import EventCreatePage from './pages/EventCreatePage';
import OrganizationApplyPage from './pages/OrganizationApplyPage';
import OrganizationDashboardPage from './pages/OrganizationDashboardPage';
import OrganizationHomePage from './pages/OrganizationHomePage';
import IndividualProfilePage from './pages/IndividualProfilePage';

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
        <Router>
          <Switch>
            <Route exact path='/home' component={HomePage} />
            <Route exact path='/event/create' component={EventCreatePage} />
            <Route
              exact
              path='/event/edit/:eventId'
              component={EventEditPage}
            />
            <Route exact path='/event/:eventId' component={EventDetailsPage} />

            <Route exact path='/profile' component={IndividualProfilePage} />
            <Route
              exact
              path='/dashboard'
              component={OrganizationDashboardPage}
            />
            <Route
              exact
              path='/organization/apply'
              component={OrganizationApplyPage}
            />

            <Route
              exact
              path='/organization/:oId'
              component={OrganizationHomePage}
            />

            <Redirect to='/home' />
          </Switch>
        </Router>
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;
