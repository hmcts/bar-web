import * as mock from 'mock-require'

mock('fees/feesClient', {
  'FeesClient': {
    checkFeeExists: (code) => Promise.resolve(code === 'existing'),
    checkRangeGroupExists: (code) => Promise.resolve(code === 'existing-range-group'),
    checkCategoryExists: (code) => Promise.resolve(code === 'existing-category')
  }
})
