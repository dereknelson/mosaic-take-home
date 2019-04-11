

const initialState = {
    results: []
}

const iexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoading: true,
            };
        default:
        return state;
    }
}
export default ({
    whateverAPI: iexReducer
})