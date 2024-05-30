import axios from "axios"
import { clearToken, getToken } from "./token"
import { Navigate } from "react-router-dom"
import router from "@/router"

//根域名配置  超时时间 请求拦截器/响应拦截器
const request = axios.create({
  baseURL: 'http://geek.itheima.net/v1_0',
  timeout: 5000
})

//添加请求拦截器
//在请求发送之前 做拦截 插入一些自定义的配置
request.interceptors.request.use((config) => {
  //操作这个config注入token数据
  //获取到token
  //按照后端的格式要求做token拼接
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

//添加响应拦截器
//在响应返回到客户端之前 做拦截 重点处理返回的数据
request.interceptors.response.use((response) => {
  return response.data
}, (error) => {
  //返回状态码401 token失效
  if (error.response.status === 401) {
    clearToken()
    router.navigate('/login')
    window.location.reload()
  }

  return Promise.reject(error)
})

export { request }