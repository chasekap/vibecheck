import search as s
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/search/<search>')
def search_request(search):

    #tweets = s.search_twitter(search)
    #articles = s.search_all_news(search)
    urls = s.search_google(search)
    #urls = ["https://www.reddit.com/r/SFGiants/","https://www.reddit.com/r/Politics/"] <-- good way to test if out of searches
    coms = s.search_reddit(urls)
    avg_sentiment, sample = s.analyze_text(coms,search)

    word_count = s.word_count(coms)
    output_dict = {
        "urls": urls,
        "avg_sentiment": avg_sentiment,
        "word_count": word_count,
        "comments" : len(coms),
        "sample" : sample

    }
    return output_dict
