// import test from 'tape'
import test from 'blue-tape'
import request from '../src/lib/request'
// import { useFakeXMLHttpRequest } from 'sinon'
import { spy, stub, useFakeXMLHttpRequest } from 'sinon'
import {
  BodyParsingError,
  MismatchContentTypeError,
  UnsupportedContentTypeError,
  NetworkError,
} from '../src/lib/errors'

const setup = () => {
  global.XMLHttpRequest = useFakeXMLHttpRequest()

  const fixtures = {}

  fixtures.xhr = useFakeXMLHttpRequest()
  fixtures.requests = []
  fixtures.xhr.onCreate = (req) => { fixtures.requests.push(req) }

  return fixtures
}

const teardown = (fixtures) => {
  fixtures.xhr.restore()
  delete global.XMLHttpRequest
}

test('A test with fixtures', (assert) => {
  const fixture = setup()

  assert.equals(typeof fixture, 'object','fixture should return an object')

  teardown(fixture)
  assert.end()
})

test('Sanity Tests', (assert) => {
  assert.equals(typeof request, 'function', 'request is a function.')
  assert.end()
})

test('A request with no options', (assert) => {
  const fixture = setup()
  request('http://www.example.com')
    .then((data) => {
      assert.equals(data, '', 'No data is returned.')
    })
    .catch((e) => {
      assert.comment('$%@#%^#$%^!@%!@$@&@$&@#%^!%@$~!')
      assert.fail(e)
    })

  assert.equals(fixture.requests.length, 1, 'A request was made.')
  assert.equals(fixture.requests[0].url, 'http://www.example.com', 'The URL was set correctly to what was passes into request().')
  assert.equals(
    fixture.requests[0].method,
    'GET',
    'The default GET method is being used.'
  )
  assert.deepEquals(
    fixture.requests[0].requestHeaders,
    {'content-type': 'application/x-www-form-urlencoded'},
    'The default content-type is being used.'
  )
  assert.equals(typeof fixture.requests[0].onload, 'function', 'onload handler is set.')
  assert.equals(typeof fixture.requests[0].onerror, 'function', 'onerror handler is set.')

  fixture.requests[0].respond(200) // trigger Resolve
  // console.log(fixture.requests[0])

  teardown(fixture)
  assert.end()
})

test('A request with additional headers', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {headers: {'header1': 'test', 'header2': 'test'}})

  assert.deepEquals(
    fixture.requests[0].requestHeaders,
    {'content-type': 'application/x-www-form-urlencoded', 'header1': 'test', 'header2': 'test'},
    'The default content-type is not overwritten and additional headers are added to the request.'
  )

  teardown(fixture)
  assert.end()
})

test('A request that overrides the default content-type header', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {headers: {'content-type': 'application/json'}})

  assert.deepEquals(
    fixture.requests[0].requestHeaders,
    {'content-type': 'application/json'},
    'The default content-type is overwritten.'
  )

  teardown(fixture)
  assert.end()
})

test('A request that overrides the default content-type header AND adds more headers', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {headers: {'content-type': 'application/json', 'header1': 'test'}})

  assert.deepEquals(
    fixture.requests[0].requestHeaders,
    {'content-type': 'application/json', 'header1': 'test'},
    'The default content-type is overwritten and a header is added.'
  )

  teardown(fixture)
  assert.end()
})

test('A POST request with no data', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {method: 'POST'})

  assert.equals(fixture.requests[0].method, 'POST', 'POST method is being used.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for GET', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {body: {'ignore': 'true'}})

  assert.equals(fixture.requests[0].requestBody, null, 'Body is ignored for GET requests.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {method: 'POST', body: {ignore: false}})

  assert.equals(fixture.requests[0].requestBody, 'ignore=false', 'Body object is turned into a query string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com', {method: 'POST', body: 'ignore=false'})

  assert.equals(fixture.requests[0].requestBody, 'ignore=false', 'Body string is left alone.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: {ignore: false}
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    '{"ignore":false}',
    'Body object is turned into a JSONstringified string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    null,
    'Body object missing is turned into a body-string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
      body: {ignore: false}
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    'ignore=false',
    'Body object with 1 property is turned into a body-string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
      body: {ignore: false, foo: 'bar'}
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    'ignore=false\r\nfoo=bar',
    'Body object with > 1 property is turned into a body-string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'text/plain'},
      body: 'ignore=false\r\nfoo=bar'
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    'ignore=false\r\nfoo=bar',
    'Body String is left untouched.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    null,
    'If Body object missing it is handled correctly by the parser.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: {ignore: false}
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    'ignore=false',
    'Body object with 1 property is turned into a urlencoded Query string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: {ignore: false, foo: 'foo bar'}
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    'ignore=false&foo=foo%20bar',
    'Body object with > 1 property is turned into a urlencoded Query string.')

  teardown(fixture)
  assert.end()
})

test('request body parsing for POST', (assert) => {
  const fixture = setup()

  request('http://www.example.com',
    {
      method: 'POST',
      headers: {'content-type': 'application/x-www-form-urlencoded'},
      body: 'ignore=false&foo=foo%20bar'
    }
  )

  assert.equals(fixture.requests[0].requestBody,
    'ignore=false&foo=foo%20bar',
    'Body string is left alone.')

  teardown(fixture)
  assert.end()
})

test('Error Handling of request body parsing', (assert) => {
  const fixture = setup()

  // console.log(UnsupportedContentTypeError.message)

  return assert.shouldFail(
    request('http://www.example.com', {
      method: 'POST',
      headers: {'content-type': 'not-supported'},
      body: {ignore: false, foo: 'bar'}
    }).then(() => teardown(fixture)),
    new RegExp(UnsupportedContentTypeError.message)
  )
})

test('Error Handling of request body parsing when body does not match contentType', (assert) => {
  const fixture = setup()

  return assert.shouldFail(
    request('http://www.example.com', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: 'This is a string but this should be JSON'
    }).then(() => teardown(fixture)),
    new RegExp(MismatchContentTypeError.message)
  )
})

// Same test as the one above but this does not need blue-tape
test('Error Handling of request body parsing when body does not match contentType', (assert) => {
  const fixture = setup()

  return (
    request('http://www.example.com', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: 'This is a string but this should be JSON'
    }).catch((rej) => {
      assert.deepEquals(rej, MismatchContentTypeError)
      teardown(fixture)
      // assert.end() // THIS NEEDS TO BE UNCOMMENTED IF YOU DO NOT USE BLUE-TAPE
    })
  )
})

test.skip('Error Handling of failure parsing body with JSON', (assert) => {
  const fixture = setup()

  stub(JSON, 'stringify').onCall(0).throws()

  return (
    request('http://www.example.com', {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: {foo: 'bar'}
    }).catch((rej) => {
      console.log(">> rej:", rej);
      assert.deepEquals(rej, BodyParsingError)
      JSON.stringify.restore()
      teardown(fixture)
    })
  )
})

test.skip('A request that fails (404)', (assert) => {
  const fixture = setup()


  teardown(fixture)
  assert.end()
})

// TODO: Test abortion of request (Really?)
