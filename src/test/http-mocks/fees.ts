import * as config from 'config'
import * as mock from 'nock'
import * as HttpStatus from 'http-status-codes'

const serviceBaseURL: string = config.get<string>('fees.url')

function validFeeWithCode (code: string, description?: string) {
  return {
    'code': code,
    'type': 'fixed',
    'description': description || `Description for ${code}`,
    'amount': 109000
  }
}

export function resolveGetCategories () {
  mock(`${serviceBaseURL}/fees-register`)
    .get(new RegExp(`/categories`))
    .reply(HttpStatus.OK, [
      {
        'code': 'online-fees',
        'rangeGroup': {
          'ranges': [
            {
              'from': 1,
              'to': 30000,
              'fee': validFeeWithCode('X0024', 'Civil Court fees - Money Claims Online - Claim Amount - 0.01 upto 300 GBP')
            },
            {
              'from': 30001,
              'to': 50000,
              'fee': validFeeWithCode('X0025', 'Civil Court fees - Money Claims Online - Claim Amount - 300.01 upto 500 GBP')
            }
          ]
        }
      },
      {
        'code': 'hearing-fees',
        'rangeGroup': {
          'ranges': [
            {
              'from': 1,
              'to': 30000,
              'fee': validFeeWithCode('X0048', 'Civil Court fees - Hearing fees - Claim Amount - 0.01 upto 300 GBP')
            },
            {
              'from': 30001,
              'to': 50000,
              'fee': validFeeWithCode('X0049', 'Civil Court fees - Hearing fees - Claim Amount - 300.01 upto 500 GBP')
            }
          ]
        },
        'fees': [
          validFeeWithCode('X0046', 'Civil Court fees - Hearing fees - Multi track claim'),
          validFeeWithCode('X0047', 'Civil Court fees - Hearing fees - Fast track claim')
        ]
      }
    ])
}

export function resolveGetCategory () {
  mock(`${serviceBaseURL}/fees-register`)
    .get(new RegExp(`/categories/2`))
    .reply(HttpStatus.OK, {
      'code': 'hearing-fees',
      'rangeGroup': {
        'ranges': [
          {
            'from': 1,
            'to': 30000,
            'fee': validFeeWithCode('X0048', 'Civil Court fees - Hearing fees - Claim Amount - 0.01 upto 300 GBP')
          },
          {
            'from': 30001,
            'to': 50000,
            'fee': validFeeWithCode('X0049', 'Civil Court fees - Hearing fees - Claim Amount - 300.01 upto 500 GBP')
          }
        ]
      },
      'fees': [
        validFeeWithCode('X0046', 'Civil Court fees - Hearing fees - Multi track claim'),
        validFeeWithCode('X0047', 'Civil Court fees - Hearing fees - Fast track claim')
      ]
    })
}

export function resolveGetRangeGroups () {
  mock(`${serviceBaseURL}/fees-register`)
    .get(new RegExp(`/range-groups`))
    .reply(HttpStatus.OK, [
      {
        'code': 'range-group-code',
        'description': 'Range Group Description',
        'ranges': [
          {
            'from': 1,
            'to': 30000,
            'fee': validFeeWithCode('X0024', 'Civil Court fees - Money Claims Online - Claim Amount - 0.01 upto 300 GBP')
          },
          {
            'from': 30001,
            'to': 50000,
            'fee': validFeeWithCode('X0025', 'Civil Court fees - Money Claims Online - Claim Amount - 300.01 upto 500 GBP')
          }
        ]
      }
    ])
}

export function resolveGetRangeGroup () {
  mock(`${serviceBaseURL}/fees-register`)
    .get(new RegExp(`/range-groups/range-group-code`))
    .reply(HttpStatus.OK, {
      'code': 'range-group-code',
      'description': 'Range Group Edit Description',
      'ranges': [
        {
          'from': 1,
          'to': 30000,
          'fee': validFeeWithCode('X0024', 'Civil Court fees - Money Claims Online - Claim Amount - 0.01 upto 300 GBP')
        },
        {
          'from': 30001,
          'to': 50000,
          'fee': validFeeWithCode('X0025', 'Civil Court fees - Money Claims Online - Claim Amount - 300.01 upto 500 GBP')
        }
      ]
    })
}

export function resolvePutRangeGroup () {
  mock(`${serviceBaseURL}/fees-register/`)
    .put(new RegExp(`/range-groups/range-group-update-code`))
    .reply(HttpStatus.OK, {
      'code': 'range-group-code',
      'description': 'Range Group Put Description',
      'ranges': []
    })
}

export function resolveGetFee () {
  mock(`${serviceBaseURL}/fees-register`)
    .get(new RegExp(`/fees/X0001`))
    .reply(HttpStatus.OK, validFeeWithCode('X0001', 'Civil Court fees - Hearing fees - Claim Amount - 0.01 upto 300 GBP'))
}

export function resolveGetFees () {
  mock(`${serviceBaseURL}/fees-register`)
    .get(new RegExp(`/fees`))
    .reply(HttpStatus.OK, [
      validFeeWithCode('X0001', 'Civil Court fees - Hearing fees - Claim Amount - 0.01 upto 300 GBP'),
      validFeeWithCode('X0002', 'Civil Court fees - Hearing fees - Claim Amount - 0.01 upto 300 GBP')
    ])
}

export function resolvePutFee () {
  mock(`${serviceBaseURL}/fees-register/`)
    .put(new RegExp(`/fees/X0001`))
    .reply(HttpStatus.OK, validFeeWithCode('X0001', 'Updated Description'))
}
