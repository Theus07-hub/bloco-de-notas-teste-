#Arquvo para salvar banco de dados.
import mysql.connector

conexao=mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="bloco_nota"
)

cursor = conexao.cursor()


    
