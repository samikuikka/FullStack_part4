const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const User = require('../models/user')
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
    if(!Object.prototype.hasOwnProperty.call(blog, 'id')) flag = false
  })
  expect(flag).toBe(true)
})

test('a valid blog can be added', async () => {
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
  expect(blogs).toHaveLength(helper.initialBlogs.length +1)

  const content = blogs.map(x => x.title)
  expect(content).toContain('How to add blogs')

})

test('if likes property missing, it will default to the value 0', async () => {
  const newBlog = {
    title: 'How to write spaghetticode',
    author: 'Teekkari Teemu',
    url: 'http://teekkariteemucodes.fi',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const blogs = await helper.blogsInDb()
  const blog = blogs[helper.initialBlogs.length]

  expect(blog.likes).toBe(0)
})

describe('can not create blogs without: ', () => {

  test('title', async() => {
    const newBlog = {
      author: 'Teekkari Teemu',
      url: 'http://teekkariteemucodes.fi',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogs = await helper.initialBlogs
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })

  test('url', async()=> {
    const newBlog = {
      title: 'How to write spaghetticode',
      author: 'Teekkari Teemu',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogs = await helper.initialBlogs
    expect(blogs).toHaveLength(helper.initialBlogs.length)
  })
})


//User tests

describe('user creation', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('works with fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Sami',
      name: 'Sami Kuikka',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  
  test('fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with proper statuscode when username invalid', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 't',
      name: 'Tom',
      password: 'abcdefg'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Username must be at least 3 characters long')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('fails with proper statuscode when password invalid', async() => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Tom the man',
      name: 'Tom',
      password: 'a'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    expect(result.body.error).toContain('Password must be at least 3 characters long')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  
})

afterAll(() => {
  mongoose.connection.close()
})