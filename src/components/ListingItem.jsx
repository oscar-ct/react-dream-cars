import React from 'react';
import { Link } from "react-router-dom";
import { ReactComponent as DeleteIcon} from "../assets/svg/deleteIcon.svg";


const ListingItem = ( { listing, id, onDelete } ) => {

    const { type, name, location, discountedPrice, regularPrice, offer, imageUrls, model, year, make } = listing;

    return (
        <li className={"category-listing"}>
            <Link to={`/category/${type}/${id}`} className={"category-listing-link"}>
                <img src={imageUrls[0]} alt={name} className={"category-listing-img"}/>
                <div>
                    <p className={"category-listing-location"}>
                        {location}
                    </p>
                    <p className={"category-listing-name"}>
                        {name}
                    </p>
                    <p className={"category-listing-price"}>
                        ${offer ? discountedPrice : regularPrice}
                        {type === "rent" && "/Day"}
                    </p>
                    <div className={"category-listing-info-div"}>

                        <p className={"category-listing-info-text"}>
                            Year: {year}
                        </p>
                        <p className={"category-listing-info-text"}>
                            Make: {make}
                        </p>
                        <p className={"category-listing-info-text"}>
                            Model: {model}
                        </p>
                    </div>
                </div>
            </Link>

            {onDelete && (
                <DeleteIcon className={"remove-icon"} fill={"rgb(231, 76 ,60)"} onClick={onDelete(listing.id, name)}/>
            )}

        </li>
    );
};

export default ListingItem;