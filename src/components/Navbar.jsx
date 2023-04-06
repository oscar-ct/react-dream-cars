import React, { useContext } from 'react';
import {useNavigate, Link} from "react-router-dom";
// import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
// import { ReactComponent as ExploreIcon} from "../assets/svg/exploreIcon.svg";
// import { ReactComponent as PersonOutlineIcon} from "../assets/svg/personIcon.svg";
import {getAuth} from "firebase/auth";
import AuthContext from "../context/AuthContext";
import {useAuthStatus} from "../hooks/useAuthStatus";
import {useEffect} from "react";


const Navbar = () => {


    const navigate = useNavigate();
    // const location = useLocation();
    const { dispatch, isLoggedIn } = useContext(AuthContext);
    const { loggedIn } = useAuthStatus();

    useEffect(function () {
        const authStatus = () => {
            // console.log(loggedIn);
            if (loggedIn) {
                dispatch({
                    type: "SET_LOGIN",
                    payload: true,
                });
            } else {
                dispatch({
                    type: "SET_LOGIN",
                    payload: false,
                });
                console.log("user is not signed in");
            }
        }
        authStatus();
    }, [dispatch, loggedIn]);
    
    // const pathMathRoute = (route) => {
    //     return route === location.pathname;
    // }


    const auth = getAuth();
    const onLogout = () => {
        dispatch({
            type: "SET_LOGIN",
            payload: false,
        });
        auth.signOut().then(navigate("/sign-in"));

    };


    return (
<>

        {/*<footer className={"nav-wrapper"}>*/}
        {/*    <nav className={"navbar"}>*/}
        {/*        <ul className={"nav-items"}>*/}
        {/*            <li className={"nav-item"} onClick={() => navigate("/")}>*/}
        {/*                <ExploreIcon fill={pathMathRoute("/") ? "black" : "#8f8f8f"} width={"36px"} height={"36px"}/>*/}
        {/*                <p className={pathMathRoute("/") ? "nav-item-name-active" : "nav-item-name"}>Explore</p>*/}
        {/*            </li>*/}
        {/*            <li className={"nav-item"} onClick={() => navigate("/offers")}>*/}
        {/*                <OfferIcon fill={pathMathRoute("/offers") ? "black" : "#8f8f8f"} width={"36px"} height={"36px"}/>*/}
        {/*                <p className={pathMathRoute("/offers") ? "nav-item-name-active" : "nav-item-name"}>Offers</p>*/}
        {/*            </li>*/}
        {/*            <li className={"nav-item"} onClick={() => navigate("/profile")}>*/}
        {/*                <PersonOutlineIcon fill={pathMathRoute("/profile") ? "black" : "#8f8f8f"} width={"36px"} height={"36px"}/>*/}
        {/*                <p className={pathMathRoute("/profile") ? "nav-item-name-active" : "nav-item-name"}>Profile</p>*/}
        {/*            </li>*/}
        {/*        </ul>*/}
        {/*    </nav>*/}
        {/*</footer>*/}

        <div className="navbar bg-base-100 shadow-md">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200  rounded-box w-52">
                        <li><Link to={"/offers"}>Offers </Link></li>
                        <li><Link to={"/"}>Explore</Link></li>
                    </ul>
                </div>
                <span className="btn btn-ghost normal-case text-xl">ExoticsUI</span>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to={"/offers"}>Offers </Link></li>
                    <li><Link to={"/"}>Explore</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img src="https://p1.hiclipart.com/preview/444/382/414/frost-pro-for-os-x-icon-set-now-free-contacts-male-profile-png-clipart-thumbnail.jpg" alt={"default"} />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
                        {
                            isLoggedIn ? <li>
                                <Link to={"/profile"} className="justify-between">
                                    My Profile
                                    {/*<span className="badge">New</span>*/}
                                </Link>
                            </li> : ""
                        }

                        {
                            isLoggedIn ? <li><span onClick={onLogout}>Logout</span></li> :
                                <li><Link to={"/sign-in"}>Login</Link></li>
                        }

                    </ul>
                </div>
            </div>
        </div>
</>
    );
};

export default Navbar;