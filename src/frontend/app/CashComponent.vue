<template>
    <div class="cash-component">
        <div class="cash-component__block cash-component__payee-name">
            <div class="cc-content">
                <label class="heading-small" for="payee-name">Payee name*</label><br />
                <input autocomplete="off" class="form-control" id="payee-name" name="payee-name" v-model="payeeName" type="text" @keyup="populate($event)" />
            </div>
        </div>
        <div class="cash-component__block cash-component__amount">
            <div class="cc-content">
                <label class="heading-small" for="amount">Amount*</label><br />
                <input autocomplete="off" class="form-control" id="amount" name="amount" v-model="amount" type="text" @keyup="populate($event)" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'cash-payment-component',
    data() {
        return {
            amount: '',
            payeeName: ''
        }
    },
    methods: {
        populate($ev) {
            this.$emit('dataPopulation', $ev.currentTarget.value)
        }
    }
}
</script>
