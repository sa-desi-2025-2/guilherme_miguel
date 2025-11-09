  document.addEventListener("DOMContentLoaded", function() {
    const botao = document.querySelector(".btn-outline-custom");
    const secaoDestino = document.querySelector("#como-funciona");

    botao.addEventListener("click", function() {
      secaoDestino.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
