function authReducer (state, action) {
    switch (action.type) {

        case "SET_BOOLEAN":
            return {
                ...state,
                anonymousBoolean: action.payload,
            }
        default:
            return state;

    }
}

export default authReducer;