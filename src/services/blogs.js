import axios from 'axios'

const baseUrl = 'http://localhost:3003/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const newBlog = async (title, author, url, token) => {
  const body = {
    'author': author,
    'title': title,
    'url': url
  }
  try {
    return await axios.post(baseUrl, body, { headers: { 'Authorization': `Bearer ${token}` } })
  } catch (error) {
    return error
  }
}

const editBlog = async (id, title, author, url, likes, token) => {
  const body = {
    'author': author,
    'upvotes': likes,
    'title': title,
    'url': url
  }

  try {
    return await axios.put(`${baseUrl}/${id}`, body, { headers: { 'Authorization': `Bearer ${token}` } })
  } catch (error) {
    return error
  }
}

const deleteBlog = async (id, token) => {
  try {
    return await axios.delete(`${baseUrl}/${id}`, { headers: { 'Authorization' : `Bearer ${token}` } })
  } catch (error) {
    return error
  }
}

export default { getAll, newBlog, editBlog, deleteBlog }