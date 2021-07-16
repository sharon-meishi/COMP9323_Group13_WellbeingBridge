// import React from 'react';

// export const StoreContext = React.createContext(null);

// const StoreProvider = ({ children }) => {
//   const [isLoginState, setIsLoginState] = React.useState(sessionStorage.getItem('token') !== null);
//   const [userType, setUsertype] = React.useState(sessionStorage.getItem('userType'))

//   const store = {
//     isLoginState: [isLoginState, setIsLoginState],
//     userType: [userType, setUsertype]
//   }

//   return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
// };

// export default StoreProvider;

import React from "react";

export const AppContext = React.createContext({});

