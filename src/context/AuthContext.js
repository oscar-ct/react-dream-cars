import {createContext, useReducer} from "react";
import authReducer from "./AuthReducer";
import PropTypes from "prop-types";



const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

    const initialState = {
        anonymousBoolean: false,
        userData: {},
        userProfileImg: "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",

    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    return <AuthContext.Provider
        value={{
            dispatch,
            anonymousBoolean: state.anonymousBoolean,
            userData: state.userData,
            userProfileImg: state.userProfileImg

        }}>
        {children}
    </AuthContext.Provider>
}

AuthContext.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthContext;
