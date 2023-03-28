import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const { email, password, name } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const submitNewUser = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await updateProfile(auth.currentUser, {
                displayName: name,
            });

            const formDataCopy = {...formData};
            delete formDataCopy.password;
            formDataCopy.timestamp = serverTimestamp();
            await setDoc(doc(db, "users", user.uid), formDataCopy)
            navigate("/")
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            <div className={"page-container"}>
                <header>
                    <p className={"page-header"}>Create An Account
                    </p>
                </header>
                <form onSubmit={submitNewUser}>
                    <input
                        className={"name-input"}
                        type={"text"}
                        placeholder={"Name"}
                        id={"name"}
                        value={name}
                        onChange={onCredentialChange}
                    />
                    <input
                        className={"email-input"}
                        type={"email"}
                        placeholder={"Email"}
                        id={"email"} value={email}
                        onChange={onCredentialChange}
                    />
                    <div className={"password-input-div"}>
                        <input
                            className={"password-input"}
                            type={ showPassword ? "text" : "password"}
                            placeholder={"Password"}
                            id={"password"}
                            value={password}
                            onChange={onCredentialChange}
                        />
                        <img
                            className={"show-password"}
                            src={visibilityIcon}
                            alt={"show password"}
                            onClick={() => setShowPassword(prevState => !prevState)}
                        />
                    </div>
                    <div className={"sign-up-bar"}>
                        <p className={"sign-up-text"}>Sign Up
                        </p>
                        <button className={"sign-up-button"}>
                            <ArrowRightIcon fill={"white"} width={"34px"} height={"34px"}/>
                        </button>
                    </div>
                </form>
                <div className={"register-link-wrapper"}>
                    <span className={"register-text"}>
                       Have an account?
                    </span>
                    <Link to={"/sign-in"} className={"register-link"}>
                        Sign In
                    </Link>
                </div>
            </div>
        </>
    );
};

export default SignUp;