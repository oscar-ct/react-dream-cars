import React, { useState } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";



const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const[changeDetails, setChangeDetails] = useState(false);

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;

    const onLogout = () => {
        auth.signOut().then(navigate("/sign-in"));
    };

    const submitChangeDetails = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                const userReference = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userReference, {
                    name: name,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const onChangePersonalDetails = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                [e.target.id]: e.target.value,
            };
        });
    };


    return (
        <div className={"profile"}>
            <header className={"profile-header"}>
                <p className={"page-header"}>My Profile</p>
                <button type={"button"} className={"logout"} onClick={onLogout}>
                    Logout
                </button>
            </header>
            <main>
                <div className={"profile-details-header"}>
                    <p className={"profile-details-text"}>Personal Details</p>
                    <p className={"change-personal-details"} onClick={() => {
                        changeDetails && submitChangeDetails();
                        setChangeDetails(prevState => !prevState);
                    }}>{changeDetails ? "Done" : "Change"}</p>
                </div>
                <div className={"profile-card"}>
                    <form>
                        <input
                            type={"text"}
                            id={"name"}
                            className={!changeDetails ? "profile-name" : "profile-name-active"}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChangePersonalDetails}
                        />
                        <input
                            type={"text"}
                            id={"email"}
                            className={!changeDetails ? "profile-email" : "profile-email-active"}
                            disabled={!changeDetails}
                            value={email}
                            onChange={onChangePersonalDetails}
                        />
                    </form>
                </div>
            </main>
        </div>
    );

};

export default Profile;