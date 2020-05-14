import requests
import praw #reddit api wrapper
import tweepy
import string
import nltk 
import re

from nltk.corpus import stopwords
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

#nltk.download('stopwords')
#nltk.download('punkt')
#nltk.download('averaged_perceptron_tagger')

blocked = {'RT', '@', 'https','*', '>', '<' , '[', ']','"','%','i','|','way','t','http','post','s','’'} #common things we should filter
#google auth
GOOGLE_API_KEY = "AIzaSyCOzm2amNVwqxRg2K0BUe59aOTXvhAgMXo" #pls don't query more than 25 times a day thnx 
SEARCH = "014749590020630390210:k5gghnyn2pt" #https://cse.google.com/cse/setup/basic?cx=014749590020630390210:k5gghnyn2pt

#twitter auth
consumer_key = 'TbCYT0ZvnwjP2eocV7W22ZIyK'
consumer_secret = 'IqsGUG3TeI9n8b9dqnZdlgT5uyt6wgKbjcS0kP2picRZZRcn7o'

access_token = '1112775245814001669-SLLqbSl0bE4msn2iR4eSl7MKM7PFUb'
access_token_secret = 'X0IHoSQdXEJ4ZWrGBEpQlb5r9W20dwFm3hk3YM6CBOXYv'




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
    reddit_urls = [] #populated by search
    url = f"https://www.googleapis.com/customsearch/v1?key={GOOGLE_API_KEY}&cx={SEARCH}&q={query}"
    data = requests.get(url).json()
    results = data['items']
    for result in results: 
        if "reddit" in result['link']: 
            reddit_urls.append(result['link'])
    return reddit_urls
   
def word_count(strings): #returns a list of tuples [word,freq] O(n) = nlog(n)
    words = {}
    multiwords = {}
    stops = stopwords.words('english')
    for s in strings: 
        s = s.strip(string.punctuation).lower()
        toked = nltk.word_tokenize(s)
        toked = nltk.pos_tag(toked)
        for word in toked:
            if (word[1] == 'NN' or word[1] == 'NNP' or word[1] == 'ADJ') and word[0] not in blocked: #noun, adjective
                if word[0] in words:
                    words[word[0]] += 1 
                    if words[word[0]] > 5:
                        multiwords[word[0]] = words[word[0]]
                else: 
                    words[word[0]] = 1          
  
    return multiwords
def parse_subreddit(r,reddit_comments,post,hot_flag=True): #query hot instead of top 
    
    lim = 20 #how many posts to return
    match = re.search('\/r\/(.*?)\/', post) #only name of subreddit
    subr = match.group(1)
    sub = r.subreddit(subr).hot(limit=lim) if hot_flag else r.subreddit(subr).top(limit=lim)
    for post in sub: 
        reddit_comments.append(post.selftext)
        comments = post.comments
        for comment in comments:
                if isinstance(comment,praw.models.MoreComments):
                        break
                        #comments = comment.comments()
                else:
                    reddit_comments.append(comment.body)
    

def search_reddit(posts):
    reddit_comments = [] #populated by search_reddit
    r = praw.Reddit(client_id="HI7iay-n7u2c_g", client_secret="xW4tDzN9RQdhxTcPuYehQ4bIKMo", user_agent="vibecheck" )
    if posts: #nonempty
        for post in posts: 
            try:
                postP = r.submission(url=post)
            except: 
                parse_subreddit(r,reddit_comments,post)
                continue
            reddit_comments.append(postP.selftext)
            comments = postP.comments
            for comment in comments:
                if isinstance(comment,praw.models.MoreComments):
                        break
                        #comments = comment.comments()
                else:
                    reddit_comments.append(comment.body)
    return reddit_comments


def search_twitter(keyword):

  auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
  auth.set_access_token(access_token, access_token_secret)

  api = tweepy.API(auth)

  public_tweets = api.search(keyword,count=100)

  for tweet in public_tweets:
    tweety = tweet.text
    twitter_comments.append(tweety)

def analyze_text(texts):
    global num_datum, sentiment_sum
    num_datum += len(texts)
    for text in texts: 
        compound_sentiment = analyser.polarity_scores(text).get('compound')
       # print("Tweet: ", text, "\nCompund sentiment: ", compound_sentiment, " - ",
               # interpret_compound_score(compound_sentiment), "\n")
        sentiment_sum += compound_sentiment





#coms = search_google('Feminism')
#search_twitter('Tiger King')
#print(reddit_urls)
#geeg = search_reddit(coms)


'''
analyze_text(twitter_comments)
mean_sentiment = sentiment_sum / num_datum
'''
#print("Mean Sentiment:", mean_sentiment, " - ", interpret_compound_score(mean_sentiment))


