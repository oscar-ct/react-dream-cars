import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import googleIcon from "../assets/svg/googleIcon.svg"

const OAuth = () => {


    const navigate = useNavigate();
    const location = useLocation();
    
    const onGoogleClick = async () => {
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            //  checking database if user exists
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            // writing to user to database
            if (!docSnap.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp(),
                });
            }
            navigate("/profile")
        } catch (error) {
            toast.error("Could not authorize sign in with Google")
        }
    }

    return (
        <div className={"social-login"}>
            <p>Or sign {location.pathname === "/sign-up" ? "up" : "in"} with
            </p>
            <button className={"social-icon-div"} onClick={onGoogleClick}>
                <img className={"social-icon-img"} src={googleIcon} alt={"google"}/>
            </button>
        </div>
    );
};

export default OAuth;