import { useState } from 'react'

const BlogsForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    try {
      await createBlog(blogTitle, blogAuthor, blogUrl)

      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id='blogTitle'
            type="text"
            value={blogTitle}
            name="Title"
            placeholder="Enter the title"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id='blogAuthor'
            type="text"
            value={blogAuthor}
            name="Author"
            placeholder="Enter the author name"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id='blogUrl'
            type="text"
            value={blogUrl}
            name="URL"
            placeholder="Enter the URL"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button id='createBlogBtn' type="submit">add</button>
      </form>
    </div>
  )
}

export default BlogsForm