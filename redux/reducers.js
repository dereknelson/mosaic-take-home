import { GET_TOP_STOCKS_SUCCESS, GET_TOP_STOCKS_ERROR, GET_BALANCE_SHEET_SUCCESS, GET_BALANCE_SHEET_ERROR,  } from "./actions";



const initialState = {
    results: [],
    error: null,
}

const iexReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TOP_STOCKS_SUCCESS:
            return { ...state, ...action.payload }
        case GET_BALANCE_SHEET_SUCCESS:
            return { ...state, ...action.payload }
        default: return state;
    }
}
export default ({
    stocks: iexReducer
})