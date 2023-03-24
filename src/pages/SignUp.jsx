import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as ArrowRightIcon} from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const { email, password, name } = formData;

    const onCredentialChange = (e) => {
        setFormData(prevState => ({
            ...prevState,
            [e.target.id]: e.target.value,
        }));
    };

    return (
        <>
            <div>
                <header>
                    <p>Welcome Back</p>
                </header>
                <form>
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