import { useState } from 'react';
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const setEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const onSubmitForgotPasswordReset = async (e) => {
        e.preventDefault();
        try {
            const auth = getAuth();
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset password link was sent");
            setEmail("");
        } catch (error) {
            console.log(error);
            toast.error("Could not send reset password link")
        }
    };

    return (
        <div className={"page-container"}>
            <header>
                <p className={"page-header"}>Reset Password</p>
            </header>
            <main>
                <form onSubmit={onSubmitForgotPasswordReset}>
                    <input
                    type={"email"}
                    className={"email-input"}
                    placeholder={"Email"}
                    id={"email"}
                    value={email}
                    onChange={setEmailChange}
                    />
                    <Link className={"forgot-password-link"} to={"/sign-in"}>
                        Return To Sign In
                    </Link>
                    <div className={"sign-in-bar"}>
                        <div className={"sign-in-text"}>
                            Send Reset Link
                        </div>
                        <button className={"sign-in-button"}>
                            <ArrowRightIcon fill={"white"} width={"34px"} height={"34px"} />
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default ForgotPassword;