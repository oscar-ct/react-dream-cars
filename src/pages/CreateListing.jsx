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
            })
       }
       return function () {
           isMounted.current = false;
       }
    }, [isMounted]);

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <div>
            Create
        </div>
    );
};

export default CreateListing;