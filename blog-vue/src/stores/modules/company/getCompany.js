import axios from 'axios'
const url = import.meta.env.VITE_API_URL

const state = {
  company: []
}

const getters = {
  getCompany: (state) => state.company
}

const mutations = {
  setCompany(state, company) {
    state.company = company
  }
}

const actions = {
  async getCompany({ commit }) {
    try {
      const response = await axios.get(`${url}/company`)
      return response.data
    } catch (e) {
      console.error('Error fetching items', e)
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
