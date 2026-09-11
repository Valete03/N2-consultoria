import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDJxMEGKArvnwTTLYPrdhyfWweJcXmzYT8",
  authDomain: "buyeasy-4bcab.firebaseapp.com",
  projectId: "buyeasy-4bcab",
  storageBucket: "buyeasy-4bcab.firebasestorage.app",
  messagingSenderId: "475090934882",
  appId: "1:997891fdff85a23a89053b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const data = {
  tipo_negocio: "",
  segmento: "",
  outro_segmento: "",
  fontes_clientes: [],
  gargalo: "",
  objetivo: "",
  visao_6_12_meses: "",
  faturamento: "",
  nome: "",
  empresa: "",
  whatsapp: ""
};

let currentStep = 1;
const totalSteps = 5;

const intro = document.getElementById("introScreen");
const form = document.getElementById("diagnosticForm");
const success = document.getElementById("successScreen");
const progress = document.getElementById("progressBar");
const counter = document.getElementById("stepCounter");
const errorBox = document.getElementById("errorBox");
const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

document.getElementById("startBtn").addEventListener("click", () => {
  intro.style.display = "none";
  form.style.display = "block";
  updateStep();
});

function selectSingle(containerId, key, conditionalId = null) {
  const container = document.getElementById(containerId);
  container.querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {
      container.querySelectorAll(".choice").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      data[key] = btn.dataset.value;

      if (conditionalId) {
        const field = document.getElementById(conditionalId);
        field.classList.toggle("show", btn.dataset.value === "Outro");
        if (btn.dataset.value !== "Outro") field.value = "";
      }
      clearError();
    });
  });
}

function selectMulti(containerId, key) {
  document.getElementById(containerId).querySelectorAll(".choice").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("selected");
      data[key] = [...document.querySelectorAll(`#${containerId} .choice.selected`)].map(b => b.dataset.value);

      if (btn.dataset.value === "Não tenho uma fonte consistente") {
        const selected = data[key];
        if (selected.length > 1 && btn.classList.contains("selected")) {
          document.querySelectorAll(`#${containerId} .choice`).forEach(b => {
            if (b !== btn) b.classList.remove("selected");
          });
          data[key] = [btn.dataset.value];
        }
      } else {
        const none = document.querySelector(`#${containerId} .choice[data-value="Não tenho uma fonte consistente"]`);
        if (none) none.classList.remove("selected");
        data[key] = [...document.querySelectorAll(`#${containerId} .choice.selected`)].map(b => b.dataset.value);
      }
      clearError();
    });
  });
}

selectSingle("tipoNegocio", "tipo_negocio", "outroSegmentoNegocio");
selectSingle("segmento", "segmento", "outroSegmento");
selectMulti("fontes", "fontes_clientes");
selectSingle("gargalo", "gargalo");
selectSingle("objetivo", "objetivo");
selectSingle("visao", "visao_6_12_meses");
selectSingle("faturamento", "faturamento");

document.getElementById("nome").addEventListener("input", e => data.nome = e.target.value.trim());
document.getElementById("empresa").addEventListener("input", e => data.empresa = e.target.value.trim());
document.getElementById("outroSegmentoNegocio").addEventListener("input", e => data.outro_segmento = e.target.value.trim());
document.getElementById("outroSegmento").addEventListener("input", e => data.outro_segmento = e.target.value.trim());

const whatsapp = document.getElementById("whatsapp");
whatsapp.addEventListener("input", e => {
  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
  data.whatsapp = e.target.value ? "+258" + e.target.value : "";
});

function updateStep() {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("active");
  progress.style.width = `${currentStep * 20}%`;
  counter.textContent = `Etapa ${currentStep} de ${totalSteps}`;
  backBtn.style.visibility = currentStep === 1 ? "hidden" : "visible";
  nextBtn.textContent = currentStep === totalSteps ? "Concluir meu diagnóstico →" : "Continuar →";
  window.scrollTo({top: 0, behavior: "smooth"});
}

function validateStep() {
  clearError();

  if (currentStep === 1) {
    if (!data.tipo_negocio) return "Selecione como a sua empresa atua.";
    if (data.tipo_negocio === "Outro" && !document.getElementById("outroSegmentoNegocio").value.trim()) return "Conte brevemente o que você faz.";
    if (!data.segmento) return "Selecione o segmento da sua empresa.";
    if (data.segmento === "Outro" && !document.getElementById("outroSegmento").value.trim()) return "Informe o seu segmento.";
  }

  if (currentStep === 2 && data.fontes_clientes.length === 0) return "Selecione pelo menos uma fonte de clientes.";
  if (currentStep === 3 && !data.gargalo) return "Selecione o principal problema.";
  if (currentStep === 4 && !data.objetivo) return "Selecione o que teria maior impacto.";
  if (currentStep === 4 && !data.visao_6_12_meses) return "Selecione onde gostaria de estar daqui a 6–12 meses.";

  if (currentStep === 5) {
    if (!data.faturamento) return "Selecione a faixa de faturamento.";
    if (!data.nome) return "Informe o seu nome completo.";
    if (!data.empresa) return "Informe o nome da empresa.";
    if (!/^\d{9}$/.test(whatsapp.value)) return "Informe um WhatsApp válido com 9 dígitos.";
    data.whatsapp = "+258" + whatsapp.value;
  }
  return "";
}

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.add("show");
  errorBox.scrollIntoView({behavior:"smooth", block:"nearest"});
}
function clearError() {
  errorBox.textContent = "";
  errorBox.classList.remove("show");
}

backBtn.addEventListener("click", () => {
  if (currentStep > 1) {
    currentStep--;
    updateStep();
  }
});

nextBtn.addEventListener("click", async () => {
  const error = validateStep();
  if (error) return showError(error);

  if (currentStep < totalSteps) {
    currentStep++;
    updateStep();
    return;
  }

  await submitLead();
});

async function submitLead() {
  nextBtn.disabled = true;
  backBtn.disabled = true;
  nextBtn.textContent = "A preparar o seu diagnóstico…";
  clearError();

  const outroNegocio = document.getElementById("outroSegmentoNegocio").value.trim();
  const outroSegmento = document.getElementById("outroSegmento").value.trim();

  const lead = {
    tipo_negocio: data.tipo_negocio,
    segmento: data.segmento,
    outro_segmento: data.segmento === "Outro" ? outroSegmento : "",
    outro_tipo_negocio: data.tipo_negocio === "Outro" ? outroNegocio : "",
    fontes_clientes: data.fontes_clientes,
    gargalo: data.gargalo,
    objetivo: data.objetivo,
    visao_6_12_meses: data.visao_6_12_meses,
    faturamento: data.faturamento,
    nome: data.nome,
    empresa: data.empresa,
    whatsapp: data.whatsapp,
    timestamp: serverTimestamp()
  };

  try {
    await addDoc(collection(db, "leads_qualificados"), lead);
    showSuccess(lead);
  } catch (err) {
    console.error(err);
    showError("Não foi possível concluir o diagnóstico. Verifique a sua ligação e tente novamente.");
    nextBtn.disabled = false;
    backBtn.disabled = false;
    nextBtn.textContent = "Concluir meu diagnóstico →";
  }
}

function showSuccess(lead) {
  form.style.display = "none";
  counter.textContent = "Diagnóstico concluído";
  progress.style.width = "100%";
  success.style.display = "block";

  document.getElementById("sumGargalo").textContent = lead.gargalo;
  document.getElementById("sumObjetivo").textContent = lead.objetivo;
  document.getElementById("sumFontes").textContent = lead.fontes_clientes.join(", ");

  const message = `Olá, N2. Sou ${lead.nome}, da ${lead.empresa}.

Acabei de concluir o Diagnóstico N2.

Meu principal gargalo hoje é:
${lead.gargalo}

Meu principal objetivo é:
${lead.objetivo}

Gostaria de conversar com vocês sobre o meu cenário.`;

  document.getElementById("whatsappBtn").href = `https://wa.me/258879217234?text=${encodeURIComponent(message)}`;
  window.scrollTo({top:0, behavior:"smooth"});
}
