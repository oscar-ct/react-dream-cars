import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";



const CreateListing = () => {
    const [loading, setLoading] = useState(false);
    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
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
    }, [isMounted]);

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

            let geolocation = {};
            let location;

            if (geolocationEnabled) {
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${MAPBOX_TOKEN}`);
                const data = await response.json();
                if (data.features.length === 0) {
                    console.log("invalid address");
                } else {
                    const coord = data.features[0];
                    geolocation.lat = coord.center[1];
                    geolocation.lon = coord.center[0];
                    location = coord.place_name;
                    console.log(coord);
                }
            } else {
                geolocation.lat = lat;
                geolocation.lon = lon;
                location = address;
            }


            try {
                await Promise.all(
                    [...images].map(function (img) {
                        return storeImages(img);
                    }));
            } catch (e) {
                setLoading(false);
                console.log("error, images no uploaded!!!", e);
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
                    }
                },
                (error) => {
                    reject(error)
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





    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
           <header>
               <p>
                    Create a listing
               </p>
           </header>
            <main>
                <form onSubmit={onSubmit}>
                    <label>Sell / Rent</label>
                    <div>
                        <button
                            type={"button"}
                            id={"type"}
                            value={"sale"}
                            onClick={onMutate}
                        >
                            Sell
                        </button>
                        <button
                            type={"button"}
                            id={"type"}
                            value={"rent"}
                            onClick={onMutate}
                        >
                            Rent
                        </button>
                    </div>

                    <label>Title</label>
                    <input
                        autoComplete={"off"}
                        type={"text"}
                        id={"name"}
                        value={name}
                        onChange={onMutate}
                        maxLength={32}
                        minLength={10}
                        required
                    />

                    <div>
                        <div>
                            <label>Year</label>
                            <input
                                type={"number"}
                                id={"year"}
                                value={year}
                                onChange={onMutate}
                                min={1}
                                max={2023}
                                required
                            />
                            <label>Mileage</label>
                            <input
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

                    <label>Make</label>
                    <input
                        type={"text"}
                        id={"make"}
                        value={make}
                        onChange={onMutate}
                        maxLength={32}
                        minLength={1}
                        required
                    />
                    <label>Model</label>
                    <input
                        type={"text"}
                        id={"model"}
                        value={model}
                        onChange={onMutate}
                        maxLength={32}
                        minLength={1}
                        required
                    />
                    <label>Address</label>
                    <textarea
                        id={"address"}
                        value={address}
                        onChange={onMutate}
                        required
                    />
                    {!geolocationEnabled && (
                        <div>
                            <div>
                                <label>Latitude</label>
                                <input
                                    type={"number"}
                                    id={"lat"}
                                    value={lat}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                            <div>
                                <label>Longitude</label>
                                <input
                                    type={"number"}
                                    id={"lon"}
                                    value={lon}
                                    onChange={onMutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label>Offer</label>
                    <div>
                        <button
                            type={"button"}
                            id={"offer"}
                            value={"yes"}
                            onClick={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            type={"button"}
                            id={"offer"}
                            value={"no"}
                            onClick={onMutate}
                        >
                            No
                        </button>
                    </div>

                    <label>Regular Price</label>
                    <div>
                        <input
                            type={"number"}
                            id={"regularPrice"}
                            value={regularPrice}
                            onChange={onMutate}
                            min={50}
                            max={750000000}
                            required
                        />
                        {type === "rent" && (
                            <p>$ / Day</p>
                        )}
                    </div>

                    {offer && (
                        <>
                            <label>Discounted Price</label>
                            <input
                                type={"number"}
                                id={"discountedPrice"}
                                value={discountedPrice}
                                onChange={onMutate}
                                min={50}
                                max={750000000}
                                required={offer}
                            />
                        </>
                    )}

                    <label>Images</label>
                    <p>
                        The first image will be the cover (max 6).
                    </p>
                    <input
                        type={"file"}
                        id={"images"}
                        onChange={onMutate}
                        max={6}
                        accept={".jpg,.png,.jpeg"}
                        multiple={true}
                        required={true}
                    />
                    <button
                        type={"submit"}
                    >
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    );
};

export default CreateListing;