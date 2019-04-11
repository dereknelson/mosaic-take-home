import api from "../api";
import produce from 'immer'
export const GET_BALANCE_SHEET_SUCCESS = 'GET_BALANCE_SHEET_SUCCESS'
export const GET_BALANCE_SHEET_ERROR = 'GET_BALANCE_SHEET_ERROR'

export const GET_TOP_STOCKS_SUCCESS = 'GET_TOP_STOCKS_SUCCESS'
export const GET_TOP_STOCKS_ERROR = 'GET_TOP_STOCKS_ERROR'

export function getTopStocks(args){
    return async (dispatch, getState) => {
        const data = await api.getTopStocks()
        dispatch({ type: GET_TOP_STOCKS_SUCCESS, payload: { results: data } })
        return data
    }
}
export function getStockPrice(args){
    return async (dispatch, getState) => {
        try {
            const price = await api.getStockInfo(args)
            return { price }
        } catch (error) {
            return { hasError: true, error }
        }
    }
}

export function getStockInfo(args){
    return async (dispatch, getState) => {
        const { stocks: oldStocks } = getState()
        let index = -1
        try {
            const result = await api.getStockInfo(args)
            console.log('result1',result)
            // produce ensures immutability 
            const newStocks = produce(oldStocks, stocks => {
                index = stocks.results.findIndex(stock => stock.symbol.toLowerCase() == args.stock.toLowerCase())
                if (index != -1) stocks.results[index] = { ...stocks.results[index], ...result }
                else stocks.results = [result].concat(stocks.results)
            })
            dispatch({ type: GET_BALANCE_SHEET_SUCCESS, payload: newStocks, })
            return { item: result, index } 
        } catch (error) {
            console.log('error',error.response)
            return { hasError: true, error }
        }
    }
}



function getBalanceSheetError(error) {
    return { type: GET_BALANCE_SHEET_ERROR, error, }
}