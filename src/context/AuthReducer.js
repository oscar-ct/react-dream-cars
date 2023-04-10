function authReducer (state, action) {
    switch (action.type) {

        case "SET_BOOLEAN":
            return {
                ...state,
                anonymousBoolean: action.payload,
            }
        case "SET_USER_DATA":
            return {
                ...state,
                userData: action.payload
            }
        case "SET_USER_PROFILE_IMG":
            return {
                ...state,
                userProfileImg: action.payload
            }
        default:
            return state;

    }
}

export default authReducer;