import {isValidURL} from '../helpers'

describe('isValidURL', () => {
    it('should return true for a valid URL', () => {
        const validURL = 'https://www.example.com/image.jpg'
        const result = isValidURL(validURL)
        expect(result).toBe(true)
    })

    it('should throw an error for an invalid URL', () => {
        const invalidURL = 'not-a-valid-url'
        expect(() => isValidURL(invalidURL)).toThrowError('Invalid URL string: not-a-valid-url')
    })
})