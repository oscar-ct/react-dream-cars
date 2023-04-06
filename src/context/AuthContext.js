import {createContext, useReducer} from "react";
import authReducer from "./AuthReducer";
import PropTypes from "prop-types";



const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

    const initialState = {
        isLoggedIn: false,
    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    return <AuthContext.Provider
        value={{
            dispatch,
            isLoggedIn: state.isLoggedIn,
        }}>
        {children}
    </AuthContext.Provider>
}

AuthContext.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthContext;
