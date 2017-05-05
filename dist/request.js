(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("request", [], factory);
	else if(typeof exports === 'object')
		exports["request"] = factory();
	else
		root["request"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var BodyParsingError = new Error('Something went wrong while parsing your request body, please double check your Content-Type and the data in the body of your request.');
var MismatchContentTypeError = new Error('There is a mismatch between the Content-Type and the request of the body.');
var UnsupportedContentTypeError = new Error('You supplied an as of yet unsupported contentType.');
var NetworkError = new Error('Network Error.');

/**
 * @module errors
*/
exports.BodyParsingError = BodyParsingError;
exports.MismatchContentTypeError = MismatchContentTypeError;
exports.UnsupportedContentTypeError = UnsupportedContentTypeError;
exports.NetworkError = NetworkError;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _requestBodyParser = __webpack_require__(3);

var _requestBodyParser2 = _interopRequireDefault(_requestBodyParser);

var _errors = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module request
*/
var request = function request(url, options) {
  var xmlRequest = new XMLHttpRequest();

  var defaultOptions = {
    method: 'GET',
    headers: { 'content-type': 'application/x-www-form-urlencoded' }
  };

  var req = _extends({}, defaultOptions, options);

  // The prev. statement would have clobbered the headers, so we re-instate it
  if (options) req.headers = _extends({}, defaultOptions.headers, options.headers || {});
  var requestPromise = new Promise(function (resolve, reject) {
    var data = null;

    xmlRequest.open(req.method, url);

    Object.keys(req.headers).forEach(function (key) {
      xmlRequest.setRequestHeader(key, req.headers[key]);
    });

    if (req.method.toUpperCase() === 'GET' || !req.body) {
      data = null;
    } else {
      try {
        data = (0, _requestBodyParser2.default)(req.headers['content-type'], req.body);
      } catch (e) {
        reject(e);
      }
    }

    xmlRequest.onload = function () {
      if (xmlRequest.status === 200) {
        resolve(xmlRequest.response);
      } else {
        reject(new Error(xmlRequest.statusText));
      }
    };

    xmlRequest.onerror = function () {
      reject(_errors.NetworkError);
    };
    xmlRequest.send(data);
  });

  requestPromise.abort = function () {
    if (xmlRequest && xmlRequest.readystate !== 4) {
      xmlRequest.abort();
    }
  };

  return requestPromise;
};

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
exports.default = request;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _request = __webpack_require__(1);

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _request2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _errors = __webpack_require__(0);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * @module requestBodyParser
*/
var requestBodyParser = function requestBodyParser(contentType, body) {
  if (!body || Object.keys(body).length === 0 && body.constructor === Object || body === '') return null;

  var data = void 0;

  if (contentType === 'application/json') {
    if ((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object') {
      try {
        data = JSON.stringify(body);
      } catch (e) {
        throw _errors.BodyParsingError;
      }
    } else {
      throw _errors.MismatchContentTypeError;
    }
  } else if (contentType === 'text/plain') {
    if (typeof body === 'string') {
      // assume that it is in the right format (i.e name1=value1\r\nname2=value2\r\n...)
      // Otherwise I should raise an error but not sure how to validate that
      data = body;
    } else if ((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object') {
      data = Object.keys(body).reduce(function (dataString, key) {
        return [].concat(_toConsumableArray(dataString), [key + '=' + body[key]]);
      }, '').join('\r\n');
    } else {
      throw _errors.MismatchContentTypeError;
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    if (typeof body === 'string') {
      // assume that it is in the right format (i.e name1=value1&name2=value2&...)
      data = body;
    } else if ((typeof body === 'undefined' ? 'undefined' : _typeof(body)) === 'object') {
      data = Object.keys(body).reduce(function (dataString, key) {
        return [].concat(_toConsumableArray(dataString), [key + '=' + encodeURIComponent(body[key])]);
      }, '').join('&');
    }
  } else {
    throw _errors.UnsupportedContentTypeError;
  }

  return data;
};

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
exports.default = requestBodyParser;

/***/ })
/******/ ]);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovLy93ZWJwYWNrL2Jvb3RzdHJhcCAyYjA4OWY1NTliYWE0N2Q0OGQ5NCIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL2Vycm9ycy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGliL3JlcXVlc3QuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9saWIvcmVxdWVzdEJvZHlQYXJzZXIuanMiXSwibmFtZXMiOlsiQm9keVBhcnNpbmdFcnJvciIsIkVycm9yIiwiTWlzbWF0Y2hDb250ZW50VHlwZUVycm9yIiwiVW5zdXBwb3J0ZWRDb250ZW50VHlwZUVycm9yIiwiTmV0d29ya0Vycm9yIiwicmVxdWVzdCIsInVybCIsIm9wdGlvbnMiLCJ4bWxSZXF1ZXN0IiwiWE1MSHR0cFJlcXVlc3QiLCJkZWZhdWx0T3B0aW9ucyIsIm1ldGhvZCIsImhlYWRlcnMiLCJyZXEiLCJyZXF1ZXN0UHJvbWlzZSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZGF0YSIsIm9wZW4iLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsInNldFJlcXVlc3RIZWFkZXIiLCJ0b1VwcGVyQ2FzZSIsImJvZHkiLCJlIiwib25sb2FkIiwic3RhdHVzIiwicmVzcG9uc2UiLCJzdGF0dXNUZXh0Iiwib25lcnJvciIsInNlbmQiLCJhYm9ydCIsInJlYWR5c3RhdGUiLCJtb2R1bGUiLCJleHBvcnRzIiwicmVxdWVzdEJvZHlQYXJzZXIiLCJjb250ZW50VHlwZSIsImxlbmd0aCIsImNvbnN0cnVjdG9yIiwiSlNPTiIsInN0cmluZ2lmeSIsInJlZHVjZSIsImRhdGFTdHJpbmciLCJqb2luIiwiZW5jb2RlVVJJQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FB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LDRDQUF5QnNCLFVBQXpCLElBQXdDdEIsR0FBeEMsU0FBK0NHLEtBQUtILEdBQUwsQ0FBL0M7QUFBQSxPQUF6QixFQUFzRixFQUF0RixFQUEwRnVCLElBQTFGLENBQStGLE1BQS9GLENBQVA7QUFDRCxLQUZNLE1BRUE7QUFDTDtBQUNEO0FBQ0YsR0FWTSxNQVVBLElBQUlQLGdCQUFnQixtQ0FBcEIsRUFBeUQ7QUFDOUQsUUFBSSxPQUFPYixJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0FBQzVCO0FBQ0FSLGFBQU9RLElBQVA7QUFDRCxLQUhELE1BR08sSUFBSSxRQUFPQSxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQThCO0FBQ25DUixhQUFPRSxPQUFPQyxJQUFQLENBQVlLLElBQVosRUFBa0JrQixNQUFsQixDQUF5QixVQUFDQyxVQUFELEVBQWF0QixHQUFiO0FBQUEsNENBQXlCc0IsVUFBekIsSUFBd0N0QixHQUF4QyxTQUErQ3dCLG1CQUFtQnJCLEtBQUtILEdBQUwsQ0FBbkIsQ0FBL0M7QUFBQSxPQUF6QixFQUEwRyxFQUExRyxFQUE4R3VCLElBQTlHLENBQW1ILEdBQW5ILENBQVA7QUFDRDtBQUNGLEdBUE0sTUFPQTtBQUNMO0FBQ0Q7O0FBRUQsU0FBTzVCLElBQVA7QUFDRCxDQXZDRDs7QUF5Q0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkEyQmVvQixpQiIsImZpbGUiOiJyZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoXCJyZXF1ZXN0XCIsIFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcInJlcXVlc3RcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wicmVxdWVzdFwiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuIFxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBpZGVudGl0eSBmdW5jdGlvbiBmb3IgY2FsbGluZyBoYXJtb255IGltcG9ydHMgd2l0aCB0aGUgY29ycmVjdCBjb250ZXh0XG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmkgPSBmdW5jdGlvbih2YWx1ZSkgeyByZXR1cm4gdmFsdWU7IH07XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDJiMDg5ZjU1OWJhYTQ3ZDQ4ZDk0IiwiXG5jb25zdCBCb2R5UGFyc2luZ0Vycm9yID0gbmV3IEVycm9yKCdTb21ldGhpbmcgd2VudCB3cm9uZyB3aGlsZSBwYXJzaW5nIHlvdXIgcmVxdWVzdCBib2R5LCBwbGVhc2UgZG91YmxlIGNoZWNrIHlvdXIgQ29udGVudC1UeXBlIGFuZCB0aGUgZGF0YSBpbiB0aGUgYm9keSBvZiB5b3VyIHJlcXVlc3QuJylcbmNvbnN0IE1pc21hdGNoQ29udGVudFR5cGVFcnJvciA9IG5ldyBFcnJvcignVGhlcmUgaXMgYSBtaXNtYXRjaCBiZXR3ZWVuIHRoZSBDb250ZW50LVR5cGUgYW5kIHRoZSByZXF1ZXN0IG9mIHRoZSBib2R5LicpXG5jb25zdCBVbnN1cHBvcnRlZENvbnRlbnRUeXBlRXJyb3IgPSBuZXcgRXJyb3IoJ1lvdSBzdXBwbGllZCBhbiBhcyBvZiB5ZXQgdW5zdXBwb3J0ZWQgY29udGVudFR5cGUuJylcbmNvbnN0IE5ldHdvcmtFcnJvciA9IG5ldyBFcnJvcignTmV0d29yayBFcnJvci4nKVxuXG4vKipcbiAqIEBtb2R1bGUgZXJyb3JzXG4qL1xuZXhwb3J0IHtcbiAgLyoqXG4gICAqIEVycm9yIHJhaXNlZCB3aGVuIHNvbWV0aGluZyBnb2VzIHdyb25nIHdoaWxlIHBhcnNpbmcgeW91ciByZXF1ZXN0IGJvZHkuXG4gICAqIEBjb25zdGFudFxuICAgKiBAdHlwZSB7RXJyb3J9XG4gICAqL1xuICBCb2R5UGFyc2luZ0Vycm9yLFxuICAvKipcbiAgICogRXJyb3IgcmFpc2VkIHdoZW4gdGhlcmUgaXMgYSBtaXNtYXRjaCBiZXR3ZWVuIHRoZSBDb250ZW50LVR5cGUgYW5kIHRoZSByZXF1ZXN0IG9mIHRoZSBib2R5LlxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge0Vycm9yfVxuICAgKi9cbiAgTWlzbWF0Y2hDb250ZW50VHlwZUVycm9yLFxuICAvKipcbiAgICogRXJyb3IgcmFpc2VkIHdoZW4geW91IHN1cHBseSBhbiB1bnN1cHBvcnRlZCBjb250ZW50LXR5cGUgaW4gdGhlIGhlYWRlci5cbiAgICogQGNvbnN0YW50XG4gICAqIEB0eXBlIHtFcnJvcn1cbiAgICovXG4gIFVuc3VwcG9ydGVkQ29udGVudFR5cGVFcnJvcixcbiAgLyoqXG4gICAqIEVycm9yIHJhaXNlZCB3aGVuIHRoZXJlIGlzIGEgbmV0d29yayBlcnJvciwgZS5nLiB0aGUgc2VydmVyIGNhbm5vdCBiZSByZWFjaGVkLlxuICAgKiBAY29uc3RhbnRcbiAgICogQHR5cGUge0Vycm9yfVxuICAgKi9cbiAgTmV0d29ya0Vycm9yLFxufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL2xpYi9lcnJvcnMuanMiLCJpbXBvcnQgcmVxdWVzdEJvZHlQYXJzZXIgZnJvbSAnLi9yZXF1ZXN0Qm9keVBhcnNlcidcbmltcG9ydCB7IE5ldHdvcmtFcnJvciB9IGZyb20gJy4vZXJyb3JzJ1xuXG4vKipcbiAqIEBtb2R1bGUgcmVxdWVzdFxuKi9cbmNvbnN0IHJlcXVlc3QgPSAodXJsLCBvcHRpb25zKSA9PiB7XG4gIGNvbnN0IHhtbFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXG4gIGNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xuICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgaGVhZGVyczogeyAnY29udGVudC10eXBlJzogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgfSxcbiAgfVxuXG4gIGNvbnN0IHJlcSA9IHsgLi4uZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfVxuXG4gIC8vIFRoZSBwcmV2LiBzdGF0ZW1lbnQgd291bGQgaGF2ZSBjbG9iYmVyZWQgdGhlIGhlYWRlcnMsIHNvIHdlIHJlLWluc3RhdGUgaXRcbiAgaWYgKG9wdGlvbnMpIHJlcS5oZWFkZXJzID0geyAuLi5kZWZhdWx0T3B0aW9ucy5oZWFkZXJzLCAuLi5vcHRpb25zLmhlYWRlcnMgfHwge30gfVxuICBjb25zdCByZXF1ZXN0UHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBsZXQgZGF0YSA9IG51bGxcblxuICAgIHhtbFJlcXVlc3Qub3BlbihyZXEubWV0aG9kLCB1cmwpXG5cbiAgICBPYmplY3Qua2V5cyhyZXEuaGVhZGVycykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICB4bWxSZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoa2V5LCByZXEuaGVhZGVyc1trZXldKVxuICAgIH0pXG5cbiAgICBpZiAocmVxLm1ldGhvZC50b1VwcGVyQ2FzZSgpID09PSAnR0VUJyB8fCAhcmVxLmJvZHkpIHtcbiAgICAgIGRhdGEgPSBudWxsXG4gICAgfSBlbHNlIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGRhdGEgPSByZXF1ZXN0Qm9keVBhcnNlcihyZXEuaGVhZGVyc1snY29udGVudC10eXBlJ10sIHJlcS5ib2R5KVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZWplY3QoZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB4bWxSZXF1ZXN0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGlmICh4bWxSZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIHJlc29sdmUoeG1sUmVxdWVzdC5yZXNwb25zZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoeG1sUmVxdWVzdC5zdGF0dXNUZXh0KSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB4bWxSZXF1ZXN0Lm9uZXJyb3IgPSAoKSA9PiB7IHJlamVjdChOZXR3b3JrRXJyb3IpIH1cbiAgICB4bWxSZXF1ZXN0LnNlbmQoZGF0YSlcbiAgfSlcblxuICByZXF1ZXN0UHJvbWlzZS5hYm9ydCA9ICgpID0+IHtcbiAgICBpZiAoeG1sUmVxdWVzdCAmJiB4bWxSZXF1ZXN0LnJlYWR5c3RhdGUgIT09IDQpIHtcbiAgICAgIHhtbFJlcXVlc3QuYWJvcnQoKVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXF1ZXN0UHJvbWlzZVxufVxuXG4vKipcbiAqIFZlcnkgc2ltcGxlLCB2ZXJ5IGxpZ2h0d2VpZ2h0LCB2ZXJ5IGxpZ2h0LW9uLWZlYXR1cmVzIEFQSSB0aGF0IGFsbG93cyB5b3UgdG9cbiAqIG1ha2UgQWpheCByZXF1ZXN0cy4gIFRoaXMgaXMgYmFzaWNhbGx5IGEgd3JhcHBlciBhcm91bmQgWE1MSHR0cFJlcXVlc3QoKS4gIElmXG4gKiB5b3UgbmVlZCBzb21ldGhpbmcgbW9yZSBjYXBhYmxlIEkgc3VnZ2VzdCB5b3VcbiAqIFtsb29rIHNvbWV3aGVyZSBlbHNlXXtAbGluayBodHRwczovL2dpdGh1Yi5jb20vcmVxdWVzdC9yZXF1ZXN0fS5cbiAqXG4gKiBBY2NlcHRzIGEgdXJsIGFuZCBhbiBvcHRpb25hbCBvcHRpb25zIG9iamVjdC4gIFRoZSBvcHRpb25zIG9iamVjdCBjYW4gYmUgdXNlZFxuICogdG8gc2V0IHRoZSBtZXRob2QgKEhUVFAgVmVyYiksIHRoZSBjb250ZW50VHlwZSBvZiB0aGUgcmVxdWVzdCBhbmQgdGhlIGJvZHkuXG4gKiBDdXJyZW50bHkgd2Ugb25seSBzdXBwb3J0ICdhcHBsaWNhdGlvbi9qc29uJywgJ3RleHQvcGxhaW4nIGFuZFxuICogJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcgKCA9IGRlZmF1bHQpLiAgVGhlIGJvZHkgY2FuIGJlIGFuIG9iamVjdFxuICogb3IgYSBTdHJpbmcuICBJZiBpdCBpcyBhbiBvYmplY3QsIHdlIHdpbGwgY29udmVydCBpdCB0byB0aGUgY29ycmVjdCBmb3JtYXRcbiAqIGRlcGVuZGluZyBvbiB0aGUgY29udGVudFR5cGUgeW91IHByb3ZpZGVkLiAgSWYgaXQgaXMgYSBTdHJpbmcsIHlvdSBuZWVkIHRvXG4gKiBtYWtlIHN1cmUgaXQgbWF0Y2hlcyB0aGUgY29udGVudFR5cGUuXG4gKiBSZXR1cm5zIGEgUHJvbWlzZSBPYmplY3QgdGhhdCB3aWxsIHJlc29sdmUgd2l0aCB0aGUgQWpheCByZXNvbnNlIHdoZW4gdGhlXG4gKiByZXF1ZXN0IHJldHVybnMgc3VjY2VzZnVsbHkuXG4gKlxuICogQGF1dGhvciBNYXJrIFZpbHJva3ggPG1hcmtAdmlscm9reC5jb20+XG4gKlxuICogQGV4YW1wbGVcbiAqICBpbXBvcnQgcmVxdWVzdCBmcm9tICdyZXF1ZXN0J1xuICpcbiAqIHJlcXVlc3QoJ2h0dHBzOi8vaHRtbHNjcmFwZXIuaGVyb2t1YXBwLmNvbS9hcGkvc2NyYXBlJywge1xuICogICBtZXRob2Q6ICdQT1NUJyxcbiAqICAgaGVhZGVyczogeydjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24vanNvbid9LFxuICogICBib2R5OiB7XG4gKiAgICAgdXJsOidodHRwczovL3d3dy50d2l0dGVyLmNvbS9tdmlscm9reCcsXG4gKiAgICAgc2VsZWN0b3I6ICcuUHJvZmlsZUhlYWRlckNhcmQtbmFtZUxpbmsudS10ZXh0SW5oZXJpdENvbG9yLmpzLW5hdidcbiAqICAgfVxuICogfSkudGhlbigoZGF0YSkgPT4gY29uc29sZS5sb2coZGF0YSkpXG4gKlxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gVGhlIFVSTCBvZiB0aGUgUkVTVCBBUEkgeW91IHdhbnQgdG8gY2FsbFxuICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgLSBBbiBvcHRpb25zIG9iamVjdCB0byBzZXQgaGVhZGVycywgdmVyYiBhbmQgZGF0YVxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRpb25zLm1ldGhvZCA9ICdHRVQnXSAtIFRoZSBIVFRQIFZlcmIgKEdFVCwgUE9TVC4uLilcbiAqIEBwYXJhbSB7b2JqZWN0fSBbb3B0aW9ucy5oZWFkZXJzID0geydjb250ZW50LXR5cGUnOiAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJ31dIC0gVGhlXG4gKiBoZWFkZXJzIHRvIGFkZCB0byB0aGUgcmVxdWVzdFxuICogQHJldHVybnMge1Byb21pc2V9IC0gUHJvbWlzZSB3aGljaCB3aWxsIGdldCByZXNvbHZlZCB3aGVuIHRoZSBBamF4IHJlcXVlc3RcbiAqIGNvbXBsZXRlc1xuICogQHRocm93cyB7TmV0d29ya0Vycm9yfVxuICogQHNlZSBtb2R1bGU6ZXJyb3JzXG4gKlxuICovXG5leHBvcnQgZGVmYXVsdCByZXF1ZXN0XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvbGliL3JlcXVlc3QuanMiLCJpbXBvcnQgcmVxdWVzdCBmcm9tICcuL2xpYi9yZXF1ZXN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVlc3RcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9pbmRleC5qcyIsImltcG9ydCB7IEJvZHlQYXJzaW5nRXJyb3IsIE1pc21hdGNoQ29udGVudFR5cGVFcnJvciwgVW5zdXBwb3J0ZWRDb250ZW50VHlwZUVycm9yIH0gZnJvbSAnLi9lcnJvcnMnXG5cbi8qKlxuICogQG1vZHVsZSByZXF1ZXN0Qm9keVBhcnNlclxuKi9cbmNvbnN0IHJlcXVlc3RCb2R5UGFyc2VyID0gKGNvbnRlbnRUeXBlLCBib2R5KSA9PiB7XG4gIGlmICghYm9keSB8fFxuICAgICAgIChPYmplY3Qua2V5cyhib2R5KS5sZW5ndGggPT09IDAgJiYgYm9keS5jb25zdHJ1Y3RvciA9PT0gT2JqZWN0KSB8fFxuICAgICAgIGJvZHkgPT09ICcnKSByZXR1cm4gbnVsbFxuXG4gIGxldCBkYXRhXG5cbiAgaWYgKGNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24vanNvbicpIHtcbiAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdvYmplY3QnKSB7XG4gICAgICB0cnkge1xuICAgICAgICBkYXRhID0gSlNPTi5zdHJpbmdpZnkoYm9keSlcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhyb3cgQm9keVBhcnNpbmdFcnJvclxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBNaXNtYXRjaENvbnRlbnRUeXBlRXJyb3JcbiAgICB9XG4gIH0gZWxzZSBpZiAoY29udGVudFR5cGUgPT09ICd0ZXh0L3BsYWluJykge1xuICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIGFzc3VtZSB0aGF0IGl0IGlzIGluIHRoZSByaWdodCBmb3JtYXQgKGkuZSBuYW1lMT12YWx1ZTFcXHJcXG5uYW1lMj12YWx1ZTJcXHJcXG4uLi4pXG4gICAgICAvLyBPdGhlcndpc2UgSSBzaG91bGQgcmFpc2UgYW4gZXJyb3IgYnV0IG5vdCBzdXJlIGhvdyB0byB2YWxpZGF0ZSB0aGF0XG4gICAgICBkYXRhID0gYm9keVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdvYmplY3QnKSB7XG4gICAgICBkYXRhID0gT2JqZWN0LmtleXMoYm9keSkucmVkdWNlKChkYXRhU3RyaW5nLCBrZXkpID0+IFsuLi5kYXRhU3RyaW5nLCBgJHtrZXl9PSR7Ym9keVtrZXldfWBdLCAnJykuam9pbignXFxyXFxuJylcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgTWlzbWF0Y2hDb250ZW50VHlwZUVycm9yXG4gICAgfVxuICB9IGVsc2UgaWYgKGNvbnRlbnRUeXBlID09PSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJykge1xuICAgIGlmICh0eXBlb2YgYm9keSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIC8vIGFzc3VtZSB0aGF0IGl0IGlzIGluIHRoZSByaWdodCBmb3JtYXQgKGkuZSBuYW1lMT12YWx1ZTEmbmFtZTI9dmFsdWUyJi4uLilcbiAgICAgIGRhdGEgPSBib2R5XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgYm9keSA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGRhdGEgPSBPYmplY3Qua2V5cyhib2R5KS5yZWR1Y2UoKGRhdGFTdHJpbmcsIGtleSkgPT4gWy4uLmRhdGFTdHJpbmcsIGAke2tleX09JHtlbmNvZGVVUklDb21wb25lbnQoYm9keVtrZXldKX1gXSwgJycpLmpvaW4oJyYnKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBVbnN1cHBvcnRlZENvbnRlbnRUeXBlRXJyb3JcbiAgfVxuXG4gIHJldHVybiBkYXRhXG59XG5cbi8qKlxuICogVmVyeSBzaW1wbGUsIHZlcnkgbGlnaHR3ZWlnaHQsIHZlcnkgbGlnaHQtb24tZmVhdHVyZXMgQVBJIHRoYXQgYXR0ZW1wdHMgdG9cbiAqIHBhcnNlIHRoZSBib2R5IG9mIGEgQWpheCBSZXF1ZXN0LiAgWW91IGNhbiBwYXNzIGl0IGFuIG9iamVjdCwgaW4gd2hpY2ggY2FzZVxuICogdGhlIHBhcnNlIHdpbGwgdHJ5IHRvIGNvbnZlcnQgaXQgdG8gdGhlIGNvcnJlY3QgdHlwZSBiYXNlZCBvbiB0aGUgY29udGVudFR5cGVcbiAqIG9yIGEgU3RyaW5nLCBpbiB3aGljaCBjYXNlIHRoZSBwYXJzZXIgcmVhbGx5IGRvZXMgbm90aGluZyBvdGhlciB0aGFuIHBhc3NpbmdcbiAqIGJhY2sgdGhpcyBzdHJpbmcgKGl0IGFzc3VtZXMgeW91IGtub3cgd2hhdCB5b3UgYXJlIGRvaW5nIGluIHRoYXQgY2FzZSkuXG4gKlxuICogQGF1dGhvciBNYXJrIFZpbHJva3ggPG1hcmtAdmlscm9reC5jb20+XG4gKlxuICogQGV4YW1wbGVcbiAqICBpbXBvcnQgcGFyc2VyIGZyb20gJ3JlcXVlc3RCb2R5UGFyc2VyJ1xuICpcbiAqIGNvbnN0IGpzb25EYXRhID0gcGFyc2VyKCdhcHBsaWNhdGlvbi9qc29uJywge2ZvbzogYmFyfSlcbiAqIGNvbnNvbGUubG9nKGpzb25EYXRhKSAvLyBcInsnZm9vJzogJ2Jhcid9XCJcbiAqXG4gKiBjb25zdCBwbGFpbkRhdGEgPSBwYXJzZXIoJ3RleHQvcGxhaW4nLCB7Zm9vOiBiYXJ9KVxuICogY29uc29sZS5sb2cocGxhaW5EYXRhKSAvLyAnZm9vPWJhcidcblxuICogQGZ1bmN0aW9uXG4gKiBAcGFyYW0ge3N0cmluZ30gY29udGVudFR5cGUgLSBUaGUgY29udGVudFR5cGUgb2YgdGhlIGJvZHlcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMgZWZmZWN0cyB0aGUgcGFyc2VyKSwgbWFuZGF0b3J5XG4gKiBAcGFyYW0geyhzdHJpbmd8T2JqZWN0KX0gYm9keSAtIFRoZSBib2R5IHRoYXQgbmVlZHMgdG8gYmUgcGFyc2VkXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAtIFRoZSBkYXRhIGFzIGEgc3RyaW5nIGFzIGludGVycHJldGVkIGJ5IHRoZSBwYXJzZXJcbiAqIEB0aHJvd3Mge0JvZHlQYXJzaW5nRXJyb3J9XG4gKiBAdGhyb3dzIHtNaXNtYXRjaENvbnRlbnRUeXBlRXJyb3J9XG4gKiBAdGhyb3dzIHtVbnN1cHBvcnRlZENvbnRlbnRUeXBlRXJyb3J9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHJlcXVlc3RCb2R5UGFyc2VyXG5cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9saWIvcmVxdWVzdEJvZHlQYXJzZXIuanMiXSwic291cmNlUm9vdCI6IiJ9