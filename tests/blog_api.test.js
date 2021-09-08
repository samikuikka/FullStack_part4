const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('all blogs have an property id', async () => {
  const response = await api.get('/api/blogs')
  let flag = true
  response.body.forEach(blog => {
    if(!Object.prototype.hasOwnProperty.call(blog, '_id')) flag = false
  })
  expect(flag).toBe(true)
})

test.only('a valid blog can be added', async () => {
  const newBlog = {
    title: 'How to add blogs',
    author: 'Paul',
    url: 'http://paulblogging.com',
    likes: 100
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await helper.blogsInDb()
  console.log(blogs)
  expect(blogs).toHaveLength(helper.initialBlogs.length +1)

  const content = blogs.map(x => x.title)
  expect(content).toContain('How to add blogs')
})

afterAll(() => {
  mongoose.connection.close()
})