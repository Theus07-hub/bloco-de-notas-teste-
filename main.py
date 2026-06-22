from flask import Flask

#Criando o App..
app = Flask(__name__)#o conteudo "name" é para localizar aonde estamos em meio as pastas.

from views import *
if __name__ == "__main__":
    app.run()