import { BodyParsingError, MismatchContentTypeError, UnsupportedContentTypeError } from './errors'

/**
 * @module requestBodyParser
*/
const requestBodyParser = (contentType, body) => {
  if (!body ||
       (Object.keys(body).length === 0 && body.constructor === Object) ||
       body === '') return null

  let data

  if (contentType === 'application/json') {
    if (typeof body === 'object') {
      try {
        data = JSON.stringify(body)
      } catch (e) {
        throw BodyParsingError
      }
    } else {
      throw MismatchContentTypeError
    }
  } else if (contentType === 'text/plain') {
    if (typeof body === 'string') {
      // assume that it is in the right format (i.e name1=value1\r\nname2=value2\r\n...)
      // Otherwise I should raise an error but not sure how to validate that
      data = body
    } else if (typeof body === 'object') {
      data = Object.keys(body).reduce((dataString, key) => [...dataString, `${key}=${body[key]}`], '').join('\r\n')
    } else {
      throw MismatchContentTypeError
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    if (typeof body === 'string') {
      // assume that it is in the right format (i.e name1=value1&name2=value2&...)
      data = body
    } else if (typeof body === 'object') {
      data = Object.keys(body).reduce((dataString, key) => [...dataString, `${key}=${encodeURIComponent(body[key])}`], '').join('&')
    }
  } else {
    throw UnsupportedContentTypeError
  }

  return data
}

/**
 * Very simple, very lightweight, very light-on-features API that attempts to
 * parse the body of a Ajax Request.  You can pass it an object, in which case
 * the parse will try to convert it to the correct type based on the contentType
 * or a String, in which case the parser really does nothing other than passing
 * back this string (it assumes you know what you are doing in that case).
 *
 * @author Mark Vilrokx <mark@vilrokx.com>
 *
 * @example
 *  import parser from 'requestBodyParser'
 *
 * const jsonData = parser('application/json', {foo: bar})
 * console.log(jsonData) // "{'foo': 'bar'}"
 *
 * const plainData = parser('text/plain', {foo: bar})
 * console.log(plainData) // 'foo=bar'

 * @function
 * @param {string} contentType - The contentType of the body
 *                              (this effects the parser), mandatory
 * @param {(string|Object)} body - The body that needs to be parsed
 * @returns {string} - The data as a string as interpreted by the parser
 * @throws {BodyParsingError}
 * @throws {MismatchContentTypeError}
 * @throws {UnsupportedContentTypeError}
 */
export default requestBodyParser

