import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import {useNavigate, useParams} from "react-router-dom";
import { serverTimestamp, getDoc, doc, updateDoc } from "firebase/firestore";
import {toast} from "react-toastify";



const EditListing = () => {
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
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
    const params = useParams();
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

    useEffect(function () {
        setLoading(true);
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const listingData = await getDoc(docRef);
            if (listingData.exists()) {
                setListing(listingData.data());
                setFormData({...listingData.data(), address: listingData.data().location})
                setLoading(false);
            } else {
                navigate("/");
                toast.error("Listing does not exist");
            }
        }
        fetchListing();
    }, [navigate, params.listingId]);


    useEffect(function () {
       if (listing && listing.userRef !== auth.currentUser.uid) {
           toast.error("You can not edit that listing");
           navigate("/");
       }
    });


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
                    // eslint-disable-next-line default-case
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
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
        setLoading(true);
        if (discountedPrice >= regularPrice) {
            // error
            console.log("Discounted price must be lower than regular price")
        } else if (images.length > 6) {
            // error
            console.log("Max 6 images");
        } else {
            const locationObj = await getCoordinates().catch(function () {
                setLoading(false);
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

                    // const docRef = await addDoc(collection(db, "listings"), formDataCopy);
                    const docRef = doc(db, "listings", params.listingId);
                    await updateDoc(docRef, formDataCopy);
                    setLoading(false);
                    toast.success("Listing saved!")
                    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
                }
            } else {
                // error
                toast.error("Error, address is not valid");
            }
        }
        setLoading(false);
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
        <div className={"profile"}>
            <header>
                <p className={"page-header"}>
                    Edit listing
                </p>
            </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label className={"form-label"}>Sell / Rent</label>
                    <div className={"form-buttons"}>
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
                            className={type === "rent" ? "form-button-active" : "form-button"}
                            type={"button"}
                            id={"type"}
                            value={"rent"}
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label className={"form-label"}>Title</label>
                    <input
                        className={"form-input-name"}
                        autoComplete={"off"}
                        type={"text"}
                        id={"name"}
                        value={name}
                        onChange={onMutate}
                        maxLength={32}
                        minLength={10}
                        required
                    />

                    <div className={"flex"}>
                        <div>
                            <label className={"form-label"}>Year</label>
                            <input
                                className={"form-input-small"}
                                type={"number"}
                                id={"year"}
                                value={year}
                                onChange={onMutate}
                                min={1900}
                                max={2023}
                                required
                            />
                        </div>
                        <div>
                            <label className={"form-label"}>Mileage</label>
                            <input
                                className={"form-input-small"}
                                type={"number"}
                                id={"mileage"}
                                value={mileage}
                                onChange={onMutate}
                                min={1}
                                max={1000000}
                                required
                            />
                        </div>
                    </div>

                    <div className={"flex"}>
                        <div>
                            <label className={"form-label"}>Make</label>
                            <input
                                className={"form-input"}
                                type={"text"}
                                id={"make"}
                                value={make}
                                onChange={onMutate}
                                maxLength={32}
                                minLength={1}
                                required
                            />
                        </div>
                        <div>
                            <label className={"form-label"}>Model</label>
                            <input
                                className={"form-input"}
                                type={"text"}
                                id={"model"}
                                value={model}
                                onChange={onMutate}
                                maxLength={32}
                                minLength={1}
                                required
                            />
                        </div>
                    </div>

                    <label className={"form-label"}>Address</label>
                    <textarea
                        className={"form-input-address"}
                        id={"address"}
                        value={address}
                        onChange={onMutate}
                        required
                    />
                    {/*{!geolocationEnabled && (*/}
                    {/*    <div>*/}
                    {/*        <div>*/}
                    {/*            <label>Latitude</label>*/}
                    {/*            <input*/}
                    {/*                type={"number"}*/}
                    {/*                id={"lat"}*/}
                    {/*                value={lat}*/}
                    {/*                onChange={onMutate}*/}
                    {/*                required*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*        <div>*/}
                    {/*            <label>Longitude</label>*/}
                    {/*            <input*/}
                    {/*                type={"number"}*/}
                    {/*                id={"lon"}*/}
                    {/*                value={lon}*/}
                    {/*                onChange={onMutate}*/}
                    {/*                required*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*)}*/}

                    <label className={"form-label"}>Offer</label>
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
                            className={!offer && offer !== null ? "form-button-active" : "form-button"}
                            type={"button"}
                            id={"offer"}
                            value={"no"}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label className={"form-label"}>Regular Price</label>
                    <div className={"form-price-div"}>
                        <input
                            className={"form-input-small"}
                            type={"number"}
                            id={"regularPrice"}
                            value={regularPrice}
                            onChange={onMutate}
                            min={50}
                            max={750000000}
                            required
                        />
                        {type === "rent" && (
                            <p className={"form-price-text"}>$ / Day</p>
                        )}
                    </div>

                    {offer && (
                        <>
                            <label className={"form-label"}>Discounted Price</label>
                            <div className={"form-price-div"}>
                                <input
                                    className={"form-input-small"}
                                    type={"number"}
                                    id={"discountedPrice"}
                                    value={discountedPrice}
                                    onChange={onMutate}
                                    min={50}
                                    max={750000000}
                                    required={offer}
                                />
                                {type === "rent" && (
                                    <p className={"form-price-text"}>$ / Day</p>
                                )}
                            </div>
                        </>
                    )}

                    <label className={"form-label"}>Images</label>
                    <p className={"images-info"}>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        className={"form-input-file"}
                        type={"file"}
                        id={"images"}
                        onChange={onMutate}
                        max={6}
                        accept={".jpg,.png,.jpeg"}
                        multiple={true}
                        required={true}
                    />
                    <button
                        className={"primary-button create-listing-button"}
                        type={"submit"}
                    >
                        Update Listing
                    </button>
                </form>
            </main>
        </div>
    );
};

export default EditListing;