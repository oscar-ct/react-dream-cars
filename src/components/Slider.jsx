import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


const Slider = () => {

    const [loading, setLoading] = useState(true);
    const [listingsState, setListingsState] = useState(null);

    const navigate = useNavigate();

    useEffect(function () {
        const getListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
            const querySnap = await getDocs(q);
            console.log(querySnap)
            let listings = [];

            querySnap.forEach(function(doc) {
               return  listings.push({
                  id: doc.id,
                  data: doc.data(),
               });
            });
            setListingsState(listings);
            setLoading(false);
        }
        getListings();
    }, []);


    if (loading) {
        return <h1>Loading...</h1>
    }

    if (listingsState.length === 0) {
        return <></>
    }

    return listingsState && (
        <>
            <p className={"explore-heading"}>Recommended</p>
            <Swiper slidesPerView={1} pagination={{clickable: true}}>
                {listingsState.map(function ({data, id}) {
                    return <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                        <div className={"swiper-slide-div"}>
                            <img src={data.imageUrls[0]} alt={"vehicles"} className={"swipe-img"}/>
                            <p className={"swiper-slide-text"}>{data.name}</p>
                            <p className={"swiper-slide-price"}>
                                ${data.discountedPrice ?? data.regularPrice}
                                {data.type === "rent" && "/ Day"}
                            </p>
                        </div>

                    </SwiperSlide>
                })}
            </Swiper>
        </>
    )
};

export default Slider;