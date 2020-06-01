import search as s
from flask import Flask
from flask import request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root@localhost:3306/vibecheck_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


@app.route('/search/<search>/<sites>')
def search_request(search,sites):

    db.create_all()
    #tweets = s.search_twitter(search)
    urls = s.search_google(search)
    # urls = ["https://www.reddit.com/r/SFGiants/","https://www.reddit.com/r/Politics/"] <-- good way to test if out of searches
    coms = s.search_reddit(urls)
    avg_sentiment, sample = s.analyze_text(coms, search)

    word_count = s.word_count(coms)
    output_dict = {
        "urls": urls,
        "avg_sentiment": avg_sentiment,
        "word_count": word_count,
<<<<<<< HEAD
        "comments" : len(coms),
        "sample" : sample,
        "sites": sites
        
=======
        "comments": len(coms),
        "sample": sample

>>>>>>> 9a1c7107878ba5f21624c30f0ca9d30dbdacaf0f
    }

    search_db_entry = UserSearch(search=search)

    db.session.add(search_db_entry)
    db.session.commit()

    return output_dict


class UserSearch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    search = db.Column(db.String(280), unique=True, nullable=False)

    def __repr__(self):
        return '<Search %r>' % self.search
