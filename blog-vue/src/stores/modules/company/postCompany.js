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
  async createCompany({ commit }, { formData = {}, config = {} }) {
    try {
      const response = await axios.post(`${url}/company/add`, formData, config)
      return response.data
    } catch (err) {
      console.error('Failed posting data', err)
    }
  },
  async updateCompany({ commit }, { formData = {}, config = {} }) {
    try {
      const response = await axios.patch(
        `${url}/company/update/${config.id}`,
        formData,
        config.headers
      )
      return response.data
    } catch (err) {
      console.error('Failed posting data', err)
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
