const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'My test blog',
    author: 'Loon',
    url: 'http://loon-blog.com',
    likes: 1572,
  },
  {
    title: 'My second test blog',
    author: 'Loon',
    url: 'http://loon-blog2.com',
    likes: 146,
  },
  {
    title: 'Awesome test blog',
    author: 'Mr. Smith',
    url: 'http://awesomeblog.com',
    likes: 1,
  }
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb
}
