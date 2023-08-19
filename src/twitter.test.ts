import { SearchType, TimelineType } from './options'
import { Twitter } from './twitter'

jest.setTimeout(90_000)

describe('Twitter', () => {
  let twitter: Twitter

  test('login', async () => {
    const username = process.env.TWITTER_USERNAME
    const password = process.env.TWITTER_PASSWORD
    const otpSecret = process.env.TWITTER_OTP_SECRET
    if (!username || !password || !otpSecret) {
      throw new Error('Failed to get environment variables.')
    }

    twitter = await Twitter.login({
      username,
      password,
      otpSecret,
      puppeteerOptions: {
        userDataDirectory: './data/userdata',
      },
      debugOptions: {
        outputResponse: {
          enable: true,
          outputDirectory: './data/responses',
        },
      },
    })
  })

  test('getUserByScreenName', async () => {
    const response = await twitter.getUserByScreenName({
      screenName: 'book000',
    })
    expect(response).toBeTruthy()
    expect(response.data).toBeTruthy()
    expect(response.data.user.result.rest_id).toBe('286048624')
  })

  test('getScreenNameByUserId', async () => {
    const response = await twitter.getScreenNameByUserId({
      userId: '286048624',
    })
    expect(response).toBeTruthy()
    expect(response).toBe('book000')
  })

  test('getUserByUserId', async () => {
    const response = await twitter.getUserByUserId({
      userId: '286048624',
    })
    expect(response).toBeTruthy()
    expect(response.screen_name).toBe('book000')
  })

  test('getRawUserByUserId', async () => {
    const response = await twitter.getRawUserByUserId({
      userId: '286048624',
    })
    expect(response).toBeTruthy()
    expect(response.data).toBeTruthy()
    expect(response.data.user.result.legacy.screen_name).toBe('book000')
  })

  test('getHomeTimelineRawTweets', async () => {
    const response = await twitter.getHomeTimelineRawTweets({
      timelineType: TimelineType.RECOMMEND,
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('getHomeTimelineTweets:recommend', async () => {
    const response = await twitter.getHomeTimelineTweets({
      timelineType: TimelineType.RECOMMEND,
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('getHomeTimelineTweets:following', async () => {
    const response = await twitter.getHomeTimelineTweets({
      timelineType: TimelineType.FOLLOWING,
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('searchRawTweets', async () => {
    const response = await twitter.searchRawTweets({
      query: 'from:book000',
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('searchTweets:popular', async () => {
    const response = await twitter.searchTweets({
      query: 'from:book000',
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('searchTweets:live(limit100)', async () => {
    const response = await twitter.searchTweets({
      query: 'from:book000',
      searchType: SearchType.LIVE,
      limit: 100,
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('searchTweets:image', async () => {
    const response = await twitter.searchTweets({
      query: 'from:book000',
      searchType: SearchType.IMAGE,
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('searchTweets:video', async () => {
    const response = await twitter.searchTweets({
      query: 'from:book000',
      searchType: SearchType.VIDEO,
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('getUserTweets', async () => {
    const response = await twitter.getUserTweets({
      screenName: 'book000',
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('getUserLikeTweets', async () => {
    const response = await twitter.getUserLikeTweets({
      screenName: 'book000',
    })
    expect(response).toBeTruthy()
    expect(response.length).toBeGreaterThan(0)
  })

  test('likeTweet', async () => {
    await expect(
      twitter.likeTweet({
        tweetId: '1685608131618086912',
      })
    ).resolves.toBe('Done')
  })

  test('unlikeTweet', async () => {
    await expect(
      twitter.unlikeTweet({
        tweetId: '1685608131618086912',
      })
    ).resolves.toBe('Done')
  })

  afterAll(async () => {
    await twitter.close()
  })
})
