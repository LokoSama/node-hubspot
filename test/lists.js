const { expect } = require('chai')
const Hubspot = require('..')
const fakeHubspotApi = require('./helpers/fake_hubspot_api')

describe('lists', () => {
  const hubspot = new Hubspot({
    accessToken: process.env.ACCESS_TOKEN || 'some-fake-token',
  })
  const listProperties = { name: 'Test list name' }

  describe('get', () => {
    const listsEndpoint = {
      path: '/contacts/v1/lists',
      response: { lists: [] },
    }
    fakeHubspotApi.setupServer({ getEndpoints: [listsEndpoint] })

    it('should return contact lists', () => {
      return hubspot.lists.get().then((data) => {
        expect(data).to.be.a('object')
        expect(data.lists).to.be.a('array')
      })
    })
  })

  describe('getOne', () => {
    describe('when passed a listId', () => {
      const listId = 123
      const listEndpoint = {
        path: `/contacts/v1/lists/${listId}`,
        response: listProperties,
      }
      fakeHubspotApi.setupServer({ getEndpoints: [listEndpoint] })

      it('should return one contact list', () => {
        return hubspot.lists.getOne(listId).then((data) => {
          expect(data).to.be.a('object')
          expect(data.name).to.equal(listProperties.name)
        })
      })
    })

    describe('when not passed a listId', () => {
      it('should return a rejected promise', () => {
        return hubspot.lists
          .getOne()
          .then(() => {
            throw new Error('I should have thrown an error')
          })
          .catch((error) => {
            expect(error.message).to.equal('id parameter must be provided.')
          })
      })
    })
  })

  describe('create', () => {
    const createListEndpoint = {
      path: '/contacts/v1/lists',
      request: listProperties,
      response: listProperties,
    }
    fakeHubspotApi.setupServer({ postEndpoints: [createListEndpoint] })

    it('should return the created list', () => {
      return hubspot.lists.create(listProperties).then((data) => {
        expect(data).to.be.a('object')
      })
    })
  })

  describe('delete', () => {
    const listId = 'fake_id'
    const deleteListEndpoint = {
      path: `/contacts/v1/lists/${listId}`,
      statusCode: 204,
    }
    fakeHubspotApi.setupServer({ deleteEndpoints: [deleteListEndpoint] })

    it('should return a 204', () => {
      return hubspot.lists.delete(listId).then((data) => {
        expect(data).to.be.an('undefined')
      })
    })
  })

  describe('getContacts', () => {
    describe('when passed a listId', () => {
      const listId = 123
      const listContactsEndpoint = {
        path: `/contacts/v1/lists/${listId}/contacts/all`,
        response: { contacts: [] },
      }
      fakeHubspotApi.setupServer({ getEndpoints: [listContactsEndpoint] })

      it('should return contacts', () => {
        return hubspot.lists.getContacts(listId).then((data) => {
          expect(data).to.be.a('object')
          expect(data.contacts).to.be.an('array')
        })
      })
    })

    describe('when not passed a listId', () => {
      it('should return a rejected promise', () => {
        return hubspot.lists
          .getContacts()
          .then(() => {
            throw new Error('I should have thrown an error')
          })
          .catch((error) => {
            expect(error.message).to.equal('id parameter must be provided.')
          })
      })
    })
  })

  describe('getRecentContacts', () => {
    describe('when passed a listId', () => {
      const listId = 123
      const listContactsEndpoint = {
        path: `/contacts/v1/lists/${listId}/contacts/recent`,
        response: { contacts: [] },
      }
      fakeHubspotApi.setupServer({ getEndpoints: [listContactsEndpoint] })

      it('should return contacts', () => {
        return hubspot.lists.getRecentContacts(listId).then((data) => {
          expect(data).to.be.a('object')
          expect(data.contacts).to.be.an('array')
        })
      })
    })

    describe('when not passed a listId', () => {
      it('should return a rejected promise', () => {
        return hubspot.lists
          .getRecentContacts()
          .then(() => {
            throw new Error('I should have thrown an error')
          })
          .catch((error) => {
            expect(error.message).to.equal('id parameter must be provided.')
          })
      })
    })
  })

  describe('addContacts', () => {
    describe('when a id and contactBody is provided', () => {
      const listId = 123
      const contactId = 234
      const addContactToListEndpoint = {
        path: `/contacts/v1/lists/${listId}/add`,
        request: { vids: [contactId] },
        response: { contacts: [] },
      }
      fakeHubspotApi.setupServer({ postEndpoints: [addContactToListEndpoint] })
      it('should return results', () => {
        return hubspot.lists
          .addContacts(listId, { vids: [contactId] })
          .then((data) => {
            expect(data).to.be.a('object')
          })
      })
    })

    describe('when not passed a listId', () => {
      it('should return a rejected promise', () => {
        return hubspot.lists
          .addContacts()
          .then(() => {
            throw new Error('I should have thrown an error')
          })
          .catch((error) => {
            expect(error.message).to.equal('id parameter must be provided.')
          })
      })
    })

    describe('when passed a listId but not contactBody', () => {
      it('should return a rejected promise', () => {
        return hubspot.lists
          .addContacts(123)
          .then(() => {
            throw new Error('I should have thrown an error')
          })
          .catch((error) => {
            expect(error.message).to.equal(
              'contactBody parameter must be provided.'
            )
          })
      })
    })
  })
})
