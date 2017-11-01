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

                <br />

                <cash-payment-component @dataPopulation="togglePaymentsLogButton"></cash-payment-component>

                <div class="buttons">
                    <p class="buttons__block">
                        <input class="button submit-btn" type="submit" value="Save and continue">
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
    created() {
        this.getPaymentTypes()
    },
    data() {
        return {
            selectedPayment: false,
            viewPaymentsLogDisabled: false,
            paymentTypes: [],
            paymentRemission: false
        };
    },
    components: { CashPaymentComponent },
    methods: {
        changeName() {
            this.name = this.newName;
            this.newName = "";
        },

        getPaymentTypes() {
            PaymentTypesService.getTypes().then(response => {
                if (response.status === 200 && typeof response.data.error === 'undefined') {
                    this.paymentTypes = response.data
                }
            })
        },

        selectPaymentType(paymentType) {
            this.selectedPayment = paymentType
            this.viewPaymentsLogDisabled = true
        },

        submitPostData($ev) {
            console.log( $ev )
            $ev.preventDefault();
            return false;
        },

        togglePaymentsLogButton(value) {
            if (value.length > 0) this.viewPaymentsLogDisabled = true
            else if (!this.selectedPayment && !this.paymentRemission) this.viewPaymentsLogDisabled = false
        },

        togglePaymentRemission() {
            this.paymentRemission = !this.paymentRemission
            if (this.paymentRemission === true) this.viewPaymentsLogDisabled = true
            else this.viewPaymentsLogDisabled = false
        }
    }
}
</script>