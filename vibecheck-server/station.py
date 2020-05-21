import search as s
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/search/<search>')
def search_request(search):
    tweets = s.search_twitter(search)
    avg_sentiment = s.analyze_text(tweets)
    word_count = s.word_count(tweets)
    output_dict = {
        "avg_sentiment": avg_sentiment,
        "word_count": word_count
    }
    return output_dict

    #return str(avg_sentiment)      
    ##\urls = s.search_google(search)
    #coms = s.search_reddit(urls)
    ##return s.word_count(coms)
    