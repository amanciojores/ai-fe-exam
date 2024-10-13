import axios from 'axios'
const url = import.meta.env.VITE_API_URL
const state = {
  users: ['Test'],
  credentials: []
}

const getters = {
  getUsers: (state) => state.users,
  getCredentials: (state) => state.credentials
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  },
  setCredentials(state, creds) {
    state.credentials = creds
  }
}

const actions = {
  async createUser({ commit }, params = {}) {
    try {
      const response = await axios(`${url}/users/createCreds`, {
        params: params
      })
      commit('setCredentials', response.data)
      return response.data
    } catch (err) {
      console.error('Error Fetching', err)
    }
  },
  async getUsers({ commit }) {
    try {
      const response = await axios(`${url}/users`)
      commit('setUsers', response.data)
      return response.data
    } catch (err) {
      console.error('Error Fetching', err)
    }
  },
  async userLogout({ commit }) {
    try {
      const response = await axios(`${url}/users/logout`, { withCredentials: true })
      return response.data
    } catch (err) {
      console.error(err)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
