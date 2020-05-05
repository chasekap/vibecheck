import requests
import praw #reddit api wrapper
import tweepy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

#google auth
GOOGLE_API_KEY = "AIzaSyCOzm2amNVwqxRg2K0BUe59aOTXvhAgMXo" #pls don't query more than 25 times a day thnx 
SEARCH = "014749590020630390210:k5gghnyn2pt" #https://cse.google.com/cse/setup/basic?cx=014749590020630390210:k5gghnyn2pt

#twitter auth
consumer_key = 'TbCYT0ZvnwjP2eocV7W22ZIyK'
consumer_secret = 'IqsGUG3TeI9n8b9dqnZdlgT5uyt6wgKbjcS0kP2picRZZRcn7o'

access_token = '1112775245814001669-SLLqbSl0bE4msn2iR4eSl7MKM7PFUb'
access_token_secret = 'X0IHoSQdXEJ4ZWrGBEpQlb5r9W20dwFm3hk3YM6CBOXYv'



reddit_urls = [] #populated by search
reddit_comments = [] #populated by search_reddit
twitter_comments = []


analyser = SentimentIntensityAnalyzer()
num_datum = 0
sentiment_sum = 0

def interpret_compound_score(score):
    if score >= 0.05:
        return "positive"
    if score <= -.05:
        return "negative"
    return "neutral"

def search_google(query):
    url = f"https://www.googleapis.com/customsearch/v1?key={GOOGLE_API_KEY}&cx={SEARCH}&q={query}"
    data = requests.get(url).json()
    results = data['items']
    for result in results: 
        if "reddit" in result['link']: 
            reddit_urls.append(result['link'])



def search_reddit(posts):
    r = praw.Reddit(client_id="HI7iay-n7u2c_g", client_secret="xW4tDzN9RQdhxTcPuYehQ4bIKMo", user_agent="vibecheck" )
    if posts: #nonempty
        for post in posts: 
            postP = r.submission(url=post)
            for comment in postP.comments:
                reddit_comments.append(comment.body)
   
    
#search_reddit(reddit_urls)




def search_twitter(keyword):

  auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
  auth.set_access_token(access_token, access_token_secret)

  api = tweepy.API(auth)

  public_tweets = api.search(keyword)

  for tweet in public_tweets:
    tweety = tweet.text
    twitter_comments.append(tweety)
    print(tweety)
    

#Test because ppl love to tweet about him
def analyze_text(texts):
    global num_datum, sentiment_sum
    num_datum += len(public_tweets)
    for text in texts: 
        compound_sentiment = analyser.polarity_scores(tweety).get('compound')
        print("Compund sentiment: ", compound_sentiment, " - ", 
                interpret_compound_score(compound_sentiment), "\n")
        sentiment_sum += compound_sentiment
        
search_twitter('Trump')
mean_sentiment = sentiment_sum / num_datum
print("Mean Sentiment:", mean_sentiment, " - ", interpret_compound_score(mean_sentiment))
