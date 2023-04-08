import {createContext, useReducer} from "react";
import authReducer from "./AuthReducer";
import PropTypes from "prop-types";



const AuthContext = createContext();

export const AuthProvider = ( {children} ) => {

    const initialState = {
        anonymousBoolean: false,

    }

    const [state, dispatch] = useReducer(authReducer, initialState);

    return <AuthContext.Provider
        value={{
            dispatch,
            anonymousBoolean: state.anonymousBoolean,

        }}>
        {children}
    </AuthContext.Provider>
}

AuthContext.propTypes = {
    children: PropTypes.node.isRequired,
}

export default AuthContext;
