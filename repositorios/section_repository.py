# ==========================================
# ANÁLISE DO CÓDIGO - section_repository.py
# ==========================================
# TOTAL FEITO POR VOCÊ: 73%
# TOTAL CORRIGIDO POR CLAUDE: 27%
#
# Detalhamento por função:
# - __init__: 100% você ✅
# - criar_section: 70% você (erros: vírgula extra + nome coluna)
# - listar_section: 95% você ✅ (erro: maiúscula)
# - atualizar_section: 40% você (erro crítico: WHERE errado + parâmetros)
# - deletar_section: 60% você (erro: nome da coluna)
# ==========================================

from .conexao_repository import conexao


class SectionRepository:
    def __init__(self):
        # 100% VOCÊ ✅
        self.conexao = conexao

    def criar_section(self, notebook_id, titulo_section):
        # 70% VOCÊ
        # Erros corrigidos: vírgula extra + nome_section → titulo_section
        """Cria uma nova section dentro de um notebook"""
        cursor = self.conexao.cursor()
        try:
            sql = "INSERT INTO section (notebook_id, titulo_section) VALUES (%s, %s)"
            cursor.execute(sql, (notebook_id, titulo_section))
            self.conexao.commit()
            return cursor.lastrowid
        finally:
            cursor.close()

    def listar_section(self, notebook_id):
        # 95% VOCÊ ✅
        # Erro corrigido: SECTION → section (maiúscula)
        """Lista todas as sections de um notebook específico"""
        cursor = self.conexao.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM section WHERE notebook_id = %s", (notebook_id,))
            resultados = cursor.fetchall()
            return resultados
        finally:
            cursor.close()

    def atualizar_section(self, id_section, novo_titulo):
        # 40% VOCÊ
        # Erros corrigidos: WHERE notebook_id → WHERE id_section (CRÍTICO!)
        #                   Parâmetros: (novo_titulo, notebook_id) → (id_section, novo_titulo)
        #                   nome_section → titulo_section
        """Atualiza o título de uma section específica"""
        cursor = self.conexao.cursor()
        try:
            sql = "UPDATE section SET titulo_section = %s WHERE id_section = %s"
            cursor.execute(sql, (novo_titulo, id_section))
            self.conexao.commit()
        finally:
            cursor.close()

    def deletar_section(self, id_section):
        # 60% VOCÊ
        # Erro corrigido: section_id → id_section (nome correto no banco)
        """Deleta uma section específica"""
        cursor = self.conexao.cursor()
        try:
            cursor.execute("DELETE FROM section WHERE id_section = %s", (id_section,))
            self.conexao.commit()
        finally:
            cursor.close()


