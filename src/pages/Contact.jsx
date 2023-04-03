import React from 'react';
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const Contact = () => {

    const [message, setMessage] = useState("");
    const [owner, setOwner] = useState(null);
    const [searchParams] = useSearchParams();
    const params = useParams();

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
        <div className={"page-container"}>
            <header className={"page-header"}>
                <p>Contact Owner</p>
            </header>
            {owner !== null && (
                <main>
                    <div className={"contact-owner"}>
                        <p className={"owner-name"}>Contact {owner?.name}</p>
                    </div>
                    <form className={"message-form"}>
                        <div className={"message-div"}>
                            <label htmlFor={"subject"} className={"message-label"}>
                                Subject
                            </label>
                            <input
                            type={"text"}
                            className={"subject-input"}
                            value={searchParams.get("listingName")}
                            disabled
                            />
                            <label htmlFor={"message"} className={"message-label"}>
                                Message
                            </label>
                            <textarea name={"message"} id={"message"} value={message} onChange={onChange} className={"message-textarea"}/>
                        </div>
                        <a href={`mailto:${owner?.email}?Subject=${searchParams.get("listingName")}&body=${message}`}>
                            <button type={"button"} className={"primary-button"}>Send Message</button>
                        </a>
                    </form>
                </main>
            )}
        </div>
    );

};

export default Contact;