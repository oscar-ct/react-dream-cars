import React from 'react';
import { useNavigate, useLocation} from "react-router-dom";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon} from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon} from "../assets/svg/personIcon.svg";

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const pathMathRoute = (route) => {
        return route === location.pathname;
    }
    
    return (

        // this is mobile first layout
        <footer className={"nav-wrapper"}>
            <nav className={"navbar"}>
                <ul className={"nav-items"}>
                    <li className={"nav-item"} onClick={() => navigate("/")}>
                        <ExploreIcon fill={pathMathRoute("/") ? "black" : "#8f8f8f"} width={"36px"} height={"36px"}/>
                        <p className={pathMathRoute("/") ? "nav-item-name-active" : "nav-item-name"}>Explore</p>
                    </li>
                    <li className={"nav-item"} onClick={() => navigate("/offers")}>
                        <OfferIcon fill={pathMathRoute("/offers") ? "black" : "#8f8f8f"} width={"36px"} height={"36px"}/>
                        <p className={pathMathRoute("/offers") ? "nav-item-name-active" : "nav-item-name"}>Offers</p>
                    </li>
                    <li className={"nav-item"} onClick={() => navigate("/profile")}>
                        <PersonOutlineIcon fill={pathMathRoute("/profile") ? "black" : "#8f8f8f"} width={"36px"} height={"36px"}/>
                        <p className={pathMathRoute("/profile") ? "nav-item-name-active" : "nav-item-name"}>Profile</p>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Navbar;