import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Message from './components/Message'
import Error from './components/Error'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)

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

  const blogsFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
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
    // loginFormRef.current.toggleVisibility()

    event.preventDefault()
    window.localStorage.removeItem('loggedBlogsUser')
    setUser(null)
    setMessage('Successfully logged out!')
    setTimeout(() => {
      setMessage('')
    }, 5000)
  }

  const handleNewBlog = async (title, author, url) => {
    blogsFormRef.current.toggleVisibility()

    const request = await blogService.newBlog(title, author, url, user.token)

    if (request.status !== 201) {
      setError(`Could not create a new blog. Status: ${request.status}, ${request.statusText}`)
      setTimeout(() => {
        setError('')
      }, 5000)
    } else {
      hook()
      setMessage(`A new blog ${title} by ${author} added`)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const handleEditBlog = async (id, title, author, url, likes) => {
    const request = await blogService.editBlog(id, title, author, url, likes, user.token)

    if (request.status !== 204) {
      setError(`Could not edit a blog. Status: ${request.status}, ${request.statusText}`)
      setTimeout(() => {
        setError('')
      }, 5000)
    } else {
      hook()
      setMessage(`A blog ${title} by ${author} was edited`)
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const handleDeleteBlog = async (id) => {
    const request = await blogService.deleteBlog(id, user.token)

    if (request.status !== 204) {
      setError(`Could not delete a blog. Status: ${request.status}, ${request.statusText}`)
      setTimeout(() => {
        setError('')
      }, 5000)
    } else {
      hook()
      setMessage('A blog was deleted')
      setTimeout(() => {
        setMessage('')
      }, 5000)
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogsBlock = () => (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>log out</button></p>
      <Togglable class='newBlockBlog' btnLabel='new blog' ref={blogsFormRef}>
        <BlogsForm
          createBlog={handleNewBlog}
        />
      </Togglable>
      {blogs
        .sort((a, b) => b.upvotes - a.upvotes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleEditBlog={handleEditBlog}
            handleDeleteBlog={handleDeleteBlog}
            user={user}
          />
        )
      }
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