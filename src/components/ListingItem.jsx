import React from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon} from "../assets/svg/deleteIcon.svg";
import { ReactComponent as EditIcon} from "../assets/svg/editIcon.svg";



const ListingItem = ( { listing, id, onDelete, onEdit } ) => {

    const { type, name, location, discountedPrice, regularPrice, offer, imageUrls, model, year, make } = listing;

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

                <div className="card w-11/12 md:w-9/12 lg:w-96 bg-base-100 shadow-xl m-2">
                    <figure><Link to={`/category/${type}/${id}`}><img src={imageUrls[0]} alt={name} /></Link></figure>
                    <div className="card-body p-5">
                        <h2 className="card-title">
                            {name}
                        </h2>
                        <p className={"text-sm"}> {location}</p>
                        <div className="flex justify-between">
                            <div className="text-sm font-bold">
                                <span className={"font-normal pr-2"}>Year:</span>{year}
                            </div>
                            <div className="text-sm font-bold">
                                <span className={"font-normal pr-2"}>Make:</span>{make}
                            </div>
                            <div className="text-sm font-bold">
                                <span className={"font-normal pr-2"}>Model:</span>{model}
                            </div>
                        </div>
                        <div className={"flex justify-between"}>
                            <div className={"flex pt-2"}>
                            {onDelete && (
                                <DeleteIcon className={"remove-icon"} fill={"rgb(231, 76 ,60)"} onClick={() => onDelete(listing.id, name)}/>
                            )}
                            {onEdit && (
                                <EditIcon className={"edit-icon"} onClick={() => onEdit(listing.id)}/>
                            )}
                            </div>
                            <div>
                                <span className={"category-listing-price"}>
                                    <span className={"mr-2 text-neutral"}>{type === "rent" ? "Daily Rate:" : "List Price:"}</span>${offer ? discountedPrice : regularPrice}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>



    );
};

export default ListingItem;