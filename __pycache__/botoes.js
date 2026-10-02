function buttonAba() {
    let inputNota = document.getElementById("inputNota")
    let novaNota= document.createElement("input")

    novaNota.type= "text";
    novaNota.placeholder = "digite o nome para sua aba";

    inputNota.appendChild(novaNota);

    // divisão de áreas
    
    let ordemUL = document.getElementById("ordemUL")
    let Novali  = document.createElement("li")

    ordemUL.appendChild(Novali)

    // Correção, usei IA para identificar o erro e ajusta-lo.
    //Estava usando inputNota, para criar outros inputs dentro dele mesmo,
    //IA sugeriu usar uma div para ajustar e funcionou.
    //proximo passo = salvar abas dentro desses input.
}

function SalvarBT() {
    let mensagem = document.getElementById("textTitle");
    
    let textTtile = document.getElementById("textTitle").textContent= mensagem;
    let textInput = document.getElementById("textInput")

    let textT = textTtile.value
    let textI = textInput.value
    
}