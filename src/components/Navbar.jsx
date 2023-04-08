import React, {useEffect, useState} from 'react';
import {useNavigate, Link} from "react-router-dom";
// import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
// import { ReactComponent as ExploreIcon} from "../assets/svg/exploreIcon.svg";
// import { ReactComponent as PersonOutlineIcon} from "../assets/svg/personIcon.svg";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase.config";



const Navbar = () => {


    const navigate = useNavigate();
    // const location = useLocation();

    const [url, setUrl] = useState("https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png");
    const [isSignedIn, setIsSignedIn] = useState(false);


    useEffect(function() {

        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/firebase.User
                // const uid = user.uid;
                // ...
                getAuthUser();
            } else {
                setIsSignedIn(false);
            }
        });

        const getAuthUser = async () => {
            const userRef = doc(db, "users", auth.currentUser.uid);
            const fetchUser = await getDoc(userRef);
            setUrl(fetchUser.data().profileUrl);
            setIsSignedIn(true);
        }
        console.log("using getAuthUser from nav useEffect")
    }, [])
    
    // const pathMathRoute = (route) => {
    //     return route === location.pathname;
    // }


    const auth = getAuth();
    const onLogout = () => {
        setUrl("https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png");
        setIsSignedIn(false);
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

        {/*<div className="navbar bg-base-100 shadow-md">*/}
        <div className={"navbar sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/95 supports-backdrop-blur:bg-white/60 dark:bg-transparent"}>
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
                    <li><Link to={"/offers"}>Special Offers</Link></li>
                    <li><Link to={"/"}>Explore</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">

                            <img src={url} alt={"profile"} />
                        </div>
                    </label>
                    <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">

                        {
                            isSignedIn ? <li>
                                <Link to={"/profile"} className="justify-between">
                                    My Profile
                                    {/*<span className="badge">New</span>*/}
                                </Link>
                            </li> : ""
                        }

                        {
                            isSignedIn ? <li><span onClick={() => onLogout()}>Logout</span></li> :
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