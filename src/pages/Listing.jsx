import { useState, useEffect } from 'react';
import { Link, useParams  } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"
// import shareIcon from "../assets/svg/shareIcon.svg"
import MapContainer from "../components/MapContainer";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);



const Listing = () => {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [shareLinkCopied, setShareLinkCopied] = useState(false);
    const [userData, setUserData] = useState({
        username: "",
        userProfileUrl: "",
    });
    // const [userDataExists, setUserDataExists] = useState(false);

    // const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();



    useEffect(function() {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            const listingData = docSnap.data();
            if (docSnap.exists()) {
                setListing(listingData);
                const userRef = doc(db, "users", listingData.userRef);
                const fetchUser = await getDoc(userRef);
                const userData = fetchUser.data();
                if (fetchUser.exists()) {
                    setUserData(prevState => {
                        return {
                            ...prevState,
                            username: userData.name,
                            userProfileUrl: userData.photoUrl,
                        }
                    });
                    // setUserDataExists(true);
                    setLoading(false);
                }
            }
        }
        fetchListing();
    }, [params.listingId]);


    if (listing !== null) {
        const date = new Date(listing.timestamp.seconds*1000);
        const dateStr = date.toDateString();
        const dateArr = dateStr.toString().split(" ");
        dateArr.shift();
        var customDateStr = dateArr.join(" ");
    }




    if (loading) {
        return <h1>Loading...</h1>

    } else {

        const { userRef, name, offer, discountedPrice, regularPrice, location, type, year, make, model, mileage, geolocation, imageUrls } = listing;

            return (
                <main className={"2xl:px-48"}>
                    {auth.currentUser?.uid !== userRef && (
                    <div className="alert shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info flex-shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <div>
                                <h3 className="font-bold">Interested? Message the owner now before its gone!</h3>
                                {/*<div className="text-xs">985 views</div>*/}
                            </div>
                        </div>
                        <div className="flex-none">
                            <Link to={`/contact/${userRef}?listingName=${name}`} className="btn btn-sm">Message</Link>
                        </div>
                    </div>
                    )}

                    <p className={"text-3xl my-6 lg:my-6 font-light text-center text-blue-400"}>
                        {name}
                    </p>

                    <Swiper slidesPerView={1} pagination={{clickable: true}} navigation>
                        {imageUrls.map(function(url, index) {
                            return  ( <SwiperSlide key={index}>
                               <div className={"swiper-slide-div"}>
                                   <img className={"swipe-img"} src={imageUrls[index]} alt={"vehicle"}/>
                               </div>

                            </SwiperSlide> )
                        })}
                    </Swiper>

                    <div className={"w-full lg:py-6 flex flex-col justify-center lg:px-6"}>
                        {/*<div className={"shadow rounded"}>*/}
                            <div className="stats bg-base lg:bg-neutral-200 flex flex-col lg:flex lg:flex-row stats shadow rounded">
                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        <div className="avatar online">
                                            <div className="w-16 rounded-full">
                                                <img src={userData.userProfileUrl} alt={"profile"} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-xl lg:text-3xl">{customDateStr}</div>
                                    <div className="stat-title">Date Posted</div>
                                    <div className="stat-desc text-primary">985 views</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>*/}
                                    </div>
                                    <div className="stat-title">{ type === "rent" ? "Daily Rate" : "List Price"}{offer && <span className={"pl-2 text-xs"}>(Discounted)</span>}</div>
                                    <div className="font-bold text-xl lg:text-3xl">${offer ? discountedPrice : regularPrice}</div>
                                    {
                                        offer &&   <div className="stat-desc text-red-600 ">Original price: <span className={"line-through"}>${regularPrice}</span></div>
                                    }

                                </div>
                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>*/}
                                    </div>
                                    <div className="stat-title">Address</div>
                                    <div className="font-bold text-xl lg:text-xl">{location}</div>
                                    {/*<div className="stat-desc">{location}</div>*/}
                                </div>
                            </div>
                            <div className={"stats flex bg-base lg:bg-neutral-200 flex-col lg:flex lg:flex-row stats shadow rounded"}>
                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>*/}
                                    </div>
                                    <div className="stat-title">Year</div>
                                    <div className="font-bold text-xl lg:text-3xl">{year}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>*/}
                                    </div>
                                    <div className="stat-title">Make</div>
                                    <div className="font-bold text-xl lg:text-3xl">{make}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>*/}
                                    </div>
                                    <div className="stat-title">Model</div>
                                    <div className="font-bold text-xl lg:text-3xl">{model}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-figure text-secondary">
                                        {/*<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>*/}
                                    </div>
                                    <div className="stat-title">Mileage</div>
                                    <div className="font-bold text-xl lg:text-3xl">{mileage}</div>
                                    {
                                       mileage < 10000 &&  <div className="stat-desc text-primary">Low miles!</div>
                                    }

                                </div>
                            </div>
                        {/*</div>*/}
                    </div>


                    {/*<div className={"share-icon-div"} onClick={() => {*/}
                    {/*    navigator.clipboard.writeText(window.location.href);*/}
                    {/*    setShareLinkCopied(true);*/}
                    {/*    setTimeout(function () {*/}
                    {/*        setShareLinkCopied(false)*/}
                    {/*    }, 2000)*/}
                    {/*}}>*/}
                    {/*    <img src={shareIcon} alt={"share"}/>*/}
                    {/*</div>*/}

                    {/*{shareLinkCopied && (*/}
                    {/*    <p className={"link-copied"}>Link Copied!</p>*/}
                    {/*)}*/}

                    {/*<div className={"listing-details"}>*/}
                    {/*    <p className={"listing-name"}>*/}
                    {/*        {name} - ${offer ? discountedPrice : regularPrice}*/}
                    {/*    </p>*/}
                    {/*    <p className={"listing-location"}>*/}
                    {/*        {location}*/}
                    {/*    </p>*/}
                    {/*    <p className={"listing-type"}>*/}
                    {/*        For {type === "rent" ? "Rent" : "Sale"}*/}
                    {/*    </p>*/}
                    {/*    {offer && (*/}
                    {/*        <p className={"discount-price"}>*/}
                    {/*            ${regularPrice - discountedPrice} discount*/}
                    {/*        </p>*/}
                    {/*    )}*/}
                    {/*    <ul className={"listing-details-list"}>*/}
                    {/*        <li>*/}
                    {/*            <span className={"li-span"}>Year</span> {year}*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <span className={"li-span"}>Make</span> {make}*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <span className={"li-span"}>Model</span> {model}*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <span className={"li-span"}>Mileage</span> {mileage}*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*    <p className={"listing-location-title"}>*/}
                    {/*        Location*/}
                    {/*    </p>*/}

                    <div>
                        <div className={"mapbox-container"}>
                           <MapContainer lat={geolocation.lat} lon={geolocation.lon} location={location}/>
                        </div>

                        {/*{auth.currentUser?.uid !== userRef && (*/}
                        {/*    <Link to={`/contact/${userRef}?listingName=${name}`} className={"primary-button"}>*/}
                        {/*        Contact Owner*/}
                        {/*    </Link>*/}
                        {/*)}*/}
                    </div>

                </main>
        );
    }
};

export default Listing;