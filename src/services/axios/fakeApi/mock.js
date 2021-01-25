import MockAdapter from 'axios-mock-adapter'
import apiClient from '../index'

const mock = new MockAdapter(apiClient, { delayResponse: 1500 })

export default mock
