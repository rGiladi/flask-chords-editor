import os


class Config():
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'e010203AzJQP020200000pq123ABd##FKJ'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://roy:rhcp010203@localhost/mychords'
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_TRACK_MODIFICATIONS = True
    TEMPLATES_AUTO_RELOAD = True

