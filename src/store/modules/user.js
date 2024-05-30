//和用户相关的状态管理
import { createSlice } from "@reduxjs/toolkit";
import { setToken as _setToken, clearToken, getToken, request } from "@/utils";
import { getProfileAPI, loginAPI } from "@/apis/user";

const userStore = createSlice({
  name: 'user',
  //数据状态
  initialState: {
    token: getToken() || '',
    userInfo: {}
  },
  //同步修改方法
  reducers: {
    setToken(state, action) {
      state.token = action.payload
      //localStorge存入本地
      _setToken(action.payload)
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload
    },
    clearUserInfo(state) {
      state.token = ''
      state.userInfo = {}
      clearToken()
    }
  }
})

//解构出actionCreater
const { setToken, setUserInfo, clearUserInfo } = userStore.actions

//获取reducer函数
const userReducer = userStore.reducer

//异步方法封装
const fetchLogin = (loginForm) => {
  return async (dispatch) => {
    //发送异步请求 提交同步action进行token的存入
    const res = await loginAPI(loginForm)
    dispatch(setToken(res.data.token))
  }
}

const fetchUserInfo = () => {
  return async (dispatch) => {
    const res = await getProfileAPI()
    dispatch(setUserInfo(res.data))
  }
}

export { fetchLogin, setToken, fetchUserInfo, setUserInfo, clearUserInfo }

export default userReducer