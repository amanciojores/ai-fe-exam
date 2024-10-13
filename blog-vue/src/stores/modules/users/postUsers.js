import axios from 'axios'
const url = import.meta.env.VITE_API_URL

const state = {
  users: []
}

const getters = {
  getUsers: (state) => state.users
}

const mutations = {
  setUsers(state, users) {
    state.users = users
  }
}

const actions = {
  async loginUser({ commit }, { body = {}, config = {} }) {
    try {
      const response = await axios.post(`${url}/users/login`, body, config)
      commit('setUsers', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching Error:', error)
    }
  },

  async checkUser({ commit }) {
    try {
      const response = await axios.post(
        `${url}/protected/checkToken`,
        {},
        {
          withCredentials: true
        }
      )
      commit('setUsers', response.data)
      return response.data
    } catch (error) {
      console.error('Error Fetching Users', error)
    }
  },

  async createUser({ commit }, { body = {}, config = {} }) {
    try {
      const response = await axios.post(`${url}/users/add/${config.id}`, body)
      return response.data
    } catch (err) {}
  },

  async updateUser({ commit }, { body = {}, config = {} }) {
    try {
      const response = await axios.patch(`${url}/users/update/${config.id}`, body)
      return response.data
    } catch (err) {
      console.error('Error Fetching Users', err)
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
