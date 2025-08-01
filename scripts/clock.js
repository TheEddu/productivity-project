function atualizarRelogio() {
    const agora = new Date();
    // const horas = agora.getHours();
    // const minutos = agora.getMinutes();
    // const segundos = agora.getSeconds();

    const relogioDigital = document.getElementById("relogio-digital");
    relogioDigital.textContent = agora.toLocaleTimeString();

    const fundo = document.getElementById("fundo");
    // const atividadeTexto = document.getElementById("atividade");
    // let cor = "bg-gray-400";
    // let atividade = "Descanso";

    // if (horas >= 8 && horas < 12) {
    //   cor = "bg-green-600";
    //   // atividade = "08:00 - 12:00 (Labs)";

    // } else if (horas >= 12 && horas < 13) {
    //   cor = "bg-orange-600";
    //   // atividade = "12:00 - 13:00 (Descanso)";

    // } else if (horas >= 13 && horas < 16) {
    //   cor = "bg-red-600";
    //   // atividade = "13:00 - 16:00 (Programação)";

    // } else if (horas >= 16 && horas < 18) {
    //   cor = "bg-blue-600";
    //   // atividade = "16:00 - 18:00 (Conteúdo Complementar)";

    // } else if (horas >= 18 && horas < 19) {
    //   cor = "bg-blue-400";
    //   // atividade = "16:00 - 19:00 (Escrita e Organização)";

    // } else if (horas >= 19 && horas < 23) {
    //   cor = "bg-orange-600";
    //   // atividade = "Descansar";
    // }

    fundo.className = `flex items-center justify-center min-h-screen transition-colors duration-500`;
    // if (atividadeTexto) {
    //   atividadeTexto.textContent = atividade;
    // }
  }

  setInterval(atualizarRelogio, 1000);
  window.onload = atualizarRelogio;