import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ListingItem from "../components/ListingItem";

const Offers = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(function() {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, "listings");
                const q = query(listingsRef, where("offer", "==", true), orderBy("timestamp", "desc"), limit(10));
                const querySnap = await getDocs(q);
                let listings = [];
                querySnap.forEach(function (doc) {
                    return listings.push({
                        id: doc.id,
                        data: doc.data(),
                    })
                });
                setListings(listings);
                setLoading(false);
            } catch (e) {
                toast.error("Could not fetch listings");
            }
        }
        fetchListings();
    }, []);
    return (
        <div className={"category"}>
            <header className={"page-header"}>
                <p>
                    Offers
                </p>
            </header>
            {loading ?
                <h1>Loading...</h1>
                : listings && listings.length > 0 ?
                    <>
                        <main>
                            <ul className={"category-listings"}>
                                {listings.map(function (listing) {
                                        return <ListingItem key={listing.id} listing={listing.data} id={listing.id}/>
                                    }
                                )}
                            </ul>
                        </main>
                    </>
                    :
                    <p>
                        There are no current offers
                    </p>
            }
        </div>
    );
};

export default Offers;