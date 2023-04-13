import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);


const Slider = () => {

    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);


    const navigate = useNavigate();

    useEffect(function () {
        const getListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
            const querySnap = await getDocs(q);

            let qListings = [];
            querySnap.forEach(function (doc) {
                qListings.push({
                    id: doc.id,
                    data: doc.data(),
                });
            });
            setListings(qListings);
            setLoading(false);
        }
        getListings();
    }, []);


    if (loading) {
        return <h1>Loading...</h1>
    }

    if (listings.length === 0) {
        return <></>
    }

    return listings && (
        <div className={"w-full flex flex-col lg:flex-row"}>

            <div className={"w-full"}>
                {/*<div className={"link flex py-1 justify-center bg-purple-400 hover:bg-neutral-focus/50"}>*/}
                {/*    <Link to={"/category/rent"} className={"text-white link"}>Click here to view all our rentals</Link>*/}
                {/*</div>*/}
                <Swiper slidesPerView={1} pagination={{clickable: true}} navigation>
                    {listings.map(function ({data, id}) {
                        return <SwiperSlide key={id}>
                            {/*<div className={"swiper-slide-div"}>*/}
                                {/*<div className={"w-full"}>*/}
                                    {/*<button className="my-0 py-0 indicator-item indicator-middle indicator-center btn bg-purple-400/90 px-8">view all rentals</button>*/}
                                    <img src={data.imageUrls[0]} alt={"vehicles"} className={"swipe-img opacity-80"}/>
                                {/*</div>*/}
                                <div onClick={() => navigate(`/category/${data.type}/${id}`)} className="indicator swiper-slide-text">
                                    <span className="text-md lg:text-lg px-4 py-3 indicator-item badge badge-primary">${data.discountedPrice ?? data.regularPrice}{data.type === "rent" && "/Day"}</span>
                                    <p className={""}>{data.name}</p>
                                </div>

                                {/*<p onClick={() => navigate(`/category/${data.type}/${id}`)} className={"swiper-slide-text-link link"}>View this listing</p>*/}
                            {/*</div>*/}

                        </SwiperSlide>
                    })}
                </Swiper>
                {/*<div className={"flex justify-center"}>*/}
                {/*    <Link to={"/category/rent"} className={"btn bg-purple-400 px-12 my-2"}>*/}
                {/*        Rent*/}
                {/*    </Link>*/}
                {/*</div>*/}

            </div>
            {/*<div className={"w-full lg:w-6/12"}>*/}
            {/*    /!*<div className={"link flex py-1 justify-center bg-green-300 hover:bg-neutral-focus/50"}>*!/*/}
            {/*    /!*    <Link to={"/category/sale"} className={"text-white link"}>Click here to view all our vehicles for sell</Link>*!/*/}
            {/*    /!*</div>*!/*/}


            {/*    <Swiper slidesPerView={1} pagination={{clickable: true}} navigation>*/}
            {/*        {saleListings.map(function ({data, id}) {*/}
            {/*            return <SwiperSlide key={id} >*/}
            {/*                /!*<div className="indicator">*!/*/}
            {/*                /!*    <span className="indicator-item indicator-middle indicator-center badge badge-secondary"/>*!/*/}
            {/*                /!*    <div className="grid w-32 h-32 bg-base-300 place-items-center">content</div>*!/*/}
            {/*                /!*</div>*!/*/}

            {/*                /!*<div className={"swiper-slide-div"}>*!/*/}


            {/*                    /!*<div className={"w-full"}>*!/*/}
            {/*                        /!*<button className="indicator-item indicator-middle indicator-center btn bg-green-400/90 px-8">rent</button>*!/*/}
            {/*                        <img src={data.imageUrls[0]} alt={"vehicles"} className={"lg:h-96 swipe-img"}/>*/}
            {/*                    /!*</div>*!/*/}
            {/*                    <div  className="indicator swiper-slide-text">*/}
            {/*                        <span className="indicator-item badge badge-primary">${data.discountedPrice ?? data.regularPrice}{data.type === "rent" && "/Day"}</span>*/}
            {/*                        <p className={""}>{data.name}</p>*/}
            {/*                    </div>*/}

            {/*                    <p onClick={() => navigate(`/category/${data.type}/${id}`)} className={"swiper-slide-text-link link"}>View this listing</p>*/}

            {/*                /!*</div>*!/*/}

            {/*            </SwiperSlide>*/}

            {/*        })}*/}
            {/*    </Swiper>*/}
            {/*    <div className={"flex justify-center"}>*/}
            {/*        <Link to={"/category/sale"} className={"btn bg-green-300 text-black px-8 my-2"}>*/}
            {/*            Purchase*/}
            {/*        </Link>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    )
};

export default Slider;