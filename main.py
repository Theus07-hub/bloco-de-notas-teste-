from flask import Flask
from models import conexao_banco
from views import *

#Criando o App..
app = Flask(__name__)#o conteudo "name" é para localizar aonde estamos em meio as pastas.

@app.route("/")
def home():
    conexao= conexao_banco()
    cursor= conexao.cursor()
    cursor.execute("SELECT * FROM nota")
    nota = cursor.fetchall() #método fetchall, ele vai listar as ultimas linhas como se fosse tuplas, e se não tiver nada.. ele returna uma lista vazia.
    cursor.close()
    conexao.close()
    return str(nota)

if __name__ == "__main__":
    app.run(debug=True)



#########################################

