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
  async fetchArticles({ commit }) {
    try {
      const response = await axios.get(`${url}/article/`)
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
