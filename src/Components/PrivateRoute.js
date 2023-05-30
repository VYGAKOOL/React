import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import React, {useContext} from "react";

const PrivateRoute = () => {
    const  {isAuthenticated}  = useContext(AuthContext);
    return (
        isAuthenticated ? <Outlet /> : <Navigate to="login" /> 
    );
};

export default PrivateRoute;