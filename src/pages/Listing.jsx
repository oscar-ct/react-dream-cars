import {useState, useEffect, useRef} from 'react';
import { Link, useParams  } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";

import shareIcon from "../assets/svg/shareIcon.svg"
import MapContainer from "../components/MapContainer";



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

        const { userRef, name, offer, discountedPrice, regularPrice, location, type, year, make, model, mileage, geolocation} = listing;

            return (
                <main>
                    Listing
                    <div onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShareLinkCopied(true);
                        setTimeout(function () {
                            setShareLinkCopied(false)
                        }, 2000)
                    }}>
                        <img src={shareIcon} alt={"share"}/>
                    </div>

                    {shareLinkCopied && (
                        <p>Link Copied!</p>
                    )}

                    <div>
                        <p>
                            {name} - ${offer ? discountedPrice : regularPrice}
                        </p>
                        <p>
                            {location}
                        </p>
                        <p>
                            For {type === "rent" ? "Rent" : "Sale"}
                        </p>
                        {offer && (
                            <p>
                                ${regularPrice - discountedPrice} discount
                            </p>
                        )}
                        <ul>
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
                        <p>
                            Location
                        </p>


                        <div className={"mapbox-container"}>
                           <MapContainer lat={geolocation.lat} lon={geolocation.lon} location={location}/>
                        </div>

                        {auth.currentUser?.uid !== userRef && (
                            <Link to={`/contact/${userRef}?listingName=${name}`}>
                                Contact Owner
                            </Link>
                        )}
                    </div>

                </main>
        );
    }
};

export default Listing;