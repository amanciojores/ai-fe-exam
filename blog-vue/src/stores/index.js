// store/index.js
import { createStore } from 'vuex'
import getUsers from './modules/users/getUsers'
import postUsers from './modules/users/postUsers'
import getCompany from './modules/company/getCompany'
import postCompany from './modules/company/postCompany'
import postArticle from './modules/article/postArticle'
import getArticle from './modules/article/getArticle'
const store = createStore({
  modules: {
    getUsers,
    postUsers,
    getCompany,
    postCompany,
    postArticle,
    getArticle
  }
})

export default store
