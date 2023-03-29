import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

const Category = () => {

    const [listings, setListings] = useState(null);
    const [loading, setLoading] = useState(true);

    const params = useParams();

    useEffect(function() {
        const fetchListings = async () => {
            try {
                const listingsRef = collection(db, "listings");
                const q = query(listingsRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(10));
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
    }, [params.categoryName]);
    return (
        <div>
            <header>
                <p>
                    {params.categoryName === "rent" ? "Vehicles for rent" : "Vehicles for sale"}
                </p>
            </header>
            {loading ? <h1>Loading...</h1> : listings && listings.length > 0 ?
            <>
                <main>
                    <ul>
                        {listings.map(function (listing) {
                                return <h3 key={listing.id}>{listing.data.name}</h3>
                            }
                        )}
                    </ul>
                </main>
            </> : <p>
                No listings for {params.categoryName}
            </p>}
        </div>
    );
};

export default Category;