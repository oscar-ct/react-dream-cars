import React from 'react';
import { Link } from "react-router-dom";
import Slider from "../components/Slider";

const Explore = () => {
    return (
        <div className={"explore"}>
            <header>
                <p className={"page-header"}>Explore</p>
            </header>

            <main>
                <Slider/>
                <p className={"explore-category-heading"}>Categories</p>
                <div className={"explore-categories"}>
                    <Link to={"/category/rent"}>
                        <img
                            className={"explore-category-img"}
                            src={"https://images.unsplash.com/photo-1592198084033-aade902d1aae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"}
                             alt={"rent"}/>
                        <p className={"explore-category-name"}>
                            Vehicles for rent
                        </p>
                    </Link>
                    <Link to={"/category/sale"}>
                        <img
                            className={"explore-category-img"}
                            src={"https://images.unsplash.com/photo-1551501438-e61a59a1fd75?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=929&q=80"}
                            alt={"sale"}
                        />
                        <p className={"explore-category-name"}>
                            Vehicles for sale
                        </p>
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default Explore;