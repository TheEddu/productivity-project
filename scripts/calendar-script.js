function formatarDataLocal(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

function gerarTarefas() {
    const campoDataInicio = document.getElementById("start-date");
    const campoDataFim = document.getElementById("end-date");
    const campoTarefa = document.getElementById("task");
    const checkboxesDias = document.querySelectorAll("input[type=checkbox]:checked");

    const dataInicio = criarDataLocal(campoDataInicio.value);
    const dataFim = criarDataLocal(campoDataFim.value);

    const diasSelecionados = [...checkboxesDias].map(cb => parseInt(cb.value));
    const descricaoTarefa = campoTarefa.value.trim();

    if (!campoDataInicio.value || !campoDataFim.value || diasSelecionados.length === 0 || !descricaoTarefa) {
        alert("Preencha todos os campos.");
        return;
    }

    const novasTarefas = [];

    let data = new Date(dataInicio);
    while (data <= dataFim) {
        if (diasSelecionados.includes(data.getDay())) {
            const dataFormatada = formatarDataLocal(data);
            novasTarefas.push({ data: dataFormatada, descricao: descricaoTarefa });
        }
        data.setDate(data.getDate() + 1);
        console.log(dataInicio, dataFim)
    }

    // Salvar no localStorage
    const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
    const todasTarefas = [...tarefasSalvas, ...novasTarefas];
    localStorage.setItem("tarefas", JSON.stringify(todasTarefas));

    renderizarCalendario(mesVisivel, anoVisivel);

    limparFormulario()
}

function buscarTarefasPorData(data) {
    const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    return tarefas.filter(tarefa => tarefa.data === data);
}

const nomesDiasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
let dataHoje = new Date();
let mesVisivel = dataHoje.getMonth();
let anoVisivel = dataHoje.getFullYear();

function renderizarCalendario(mes, ano) {
    const gradeCalendario = document.getElementById("grade-calendario");
    gradeCalendario.innerHTML = "";

    document.getElementById("mes-ano").textContent =
        new Date(ano, mes).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
        
    // Cabeçalho dos dias
    // nomesDiasSemana.forEach(nomeDia => {
    //     const elementoDia = document.createElement("div");
    //     elementoDia.className = "calendar-day";
    //     elementoDia.textContent = nomeDia;
    //     gradeCalendario.appendChild(elementoDia);
    // });

    const primeiroDiaDoMes = new Date(ano, mes, 1);
    const ultimoDiaDoMes = new Date(ano, mes + 1, 0);
    const indicePrimeiroDiaSemana = primeiroDiaDoMes.getDay();
    const totalDiasNoMes = ultimoDiaDoMes.getDate();

    // Células vazias antes do primeiro dia
    for (let i = 0; i < indicePrimeiroDiaSemana; i++) {
        const celulaVazia = document.createElement("div");
        celulaVazia.className = "calendar-cell";
        gradeCalendario.appendChild(celulaVazia);
    }

    // Dias do mês
    for (let dia = 1; dia <= totalDiasNoMes; dia++) {
        const celulaDia = document.createElement("div");
        celulaDia.className = "calendar-cell";

        const dataAtualStr = new Date(ano, mes, dia).toISOString().split("T")[0];
        celulaDia.innerHTML = `<strong>${dia}</strong>`;

        const tarefasDoDia = buscarTarefasPorData(dataAtualStr);
        tarefasDoDia.forEach(tarefa => {
            const divTarefa = document.createElement("div");
            divTarefa.className = "task";
            divTarefa.innerHTML = `
                <span class="task-text">${tarefa.descricao}</span>
                <button class="remove-task-btn" title="Remover tarefa" onclick="removerTarefaCalendario('${tarefa.data}', '${tarefa.descricao.replace(/'/g,"\\'")}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#ef4444" viewBox="0 0 24 24"><path d="M9 3v1H4v2h16V4h-5V3H9zm2 2h2v1h-2V5zm-4 4v12c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V9H7zm2 2h2v8h-2v-8zm4 0h2v8h-2v-8z"/></svg>
                </button>
            `;
            celulaDia.appendChild(divTarefa);
        });

        gradeCalendario.appendChild(celulaDia);
    }
}

function mudarMes(direcao) {
    mesVisivel += direcao;
    if (mesVisivel > 11) {
        mesVisivel = 0;
        anoVisivel++;
    } else if (mesVisivel < 0) {
        mesVisivel = 11;
        anoVisivel--;
    }
    renderizarCalendario(mesVisivel, anoVisivel);
}

// Função global para remover tarefa do calendário/localStorage
window.removerTarefaCalendario = function(data, descricao) {
    let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
    tarefas = tarefas.filter(tarefa => !(tarefa.data === data && tarefa.descricao === descricao));
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    renderizarCalendario(mesVisivel, anoVisivel);
}

// Inicializar calendário ao carregar a página
window.onload = () => {
    renderizarCalendario(mesVisivel, anoVisivel);
};

function criarDataLocal(stringData) {
  const [ano, mes, dia] = stringData.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}

function limparFormulario() {
    document.getElementById("start-date").value = "";
    document.getElementById("end-date").value = "";
    document.getElementById("task").value = "";
    const checkboxes = document.querySelectorAll("input[type=checkbox]");
    checkboxes.forEach(checkbox => checkbox.checked = false);
}


// function sincronizarTarefas() {
//   const tarefasLista = JSON.parse(localStorage.getItem("data")) || [];
//   const tarefasCalendario = tarefasLista.map(task => ({
//     data: task.date,
//     descricao: `${task.title} - ${task.description}`,
//   }));
//   localStorage.setItem("tarefas", JSON.stringify(tarefasCalendario));
//   renderizarCalendario(mesVisivel, anoVisivel);
// }