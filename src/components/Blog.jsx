import { useState, useRef } from 'react'
import Togglable from './Togglable'

const Blog = ({ blog, handleEditBlog, handleDeleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const handleVisibilityRef = useRef()

  const handleVisibilityClick = () => {
    handleVisibilityRef.current.toggleVisibility()
  }

  const addLike = () => {
    let newLikes
    if (blog.upvotes === undefined || blog.upvotes === null)
      newLikes = 1
    else
      newLikes = blog.upvotes + 1
    handleEditBlog(blog.id, blog.title, blog.author, blog.url, newLikes)
  }

  const deleteBlog = () => {
    if (window.confirm(`Remove blog ${blog.title}`))
      handleDeleteBlog(blog.id)
  }

  const deleteBtn = () => (
    <p><button onClick={deleteBlog}>remove</button></p>
  )

  return (
    <div className='blogBlock'>
      <div>
        {blog.title} {blog.author}
      </div>
      <Togglable class='infoBlock' btnLabel={visible ? 'hide' : 'view'} ref={handleVisibilityRef}>
        <p>{blog.url}</p>
        <p>likes {blog.upvotes} <button className='likeBtn' onClick={addLike}>like</button></p>
        <p>{blog.user.name}</p>
        {user.username === blog.user.username && deleteBtn()}
      </Togglable>
    </div>
  )
}


export default Blog