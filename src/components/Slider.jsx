import { useState, useEffect } from 'react';
import {Link, useNavigate} from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


const Slider = () => {

    const [loading, setLoading] = useState(true);
    const [rentalListings, setRentalListings] = useState(null);
    const [saleListings, setSaleListings] = useState(null);

    const navigate = useNavigate();

    useEffect(function () {
        const getListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
            const querySnap = await getDocs(q);

            let rListings = [];
            let sListings = [];

            querySnap.forEach(function(doc) {

                if (doc.data().type === "rent") {
                    rListings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                } else {
                    sListings.push({
                        id: doc.id,
                        data: doc.data(),
                    });
                }

            });
            setSaleListings(sListings);
            setRentalListings(rListings);
            setLoading(false);
        }
        getListings();
    }, []);


    if (loading) {
        return <h1>Loading...</h1>
    }

    if (rentalListings.length === 0) {
        return <></>
    }

    return rentalListings && (
        <div className={"w-full flex flex-col lg:flex-row"}>

            <div className={"w-full lg:w-6/12"}>
                <div className={"flex justify-center"}>
                    <Link to={"/category/rent"} className={"btn btn-primary px-24 my-2"}>
                        Rent
                    </Link>
                </div>
                {/*<div className={"link flex py-1 justify-center bg-purple-400 hover:bg-neutral-focus/50"}>*/}
                {/*    <Link to={"/category/rent"} className={"text-white link"}>Click here to view all our rentals</Link>*/}
                {/*</div>*/}
                <Swiper slidesPerView={1} pagination={{clickable: true}} navigation>
                    {rentalListings.map(function ({data, id}) {
                        return <SwiperSlide key={id}>
                            {/*<div className={"swiper-slide-div"}>*/}
                                {/*<div className={"w-full"}>*/}
                                    {/*<button className="my-0 py-0 indicator-item indicator-middle indicator-center btn bg-purple-400/90 px-8">view all rentals</button>*/}
                                    <img src={data.imageUrls[0]} alt={"vehicles"} className={"lg:h-96 swipe-img"}/>
                                {/*</div>*/}
                                <div className="indicator swiper-slide-text">
                                    <span className="indicator-item badge badge-primary">${data.discountedPrice ?? data.regularPrice}{data.type === "rent" && "/Day"}</span>
                                    <p className={""}>{data.name}</p>
                                </div>

                                <p onClick={() => navigate(`/category/${data.type}/${id}`)} className={"swiper-slide-text-link link"}>Click to view this listing</p>
                            {/*</div>*/}

                        </SwiperSlide>
                    })}
                </Swiper>

            </div>
            <div className={"w-full lg:w-6/12"}>
                <div className={"flex justify-center"}>
                    <Link to={"/category/sale"} className={"btn btn-primary px-24 my-2"}>
                        Buy
                    </Link>
                </div>
                {/*<div className={"link flex py-1 justify-center bg-green-300 hover:bg-neutral-focus/50"}>*/}
                {/*    <Link to={"/category/sale"} className={"text-white link"}>Click here to view all our vehicles for sell</Link>*/}
                {/*</div>*/}
                <Swiper slidesPerView={1} pagination={{clickable: true}} navigation>
                    {saleListings.map(function ({data, id}) {
                        return <SwiperSlide key={id} >
                            {/*<div className="indicator">*/}
                            {/*    <span className="indicator-item indicator-middle indicator-center badge badge-secondary"/>*/}
                            {/*    <div className="grid w-32 h-32 bg-base-300 place-items-center">content</div>*/}
                            {/*</div>*/}

                            {/*<div className={"swiper-slide-div"}>*/}


                                {/*<div className={"w-full"}>*/}
                                    {/*<button className="indicator-item indicator-middle indicator-center btn bg-green-400/90 px-8">rent</button>*/}
                                    <img src={data.imageUrls[0]} alt={"vehicles"} className={"lg:h-96 swipe-img"}/>
                                {/*</div>*/}
                                <div  className="indicator swiper-slide-text">
                                    <span className="indicator-item badge badge-primary">${data.discountedPrice ?? data.regularPrice}{data.type === "rent" && "/Day"}</span>
                                    <p className={""}>{data.name}</p>
                                </div>

                                <p onClick={() => navigate(`/category/${data.type}/${id}`)} className={"swiper-slide-text-link link"}>Click to view this listing</p>

                            {/*</div>*/}

                        </SwiperSlide>

                    })}
                </Swiper>
            </div>
        </div>
    )
};

export default Slider;