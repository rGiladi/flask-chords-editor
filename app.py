from flask import Flask, render_template, request
from flask_bootstrap import Bootstrap
from flask_script import Manager, Shell
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import MigrateCommand, Migrate
from flask_wtf.csrf import CSRFProtect
from config import Config
from uuid import uuid4


bootstrap = Bootstrap()
db = SQLAlchemy()
csrf = CSRFProtect()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    csrf.init_app(app)
    db.init_app(app)
    bootstrap.init_app(app)
    return app

app = create_app()
manager = Manager(app)
migrate = Migrate(app, db)


@app.route('/')
def main():
    return render_template('app.html')


@app.route('/save_chords', methods=['POST'])
def save_chords():
    raw_html = request.form.get('chords')
    if not raw_html:
        return None
    else:
        url = uuid4().hex[:8]
        new_chords = Content(html=raw_html, url=url)
        db.session.add(new_chords)
        return url


@app.route('/chords/<url>', methods=['GET'])
def get_chords(url):
    col = Content.query.filter_by(url=url).first()
    if col:
        return render_template('chords.html', chords=col.html, url=col.url)
    else:
        return 'הדף המבוקש לא נמצא', 400


@app.route('/chords', methods=['POST', 'GET'])
def chords():
    return render_template('chords.html')


# MODELS
class Content(db.Model):
    html = db.Column(db.Text)
    url = db.Column(db.String(9), primary_key=True, unique=True)

    def __init__(self, html, url):
        self.html = html
        self.url = url


def make_shell_context():
    return dict(app=app, db=db, Content=Content)

manager.add_command('db', MigrateCommand)
manager.add_command('shell', Shell(make_context=make_shell_context))


if __name__ == '__main__':
    manager.run()