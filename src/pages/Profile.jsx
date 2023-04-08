import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from "firebase/firestore";
import { db } from "../firebase.config";
import plusIcon from "../assets/svg/icons8-add-new-100.png"
import ListingItem from "../components/ListingItem";
import {toast} from "react-toastify";



const Profile = () => {

    const[changeDetails, setChangeDetails] = useState(false);
    const[loading, setLoading] = useState(true);
    const[listingsState, setListingsState] = useState(null);

    const auth = getAuth();
    const navigate = useNavigate();

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

    const editListingNav = (listingId) => {
        navigate(`/edit-listing/${listingId}`)
    }

    const onClick = () => {
        changeDetails && submitChangeDetails();
        setChangeDetails(prevState => !prevState);
    }


    return (

        <div className={"mt-4 lg:mt-12"}>
            {/*<div className={"profile"}>*/}
            {/*    <header className={"profile-header"}>*/}
            {/*        <p className={"page-header"}>My Profile</p>*/}
            {/*        <button type={"button"} className={"logout"} onClick={onLogout}>*/}
            {/*            Logout*/}
            {/*        </button>*/}
            {/*    </header>*/}
            {/*    <main>*/}
            {/*        <div className={"profile-details-header"}>*/}
            {/*            <p className={"personal-details-text"}>Personal Details</p>*/}
            {/*            <p className={"change-personal-details"} onClick={() => {*/}
            {/*                changeDetails && submitChangeDetails();*/}
            {/*                setChangeDetails(prevState => !prevState);*/}
            {/*            }}>{changeDetails ? "Done" : "Change"}*/}
            {/*            </p>*/}
            {/*        </div>*/}
            {/*        <div className={"profile-card"}>*/}
            {/*            <form>*/}
            {/*                <input*/}
            {/*                    type={"text"}*/}
            {/*                    id={"name"}*/}
            {/*                    className={!changeDetails ? "profile-name" : "profile-name-active"}*/}
            {/*                    disabled={!changeDetails}*/}
            {/*                    value={name}*/}
            {/*                    onChange={onChangePersonalDetails}*/}
            {/*                />*/}
            {/*                <input*/}
            {/*                    type={"text"}*/}
            {/*                    id={"email"}*/}
            {/*                    className={!changeDetails ? "profile-email" : "profile-email-active"}*/}
            {/*                    disabled={true}*/}
            {/*                    value={email}*/}
            {/*                    onChange={onChangePersonalDetails}*/}
            {/*                />*/}
            {/*            </form>*/}
            {/*        </div>*/}

            {/*        <Link to={"/create-listing"} className={"create-listing"}>*/}
            {/*            <img src={homeIcon} alt={"home"}/>*/}
            {/*            <p>Sell or rent your vehicle</p>*/}
            {/*            <img src={arrowRight} alt={"right arrow"}/>*/}
            {/*        </Link>*/}

            {/*        {!loading && listingsState?.length > 0 ? (*/}
            {/*            <>*/}
            {/*                <p>Your Listings</p>*/}
            {/*                <div className={"flex justify-center"}>*/}
            {/*                    {listingsState.map(function (listing) {*/}
            {/*                        return <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => deleteListing(listing.id, listing.data.name)} onEdit={() => editListingNav(listing.id)}/>*/}
            {/*                    })}*/}
            {/*                </div>*/}
            {/*            </>*/}
            {/*        ) : <p>You have no listings yet</p>}*/}

            {/*    </main>*/}
            {/*</div>*/}

                <main className={"flex flex-col"}>

                    <div>
                        <div className={"flex flex-col w-full px-4 sm:px-12"}>
                            <p className={"text-3xl text-blue-400 font-light"}>Account Details</p>
                            <div className={"my-10 flex justify-between"}>
                                <p className={"text-md text-zinc-400 font-light"}>Click the edit icon to update account details.</p>
                                {!changeDetails ?
                                    <button className={"btn btn-primary btn-xs sm:btn-sm"} onClick={() => {onClick()}}>Edit</button>
                                    // <EditIcon style={{cursor: "pointer"}} className={"mt-3 mr-3 mb-1"} fill={"neutral"} />
                                    :
                                    <button className="btn btn-success btn-xs sm:btn-sm" onClick={() => {onClick()}}>Save</button>
                                }
                            </div>
                            <div className="flex items-center">

                                <div className={"w-2/6 sm:w-3/6 flex flex-col"}>
                                    <div className={"flex justify-end py-6 pr-6"}>
                                        <p className={"text-sm sm:text-base"}>Account Name:</p>
                                    </div>
                                    <div className={"flex justify-end py-6 pr-6"}>
                                        <p className={"text-sm sm:text-base"}>Email:</p>
                                    </div>
                                    <div className={"flex justify-end py-6 pr-6"}>
                                        <p className={"text-sm sm:text-base"}>Profile Picture:</p>
                                    </div>
                                </div>
                                <div className="w-4/6 sm:w-3/6 flex flex-col">
                                    <div className={"flex justify-start p-3"}>
                                        <input
                                            autoComplete={"off"}
                                            type={"text"}
                                            id={"name"}
                                            className={!changeDetails ? "input input-primary w-full max-w-xs text-sm sm:text-base" : " text-sm sm:text-base input input-primary w-full max-w-xs"}
                                            disabled={!changeDetails}
                                            value={name}
                                            onChange={onChangePersonalDetails}
                                        />
                                    </div>

                                    <div className={"flex justify-start p-3"}>
                                        <input
                                            autoComplete={"off"}
                                            type={"text"}
                                            id={"email"}
                                            className={!changeDetails ? "input input-primary w-full max-w-xs text-sm sm:text-base" : " text-sm sm:text-base input input-primary w-full max-w-xs"}
                                            disabled={true}
                                            value={email}
                                            onChange={onChangePersonalDetails}
                                        />
                                    </div>
                                    <div className={"flex justify-start p-3"}>
                                        <input
                                            autoComplete={"off"}
                                            type={"file"}
                                            accept={".jpg,.png,.jpeg"}
                                            id={"image"}
                                            disabled={!changeDetails}
                                            className={"file-input file-input-bordered file-input-primary w-full max-w-xs text-sm sm:text-base"}
                                            // value={email}
                                            onChange={onChangePersonalDetails}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className={"my-5 w-full px-4 sm:px-12"}>
                        <p className={"text-3xl text-blue-400 font-light"}>My Listings</p>
                    </div>
                    <div className={"flex flex-col items-center"}>
                        {!loading && listingsState?.length > 0 ? (
                            <>
                                <div className={"flex flex-col lg:flex-row lg:justify-center w-full items-center"}>

                                    <div className={"flex justify-center flex-wrap"}>
                                        <Link to={"/create-listing"} className="grid w-11/12 md:w-9/12 lg:w-96 h-20 lg:h-auto card bg-base-300 rounded-box place-items-center m-2 shadow-lg">
                                            <img className={"h-8 lg:h-14"} src={plusIcon} alt={"plus"}/>
                                        </Link>
                                    {listingsState.map(function (listing) {
                                        return <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => deleteListing(listing.id, listing.data.name)} onEdit={() => editListingNav(listing.id)}/>
                                    })}
                                    </div>
                                </div>
                            </>
                        ) : <>
                            <div className={"mt-5"}>
                                <p className={"text-lg font-bold"}>No listings</p>
                            </div>
                            <div className={"flex flex-col lg:flex-row lg:justify-center w-full items-center"}>
                                <div className={"flex justify-center flex-wrap"}>
                                    <Link to={"/create-listing"} className="grid w-96 h-96  card bg-base-300 rounded-box place-items-center m-2 shadow-lg">
                                    <img className={"h-8 lg:h-14"} src={plusIcon} alt={"plus"}/>
                                    </Link>
                                </div>
                            </div>
                        </>
                        }
                    </div>

                </main>

        </div>
    );

};

export default Profile;