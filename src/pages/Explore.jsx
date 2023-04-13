import React from 'react';
import Slider from "../components/Slider";
import {useNavigate} from "react-router-dom";

const Explore = () => {

    const navigate = useNavigate();

    return (
        <div className={"2xl:mx-48 min-h-screen"}>
            <main className={"explore-bg min-h-screen"}>

                    {/*<div className={"py-3  md:py-10 flex justify-center"}>*/}
                    {/*    <h1 className="text-3xl text-center text-blue-400">To get started, select a category to view.</h1>*/}
                    {/*</div>*/}

                    <div className={"bg-black/80 lg:h-[32rem] flex flex-col"}>
                        <div className={"flex px-4 lg:px-12 py-12 h-full flex-col items-center justify-center lg:items-start text-white w-full lg:w-8/12"}>
                            <h1 className="text-4xl md:text-6xl">Making your dreams come true</h1>
                            <p className={"mt-4 text-lg font-light lg:text-xl leading-8"}>We turn your dream car into a reality by providing you with the driving experience you will never forget. Choose from hundreds of luxurious, fast, prestigious vehicles.</p>
                            <div className={"w-full flex justify-end"}>
                                <div className={"w-4-/12 md:w-6/12 "}/>
                                <div className={"w-8/12 md:w-6/12"}>
                                    <div className={"w-full flex justify-center mt-5 mb-3"}>
                                        <span className={"text-lg font-bold text-center"}>Ready to get behind the wheel?</span>
                                    </div>
                                    <div className={"flex w-full justify-between"}>
                                        <button onClick={() => navigate("/category/sale")} className={"btn px-10"}>buy</button>
                                        <button onClick={() => navigate("/category/rent")} className={"btn px-10"}>rent</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className={"bg-neutral-800 rounded"}>
                        <Slider/>
                    </div>


            </main>
        </div>
    );
};

export default Explore;