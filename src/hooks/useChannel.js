const { getChannelAPI } = require("@/apis/article");
const { useState, useEffect } = require("react");

function useChannel() {
  //1获取频道列表
  const [channelList, setChannelList] = useState([])

  useEffect(() => {
    //封装函数 在函数体内调用接口
    const getChannelList = async () => {
      const res = await getChannelAPI()
      setChannelList(res.data.channels)
    }
    //调用函数
    getChannelList()
  }, [])
  //把组件中要用到的数据return出去
  return {
    channelList
  }
}

export { useChannel }