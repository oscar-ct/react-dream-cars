import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import {toast} from "react-toastify";
import React from "react";



const CreateListing = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        year: 0,
        mileage: 0,
        model: "",
        make: "",
        address: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        lat: 0,
        lon: 0,
    });

    const geolocationEnabled = useRef(true);

    const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN

    const { type, name, year, mileage, model, make, address, offer, regularPrice, discountedPrice,  images, lat, lon } = formData;


    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(function() {
       if (isMounted) {
            onAuthStateChanged(auth, function (user) {
                if (user) {
                    setFormData({...formData, userRef: user.uid});
                } else  {
                    navigate("/sign-in");
                }
            });
       }
       return function () {
           isMounted.current = false;
       }
        // eslint-disable-next-line
    }, []);


    const storeImages = async (image) => {
        return new Promise(function (resolve, reject) {
            const storage = getStorage();
            const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
            const storageRef = ref(storage, "images/" + fileName);
            const uploadTask = uploadBytesResumable(storageRef, image);
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    reject(error)
                    // eslint-disable-next-line default-case
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                        default:
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                        console.log('File available at', downloadURL);
                    });
                }
            );
        });
    }

    const getCoordinates = async () => {
        let geolocation = {};
        let location = "";

        if (geolocationEnabled) {
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${MAPBOX_TOKEN}`);
            const data = await response.json();
            if (data.features.length === 0) {
                // error
                console.log("invalid address");
            } else {
                const coord = data.features[0];
                geolocation.lat = coord.center[1];
                geolocation.lon = coord.center[0];
                location = coord.place_name;
                console.log(coord);
                // verify
            }
        } else {
            geolocation.lat = lat;
            geolocation.lon = lon;
            location = address;
        }
        return {
            location,
            geolocation,
        }
    }



    const onSubmit = async (e) => {
        e.preventDefault();
        // setLoading(true);
        if (discountedPrice >= regularPrice) {
            // error
            console.log("Discounted price must be lower than regular price")
        } else if (images.length > 6) {
            // error
            console.log("Max 6 images");
        } else {
            const locationObj = await getCoordinates().catch(function () {
                // setLoading(false);
                console.log("error, geolocation failed!!!");
            });
            console.log(locationObj);
            if (locationObj.location !== "") {
                const verifiedAddress = window.confirm(`Please confirm address: ${locationObj.location}`);
                if (verifiedAddress) {
                    const imageUrls =  await Promise.all(
                        [...images].map(function (img) {
                            return storeImages(img);
                        })).catch(function () {
                        setLoading(false);
                        console.log("error, images no uploaded!!!");
                    });
                    const formDataCopy = {
                        ...formData,
                        imageUrls: imageUrls,
                        geolocation: locationObj.geolocation,
                        timestamp: serverTimestamp(),
                    }
                    delete formDataCopy.images;
                    delete formDataCopy.address;
                    delete formDataCopy.lat;
                    delete formDataCopy.lon;
                    locationObj.location && (formDataCopy.location = locationObj.location);
                    !formDataCopy.offer && delete formDataCopy.discountedPrice;

                    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
                    setLoading(false);
                    toast.success("Listing saved!")
                    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
                }
            } else {
                // error
                toast.error("Could not find address provided, please re-enter a valid address");
                console.log(formData)
            }
        }
        // setLoading(false);
    }


    const onMutate = (e) => {
        let bool = null;
        if (e.target.value === "yes") {
            bool = true;
        } else if (e.target.value === "no") {
            bool = false;
        }
        if (e.target.files) {
            setFormData(prevState => {
                return {
                    ...prevState,
                    images: e.target.files,
                };
            });
        } else if (!e.target.files) {
            setFormData(prevState => {
                return {
                    ...prevState,
                    [e.target.id]: bool ?? e.target.value,
                };
            });
        }
    };



    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>

            <div className={"w-full px-4 sm:px-12 lg:px-24 2xl:px-48"}>

                <div className={"mt-12 mb-3 w-full  flex justify-center"}>
                    <p className={"text-3xl text-blue-500 font-light"}>Let's create a listing!</p>
                </div>

                <div className="card lg:card-side shadow-xl">

                    <div className="card-body">
                        <h2 className="text-center text-lg font-bold italic">All fields are required.</h2>

                        <form onSubmit={onSubmit}>
                        <div className={"flex flex-col lg:flex-row w-full"}>
                            <div className={"w-full lg:w-6/12 "}>
                                <p className={"pt-6 pb-3 lg:pb-6"}>Are you selling or renting out your vehicle?<span className={"text-red-600 pl-1"}>*</span></p>
                                <div className={"form-buttons justify-start"}>
                                    <button
                                        className={type === "sale" ? "form-button-active" : "form-button"}
                                        type={"button"}
                                        id={"type"}
                                        value={"sale"}
                                        onClick={onMutate}
                                    >
                                        Sell
                                    </button>
                                    <button
                                        className={type === "rent" ? "form-button-active ml-3" : " ml-3 form-button"}
                                        type={"button"}
                                        id={"type"}
                                        value={"rent"}
                                        onClick={onMutate}
                                    >
                                        Rent
                                    </button>
                                </div>
                            </div>
                            <div className={"w-full lg:w-6/12 "}>
                                <p className={"pt-6 pb-3 lg:pb-6"}>Listing Title<span className={"text-red-600 pl-1"}>*</span></p>
                                <div className={"flex"}>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        id={"name"}
                                        value={name}
                                        className={ name.length >= 9 && name.length <= 32 ? "input-primary input input-bordered w-9/12 text-sm sm:text-base" : (name.length >= 33 || name.length < 9) && name.length !== 0 ? "input-bordered input-error input w-9/12 text-sm sm:text-base" : "input-bordered input w-9/12 text-sm sm:text-base"}
                                        onChange={onMutate}
                                        maxLength={31}
                                        minLength={10}
                                        required
                                    />
                                </div>
                            </div>

                        </div>


                        <div className={"flex flex-col lg:flex-row lg:justify-around lg:items-end w-full"}>

                            <div className={"flex w-full w-full lg:w-6/12"}>
                                <div className={"w-6/12"}>
                                    <p className={"pt-6 pb-3"}>Make<span className={"text-red-600 pl-1"}>*</span></p>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        id={"make"}
                                        // className={"input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                        className={ make.length >= 1 && make.length <= 12 ? "input-primary input input-bordered w-8/12 xl:w-6/12 text-sm sm:text-base" : (make.length >= 13 || make.length < 1) && make.length !== 0 ? "input-bordered input-error input w-8/12 xl:w-6/12 text-sm sm:text-base" : "input-bordered input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                        onChange={onMutate}
                                        maxLength={24}
                                        minLength={1}
                                        required
                                    />
                                </div>
                                <div className={"w-6/12"}>
                                    <p className={"pt-6 pb-3"}>Model<span className={"text-red-600 pl-1"}>*</span></p>
                                    <input
                                        autoComplete={"off"}
                                        type={"text"}
                                        id={"model"}
                                        className={ model.length >= 1 && model.length <= 12 ? "input-primary input input-bordered w-8/12 xl:w-6/12 text-sm sm:text-base" : (model.length >= 13 || model.length < 1) && model.length !== 0 ? "input-bordered input-error input w-8/12 xl:w-6/12 text-sm sm:text-base" : "input-bordered input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                        onChange={onMutate}
                                        maxLength={24}
                                        minLength={1}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={"flex w-full  w-full lg:w-6/12"}>
                                <div className={"w-6/12"}>
                                    <p className={"pt-6 pb-3 lg:pb-6"}>Year<span className={"text-red-600 pl-1"}>*</span></p>
                                    <input
                                        autoComplete={"off"}
                                        type={"number"}
                                        id={"year"}
                                        className={ year >= 1900 && year <= 2024 ? "input-primary input input-bordered w-8/12 xl:w-6/12 text-sm sm:text-base" : (year >= 2025 || year < 1900) && year !== 0 ? "input-bordered input-error input w-8/12 xl:w-6/12 text-sm sm:text-base" : "input-bordered input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                        onChange={onMutate}
                                        min={1900}
                                        max={2024}
                                        required
                                    />
                                </div>
                                <div className={"w-6/12"}>
                                    <p className={"pt-6 pb-3 lg:pb-6"}>Mileage<span className={"text-red-600 pl-1"}>*</span></p>
                                    <input
                                        autoComplete={"off"}
                                        type={"number"}
                                        id={"mileage"}
                                        className={ mileage >= 1 && mileage <= 1000000 ? "input-primary input input-bordered w-8/12 xl:w-6/12 text-sm sm:text-base" : (mileage >= 1000001 || mileage < 1) && mileage !== 0 ? "input-bordered input-error input w-8/12 xl:w-6/12 text-sm sm:text-base" : "input-bordered input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                        onChange={onMutate}
                                        min={1}
                                        max={1000000}
                                        required
                                    />
                                </div>
                            </div>


                        </div>




                        <div className={"flex flex-col lg:flex-row w-full"}>

                            <div className={"w-full lg:w-6/12 "}>
                                <p className={"pt-6 pb-3 lg:pb-6"}>Would you like to offer a special price?<span className={"text-red-600 pl-1"}>*</span></p>
                                <div className={"form-buttons"}>
                                    <button
                                        className={offer ? "form-button-active" : "form-button"}
                                        type={"button"}
                                        id={"offer"}
                                        value={"yes"}
                                        onClick={onMutate}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        className={!offer && offer !== null ? "ml-3 form-button-active" : "ml-3 form-button"}
                                        type={"button"}
                                        id={"offer"}
                                        value={"no"}
                                        onClick={onMutate}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>




                            <div className={"flex w-full  w-full lg:w-6/12"}>
                                <div className={"w-6/12"}>
                                    <p className={"pt-6 pb-3 lg:pb-6"}>List Price<span className={"text-red-600 pl-1"}>*</span></p>
                                    <input
                                        autoComplete={"off"}
                                        type={"number"}
                                        id={"regularPrice"}
                                        value={regularPrice}
                                        className={ regularPrice >= 50 && regularPrice <= 750000000 ? "input-primary input input-bordered w-8/12 xl:w-6/12 text-sm sm:text-base" : (regularPrice >= 750000001 || regularPrice < 50) && regularPrice !== 0 ? "input-bordered input-error input w-8/12 xl:w-6/12 text-sm sm:text-base" : "input-bordered input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                        onChange={onMutate}
                                        min={50}
                                        max={750000000}
                                        required
                                    />
                                </div>
                                {offer && (
                                    <div className={"w-6/12"}>
                                        <p className={"pt-6 pb-3 lg:pb-6"}>Discount Price<span className={"text-red-600 pl-1"}>*</span></p>
                                        <input
                                            autoComplete={"off"}
                                            type={"number"}
                                            id={"discountedPrice"}
                                            value={offer ? discountedPrice : 0}
                                            className={ regularPrice - discountedPrice > 0 ? "input-primary input input-bordered w-8/12 xl:w-6/12 text-sm sm:text-base" : regularPrice - discountedPrice <= 0 && discountedPrice !== 0 ? "input-bordered input-error input w-8/12 xl:w-6/12 text-sm sm:text-base" : "input-bordered input w-8/12 xl:w-6/12 text-sm sm:text-base"}
                                            onChange={onMutate}
                                            min={0}
                                            max={regularPrice}
                                            required={offer}
                                        />
                                    </div>
                                )}

                            </div>

                        </div>

                        <div className={"flex flex-col lg:flex-row w-full"}>

                                <div className={"w-full lg:w-6/12"}>
                                    <p className={"pt-6 pb-3 lg:pb-6"}>Address<span className={"text-red-600 pl-1"}>*</span></p>
                                    <textarea
                                        className={ address.length >= 9 && address.length <= 64 ? "input-primary input input-bordered w-9/12 text-sm sm:text-base" : (address.length >= 65 || address.length < 9) && address.length !== 0 ? "input-bordered input-error input w-9/12 text-sm sm:text-base" : "input-bordered input w-9/12 text-sm sm:text-base"}
                                        id={"address"}
                                        value={address}
                                        onChange={onMutate}
                                        required
                                    />
                                </div>

                            <div className={"w-full lg:w-6/12"}>
                                <p className={"pt-6 pb-3 lg:pb-6"}>
                                    Images
                                    <span className={"text-red-600 pl-1"}>
                                        *
                                    </span>
                                    <span className={"text-xs pl-3"}>
                                        The first image will be the cover (max 6).
                                    </span>
                                </p>

                                    <input
                                        type={"file"}
                                        accept={".jpg,.png,.jpeg"}
                                        id={"images"}
                                        max={6}
                                        onChange={onMutate}
                                        // className={"file-input w-9/12 text-sm sm:text-base"}
                                        className={ images.length >= 1 && images.length <= 6 ? "file-input-primary file-input file-input-bordered w-9/12 text-sm sm:text-base" : (images.length >= 7 || images.length < 1) && images.length !== 0 ? "file-input-bordered file-input-error file-input w-9/12 text-sm sm:text-base" : "file-input-bordered file-input w-9/12 text-sm sm:text-base"}
                                        multiple={true}
                                        required={true}
                                    />

                            </div>

                        </div>


                        <div className="card-actions mt-8 justify-end">
                            <button
                                type={"submit"}
                                className="btn bg-primary"
                                disabled={!(name.length >= 9 && name.length <= 32 && make.length >= 1 && make.length <= 12 && model.length >= 1 && model.length <= 12 && year >= 1900 && year <= 2024 && mileage >= 1 && mileage <= 1000000 && regularPrice >= 50 && regularPrice <= 750000000 && address.length >= 9 && address.length <= 64 && images.length >= 1 && images.length <= 6 && regularPrice - discountedPrice > 0)}
                            >
                                Create
                            </button>
                        </div>

                        </form>
                    </div>

                </div>


            </div>


























            {/*////////////////////////////////////////////////////////////////////////////////*/}

        {/*<div className={"profile"}>*/}
        {/*   <header>*/}
        {/*       <p className={"page-header"}>*/}
        {/*            Create a listing*/}
        {/*       </p>*/}
        {/*   </header>*/}
        {/*    <main>*/}
        {/*        <form onSubmit={onSubmit}>*/}
        {/*            <label className={"form-label"}>Sell / Rent</label>*/}
        {/*            <div className={"form-buttons"}>*/}
        {/*                <button*/}
        {/*                    className={type === "sale" ? "form-button-active" : "form-button"}*/}
        {/*                    type={"button"}*/}
        {/*                    id={"type"}*/}
        {/*                    value={"sale"}*/}
        {/*                    onClick={onMutate}*/}
        {/*                >*/}
        {/*                    Sell*/}
        {/*                </button>*/}
        {/*                <button*/}
        {/*                    className={type === "rent" ? "form-button-active" : "form-button"}*/}
        {/*                    type={"button"}*/}
        {/*                    id={"type"}*/}
        {/*                    value={"rent"}*/}
        {/*                    onClick={onMutate}*/}
        {/*                >*/}
        {/*                    Rent*/}
        {/*                </button>*/}
        {/*            </div>*/}

        {/*            <label className={"form-label"}>Title</label>*/}
        {/*            <input*/}
        {/*                className={"form-input-name"}*/}
        {/*                autoComplete={"off"}*/}
        {/*                type={"text"}*/}
        {/*                id={"name"}*/}
        {/*                value={name}*/}
        {/*                onChange={onMutate}*/}
        {/*                maxLength={32}*/}
        {/*                minLength={10}*/}
        {/*                required*/}
        {/*            />*/}

        {/*            <div className={"flex"}>*/}
        {/*                <div>*/}
        {/*                    <label className={"form-label"}>Year</label>*/}
        {/*                    <input*/}
        {/*                        className={"form-input-small"}*/}
        {/*                        type={"number"}*/}
        {/*                        id={"year"}*/}
        {/*                        value={year}*/}
        {/*                        onChange={onMutate}*/}
        {/*                        min={1900}*/}
        {/*                        max={2023}*/}
        {/*                        required*/}
        {/*                    />*/}
        {/*                </div>*/}
        {/*                <div>*/}
        {/*                    <label className={"form-label"}>Mileage</label>*/}
        {/*                    <input*/}
        {/*                        className={"form-input-small"}*/}
        {/*                        type={"number"}*/}
        {/*                        id={"mileage"}*/}
        {/*                        value={mileage}*/}
        {/*                        onChange={onMutate}*/}
        {/*                        min={1}*/}
        {/*                        max={1000000}*/}
        {/*                        required*/}
        {/*                    />*/}
        {/*                </div>*/}
        {/*            </div>*/}

        {/*            <div className={"flex"}>*/}
        {/*                <div>*/}
        {/*                    <label className={"form-label"}>Make</label>*/}
        {/*                    <input*/}
        {/*                        className={"form-input"}*/}
        {/*                        type={"text"}*/}
        {/*                        id={"make"}*/}
        {/*                        value={make}*/}
        {/*                        onChange={onMutate}*/}
        {/*                        maxLength={32}*/}
        {/*                        minLength={1}*/}
        {/*                        required*/}
        {/*                    />*/}
        {/*                </div>*/}
        {/*                <div>*/}
        {/*                    <label className={"form-label"}>Model</label>*/}
        {/*                    <input*/}
        {/*                        className={"form-input"}*/}
        {/*                        type={"text"}*/}
        {/*                        id={"model"}*/}
        {/*                        value={model}*/}
        {/*                        onChange={onMutate}*/}
        {/*                        maxLength={32}*/}
        {/*                        minLength={1}*/}
        {/*                        required*/}
        {/*                    />*/}
        {/*                </div>*/}
        {/*            </div>*/}

        {/*            <label className={"form-label"}>Address</label>*/}
        {/*            <textarea*/}
        {/*                className={"form-input-address"}*/}
        {/*                id={"address"}*/}
        {/*                value={address}*/}
        {/*                onChange={onMutate}*/}
        {/*                required*/}
        {/*            />*/}
        {/*            {!geolocationEnabled && (*/}
        {/*                <div>*/}
        {/*                    <div>*/}
        {/*                        <label>Latitude</label>*/}
        {/*                        <input*/}
        {/*                            type={"number"}*/}
        {/*                            id={"lat"}*/}
        {/*                            value={lat}*/}
        {/*                            onChange={onMutate}*/}
        {/*                            required*/}
        {/*                        />*/}
        {/*                    </div>*/}
        {/*                    <div>*/}
        {/*                        <label>Longitude</label>*/}
        {/*                        <input*/}
        {/*                            type={"number"}*/}
        {/*                            id={"lon"}*/}
        {/*                            value={lon}*/}
        {/*                            onChange={onMutate}*/}
        {/*                            required*/}
        {/*                        />*/}
        {/*                    </div>*/}
        {/*                </div>*/}
        {/*            )}*/}

        {/*            <label className={"form-label"}>Offer</label>*/}
        {/*            <div className={"form-buttons"}>*/}
        {/*                <button*/}
        {/*                    className={offer ? "form-button-active" : "form-button"}*/}
        {/*                    type={"button"}*/}
        {/*                    id={"offer"}*/}
        {/*                    value={"yes"}*/}
        {/*                    onClick={onMutate}*/}
        {/*                >*/}
        {/*                    Yes*/}
        {/*                </button>*/}
        {/*                <button*/}
        {/*                    className={!offer && offer !== null ? "form-button-active" : "form-button"}*/}
        {/*                    type={"button"}*/}
        {/*                    id={"offer"}*/}
        {/*                    value={"no"}*/}
        {/*                    onClick={onMutate}*/}
        {/*                >*/}
        {/*                    No*/}
        {/*                </button>*/}
        {/*            </div>*/}

        {/*            <label className={"form-label"}>Regular Price</label>*/}
        {/*            <div className={"form-price-div"}>*/}
        {/*                <input*/}
        {/*                    className={"form-input-small"}*/}
        {/*                    type={"number"}*/}
        {/*                    id={"regularPrice"}*/}
        {/*                    value={regularPrice}*/}
        {/*                    onChange={onMutate}*/}
        {/*                    min={50}*/}
        {/*                    max={750000000}*/}
        {/*                    required*/}
        {/*                />*/}
        {/*                {type === "rent" && (*/}
        {/*                    <p className={"form-price-text"}>$ / Day</p>*/}
        {/*                )}*/}
        {/*            </div>*/}

        {/*            {offer && (*/}
        {/*                <>*/}
        {/*                    <label className={"form-label"}>Discounted Price</label>*/}
        {/*                    <div className={"form-price-div"}>*/}
        {/*                        <input*/}
        {/*                            className={"form-input-small"}*/}
        {/*                            type={"number"}*/}
        {/*                            id={"discountedPrice"}*/}
        {/*                            value={offer ? discountedPrice : 0}*/}
        {/*                            onChange={onMutate}*/}
        {/*                            min={50}*/}
        {/*                            max={750000000}*/}
        {/*                            required={offer}*/}
        {/*                        />*/}
        {/*                        {type === "rent" && (*/}
        {/*                            <p className={"form-price-text"}>$ / Day</p>*/}
        {/*                        )}*/}
        {/*                    </div>*/}
        {/*                </>*/}
        {/*            )}*/}

        {/*            <label className={"form-label"}>Images</label>*/}
        {/*            <p className={"images-info"}>*/}
        {/*                The first image will be the cover (max 6).*/}
        {/*            </p>*/}
        {/*            <input*/}
        {/*                className={"form-input-file"}*/}
        {/*                type={"file"}*/}
        {/*                id={"images"}*/}
        {/*                onChange={onMutate}*/}
        {/*                max={6}*/}
        {/*                accept={".jpg,.png,.jpeg"}*/}
        {/*                multiple={true}*/}
        {/*                required={true}*/}
        {/*            />*/}
        {/*            <button*/}
        {/*                className={"primary-button create-listing-button"}*/}
        {/*                type={"submit"}*/}
        {/*            >*/}
        {/*                Create Listing*/}
        {/*            </button>*/}
        {/*        </form>*/}
        {/*    </main>*/}
        {/*</div>*/}




        </>
    );
};

export default CreateListing;