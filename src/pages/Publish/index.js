import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useEffect, useState } from 'react'
import { createArticle, getArticleById, getArticleListAPI, getChannelAPI, updateArticleAPI } from '@/apis/article'
import { useChannel } from '@/hooks/useChannel'

const { Option } = Select

const Publish = () => {
  //获取频道列表
  const { channelList } = useChannel()

  //发布文章
  const onFinish = async (formValue) => {
    if (imageList.length !== imageType) return message.warning('封面类型和图片数量不匹配')
    const { channel_id, content, title } = formValue
    const params = {
      channel_id,
      content,
      title,
      type: 1,
      cover: {
        type: imageType, //封面模式
        //新增和编辑不同的url处理逻辑
        images: imageList.map(item => {
          if (item.response) {
            return item.response.data.url
          } else {
            return item.url
          }
        }) //图片列表
      }
    }
    //新增 新增接口 编辑状态 更新接口 id
    if (articleId) {
      await updateArticleAPI({ ...params, id: articleId })
    } else {
      await createArticle(params)
    }
    message.success(`${articleId ? '编辑文章成功' : '发布文章成功'}`)
  }

  //上传图片
  const [imageList, setImageList] = useState([])
  const onUploadChange = (info) => {
    setImageList(info.fileList)
  }

  //控制图片type
  const [imageType, setImageType] = useState(0)

  const onTypeChange = (e) => {
    console.log(e)
    setImageType(e.target.value)
  }

  //回填数据
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id')
  //获取实例
  const [form] = Form.useForm()
  useEffect(() => {
    async function getArticle() {
      const res = await getArticleById(articleId)
      const { cover, ...formValue } = res.data
      //设置表单数据
      form.setFieldsValue({ ...formValue, type: cover.type })
      // 2. 回填封面图片
      setImageType(cover.type) // 封面类型
      setImageList(cover.images.map(url => ({ url }))) // 封面list
    }
    if (articleId) {
      getArticle()
    }
  }, [articleId, form]
  )

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb items={[
            { title: <Link to={'/'}>首页</Link> },
            { title: `${articleId ? '编辑文章' : '发布文章'}` },
          ]}
          />
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 0 }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelList.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={onTypeChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imageType > 0 &&
              <Upload
                name="image"
                listType="picture-card"
                showUploadList
                action={'http://geek.itheima.net/v1_0/upload'}
                onChange={onUploadChange}
                maxCount={imageType}
                fileList={imageList}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            {/* 富文本编辑器 */}
            <ReactQuill
              className='publish-quill'
              theme='snow'
              placeholder='请输入文章内容'
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                发布文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Publish