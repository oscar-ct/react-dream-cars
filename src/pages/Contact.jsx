import React, {useContext} from 'react';
import { useEffect, useState } from "react";
import {useParams, useSearchParams} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";


const Contact = () => {

    const [message, setMessage] = useState("");
    const [owner, setOwner] = useState(null);
    const [searchParams] = useSearchParams();
    const params = useParams();
    const {randomFact} = useContext(AuthContext);

    useEffect(function () {
        const getOwner = async () => {
            const docRef = doc(db, "users", params.ownerId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setOwner(docSnap.data())
                // console.log(docSnap.data())
            } else {
                toast.error("Something went wrong, this user no longer exists")
            }
            // console.log(searchParams.get("listingName"));
            // console.log(params)
        }
        getOwner();
    }, [params.ownerId]);

    const onChange = (e) => {

        setMessage(e.target.value);
    }

    return (

<>

        <div className="bg-no-repeat bg-cover bg-center relative" style={{background: "url(https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)"}}>
            <div className="absolute bg-gradient-to-b from-blue-500 to-blue-400 opacity-75 inset-0 z-0">
            </div>
            <div className="min-h-screen flex flex-row mx-4 sm:mx-12 justify-center">
                <div className="flex-col flex self-center  sm:max-w-5xl xl:max-w-2xl  z-10">
                    <div className="self-start hidden lg:flex flex-col  text-white">
                        <img src="" className="mb-3" alt={""}/>
                        <div className={"w-9/12"}>
                            <h1 className="mb-3 font-bold text-5xl">Contact Owner
                            </h1>
                            <p className="pr-3 font-bold">Fun fact of the day: <span className={"pl-1 font-light"}>{randomFact !== undefined && randomFact}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full md:w-7/12 flex justify-center self-center z-10">
                    {owner !== null && (
                        <div className="p-12 bg-white mx-auto rounded-2xl sm:w-96 w-full">
                            <div className="mb-4 flex flex-col justify-center">
                                <h3 className="font-semibold text-2xl text-gray-800">Message
                                </h3>
                                <p className="text-gray-500 font-light">Vehicle Owner's Name: { owner && <span className={"font-normal text-primary"}>{owner?.name}</span>}
                                </p>
                            </div>
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label htmlFor={"subject"} className="text-sm font-medium text-gray-700 tracking-wide">Subject
                                    </label>
                                    <input
                                        className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"off"}
                                        type={"email"}
                                        placeholder={"mail@hotmail.com"}
                                        id={"email"}
                                        value={searchParams.get("listingName")}
                                        onChange={onChange}
                                        required
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor={"subject"} className="text-sm font-medium text-gray-700 tracking-wide">Email
                                    </label>
                                    <textarea
                                        className="w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                                        autoComplete={"off"}
                                        type={"text"}
                                        placeholder={"Type message here"}
                                        id={"message"}
                                        value={message}
                                        onChange={onChange}
                                        required
                                        rows={10}
                                        name={"message"}
                                    />
                                </div>


                                <div>
                                    <a href={`mailto:${owner?.email}?Subject=${searchParams.get("listingName")}&body=${message}`}>
                                        <button type="submit" className="w-full flex justify-center bg-blue-400  hover:bg-blue-500 text-gray-100 p-3  rounded tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500">
                                        Send Message
                                        </button>
                                    </a>
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
    );

};

export default Contact;