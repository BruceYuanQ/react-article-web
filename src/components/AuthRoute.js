//封装高阶组件
//核心逻辑 有token正常跳转 无token去登录

const { getToken } = require("@/utils")
const { Navigate } = require("react-router-dom")

const AuthRoute = ({ children }) => {
  const isToken = getToken()
  if (isToken) {
    return <>{children}</>
  } else {
    return <Navigate to="/login" replace />
  }

}

export default AuthRoute