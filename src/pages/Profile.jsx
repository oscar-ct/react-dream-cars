import React, {useEffect, useState} from 'react';
import { getAuth } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";


const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const onLogout = () => {
        auth.signOut().then(navigate("/sign-in"));
    }

    return (
        <button type={"button"} onClick={onLogout}>Sign Out</button>
    )


};

export default Profile;