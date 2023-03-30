import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const [loading, setLoading] = useState(false);
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
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
        discountPrice: 0,
        images: {},
        lat: 0,
        lon: 0,
    });

    const { type, name, year, mileage, model, make, address, offer, regularPrice, discountPrice,  images, lat, lon } = formData;


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

    const onSubmit = (e) => {
        e.preventDefault();
    }
    const onMutate = (e) => {
        e.preventDefault();
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
                            value={true}
                            onChange={onMutate}
                        >
                            Yes
                        </button>
                        <button
                            type={"button"}
                            id={"offer"}
                            value={false}
                            onChange={onMutate}
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
                                value={discountPrice}
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