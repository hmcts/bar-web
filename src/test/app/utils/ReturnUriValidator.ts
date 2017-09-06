import { expect } from 'chai'
import { ensureUriSafeOrFallback } from 'utils/ReturnUriValidator'

describe('ReturnUriValidator', () => {

  it('should use fallback URI is case of null', () => {
    let url = ensureUriSafeOrFallback(null, '/admin/welcome')
    expect(url).to.eq('/admin/welcome')
  })

  it('should use fallback URI is case of absolute path', () => {
    let url = ensureUriSafeOrFallback('http://www.google.com', '/admin/welcome')
    expect(url).to.eq('/admin/welcome')
  })

  it('should use fallback URI if url does not start with /', () => {
    let url = ensureUriSafeOrFallback('admin/fees', '/admin/welcome')
    expect(url).to.eq('/admin/welcome')
  })

  it('should allow alphanumeric characters and /-_', () => {
    let url = ensureUriSafeOrFallback('/ABCDefgh/123456/-_', '/admin/welcome')
    expect(url).to.eq('/ABCDefgh/123456/-_')
  })

  it('should not allow other special characters', () => {
    let allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_/'
    for (let c = 1; c < 255; c++) {
      let returnUri = '/' + String.fromCharCode(c)
      let url = ensureUriSafeOrFallback(returnUri, '/admin/welcome')
      expect(url).to.eq(allowedChars.indexOf(String.fromCharCode(c).toUpperCase()) > -1 ? returnUri : '/admin/welcome')
    }
  })
})
