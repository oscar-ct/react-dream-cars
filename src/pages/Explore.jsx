import React from 'react';
import Slider from "../components/Slider";

const Explore = () => {
    return (
        <div className={"2xl:mx-48 bg-white min-h-screen"}>
            <main>

                    <div className={"pb-8 md:py-10 flex justify-center"}>
                        <h1 className="text-3xl font-light text-center text-blue-400">To get started, select a category to view.</h1>
                    </div>
                <Slider/>

            </main>
        </div>
    );
};

export default Explore;