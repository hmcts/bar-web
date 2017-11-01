import axios from 'axios'

exports.getTypes = () => {
    return axios.get('/client/payment-types')
}
