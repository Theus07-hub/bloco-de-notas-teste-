import mysql.connector

conexao = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="",
    database="notas"
)
if conexao.is_connected():
    print("Conexão estabelecida com sucesso!")
cursor = conexao.cursor()