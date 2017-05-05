import test from 'tape'
import { stub } from 'sinon'
import requestBodyParser from '../src/lib/requestBodyParser'
// import { spy, stub, useFakeXMLHttpRequest } from 'sinon'
import { BodyParsingError, MismatchContentTypeError, UnsupportedContentTypeError } from '../src/lib/errors'


test('Generic behavior', (t) => {
  t.test('without parameters', (assert) => {
    const expected = null
    const actual = requestBodyParser('application/json')

    assert.equals(actual, expected, 'When no body is passed in, null is returned, always.')

    assert.end()
  })

  t.test('with valid contentType but without body', (assert) => {
    const expected = null
    const actual = requestBodyParser('application/json')

    assert.equals(actual, expected, 'When no body is passed in, null is returned, always.')

    assert.end()
  })

  t.throws(() => requestBodyParser('unsupported/type', ' '),
    UnsupportedContentTypeError,
    'Raise an error when an invalid ContentType is used.')

  t.end()
})

test('application/json content type', (t) => {
  t.test('with a valid but empty object in the body', (assert) => {
    const expected = null
    const actual = requestBodyParser('application/json', {})

    assert.equals(actual, expected, 'Return null')

    assert.end()
  })

  t.test('with a valid object in the body (1 property)', (assert) => {
    const expected = '{"foo":"bar"}'
    const actual = requestBodyParser('application/json', { foo: 'bar' })

    assert.equals(actual, expected, 'Return stringified JSON')

    assert.end()
  })

  t.test('with a valid object in the body (> 1 property)', (assert) => {
    const expected = '{"foo":"bar","fiz":"baz"}'
    const actual = requestBodyParser('application/json', { foo: 'bar', fiz: 'baz' })

    assert.equals(actual, expected, 'Return stringified JSON')

    assert.end()
  })

  t.throws(() => requestBodyParser('application/json', ' '),
    MismatchContentTypeError,
    'Raise an error when ContentType is JSON and a non-parsable Object is passed.')


  t.test('when JSON.stringify fails to parse the passed in JSON', (assert) => {
    stub(JSON, 'stringify').onCall(0).throws()

    assert.throws(() => requestBodyParser('application/json', { foo: 'bar' }),
      BodyParsingError,
      'Raise an error when JSON.stringify errors out.')

    JSON.stringify.restore()
    assert.end()
  })

  t.end()
})

test('text/plain content type', (t) => {
  t.test('with a valid but empty object in the body', (assert) => {
    const expected = null
    const actual = requestBodyParser('text/plain', {})

    assert.equals(actual, expected, 'Return null')

    assert.end()
  })

  t.test('with a valid but empty String in the body', (assert) => {
    const expected = null
    const actual = requestBodyParser('text/plain', '')

    assert.equals(actual, expected, 'Return null')

    assert.end()
  })

  t.test('with a valid object in the body (1 property)', (assert) => {
    const expected = 'foo=bar'
    const actual = requestBodyParser('text/plain', { foo: 'bar' })

    assert.equals(actual, expected, 'Return plain string')

    assert.end()
  })

  t.test('with a valid object in the body (>1 property)', (assert) => {
    const expected = 'foo=bar\r\nfiz=baz'
    const actual = requestBodyParser('text/plain', { foo: 'bar', fiz: 'baz' })

    assert.equals(actual, expected, 'Return plain string')

    assert.end()
  })

  t.test('with a valid string in the body (1 property)', (assert) => {
    const expected = 'foo=bar'
    const actual = requestBodyParser('text/plain', 'foo=bar')

    assert.equals(actual, expected, 'Return string')

    assert.end()
  })

  t.test('with a valid string in the body (>1 property)', (assert) => {
    const expected = 'foo=bar\r\nfiz=baz'
    const actual = requestBodyParser('text/plain', 'foo=bar\r\nfiz=baz')

    assert.equals(actual, expected, 'Return string')

    assert.end()
  })

  t.test('with a INvalid string in the body', (assert) => {
    const expected = 'invalid string'
    const actual = requestBodyParser('text/plain', 'invalid string')

    assert.equals(actual, expected, 'Still gets accepted, no validation done in parser!')

    assert.end()
  })

  t.test('with a INvalid string in the body', (assert) => {
    const expected = '0=invalid string'
    const actual = requestBodyParser('text/plain', ['invalid string'])

    assert.equals(actual, expected, 'Still gets accepted, no validation done in parser!')

    assert.end()
  })

  t.end()
})

test('application/x-www-form-urlencoded content type', (t) => {
  t.test('with a valid but empty object in the body', (assert) => {
    const expected = null
    const actual = requestBodyParser('application/x-www-form-urlencoded', {})

    assert.equals(actual, expected, 'Return null')

    assert.end()
  })

  t.test('with a valid but empty String in the body', (assert) => {
    const expected = null
    const actual = requestBodyParser('application/x-www-form-urlencoded', '')

    assert.equals(actual, expected, 'Return null')

    assert.end()
  })

  t.test('with a valid object in the body (1 property)', (assert) => {
    const expected = 'foo=bar'
    const actual = requestBodyParser('application/x-www-form-urlencoded', { foo: 'bar' })

    assert.equals(actual, expected, 'Return plain string')

    assert.end()
  })

  t.test('with a valid object in the body (>1 property)', (assert) => {
    const expected = 'foo=bar&fiz=baz'
    const actual = requestBodyParser('application/x-www-form-urlencoded', { foo: 'bar', fiz: 'baz' })

    assert.equals(actual, expected, 'Return plain string')

    assert.end()
  })

  t.test('with a valid string in the body (1 property)', (assert) => {
    const expected = 'foo=bar'
    const actual = requestBodyParser('application/x-www-form-urlencoded', 'foo=bar')

    assert.equals(actual, expected, 'Return string')

    assert.end()
  })

  t.test('with a valid string in the body (>1 property)', (assert) => {
    const expected = 'foo=bar&fiz=baz'
    const actual = requestBodyParser('application/x-www-form-urlencoded', 'foo=bar&fiz=baz')

    assert.equals(actual, expected, 'Return string')

    assert.end()
  })

  t.test('with a INvalid string in the body', (assert) => {
    const expected = 'invalid string'
    const actual = requestBodyParser('application/x-www-form-urlencoded', 'invalid string')

    assert.equals(actual, expected, 'Still gets accepted, no validation done in parser!')

    assert.end()
  })

  t.test('with a INvalid string in the body', (assert) => {
    const expected = '0=invalid%20string'
    const actual = requestBodyParser('application/x-www-form-urlencoded', ['invalid string'])

    assert.equals(actual, expected, 'Still gets accepted, no validation done in parser!')

    assert.end()
  })

  t.end()
})
