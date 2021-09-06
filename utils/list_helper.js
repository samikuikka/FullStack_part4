var _ = require('lodash')

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.length === 0
    ? []
    : blogs.reduce((best, current) => {
      return current.likes > best.likes ? current : best
    }, {likes: -1})
}

const mostBlogs = (blogs) => {

  //Check if empty
  if(blogs.length === 0) return {}

  const authors = _.groupBy(blogs, 'author')
  const x = _.sortBy(authors, author => author.length).pop()
  const author = x[0].author
  const amount = x.length
  return { author: author, blogs: amount }
}

const mostLikes = (blogs) => {
  //Check if empty
  if(blogs.length === 0) return {}

  const authors = _.groupBy(blogs, 'author')
  const x = _.sortBy(authors, author => {
    return author.reduce((sum, blog) => sum + blog.likes, 0)
  }).pop()
  const author = x[0].author
  const likes  = x.reduce((sum, blog) => sum + blog.likes, 0)
  return { author: author, likes: likes }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}