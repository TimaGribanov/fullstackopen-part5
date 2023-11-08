import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const hook = () => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }

  useEffect(hook, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({username, password})
      window.localStorage.setItem('loggedBlogsUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setError('Wrong credentials')
      setTimeout(() => {
        setError('')
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogsUser')
    setUser(null)
    setMessage('Successfully logged out!')
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
      const request = await blogService.newBlog(blogTitle, blogAuthor, blogUrl, user.token)
      console.log(request.status)

      if (request.status !== 201) {
        setError(`Could not create a new blog. Status: ${request.status}, ${request.statusText}`)
        setTimeout(() => {
          setError('')
        }, 5000)
      } else {
        hook()
        setMessage(`A new blog ${blogTitle} by ${blogAuthor} added`)
        setTimeout(() => {
          setMessage('')
        }, 5000)
        setBlogTitle('')
        setBlogAuthor('')
        setBlogUrl('')
      }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to applications</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogsBlock = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>log out</button></p>
      {blogsForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const blogsForm = () => (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            type="text"
            value={blogTitle}
            name="Title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={blogAuthor}
            name="Author"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={blogUrl}
            name="URL"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  return (
    <div>
      <Error error={error} />
      <Message message={message} />
      {user === null && loginForm()}
      {user !== null && blogsBlock()}
    </div>
  )
}

export default App