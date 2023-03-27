import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

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
            await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(auth.currentUser, {
                displayName: name,
            });
            navigate("/")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div>
                <header>
                    <p>Welcome Back</p>
                </header>
                <form onSubmit={submitNewUser}>
                    <input type={"text"} placeholder={"Name"} id={"name"} value={name} onChange={onCredentialChange}/>

                    <input type={"email"} placeholder={"Email"} id={"email"} value={email} onChange={onCredentialChange}/>
                    <div>
                        <input type={ showPassword ? "text" : "password"} placeholder={"Password"} id={"password"} value={password} onChange={onCredentialChange}/>
                        <img src={visibilityIcon} alt={"show password"} onClick={() => setShowPassword(prevState => !prevState)}/>
                    </div>

                    <div>
                        <p>Sign In</p>
                        <button><ArrowRightIcon fill={"white"} width={"34px"} height={"34px"} /></button>
                    </div>
                </form>
                <Link to={"/sign-in"}>Sign In Instead</Link>
            </div>
        </>
    );
};

export default SignUp;