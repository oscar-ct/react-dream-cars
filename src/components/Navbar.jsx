import React from 'react';
import { useNavigate, useLocation} from "react-router-dom";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExploreIcon} from "../assets/svg/exploreIcon.svg";
import { ReactComponent as PersonOutlineIcon} from "../assets/svg/personIcon.svg";

const Navbar = () => {

    const navigate = useNavigate;
    return (

        // this is mobile first layout
        <footer className={"nav-wrapper"}>
            <nav className={"navbar"}>
                <ul className={"nav-items"}>
                    <li className={"nav-item"}>
                        <ExploreIcon fill={"black"} width={"36px"} height={"36px"}/>
                        <p>Explore</p>
                    </li>
                    <li className={"nav-item"}>
                        <OfferIcon fill={"black"} width={"36px"} height={"36px"}/>
                        <p>Offer</p>
                    </li>
                    <li className={"nav-item"}>
                        <PersonOutlineIcon fill={"black"} width={"36px"} height={"36px"}/>
                        <p>Profile</p>
                    </li>
                </ul>
            </nav>
        </footer>
    );
};

export default Navbar;