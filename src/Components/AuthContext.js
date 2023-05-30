import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
 

const AuthProvider = ({ children }) => {
   
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return JSON.parse(localStorage.getItem('isAuthenticated')) || false;
      });

    const [isAdmin, setIsAdmin] = useState(() => {
        return JSON.parse(localStorage.getItem('isAdmin')) || false;
      });  

    const [authenticatedUser, setAuthenticatedUser] = useState(null);

      useEffect(() => {
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
      }, [isAdmin]);

      useEffect(() => {
        localStorage.setItem('isAuthenticated', JSON.stringify(isAuthenticated));
      }, [isAuthenticated]);

    const login = (isAdmin) => {
         setIsAuthenticated(true);
         setIsAdmin(isAdmin);
        localStorage.setItem('isAuthenticated', JSON.stringify(true));
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
     };

    const logout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.setItem('isAuthenticated', JSON.stringify(false));
        localStorage.setItem('isAdmin', JSON.stringify(false));
     };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout, authenticatedUser, setAuthenticatedUser }}>
             {children}
        </AuthContext.Provider> );
};

export { AuthContext, AuthProvider };