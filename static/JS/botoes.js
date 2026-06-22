const noteInput = document.getElementById("valInput");
const newButton = document.getElementById("new-note");
const saveButton = document.getElementById("save-note");
const deleteButton = document.getElementById("delete-note");
const prevButton = document.getElementById("prev-note");
const nextButton = document.getElementById("next-note");

function newNote(){
    noteInput.value ="";
    noteInput.focus();
}

function saveNote(){
    alert("Botão Salvar Nota Funcionando");
}

function deleteNote(){
    noteInput.value = "";
}

function prevNote(){
    alert("Voltar Nota");
}

function nextNote(){
    alert("Avançar Nota");
}

newButton.addEventListener("click", newNote);
saveButton.addEventListener("click", saveNote);
deleteButton.addEventListener("click", deleteNote);
prevButton.addEventListener("click", prevNote);
nextButton.addEventListener("click", nextNote);
