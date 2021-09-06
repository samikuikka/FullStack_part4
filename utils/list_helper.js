

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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}