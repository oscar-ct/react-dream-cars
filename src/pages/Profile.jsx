import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import {Link, useNavigate} from "react-router-dom";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc} from "firebase/firestore";
import { db } from "../firebase.config";
// import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg"
// import homeIcon from "../assets/svg/homeIcon.svg"
import plusIcon from "../assets/svg/icons8-add-new-100.png"
import ListingItem from "../components/ListingItem";
import {toast} from "react-toastify";
import { ReactComponent as EditIcon} from "../assets/svg/editIcon.svg";


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


    // const onLogout = () => {
    //     auth.signOut().then(navigate("/sign-in"));
    // };

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

        <div className={"mt-4"}>
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
                        <div className={"flex justify-center"}>
                            <div className="card w-11/12 md:w-9/12 lg:w-1/2 bg-neutral text-neutral-content">
                                <div  className={"flex justify-between"}>
                                    <p className={"w-full pl-8 mt-3 text-center text-lg font-bold"}>Personal Details</p>
                                    <div>
                                    {!changeDetails ?
                                        <EditIcon style={{cursor: "pointer"}} className={"mt-3 mr-3 mb-1"} fill={"white"} onClick={() => {onClick()}}/>
                                        :
                                        <button className="btn btn-primary btn-xs mt-3 mr-3 mb-1" onClick={() => {onClick()}}>done</button>
                                    }
                                    </div>
                                </div>
                                <div className="pt-0 card-body text-center">
                                    <div className={"flex"}>
                                        <label className={"pt-3 pr-1"}>Name:</label>
                                        <input
                                            autoComplete={"off"}
                                            type={"text"}
                                            id={"name"}
                                            className={!changeDetails ? "bg-transparent m-3 w-full" : "input input-ghost w-full max-w-xs"}
                                            disabled={!changeDetails}
                                            value={name}
                                            onChange={onChangePersonalDetails}
                                        />
                                    </div>
                                    <div className={"flex"}>
                                        <label className={"pt-3 pr-1"}>Email:</label>
                                        <input
                                            autoComplete={"off"}
                                            type={"text"}
                                            id={"email"}
                                            className={!changeDetails ? "bg-transparent m-3 w-full" : "input input-ghost w-full max-w-xs text-black"}                                  disabled={true}
                                            value={email}
                                            onChange={onChangePersonalDetails}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className={"flex flex-col items-center"}>
                        {!loading && listingsState?.length > 0 ? (
                            <>
                                <div className={"mt-5"}>
                                    <p className={"text-2xl font-bold"}>My Listings</p>
                                </div>
                                <div className={"flex flex-col lg:flex-row lg:justify-center w-full items-center"}>

                                    <div className={"flex justify-center flex-wrap"}>
                                        <Link to={"/create-listing"} className="grid w-11/12 md:w-9/12 lg:w-96 h-20 lg:h-auto card bg-base-300 rounded-box place-items-center m-2 shadow-xl">
                                            <img className={"h-8 lg:h-14"} src={plusIcon} alt={"plus"}/>
                                        </Link>
                                    {listingsState.map(function (listing) {
                                        return <ListingItem key={listing.id} listing={listing.data} id={listing.id} onDelete={() => deleteListing(listing.id, listing.data.name)} onEdit={() => editListingNav(listing.id)}/>
                                    })}
                                    </div>
                                </div>
                            </>
                        ) : <p>You have no listings yet</p>}
                    </div>

                </main>

        </div>
    );

};

export default Profile;