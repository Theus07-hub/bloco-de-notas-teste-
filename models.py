#Arquvo para salvar banco de dados.
import mysql.connector

def conexao_banco():
    conexao=mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="bloco_nota"
    )
    return conexao