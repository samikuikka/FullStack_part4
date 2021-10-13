const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const Comment = require('../models/comment')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name: 1})
    .populate('comments')
  response.json(blogs)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id)

  const comment = new Comment({
    comment: body.comment,
    blog: blog._id
  })

  const savedComment = await comment.save()
  blog.comments = blog.comments.concat(savedComment._id)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

  
blogsRouter.post('/',middleware.userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
    comments: []
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {

  const user = request.user

  //Check if token and user id of blog matches
  const blog = await Blog.findById(request.params.id)

  if( blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    return response.status(204).end()
  } else {
    return response.status(400).json({ error: 'wrong user token' })
  }
})

blogsRouter.put('/:id', middleware.userExtractor, async(request, response) => {
  const body = request.body

  const blog = {
    likes: body.likes || 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
  response.json(updatedBlog)
})

module.exports = blogsRouter
  