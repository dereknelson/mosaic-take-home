import axios from 'axios'
import keys from './keys'
class API {
    url = 'https://cloud.iexapis.com/beta'
    token = `token=${keys.mosaicIEX}`

    stringify = args => JSON.stringify(args)

    getTopStocks = async () => {
        try {
            const url = this.url.concat(`/stock/market/list/mostactive?${this.token}`)
            const { data } = await axios.get(url)
            return data
        } catch (error) {
            throw error
        }
    }
    getStockInfo = async args => {
        const { stock, getWhat } = args
        try {
            const url = this.url.concat(`/stock/${stock}/${getWhat}?${this.token}`)
            const { data } = await axios.get(url)
            return data
        } catch (error) {
            throw error
        }
    }
}
export default new API()