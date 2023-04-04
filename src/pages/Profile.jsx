import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from "firebase/firestore";
import { db } from "../firebase.config";
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
import homeIcon from "../assets/svg/homeIcon.svg"
import ListingItem from "../components/ListingItem";
import {toast} from "react-toastify";


const Profile = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const[changeDetails, setChangeDetails] = useState(false);
    const[loading, setLoading] = useState(true);
    const[listingsState, setListingsState] = useState(null);

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;


    useEffect(function () {
        const fetchUserListings = async () => {
            const listingRef = collection(db, "listings");
            const q = query(listingRef, where("userRef", "==", auth.currentUser.uid), orderBy("timestamp", "desc"));
            const data = await getDocs(q);
            const listings = [];
            data.forEach(function (doc) {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListingsState(listings);
            setLoading(false);
        }
        fetchUserListings();
    }, [auth.currentUser.uid])


    const onLogout = () => {
        auth.signOut().then(navigate("/sign-in"));
    };

    const submitChangeDetails = async () => {
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, {
                    displayName: name,
                });
                const userReference = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userReference, {
                    name: name,
                });
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    const onChangePersonalDetails = (e) => {
        setFormData(prevState => {
            return {
                ...prevState,
                [e.target.id]: e.target.value,
            };
        });
    };
    
    const deleteListing = async (listingId, title) => {
        if (window.confirm(`Are you sure you want to delete ${title}`)) {
            const docRef = doc(db, "listings", listingId);
            await deleteDoc(docRef);
            const updatedListings = listingsState.filter(function (listing) {
                return listing.id !== listingId;
            });
            setListingsState(updatedListings);
            toast.success("Successfully deleted listing");
        }
    };


    return (
        <div className={"profile"}>
            <header className={"profile-header"}>
                <p className={"page-header"}>My Profile</p>
                <button type={"button"} className={"logout"} onClick={onLogout}>
                    Logout
                </button>
            </header>
            <main>
                <div className={"profile-details-header"}>
                    <p className={"personal-details-text"}>Personal Details</p>
                    <p className={"change-personal-details"} onClick={() => {
                        changeDetails && submitChangeDetails();
                        setChangeDetails(prevState => !prevState);
                    }}>{changeDetails ? "Done" : "Change"}
                    </p>
                </div>
                <div className={"profile-card"}>
                    <form>
                        <input
                            type={"text"}
                            id={"name"}
                            className={!changeDetails ? "profile-name" : "profile-name-active"}
                            disabled={!changeDetails}
                            value={name}
                            onChange={onChangePersonalDetails}
                        />
                        <input
                            type={"text"}
                            id={"email"}
                            className={!changeDetails ? "profile-email" : "profile-email-active"}
                            disabled={true}
                            value={email}
                            onChange={onChangePersonalDetails}
                        />
                    </form>
                </div>

                <Link to={"/create-listing"} className={"create-listing"}>
                    <img src={homeIcon} alt={"home"}/>
                    <p>Sell or rent your vehicle</p>
                    <img src={arrowRight} alt={"right arrow"}/>
                </Link>

                {!loading && listingsState?.length > 0 ? (
                    <>
                        <p>Your Listings</p>
                        <ul>
                            {listingsState.map(function (listing) {
                                return <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => deleteListing(listing.id, listing.data.name)}/>
                            })}
                        </ul>
                    </>
                ) : <p>You have no listings yet</p>}

            </main>
        </div>
    );

};

export default Profile;