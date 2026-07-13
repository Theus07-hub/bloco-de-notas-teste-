const noteInput = document.getElementById("valInput"); // const guarda refêrencia do elemento e getElementById encontra o botão no HTML
const newButton = document.getElementById("new-note");
const saveButton = document.getElementById("save-note");
const deleteButton = document.getElementById("delete-note");
const prevButton = document.getElementById("prev-note");
const nextButton = document.getElementById("next-note");

let notes = JSON.parse(localStorage.getItem("notes") || "[]")
let currentIndex = -1;

function newNote(){
    noteInput.value =""; // Vai apagar o campo de texto para reenscrever
    currentIndex = -1;  //diz que você não está editando uma nota salva ainda
    noteInput.focus(); // Seleciona a caixa de texto para digitar.
}

function saveNote(){
    const currentNote = noteInput.value.trim(); // vai procurar o item na caixa de texto

    if (currentNote === "") return;//impede que a nota seja salva em branco

    notes.push(currentNote);
    localStorage.setItem("notes", JSON.stringify(notes)); // vai selecionar o item da caixa de texto para salvar.
    currentIndex = notes.length - 1; 
}


//Área feita com IA, buscarei entender linha por linha pós finalização.
function deleteNote(){
   if (currentIndex === -1) { // A nota é nova, mas não foi salva ainda, então só limpa a escrita.
        noteInput.value = "";
        return;
   }

   notes.splice(currentIndex, 1); //splice ele modifica, limpa e substitui a array, portanto ele seleciona a nota selecionada e apaga.
   localStorage.setItem("notes", JSON.stringify(notes)); // localStorage.setItem(...) atualiza o que ficou salvo no navegador se não sobrar nada ele apaga tudo.

   if(notes.length === 0){
    noteInput.value = "";
    currentIndex = -1;
    return;
   }

   if(currentIndex >= notes.length){
        currentIndex = notes.length - 1;
   }

   noteInput.value = notes[currentIndex];
}

//Área feita com ia, não entendi como se monta essa estrutura, portanto decidi dar CTRL + C e entender depois.

function prevNote(){
    if (currentIndex > 0){ //volta uma nota, se existir anterior
        currentIndex --;
        noteInput.value = notes[currentIndex]; // Mostra a nota na tela
    }
}

function nextNote(){ //avança uma nota, se existir próxima
    if (currentIndex < notes.length - 1){
        currentIndex++;
        noteInput.value = notes[currentIndex];
    }
}

newButton.addEventListener("click", newNote); // addEventListener = faz a ligação entre os botões e a função.
saveButton.addEventListener("click", saveNote);
deleteButton.addEventListener("click", deleteNote);
prevButton.addEventListener("click", prevNote);
nextButton.addEventListener("click", nextNote);


// js pego no MDB cópiado//
document.querySelector('.first-button').addEventListener('click', function () {

document.querySelector('.animated-icon1').classList.toggle('open');
});
document.querySelector('.second-button').addEventListener('click', function () {

document.querySelector('.animated-icon2').classList.toggle('open');
});
document.querySelector('.third-button').addEventListener('click', function () {

document.querySelector('.animated-icon3').classList.toggle('open');
});

// Fim do código copiado.//