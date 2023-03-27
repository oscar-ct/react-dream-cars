import React, {useEffect, useState} from 'react';
import {getAuth} from "firebase/auth";


const Profile = () => {

    const [user, setUser] = useState(null);

    const auth = getAuth();
    useEffect(function () {
        setUser(auth.currentUser)
    }, []);

    if (user) {
        return <h1>{user.displayName}</h1>
    } else {
        return (
            <h1>Not logged In</h1>
        );
    }

};

export default Profile;