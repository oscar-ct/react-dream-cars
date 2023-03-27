import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";



const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const { email, password } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    const submitSignIn = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user) {
                navigate("/profile")
            }
        } catch (e) {
            toast.error("Invalid password/email")
        }
    }

    return (
        <>
            <div>
                <header>
                    <p>Welcome Back</p>
                </header>
                <form onSubmit={submitSignIn}>
                    <input type={"email"} placeholder={"Email"} id={"email"} value={email} onChange={onCredentialChange}/>
                    <div>
                        <input type={ showPassword ? "text" : "password"} placeholder={"Password"} id={"password"} value={password} onChange={onCredentialChange}/>
                        <img src={visibilityIcon} alt={"show password"} onClick={() => setShowPassword(prevState => !prevState)}/>
                    </div>
                    <Link to={"/forgot-password"}>Forgot Password</Link>
                    <div>
                        <p>Sign In</p>
                        <button><ArrowRightIcon fill={"white"} width={"34px"} height={"34px"} /></button>
                    </div>
                </form>
                <Link to={"/sign-up"}>Sign Up Instead</Link>
            </div>
        </>
    );
};

export default SignIn;