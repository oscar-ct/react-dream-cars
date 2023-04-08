import React, {useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";





const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();
    const { email, password } = formData;

    // useEffect(function () {
    //     const checkLoginStatus = () => {
    //         if (isLoggedIn) {
    //             navigate("/profile");
    //             console.log("you are already logged in");
    //         }
    //     }
    //     checkLoginStatus();
    // }, [isLoggedIn, navigate]);

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
                    navigate("/profile");
                }
        } catch (e) {
            toast.error("Invalid password/email")
        }
    }


    return (
        <>
            {/*<div className={"page-container"}>*/}
            {/*    <header>*/}
            {/*        <p className={"page-header"}>Welcome Back,</p>*/}
            {/*    </header>*/}
            {/*    <form onSubmit={submitSignIn}>*/}
            {/*        <input*/}
            {/*            className={"email-input"}*/}
            {/*            autoComplete={"email"}*/}
            {/*            type={"email"}*/}
            {/*            placeholder={"Email"}*/}
            {/*            id={"email"}*/}
            {/*            value={email}*/}
            {/*            onChange={onCredentialChange}/>*/}
            {/*        <div className={"password-input-div"}>*/}
            {/*            <input*/}
            {/*                className={"password-input"}*/}
            {/*                autoComplete={"current-password"}*/}
            {/*                type={ showPassword ? "text" : "password"}*/}
            {/*                placeholder={"Password"}*/}
            {/*                id={"password"}*/}
            {/*                value={password}*/}
            {/*                onChange={onCredentialChange}/>*/}
            {/*            <img*/}
            {/*                src={visibilityIcon}*/}
            {/*                alt={"show password"}*/}
            {/*                onClick={() => setShowPassword(prevState => !prevState)}*/}
            {/*                className={"show-password"}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <Link className={"forgot-password-link"} to={"/forgot-password"}>Forgot Password?*/}
            {/*        </Link>*/}
            {/*        <div className={"sign-in-bar"}>*/}
            {/*            <p className={"sign-in-text"}>Sign In*/}
            {/*            </p>*/}
            {/*            <button className={"sign-in-button"}>*/}
            {/*                <ArrowRightIcon fill={"white"} width={"34px"} height={"34px"} />*/}
            {/*            </button>*/}
            {/*        </div>*/}
            {/*    </form>*/}

            {/*    <OAuth/>*/}

            {/*    <div className={"sign-in-wrapper"}>*/}
            {/*        <span className={"sign-in-span"}>Don't have an account?*/}
            {/*        </span>*/}
            {/*        <Link to={"/sign-up"}>*/}
            {/*            <button className={"sign-in-link-button"}>*/}
            {/*                Sign Up*/}
            {/*            </button>*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</div>*/}




            <div className="bg-no-repeat bg-cover bg-center relative" style={{background: "url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)"}}>
                <div className="absolute bg-gradient-to-b from-green-500 to-green-400 opacity-75 inset-0 z-0">
                </div>
                <div className="min-h-screen flex flex-row mx-4 sm:mx-12 justify-center">
                    <div className="flex-col flex self-center  sm:max-w-5xl xl:max-w-2xl  z-10">
                        <div className="self-start hidden lg:flex flex-col  text-white">
                            <img src="" className="mb-3" alt={""}/>
                            <div className={"w-9/12"}>
                                <h1 className="mb-3 font-bold text-5xl">Welcome Back,
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
                                <h3 className="font-semibold text-2xl text-gray-800">Sign In
                                </h3>
                                <p className="text-gray-500">Please sign in to your account.
                                </p>
                            </div>
                            <form onSubmit={submitSignIn} className="space-y-5">
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
                                        onChange={onCredentialChange}/>
                                </div>
                                <div className="space-y-2">
                                    <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">
                                        Password
                                    </label>

                                        <input
                                            className="w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-green-400"
                                            autoComplete={"current-password"}
                                            type={ showPassword ? "text" : "password"}
                                            placeholder={"Enter your Password"}
                                            id={"password"}
                                            value={password}
                                            onChange={onCredentialChange}/>
                                        <div className={"flex justify-start flex-row-reverse"}>
                                            <img
                                                src={visibilityIcon}
                                                alt={"show password"}
                                                onClick={() => setShowPassword(prevState => !prevState)}
                                                className={"show-password-img"}
                                            />
                                            <div className="flex justify-end">
                                                <div className="text-sm">
                                                    <Link to={"/forgot-password"} className="text-green-400 hover:text-green-500">
                                                        Forgot your password?
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                </div>

                                <div>
                                    <button type="submit" className="w-full flex justify-center bg-green-400  hover:bg-green-500 text-gray-100 p-3  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                                        Sign in
                                    </button>
                                </div>
                            </form>

                            <OAuth/>

                            <div className={"flex justify-center"}>
                                <p className={"pt-6"}>
                                    Don't have an account?
                                </p>
                                <Link to={"/sign-up"} className="text-green-400 hover:text-green-500 pt-6 pl-1">
                                    Sign-up
                                </Link>
                            </div>


                        </div>
                    </div>
                </div>
            </div>



        </>
    );
};

export default SignIn;