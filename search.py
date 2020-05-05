import requests
import praw #reddit api wrapper

API_KEY = "AIzaSyCOzm2amNVwqxRg2K0BUe59aOTXvhAgMXo" #pls don't query more than 25 times a day thnx 
SEARCH = "014749590020630390210:k5gghnyn2pt" #https://cse.google.com/cse/setup/basic?cx=014749590020630390210:k5gghnyn2pt

reddit_urls = [] #populated by search 
reddit_comments = [] #populated by search_reddit

def search(query):
    url = f"https://www.googleapis.com/customsearch/v1?key={API_KEY}&cx={SEARCH}&q={query}"
    data = requests.get(url).json()
    results = data['items']
    for result in results: 
        if "reddit" in result['link']: 
            reddit_urls.append(result['link'])

#search("Emacs")
search("Eggert UCLA")

def search_reddit(posts):
    r = praw.Reddit(client_id="HI7iay-n7u2c_g", client_secret="xW4tDzN9RQdhxTcPuYehQ4bIKMo", user_agent="vibecheck" )
    
    for post in posts: 
        postP = r.submission(url=post)
        for comment in postP.comments:
            reddit_comments.append(comment.body)
   
    
search_reddit(reddit_urls)
print(reddit_comments)
