import axios from 'axios'
const baseUrl = 'http://localhost:3003/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const newBlog = async (title, author, url, token) => {
  const body = {
    "author": author,
    "title": title,
    "url": url
  }
  try {
    const request = await axios.post(baseUrl, body, { headers: {"Authorization" : `Bearer ${token}`} })
    return request
  } catch (error) {
    return error
  }
}

export default { getAll, newBlog }