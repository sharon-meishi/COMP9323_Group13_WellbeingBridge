import React, { useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {AppContext} from './utils/store';
import HomePage from './pages/HomePage';
import OrganizationApplyPage from './pages/OrganizationApplyPage';

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
    <AppContext.Provider value={store}>
      <Redirect to='/home' />
      <Switch>
        <Route exact path='/home' component={HomePage} />
        <Route exact path='/home/:eventid' component={HomePage} />
        <Route
          exact
          path='/organization/apply'
          component={OrganizationApplyPage}
        />
      </Switch>
    </AppContext.Provider>
  );
}

export default App;
