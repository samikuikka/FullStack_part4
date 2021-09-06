const listHelper = require('../utils/list_helper')

describe('favoriteBlog', () => {

  test('of no blogs is empty list', () => {
    expect(listHelper.favoriteBlog([])).toEqual([])
  })
  
  test('of 1 blog is that blog', () => {
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
  
    expect(listHelper.favoriteBlog(blogs)).toEqual(blogs[0])
  })
  
  test('in bigger blog list result is blog with most likes', () => {
    let blogs = [
        
      {
        title: 'My second blog',
        author: 'Loon',
        url: 'http://loon-blog2.com',
        likes: 146,
      },
      {
        title: 'My blog',
        author: 'Loon',
        url: 'http://loon-blog.com',
        likes: 1572,
      },
      {
        title: 'Awesome blog',
        author: 'Mr. Smith',
        url: 'http://awesomeblog.com',
        likes: 1,
      }
    ]
  
    expect(listHelper.favoriteBlog(blogs)).toBe(blogs[1])
  })
})