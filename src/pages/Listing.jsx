import { useState, useEffect } from 'react';
import { Link, useParams  } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"
import shareIcon from "../assets/svg/shareIcon.svg"
import MapContainer from "../components/MapContainer";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);



const Listing = () => {

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);

    // const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();



    useEffect(function() {
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setListing(docSnap.data());
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId]);



    if (loading) {
        return <h1>Loading...</h1>

    } else {

        const { userRef, name, offer, discountedPrice, regularPrice, location, type, year, make, model, mileage, geolocation, imageUrls } = listing;

            return (
                <main>

                    <Swiper slidesPerView={1} pagination={{clickable: true}}>
                        {imageUrls.map(function(url, index) {
                            return  ( <SwiperSlide key={index}>
                               <div className={"swiper-slide-div"}>
                                   <img className={"swipe-img"} src={imageUrls[index]} alt={"vehicle"}/>
                               </div>

                            </SwiperSlide> )
                        })}
                    </Swiper>

                    <div className={"share-icon-div"} onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShareLinkCopied(true);
                        setTimeout(function () {
                            setShareLinkCopied(false)
                        }, 2000)
                    }}>
                        <img src={shareIcon} alt={"share"}/>
                    </div>

                    {shareLinkCopied && (
                        <p className={"link-copied"}>Link Copied!</p>
                    )}

                    <div className={"listing-details"}>
                        <p className={"listing-name"}>
                            {name} - ${offer ? discountedPrice : regularPrice}
                        </p>
                        <p className={"listing-location"}>
                            {location}
                        </p>
                        <p className={"listing-type"}>
                            For {type === "rent" ? "Rent" : "Sale"}
                        </p>
                        {offer && (
                            <p className={"discount-price"}>
                                ${regularPrice - discountedPrice} discount
                            </p>
                        )}
                        <ul className={"listing-details-list"}>
                            <li>
                                {year}
                            </li>
                            <li>
                                {make}
                            </li>
                            <li>
                                {model}
                            </li>
                            <li>
                                {mileage}
                            </li>
                        </ul>
                        <p className={"listing-location-title"}>
                            Location
                        </p>


                        <div className={"mapbox-container"}>
                           <MapContainer lat={geolocation.lat} lon={geolocation.lon} location={location}/>
                        </div>

                        {auth.currentUser?.uid !== userRef && (
                            <Link to={`/contact/${userRef}?listingName=${name}`} className={"primary-button"}>
                                Contact Owner
                            </Link>
                        )}
                    </div>

                </main>
        );
    }
};

export default Listing;