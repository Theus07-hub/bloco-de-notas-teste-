from main import app
from flask import render_template


@app.route("/")
def menu():
    return render_template("Nodev2.html")

@app.route("/blog")
def blog_inicio():
    return "Meu blog!"
    