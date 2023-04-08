import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";


export const useAuthStatus = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(function () {
        const auth = getAuth();
       onAuthStateChanged(auth, function (user) {
           if (user) {
               setLoggedIn(true);
           }
           setLoading(false);
       });
       console.log("Checking auth status from useAuthStatus custom hook")
    });


    return { loggedIn, loading }
};

