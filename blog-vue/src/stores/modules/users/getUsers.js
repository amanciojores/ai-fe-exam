import axios from 'axios'

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
  async fetchItems({ commit }, params = {}) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}`, {
        params: params
      })
      commit('setUsers', response.data)
    } catch (error) {
      console.error('Error fetching items:', error)
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
