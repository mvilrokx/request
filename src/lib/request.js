import requestBodyParser from './requestBodyParser'
import { NetworkError } from './errors'

/**
 * @module request
*/
const request = (url, options) => {
  const xmlRequest = new XMLHttpRequest()

  const defaultOptions = {
    method: 'GET',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  }

  const req = { ...defaultOptions, ...options }

  // The prev. statement would have clobbered the headers, so we re-instate it
  if (options) req.headers = { ...defaultOptions.headers, ...options.headers || {} }
  const requestPromise = new Promise((resolve, reject) => {
    let data = null

    xmlRequest.open(req.method, url)

    Object.keys(req.headers).forEach((key) => {
      xmlRequest.setRequestHeader(key, req.headers[key])
    })

    if (req.method.toUpperCase() === 'GET' || !req.body) {
      data = null
    } else {
      try {
        data = requestBodyParser(req.headers['content-type'], req.body)
      } catch (e) {
        reject(e)
      }
    }

    xmlRequest.onload = () => {
      if (xmlRequest.status === 200) {
        resolve(xmlRequest.response)
      } else {
        reject(new Error(xmlRequest.statusText))
      }
    }

    xmlRequest.onerror = () => { reject(NetworkError) }
    xmlRequest.send(data)
  })

  requestPromise.abort = () => {
    if (xmlRequest && xmlRequest.readystate !== 4) {
      xmlRequest.abort()
    }
  }

  return requestPromise
}

/**
 * Very simple, very lightweight, very light-on-features API that allows you to
 * make Ajax requests.  This is basically a wrapper around XMLHttpRequest().  If
 * you need something more capable I suggest you
 * [look somewhere else]{@link https://github.com/request/request}.
 *
 * Accepts a url and an optional options object.  The options object can be used
 * to set the method (HTTP Verb), the contentType of the request and the body.
 * Currently we only support 'application/json', 'text/plain' and
 * 'application/x-www-form-urlencoded' ( = default).  The body can be an object
 * or a String.  If it is an object, we will convert it to the correct format
 * depending on the contentType you provided.  If it is a String, you need to
 * make sure it matches the contentType.
 * Returns a Promise Object that will resolve with the Ajax resonse when the
 * request returns succesfully.
 *
 * @author Mark Vilrokx <mark@vilrokx.com>
 *
 * @example
 *  import request from 'request'
 *
 * request('https://htmlscraper.herokuapp.com/api/scrape', {
 *   method: 'POST',
 *   headers: {'content-type': 'application/json'},
 *   body: {
 *     url:'https://www.twitter.com/mvilrokx',
 *     selector: '.ProfileHeaderCard-nameLink.u-textInheritColor.js-nav'
 *   }
 * }).then((data) => console.log(data))
 *
 * @function
 * @param {string} url - The URL of the REST API you want to call
 * @param {object} options - An options object to set headers, verb and data
 * @param {string} [options.method = 'GET'] - The HTTP Verb (GET, POST...)
 * @param {object} [options.headers = {'content-type': 'application/x-www-form-urlencoded'}] - The
 * headers to add to the request
 * @returns {Promise} - Promise which will get resolved when the Ajax request
 * completes
 * @throws {NetworkError}
 * @see module:errors
 *
 */
export default request
