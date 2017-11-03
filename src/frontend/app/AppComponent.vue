<template>
    <div class="grid-row">
        <div class="column-two-thirds">
            <form v-if="paymentTypes.length > 0" @submit="submitPostData($event)">
                <div class="form-group">
                    <fieldset>
                        <legend>
                            <h1 class="heading-medium">Payment type*</h1>
                        </legend>

                        <div class="post-form">
                            <div class="post-form__radio-column">
                                <div class="multiple-choice" v-for="(paymentType, index) in paymentTypes" :key="paymentType.id" @click="selectPaymentType(paymentType)">
                                    <input :id="'payment-type-'+paymentType.id" name="radio-group" type="radio" :value="paymentType.id">
                                    <label :for="'payment-type-'+paymentType.id">{{ paymentType.name }}</label>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>
                            <h1 class="heading-medium">Does payment instruction have part remission?</h1>
                        </legend>

                        <div class="multiple-choice">
                            <input id="part-remission" name="part-remission" type="checkbox" value="part-remission" @click="togglePaymentRemission">
                            <label for="part-remission">Part remission</label>
                        </div>
                    </fieldset>
                </div>

                <cash-payment-component @dataPopulation="onDataPopulation"></cash-payment-component>

                <div class="buttons">
                    <p class="buttons__block">
                        <input class="button submit-btn" type="submit" value="Add to payments log">
                        <a class="button button-blue" :class="{ 'view-payment-log-disabled': viewPaymentsLogDisabled }">View payments log</a>
                    </p>
                </div>
            </form>

        </div>
    </div>
</template>

<script>
import * as PaymentTypesService from '../services/PaymentTypesService'
import CashPaymentComponent from './CashComponent.vue'

export default {
    name: "bar-app",
    components: { CashPaymentComponent },
    created() {
        this.getPaymentTypes()
    },
    data() {
        return {
            selectedPayment: {
                data: {},
                type: false
            },
            viewPaymentsLogDisabled: false,
            paymentTypes: [],
            paymentRemission: false,
        };
    },
    methods: {
        getPaymentTypes() {
            PaymentTypesService.getTypes().then(response => {
                if (response.status === 200 && typeof response.data.error === 'undefined') {
                    this.paymentTypes = response.data
                }
            })
        },

        onDataPopulation(value) {
            this.selectedPayment.data = value
            if (this._hasPartialData() || this._paymentPartialData()) this.viewPaymentsLogDisabled = true
            else this.viewPaymentsLogDisabled = false
        },

        selectPaymentType(paymentType) {
            this.selectedPayment.type = paymentType
            this.viewPaymentsLogDisabled = true
        },

        submitPostData($ev) {
            $ev.preventDefault();    
            return false;
        },

        togglePaymentRemission() {
            this.paymentRemission = !this.paymentRemission
            if (this._hasPartialData() || this._paymentPartialData()) this.viewPaymentsLogDisabled = true
            else this.viewPaymentsLogDisabled = false
        },

        _hasPartialData() {
            if (this.paymentRemission === true || this.selectedPayment.type !== false) {
                return true
            }

            return false
        },

        _paymentPartialData() {
            const keys = Object.keys(this.selectedPayment.data)
            let hasPartialData = false
            for (let i = 0; i < keys.length; i++) {
                if (this.selectedPayment.data[keys[i]].trim().length > 0) {
                    hasPartialData = true
                    break
                } 
            }

            return hasPartialData
        }
    }
}
</script>