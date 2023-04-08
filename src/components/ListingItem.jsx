import React from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon} from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon} from "../assets/svg/editIcon.svg";



const ListingItem = ( { listing, id, onDelete, onEdit } ) => {

    const { type, name, location, discountedPrice, regularPrice, offer, imageUrls, model, year, make, mileage, timestamp } = listing;

    const date = new Date(timestamp.seconds*1000);
    const dateStr = date.toDateString();
    const dateArr = dateStr.toString().split(" ");
    dateArr.shift();
    const customDateStr = dateArr.join(" ");

    return (

        // <li className={"category-listing"}>
        //     <Link to={`/category/${type}/${id}`} className={"category-listing-link"}>
        //         <img src={imageUrls[0]} alt={name} className={"category-listing-img"}/>
        //         <div>
        //             <p className={"category-listing-location"}>
        //                 {location}
        //             </p>
        //             <p className={"category-listing-name"}>
        //                 {name}
        //             </p>
        //             <p className={"category-listing-price"}>
        //                 ${offer ? discountedPrice : regularPrice}
        //                 {type === "rent" && "/Day"}
        //             </p>
        //             <div className={"category-listing-info-div"}>
        //
        //                 <p className={"category-listing-info-text"}>
        //                     Year: {year}
        //                 </p>
        //                 <p className={"category-listing-info-text"}>
        //                     Make: {make}
        //                 </p>
        //                 <p className={"category-listing-info-text"}>
        //                     Model: {model}
        //                 </p>
        //             </div>
        //         </div>
        //     </Link>
        //
        //     {onDelete && (
        //         <DeleteIcon className={"remove-icon"} fill={"rgb(231, 76 ,60)"} onClick={() => onDelete(listing.id, name)}/>
        //     )}
        //
        //     {onEdit && (
        //         <EditIcon className={"edit-icon"} onClick={() => onEdit(listing.id)}/>
        //     )}
        //
        // </li>

                <div className="card w-11/12 md:w-9/12 lg:w-96 bg-base-100 list-max-height shadow-xl m-2">
                    <figure>
                        <Link to={`/category/${type}/${id}`}><img src={imageUrls[0]} alt={name} />
                            { type === "rent" ?
                                <p className={"list-text-rent"}>Rental</p>
                                :
                                <p className={"list-text-sale"}>For Sale</p>
                            }
                        </Link>

                    </figure>
                    <div className="card-body pb-5 px-5 pt-0">
                        { offer ? <span className={"list-text-discounted text-xs"}>Discounted</span> : <span className={"list-text-discounted-false text-xs"}>.</span>}
                        <h2 className="card-title mt-0 pt-0">
                            {name}
                        </h2>
                        <p className={"text-sm"}> {location.replace(", United States", "")}</p>

                        <div className="stats shadow bg-base-200 my-2">
                            <div className="stat px-1 py-1 place-items-center">
                                <div className="stat-title text-sm">Year</div>
                                <div className="text-md font-bold">{year}</div>
                                {/*<div className="stat-desc">Jan 1st - Feb 1st</div>*/}
                            </div>
                            <div className="stat px-1 py-1 place-items-center">
                                <div className="stat-title text-sm">Make</div>
                                <div className="text-md font-bold">{make}</div>
                                {/*<div className="stat-desc">↗︎ 400 (22%)</div>*/}
                            </div>
                            <div className="stat px-1 py-1 place-items-center">

                                <div className="stat-title text-sm">Model</div>
                                <div className="text-md font-bold">{model}</div>
                                {/*<div className="stat-desc">↘︎ 90 (14%)</div>*/}
                            </div>
                            <div className="stat px-1 py-1 place-items-center">

                                <div className="stat-title text-sm">Mileage</div>
                                <div className="text-md font-bold">{mileage}</div>
                                {/*<div className="stat-desc">↘︎ 90 (14%)</div>*/}
                            </div>
                        </div>




                        <div className={"flex justify-between"}>
                            <div className={"flex pt-2"}>

                            {onDelete && (
                                <DeleteIcon className={"remove-icon mt-5"} fill={"rgb(231, 76 ,60)"} onClick={() => onDelete(listing.id, name)}/>
                            )}
                            {onEdit && (
                                <EditIcon className={"edit-icon mt-5"} onClick={() => onEdit(listing.id)}/>
                            )}
                            {
                                !onDelete && !onEdit && (
                                <div className={"flex"}>
                                    <div className="btn btn-ghost btn-circle avatar">
                                        <div className="w-10 rounded-full">
                                            <img
                                                src={listing.userProfileUrl}
                                                alt={"profile"}/>
                                        </div>
                                    </div>
                                    <div className={"flex flex-col justify-center ml-1"}>
                                        <span className={"text-xs ml-1"}>Posted on: </span>
                                        <span className={"text-neutral text-sm ml-1 my-0 py-0"}>{customDateStr}</span>
                                    </div>
                                </div>
                            )}
                            </div>
                            <div>
                                <div className={"flex flex-col items-center"}>
                                    <div className={"mr-1 mt-1"}>
                                        {type === "rent" ?
                                            <span className={"text-neutral text-sm font-bold"}>
                                                Daily Rate
                                            </span>
                                        :   <span className={"text-neutral text-sm font-bold"}>
                                                List Price
                                            </span>
                                        }
                                    </div>
                                    {offer ?
                                        <div>
                                            <span className={"line-through text-md"}>
                                                ${regularPrice}
                                            </span>
                                            <span className={" pl-1 text-green-400 font-bold text-xl"}>
                                                ${discountedPrice}
                                            </span>
                                        </div>
                                    :
                                        <span className={"text-green-400 font-bold text-xl"}>
                                            ${regularPrice}
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>






                    </div>
                </div>



    );
};

export default ListingItem;