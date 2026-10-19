"use strict";

const quizQuestions = [
  {
    question: "¿Qué distingue principalmente una decisión data-driven de una decisión intuitiva?",
    options: [
      "Se basa en evidencia y análisis de datos, además del criterio profesional.",
      "Elimina por completo la experiencia de las personas.",
      "Se toma más rápido porque no necesita definir un problema.",
      "Solo utiliza datos financieros históricos."
    ],
    answer: 0,
    explanation: "Una decisión data-driven usa datos relevantes para fundamentar la elección, sin sustituir el contexto ni el juicio humano."
  },
  {
    question: "En un proceso ETL, ¿qué ocurre durante la fase Transform?",
    options: [
      "Se guardan los datos ya preparados en el Data Warehouse.",
      "Se extraen los datos de CRM, ERP y otras fuentes.",
      "Se limpian, normalizan y combinan los datos para su análisis.",
      "Se convierten las métricas en decisiones automáticamente."
    ],
    answer: 2,
    explanation: "Transform es la fase en la que se corrigen formatos, duplicados y valores, y se armonizan los datos antes de cargarlos."
  },
  {
    question: "¿Cuál es una ventaja de integrar ventas de tienda física y e-commerce en un mismo proceso ETL?",
    options: [
      "Evitar que cada canal tenga que registrar transacciones.",
      "Obtener un reporte unificado con definiciones y formatos consistentes.",
      "Reemplazar el sistema de ventas por una hoja de cálculo.",
      "Guardar los datos únicamente en el CRM."
    ],
    answer: 1,
    explanation: "La integración alinea campos, fechas, productos y monedas para comparar los canales desde una fuente analítica común."
  },
  {
    question: "En un modelo dimensional de ventas, ¿cuál es un ejemplo de dimensión?",
    options: [
      "Unidades vendidas por transacción.",
      "Ingresos totales calculados para un período.",
      "Margen bruto de cada pedido.",
      "Cliente, producto o tiempo."
    ],
    answer: 3,
    explanation: "Las dimensiones describen el contexto de los hechos. Cliente, producto y tiempo permiten analizar las ventas desde distintas perspectivas."
  },
  {
    question: "¿Qué expresa el valor de vida del cliente (CLV)?",
    options: [
      "La proporción de visitantes que completa una compra en una sesión.",
      "La contribución económica esperada de la relación con un cliente a lo largo del tiempo.",
      "El porcentaje de ventas de una empresa frente a todo el mercado.",
      "La diferencia entre ingresos por ventas y costo de los bienes vendidos."
    ],
    answer: 1,
    explanation: "El CLV estima el valor económico de la relación con un cliente durante su ciclo de vida; es útil para orientar retención e inversión."
  }
];

let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let score = 0;
let answerChecked = false;

function renderMarkdown(markdown) {
  const escapeHtml = (text) => text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
  const formatInline = (text) => escapeHtml(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listType = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      html.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  };

  const closeList = () => {
    if (listType) {
      html.push(`</${listType}>`);
      listType = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    const unorderedItem = trimmed.match(/^[-*]\s+(.+)$/);
    const orderedItem = trimmed.match(/^\d+\.\s+(.+)$/);

    if (!trimmed) {
      flushParagraph();
      closeList();
      continue;
    }

    if (heading) {
      flushParagraph();
      closeList();
      const level = heading[1].length;
      html.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    if (unorderedItem || orderedItem) {
      flushParagraph();
      const nextType = unorderedItem ? "ul" : "ol";
      if (listType !== nextType) {
        closeList();
        html.push(`<${nextType}>`);
        listType = nextType;
      }
      html.push(`<li>${formatInline((unorderedItem || orderedItem)[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  closeList();
  return html.join("\n");
}

async function loadTheoryContent() {
  const contentTargets = document.querySelectorAll("[data-markdown]");
  await Promise.all(Array.from(contentTargets, async (target) => {
    const filePath = target.dataset.markdown;
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`No se pudo cargar ${filePath}: HTTP ${response.status}`);
      }
      target.innerHTML = renderMarkdown(await response.text());
    } catch (error) {
      console.error(error);
      target.textContent = "No se pudo cargar este módulo. Comprueba que la página se sirve desde un servidor local y vuelve a intentarlo.";
    }
  }));
}

function updateProgress(answeredCount) {
  const progress = document.getElementById("quiz-progress");
  const fill = document.getElementById("progress-fill");
  const counter = document.getElementById("question-counter");
  if (!progress || !fill || !counter) return;

  const value = Math.min(answeredCount, quizQuestions.length);
  progress.setAttribute("aria-valuenow", String(value));
  fill.style.width = `${(value / quizQuestions.length) * 100}%`;
  counter.textContent = value === quizQuestions.length
    ? `Completado · ${quizQuestions.length} preguntas`
    : `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
}

function renderQuestion() {
  const question = quizQuestions[currentQuestionIndex];
  const content = document.getElementById("quiz-content");
  const button = document.getElementById("quiz-next");
  const hint = document.getElementById("quiz-hint");
  const feedback = document.getElementById("quiz-feedback");
  if (!content || !button || !hint || !feedback || !question) return;

  selectedOptionIndex = null;
  answerChecked = false;
  content.innerHTML = `
    <h3 class="quiz-question">${question.question}</h3>
    <div class="quiz-options" role="group" aria-label="Opciones de respuesta">
      ${question.options.map((option, index) => `
        <button class="quiz-option" type="button" data-option="${index}">
          <span class="option-letter" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
          <span>${option}</span>
        </button>
      `).join("")}
    </div>
  `;

  content.querySelectorAll(".quiz-option").forEach((option) => {
    option.addEventListener("click", () => selectOption(Number(option.dataset.option)));
  });

  button.disabled = true;
  button.textContent = "Comprobar respuesta";
  hint.textContent = "Elige la respuesta que consideres correcta.";
  feedback.textContent = "";
  feedback.className = "quiz-feedback";
  updateProgress(currentQuestionIndex);
}

function selectOption(optionIndex) {
  if (answerChecked) return;
  selectedOptionIndex = optionIndex;
  document.querySelectorAll(".quiz-option").forEach((option, index) => {
    option.classList.toggle("is-selected", index === optionIndex);
  });
  const button = document.getElementById("quiz-next");
  if (button) button.disabled = false;
}

function checkAnswer() {
  if (selectedOptionIndex === null || answerChecked) return;
  const question = quizQuestions[currentQuestionIndex];
  const correct = selectedOptionIndex === question.answer;
  answerChecked = true;
  if (correct) score += 1;

  document.querySelectorAll(".quiz-option").forEach((option, index) => {
    option.disabled = true;
    if (index === question.answer) option.classList.add("is-correct");
    if (index === selectedOptionIndex && !correct) option.classList.add("is-incorrect");
  });

  const feedback = document.getElementById("quiz-feedback");
  const hint = document.getElementById("quiz-hint");
  const button = document.getElementById("quiz-next");
  if (feedback) {
    feedback.textContent = `${correct ? "¡Correcto!" : "No es la opción correcta."} ${question.explanation}`;
    feedback.classList.add(correct ? "is-correct" : "is-incorrect");
  }
  if (hint) hint.textContent = correct ? "Respuesta correcta" : "Respuesta revisada";
  if (button) button.textContent = currentQuestionIndex === quizQuestions.length - 1 ? "Ver resultado" : "Siguiente pregunta";
  updateProgress(currentQuestionIndex + 1);
}

function renderQuizResult() {
  const content = document.getElementById("quiz-content");
  const button = document.getElementById("quiz-next");
  const hint = document.getElementById("quiz-hint");
  const feedback = document.getElementById("quiz-feedback");
  if (!content || !button || !hint || !feedback) return;

  const percentage = (score / quizQuestions.length) * 100;
  let title;
  let message;
  if (percentage === 100) {
    title = "¡Dominio total!";
    message = "Has conectado los conceptos clave de BI. Sigue aplicándolos a preguntas y decisiones reales.";
  } else if (percentage >= 60) {
    title = "¡Buen trabajo!";
    message = "Tienes una base sólida. Repasa los módulos para afianzar los conceptos que te faltaron.";
  } else {
    title = "Cada dato cuenta.";
    message = "Vuelve a los módulos, repasa las explicaciones y prueba de nuevo: aprender también es iterar.";
  }

  content.innerHTML = `
    <div class="quiz-result">
      <div class="result-score" aria-label="${score} de ${quizQuestions.length}">${score}/${quizQuestions.length}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="button button-primary" id="quiz-restart" type="button">Intentarlo de nuevo</button>
    </div>
  `;
  content.querySelector("#quiz-restart").addEventListener("click", resetQuiz);
  button.hidden = true;
  hint.textContent = "Cuestionario completado";
  feedback.textContent = "";
  updateProgress(quizQuestions.length);
}

function resetQuiz() {
  currentQuestionIndex = 0;
  selectedOptionIndex = null;
  score = 0;
  answerChecked = false;
  const button = document.getElementById("quiz-next");
  if (button) button.hidden = false;
  renderQuestion();
}

function initializeQuiz() {
  const button = document.getElementById("quiz-next");
  if (!button) return;
  button.addEventListener("click", () => {
    if (!answerChecked) {
      checkAnswer();
    } else if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex += 1;
      renderQuestion();
    } else {
      renderQuizResult();
    }
  });
  renderQuestion();
}

function createChartOptions() {
  const fontFamily = getComputedStyle(document.body).fontFamily;
  return {
    chart: {
      fontFamily,
      foreColor: "#0B0F19",
      toolbar: { show: false },
      animations: { enabled: true, easing: "easeinout", speed: 650 },
      background: "transparent"
    },
    theme: { mode: "light" },
    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      padding: { left: 8, right: 10 }
    },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" }
    },
    dataLabels: { style: { fontFamily, fontWeight: 600 } },
    noData: { text: "No hay datos disponibles" }
  };
}

function renderCharts() {
  const revenueElement = document.getElementById("revenue-chart");
  const marketElement = document.getElementById("market-chart");
  const shipmentsElement = document.getElementById("shipments-chart");
  if (!revenueElement || !marketElement || !shipmentsElement) return;

  if (typeof ApexCharts === "undefined") {
    [revenueElement, marketElement, shipmentsElement].forEach((element) => {
      element.textContent = "No se pudieron cargar las gráficas. Comprueba tu conexión e inténtalo de nuevo.";
    });
    return;
  }

  // Personaliza aquí los valores del dashboard. Las gráficas mantienen la paleta azul, negra y blanca.
  const revenueYears = ["FY2022/23", "FY2023/24", "FY2024/25", "FY2025/26"];
  const revenueValues = [61947, 56864, 69077, 83075];
  const marketCompanies = ["Lenovo", "HP Inc.", "Dell", "Apple", "ASUS", "Acer", "Otros"];
  const marketShares = [27.2, 21.3, 15.3, 9.4, 6.8, 5.8, 14.2];
  const shipmentYears = ["2024", "2025"];
  const shipmentValues = [62542, 73567];
  const growth = ((shipmentValues[1] - shipmentValues[0]) / shipmentValues[0]) * 100;
  const shared = createChartOptions();

  const revenueChart = new ApexCharts(revenueElement, {
    ...shared,
    chart: { ...shared.chart, type: "area", height: 285 },
    colors: ["#0A66C2"],
    series: [{ name: "Ingresos", data: revenueValues }],
    xaxis: {
      categories: revenueYears,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: "#6B7280", fontSize: "10px" } }
    },
    yaxis: {
      min: 0,
      labels: {
        style: { colors: "#6B7280", fontSize: "10px" },
        formatter: (value) => `${Math.round(value / 1000)}k`
      }
    },
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        shadeIntensity: 0.25,
        gradientToColors: ["#DBEAFE"],
        inverseColors: false,
        opacityFrom: 0.42,
        opacityTo: 0.04,
        stops: [0, 100]
      }
    },
    markers: {
      size: 4,
      colors: ["#FFFFFF"],
      strokeColors: "#0A66C2",
      strokeWidth: 2,
      hover: { size: 6 }
    },
    dataLabels: { ...shared.dataLabels, enabled: false },
    tooltip: {
      ...shared.tooltip,
      y: { formatter: (value) => `$${value.toLocaleString("en-US")} millones` }
    }
  });

  const marketChart = new ApexCharts(marketElement, {
    ...shared,
    chart: { ...shared.chart, type: "bar", height: 330 },
    series: [{ name: "Cuota de mercado", data: marketShares }],
    colors: ["#0A66C2", "#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280", "#6B7280"],
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 4,
        barHeight: "58%",
        dataLabels: { position: "right" }
      }
    },
    xaxis: {
      categories: marketCompanies,
      max: 32,
      tickAmount: 4,
      labels: {
        style: { colors: "#6B7280", fontSize: "10px" },
        formatter: (value) => `${value}%`
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: "#0B0F19", fontSize: "11px", fontWeight: 600 } } },
    grid: { ...shared.grid, padding: { left: 5, right: 30 } },
    legend: { show: false },
    dataLabels: {
      ...shared.dataLabels,
      enabled: true,
      formatter: (value) => `${value}%`,
      offsetX: 5,
      style: { colors: ["#0B0F19"], fontSize: "10px", fontWeight: 700 }
    },
    tooltip: { ...shared.tooltip, y: { formatter: (value) => `${value}%` } }
  });

  const shipmentsChart = new ApexCharts(shipmentsElement, {
    ...shared,
    chart: { ...shared.chart, type: "donut", height: 285 },
    series: shipmentValues,
    labels: shipmentYears,
    colors: ["#0A66C2", "#DBEAFE"],
    stroke: { colors: ["#FFFFFF"], width: 3 },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "11px",
      labels: { colors: "#0B0F19" },
      markers: { width: 8, height: 8, radius: 8 },
      itemMargin: { horizontal: 12, vertical: 4 }
    },
    dataLabels: {
      ...shared.dataLabels,
      enabled: true,
      formatter: (percentage) => `${percentage.toFixed(1)}%`,
      style: { colors: ["#0B0F19"], fontSize: "10px", fontWeight: 700 },
      dropShadow: { enabled: false }
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              offsetY: 17,
              color: "#6B7280",
              formatter: () => "Crecimiento"
            },
            value: {
              show: true,
              offsetY: -12,
              color: "#0B0F19",
              fontSize: "23px",
              fontWeight: 750,
              formatter: () => `+${growth.toFixed(1)}%`
            },
            total: { show: false }
          }
        }
      }
    },
    tooltip: {
      ...shared.tooltip,
      y: { formatter: (value) => `${value.toLocaleString("en-US")} miles de unidades` }
    }
  });

  [revenueChart, marketChart, shipmentsChart].forEach((chart) => chart.render());
}

function initializeNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Abrir navegación" : "Cerrar navegación");
    links.classList.toggle("is-open", !isOpen);
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir navegación");
      links.classList.remove("is-open");
    });
  });
}

function initializeScrollReveal() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => observer.observe(element));
}

document.addEventListener("DOMContentLoaded", () => {
  loadTheoryContent();
  initializeQuiz();
  initializeNavigation();
  initializeScrollReveal();
  renderCharts();
});
