/* eslint-env node, jest */

const {palindrome} = require('../utils/for_testing.js')

test.skip('palindrome', () => {
    const result = palindrome('mati')
    expect(result).toBe('itam')
})

test.skip('palindrome empty string', () => {
    const result = palindrome('')
    expect(result).toBe('')
})

test.skip('palindrome empty string', () => {
    const result = palindrome()
    expect(result).toBeUndefined()
})