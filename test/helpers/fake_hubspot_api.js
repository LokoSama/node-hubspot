const nockHelper = require('./nock_helper')

class FakeHubSpotApi {
  setupServer({
    demo = false,
    getEndpoints = [],
    postEndpoints = [],
    putEndpoints = [],
    patchEndpoints = [],
    deleteEndpoints = [],
  } = {}) {
    let maybeAddHapiKeyToQuery = (x) => x
    if (demo) {
      maybeAddHapiKeyToQuery = (parameters) => {
        parameters.query = parameters.query || {}
        parameters.query.hapikey = parameters.query.hapikey || 'demo'
        return parameters
      }
    }

    beforeEach(() => {
      nockHelper.disableNetConnect()
      nockHelper.mockRateLimit()
      getEndpoints.map(maybeAddHapiKeyToQuery).map(nockHelper.mockGetEndpoint)
      postEndpoints.map(maybeAddHapiKeyToQuery).map(nockHelper.mockPostEndpoint)
      putEndpoints.map(maybeAddHapiKeyToQuery).map(nockHelper.mockPutEndpoint)
      patchEndpoints
        .map(maybeAddHapiKeyToQuery)
        .map(nockHelper.mockPatchEndpoint)
      deleteEndpoints
        .map(maybeAddHapiKeyToQuery)
        .map(nockHelper.mockDeleteEndpoint)
    })

    afterEach(() => {
      nockHelper.resetNock()
    })
  }
}

module.exports = new FakeHubSpotApi()
