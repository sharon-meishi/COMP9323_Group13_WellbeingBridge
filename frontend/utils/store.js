import React from 'react';

export const StoreContext = React.createContext(null);

const StoreProvider = ({ children }) => {
  const [isLoginState, setIsLoginState] = React.useState(sessionStorage.getItem('token') !== null);
  const [userType, setUserType] =  React.useState(sessionStorage.getItem('userType') !== null);

  const store = {
    isLoginState: [isLoginState, setIsLoginState],
    userType: [userType, setUserType],
  }

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
};

export default StoreProvider;