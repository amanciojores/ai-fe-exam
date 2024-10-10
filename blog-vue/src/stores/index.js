// store/index.js
import { createStore } from 'vuex'
import getUsers from './modules/users/getUsers'

const store = createStore({
  modules: {
    getUsers
  }
})

export default store
