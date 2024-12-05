const itens = document.querySelectorAll(".item-drag");
const posicoes = document.querySelectorAll(".area-drop");
const mensagem = document.getElementById("mensagem");
let tentativas = 0; // Contador de itens movidos
let itensMovidos = []; // Lista de itens movidos

// Adiciona eventos para drag-and-drop e touch
itens.forEach((item) => {
  item.addEventListener("dragstart", (event) => {
    if (item.classList.contains("disabled")) return;
    event.dataTransfer.setData("item", item.id); // Usando o ID do item
  });

  // Suporte para dispositivos móveis
  item.addEventListener("touchstart", (event) => {
    if (item.classList.contains("disabled")) return;
    event.target.classList.add("dragging");
  });

  item.addEventListener("touchmove", (event) => {
    if (item.classList.contains("disabled")) return;
    const touch = event.touches[0];
    const draggingItem = document.querySelector(".dragging");
    if (draggingItem) {
      draggingItem.style.position = "absolute";
      draggingItem.style.left = `${touch.pageX}px`;
      draggingItem.style.top = `${touch.pageY}px`;
    }
    event.preventDefault();  // Impede que a tela seja rolada
  });

  item.addEventListener("touchend", (event) => {
    const draggingItem = document.querySelector(".dragging");
    if (draggingItem) {
      draggingItem.style.position = "";
      draggingItem.style.left = "";
      draggingItem.style.top = "";
      draggingItem.classList.remove("dragging");

      const itemName = draggingItem.id;
      handleDrop(itemName); // Passando o id do item
    }
  });
});

// Adiciona eventos de arrastar ao quarto
const quarto = document.getElementById("quarto");
quarto.addEventListener("dragover", (event) => {
  event.preventDefault(); // Necessário para permitir o "drop"
});

quarto.addEventListener("drop", (event) => {
  event.preventDefault();
  const itemId = event.dataTransfer.getData("item");
  handleDrop(itemId); // Passando o id do item
});

// Função para tratar o drop e mover o item automaticamente para a posição correta
function handleDrop(itemId) {
  // if (tentativas >= 3) {
  //   mensagem.textContent = "Você já moveu 3 itens nesta tentativa!";
  //   return;
  // }

  // Adiciona o item à lista de itens movidos e atualiza a contagem
  if (!itensMovidos.includes(itemId)) {
    itensMovidos.push(itemId);
    tentativas++;
  }

  // Move o item automaticamente para a posição correta
  const posicaoCorreta = document.querySelector(`#area-${itemId}`); // Usando a nova identificação da área
  if (posicaoCorreta && !posicaoCorreta.classList.contains("completo")) {
    posicaoCorreta.textContent = ""; // Limpa a área de destino
    posicaoCorreta.classList.add("completo");
    const itemElement = document.getElementById(itemId);
    posicaoCorreta.appendChild(itemElement); // Coloca o item na área correta
     // Aplica a classe "grande" para aumentar o tamanho do item
     itemElement.classList.add("grande");
  }

  // Verifica se já foram movidos 3 itens
  if (tentativas === 3) {
    desabilitarItens(); // Desabilita os itens restantes
    validarTentativa(); // Valida a tentativa e apresenta a mensagem
  }
}

// Função para desabilitar os itens após 3 movimentos
function desabilitarItens() {
  itens.forEach((item) => {
    item.classList.add("disabled");
  });
}

// Função para validar a tentativa
function validarTentativa() {
  const itensCorretos = ["notebook", "modem", "cadeira"];
  const estaCorreto = itensCorretos.every((item) => itensMovidos.includes(item));

  if (estaCorreto) {
    mensagem.textContent = "A palavra da sua organização é COMPUTADOR.";
    mensagem.style.color = 'green';
  } else {
    mensagem.textContent = "A palavra da sua organização é CELULAR.";
    mensagem.style.color = 'red';
  }
}
