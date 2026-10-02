import mysql.connector
from flask import Flask, render_template

conexao = mysql.connector.connect(
    host = "127.0.0.1",
    user= "root",
    password = "",
    database = "notas",
);


app = Flask(__name__)

@app.route("/")
def entrada():
    return render_template("Nodev2.html")
if __name__ == "__main__":
    app.run()

