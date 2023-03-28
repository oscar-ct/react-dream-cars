import React from 'react';
import { Navigate, Outlet } from "react-router-dom";
import {useAuthStatus} from "../hooks/useAuthStatus";



const PrivateRoute = () => {
    const { loggedIn, loading } = useAuthStatus();

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (loggedIn) {
        return <Outlet/>
    } else  {
        return <Navigate to={"/sign-in"}/>
    }


};

export default PrivateRoute;