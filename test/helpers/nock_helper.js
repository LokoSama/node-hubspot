const nock = require('nock')

const mockEndpoint = ({
  path,
  response,
  responseError,
  verb,
  request,
  query = {},
  statusCode = 200,
}) => {
  if (responseError) {
    nock('https://api.hubapi.com', { encodedQueryParams: true })
      .intercept(path, verb, request)
      .query(query)
      .replyWithError(responseError)
  } else {
    nock('https://api.hubapi.com', { encodedQueryParams: true })
      .intercept(path, verb, request)
      .query(query)
      .reply(statusCode, response)
  }
  console.log()
}

class NockHelper {
  disableNetConnect() {
    nock.disableNetConnect()
  }

  mockRateLimit() {
    mockEndpoint({
      path: '/integrations/v1/limit/daily',
      verb: 'GET',
      response: [
        {
          name: 'api-calls-daily',
          usageLimit: 160000,
          currentUsage: 19742,
          collectedAt: Date.now(),
          fetchStatus: 'CACHED',
          resetsAt: Date.now() + 24 * 60 * 60 * 1000,
        },
      ],
      query: { hapikey: process.env.HUBSPOT_API_KEY || 'demo' },
    })
  }

  mockGetEndpoint(parameters) {
    parameters.verb = 'GET'
    mockEndpoint(parameters)
  }

  mockPostEndpoint(parameters) {
    parameters.verb = 'POST'
    mockEndpoint(parameters)
  }

  mockPutEndpoint(parameters) {
    parameters.verb = 'PUT'
    mockEndpoint(parameters)
  }

  mockPatchEndpoint(parameters) {
    parameters.verb = 'PATCH'
    mockEndpoint(parameters)
  }

  mockDeleteEndpoint(parameters) {
    parameters.verb = 'DELETE'
    mockEndpoint(parameters)
  }

  resetNock() {
    nock.cleanAll()
    nock.enableNetConnect()
  }
}

module.exports = new NockHelper()
