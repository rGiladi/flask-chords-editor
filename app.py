from flask import Flask, render_template, request
from flask_bootstrap import Bootstrap
from flask_script import Manager
from flask_pymongo import PyMongo
from config import Config
from datetime import datetime
from uuid import uuid4

mongo = PyMongo()
bootstrap = Bootstrap()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    mongo.init_app(app)
    bootstrap.init_app(app)
    return app

app = create_app()
manager = Manager(app)


@app.route('/')
def main():
    return render_template('app.html')


@app.route('/save_chords', methods=['POST', 'GET'])
def save_chords():
    db_chords = mongo.db.chords
    chords = request.form.get('chords')
    db_chords.create_index('expiration', expireAfterSeconds=3600*24*3)
    expiration = {'expiration': datetime.utcnow()}
    url = uuid4().hex[:8]
    db_chords.insert_one({'url': url ,'chords': chords, 'expiration': expiration })

    return url

@app.route('/chords/<url>', methods=['GET'])
def get_chords(url):
    db_chords = mongo.db.chords
    col = db_chords.find_one({'url': url})
    if col:
        return render_template('chords.html', chords=col['chords'], url=col['url'])
    else:
        return 'הדף המבוקש לא נמצא', 400

@app.route('/chords', methods=['POST', 'GET'])
def chords():
    return render_template('chords.html')

if __name__ == '__main__':
    manager.run()