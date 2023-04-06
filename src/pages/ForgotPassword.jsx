import { useState } from 'react';
import { Link } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { toast } from "react-toastify";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";
import React from "react";

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
    <>
        {/*<div className={"page-container"}>*/}
        {/*    <header>*/}
        {/*        <p className={"page-header"}>Reset Password</p>*/}
        {/*    </header>*/}
        {/*    <main>*/}
        {/*        <form onSubmit={onSubmitForgotPasswordReset}>*/}
        {/*            <input*/}
        {/*            type={"email"}*/}
        {/*            className={"email-input"}*/}
        {/*            placeholder={"Email"}*/}
        {/*            id={"email"}*/}
        {/*            value={email}*/}
        {/*            onChange={setEmailChange}*/}
        {/*            />*/}
        {/*            <Link className={"forgot-password-link"} to={"/sign-in"}>*/}
        {/*                Return To Sign In*/}
        {/*            </Link>*/}
        {/*            <div className={"sign-in-bar"}>*/}
        {/*                <div className={"sign-in-text"}>*/}
        {/*                    Send Reset Link*/}
        {/*                </div>*/}
        {/*                <button className={"sign-in-button"}>*/}
        {/*                    <ArrowRightIcon fill={"white"} width={"34px"} height={"34px"} />*/}
        {/*                </button>*/}
        {/*            </div>*/}
        {/*        </form>*/}
        {/*    </main>*/}
        {/*</div>*/}



        <div className="bg-no-repeat bg-cover bg-center relative" style={{background: "url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)"}}>
            <div className="absolute bg-gradient-to-b from-green-500 to-green-400 opacity-75 inset-0 z-0">
            </div>
            <div className="min-h-screen flex flex-row mx-4 sm:mx-12 justify-center">
                <div className="flex-col flex self-center sm:max-w-5xl xl:max-w-2xl  z-10">
                    <div className="self-start hidden lg:flex flex-col  text-white">
                        <img src="" className="mb-3"/>
                        <div className={"w-9/12"}>
                            <h1 className="mb-3 font-bold text-5xl">Lets reset that password.
                            </h1>
                            <p className="pr-3">Lorem ipsum is placeholder text commonly used in the graphic, print,
                                and publishing industries for previewing layouts and visual mockups
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-7/12 flex justify-center self-center z-10">
                    <div className="p-12 bg-white mx-auto rounded-2xl sm:w-96 w-full">
                        <div className="mb-4">
                            <h3 className="font-semibold text-2xl text-gray-800">Reset Password
                            </h3>
                            <p className="text-gray-500">Please enter your email to reset <br/>your password.
                            </p>
                        </div>
                        <form onSubmit={onSubmitForgotPasswordReset} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 tracking-wide">Email
                                </label>
                                <input
                                    className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                                    autoComplete={"email"}
                                    type={"email"}
                                    placeholder={"mail@hotmail.com"}
                                    id={"email"}
                                    value={email}
                                    onChange={setEmailChange}/>
                            </div>

                            <div>
                                <button type="submit" className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                                    Reset
                                </button>
                            </div>
                        </form>

                        <div className={"flex justify-center"}>
                            <p className={"pt-6"}>
                                Remembered you password?
                            </p>
                            <Link to={"/sign-up"} className="text-green-400 hover:text-green-500 pt-6 pl-1">
                                Sign-in
                            </Link>
                        </div>


                    </div>
                </div>
            </div>
        </div>




    </>
    );
};

export default ForgotPassword;