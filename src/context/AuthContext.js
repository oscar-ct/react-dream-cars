import {createContext, useReducer} from "react";
import authReducer from "./AuthReducer";
import PropTypes from "prop-types";
import {funFacts} from "./Facts";




const AuthContext = createContext();
const factsArr = funFacts();
const randomNumber = Math.floor(Math.random() * factsArr.length);
const randomFact = factsArr[randomNumber].fact;


export const AuthProvider = ( {children} ) => {

    const initialState = {
        anonymousBoolean: false,
        userData: {},
        userProfileImg: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
        randomFact: randomFact,

    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    return <AuthContext.Provider
        value={{
            dispatch,
            anonymousBoolean: state.anonymousBoolean,
            userData: state.userData,
            userProfileImg: state.userProfileImg,
            randomFact: state.randomFact

        }}>
        {children}
    </AuthContext.Provider>
}

AuthContext.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthContext;
