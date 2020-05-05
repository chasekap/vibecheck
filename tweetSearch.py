import tweepy

consumer_key = 'TbCYT0ZvnwjP2eocV7W22ZIyK'
consumer_secret = 'IqsGUG3TeI9n8b9dqnZdlgT5uyt6wgKbjcS0kP2picRZZRcn7o'

access_token = '1112775245814001669-SLLqbSl0bE4msn2iR4eSl7MKM7PFUb'
access_token_secret = 'X0IHoSQdXEJ4ZWrGBEpQlb5r9W20dwFm3hk3YM6CBOXYv'

def search(keyword):

  auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
  auth.set_access_token(access_token, access_token_secret)

  api = tweepy.API(auth)

  public_tweets = api.search(keyword)

  for tweet in public_tweets:
    tweety = tweet.text
    print(tweety + '\n')

#Test because ppl love to tweet about him
search('Trump')