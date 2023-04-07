import React from 'react';
import { Link } from "react-router-dom";
import Slider from "../components/Slider";

const Explore = () => {
    return (
        <div className={"lg:mx-24 xl:mx-48 2xl:mx-96 bg-white min-h-screen"}>
            <main>
                <div className={""}>
                    <Slider/>
                </div>
                <div className={"bg-white h-96 rounded-bl-2xl rounded-br-2xl"}>
                    <div className={"pt-6 lg:pt-12 lg:pb-6 mb-6 flex justify-center"}>
                        <h1 className="text-xl lg:text-2xl">To get started, select a category to view.</h1>
                    </div>
                    <div className="flex flex-col lg:flex-row mx-8 sm:mx-12">
                        <Link to={"/category/rent"} className="grid flex-grow h-24 lg:h-32 card bg-purple-600 rounded-box place-items-center">
                            <h1 className="text-3xl font-bold text-white">
                                Rent
                            </h1>
                        </Link>
                        <div className="divider lg:divider-horizontal">OR</div>
                        <Link to={"/category/sale"} className="grid flex-grow h-24 lg:h-32 card bg-green-400 rounded-box place-items-center">
                            <h1 className="text-3xl font-bold text-slate-800">
                                Buy
                            </h1>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Explore;