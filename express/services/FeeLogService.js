const axios = require('axios');
const config = require('config');
const request = require('client-request/promise');
const barUrl = config.get('bar.url');

class FeeLogService {
    getFeeLog() {
        console.log(`Trying to reach: ${barUrl}/payment-logs`);
/*
        return request({
            uri: `${barUrl}/payment-logs`,
            method: "GET",
            json: true,
            headers: {
                'Content-Type': 'application/json'
            }
        });*/
    }
}

module.exports = FeeLogService;
