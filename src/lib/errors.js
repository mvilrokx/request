
const BodyParsingError = new Error('Something went wrong while parsing your request body, please double check your Content-Type and the data in the body of your request.')
const MismatchContentTypeError = new Error('There is a mismatch between the Content-Type and the request of the body.')
const UnsupportedContentTypeError = new Error('You supplied an as of yet unsupported contentType.')
const NetworkError = new Error('Network Error.')

/**
 * @module errors
*/
export {
  /**
   * Error raised when something goes wrong while parsing your request body.
   * @constant
   * @type {Error}
   */
  BodyParsingError,
  /**
   * Error raised when there is a mismatch between the Content-Type and the request of the body.
   * @constant
   * @type {Error}
   */
  MismatchContentTypeError,
  /**
   * Error raised when you supply an unsupported content-type in the header.
   * @constant
   * @type {Error}
   */
  UnsupportedContentTypeError,
  /**
   * Error raised when there is a network error, e.g. the server cannot be reached.
   * @constant
   * @type {Error}
   */
  NetworkError,
}
