const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('totaLikes', () => {

  test('of no blogs is zero', () => {
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when only one blog, the likes of amount of that', () => {
    let blogs = [
      {
        _id: '61310ffaa56d4646fc9fcfab',
        title: 'My blog',
        author: 'Loon',
        url: 'http://loon-blog.com',
        likes: 1572,
        __v: 0 
      }
    ]

    expect(listHelper.totalLikes(blogs)).toBe(1572)  
  })

  test('in bigger blog list result is sum of all blogs', () => {
    let blogs = [
      {
        title: 'My blog',
        author: 'Loon',
        url: 'http://loon-blog.com',
        likes: 1572,
      },
      {
        title: 'My second blog',
        author: 'Loon',
        url: 'http://loon-blog2.com',
        likes: 146,
      },
      {
        title: 'Awesome blog',
        author: 'Mr. Smith',
        url: 'http://awesomeblog.com',
        likes: 1,
      }
    ]

    expect(listHelper.totalLikes(blogs)).toBe(1719)
  })
})