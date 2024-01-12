import { useState } from 'react'

const Blog = ({ blog, handleEditBlog, handleDeleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const handleVisibilityClick = () => {
    setVisible(!visible)
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

  const deleteBtn = () =>  (
    <button onClick={deleteBlog}>remove</button>
  )

  return (
    <div className='blogBlock'>
      <div>{blog.title} {blog.author} <button onClick={handleVisibilityClick}>{visible ? 'hide' : 'view'}</button></div>
      <div className={visible ? 'visibleBlogInfo' : 'hiddenBlogInfo'}>
        <p>{blog.url}</p>
        <p>likes {blog.upvotes} <button onClick={addLike}>like</button></p>
        <p>{blog.user.name}</p>
        {user.username === blog.user.username && deleteBtn()}
      </div>
    </div>
  )
}


export default Blog