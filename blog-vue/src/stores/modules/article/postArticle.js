import axios from 'axios'
const url = import.meta.env.VITE_API_URL

const state = {
  article: []
}

const getters = {
  getArticle: (state) => state.article
}

const mutations = {
  setArticle(state, article) {
    state.article = article
  }
}

const actions = {
  async addArticle({ commit }, { formData = {}, config = {} }) {
    try {
      const response = await axios.post(`${url}/article/add`, formData, config)
      return response.data
    } catch (e) {
      console.error('Error fetching items', e)
    }
  },
  async updateArticle({ commit }, { formData = {}, config = {}, id }) {
    try {
      const response = await axios.patch(`${url}/article/update/${id}`, formData, config)
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
