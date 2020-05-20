import search as s
from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/search/<search>')
def search_request(search):
    urls = s.search_google(search)
    coms = s.search_reddit(urls)
    return s.word_count(coms)
    