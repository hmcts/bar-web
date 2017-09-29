export const getPaymentTypes = (cb) => {
  cb([
    { id: 1, name: 'Cheque' },
    { id: 2, name: 'Cash' },
    { id: 3, name: 'Payment by Account' },
    { id: 4, name: 'Postal order' },
    { id: 5, name: 'Foreign cheque' },
    { id: 6, name: 'Request to ring' }
  ])
}
