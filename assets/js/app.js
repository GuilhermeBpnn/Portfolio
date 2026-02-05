const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** ==========================
 * CONFIG
 * ========================== */
// 1) Formspree (recomendado):
// Crie um form no Formspree e cole aqui o endpoint (ex: https://formspree.io/f/xxxxxxx)
const FORM_ENDPOINT = ""; // <- COLE AQUI para envio real

// 2) WhatsApp com mensagem pronta:
const WHATSAPP_PRESET_MESSAGE =
  "Olá Guilherme! Vim pelo seu site e gostaria de um orçamento. Podemos conversar?";

/** ==========================
 * DADOS DO SITE
 * ========================== */
const DATA = {
  profile: {
    name: "Guilherme Ataides",
    email: "guilhermeb.ataides@gmail.com",
    whatsapp: "5562982012982",
    links: {
      github: "https://github.com/GuilhermeBpnn",
      linkedin: "#",
      website: "#"
    }
  },

  portfolio: [
    {
      id: "neoncore",
      title: "NeonCore — Plataforma de Serviços e Pedidos",
      category: "plataforma",
      tags: ["Plataforma", "Admin", "Pedidos", "UI/UX"],
      summary:
        "Plataforma para prestação de serviços e administração de pedidos, com módulos, fluxo operacional e painel administrativo. Projeto em evolução com foco em UI/UX e escalabilidade.",
      year: "2026",
      role: "UI/UX + Front-end + Estrutura do produto",
      stack: ["JavaScript", "UI/UX", "Web"],
      metrics: { performance: "90+", seo: "—", acessibilidade: "90+" },
      links: { demo: "", repo: "" } // sem link público ainda
    },
    {
      id: "landing-construcao",
      title: "Landing Page — Empresa de Construção Civil",
      category: "landing",
      tags: ["Landing", "Conversão", "CTA", "SEO"],
      summary:
        "Landing page para captação de leads com seções estratégicas (prova social, serviços, diferenciais e contato).",
      year: "2026",
      role: "Design + Front-end",
      stack: ["HTML", "CSS", "JavaScript"],
      metrics: { performance: "95+", seo: "90+", acessibilidade: "92+" },
      links: { demo: "#", repo: "#" }
    },
    {
      id: "bot-certificados",
      title: "Bot — Vencimento de Certificados (1000+ empresas)",
      category: "bot",
      tags: ["Automação", "Monitoramento", "Logs"],
      summary:
        "Automação que verifica e armazena vencimentos de certificados em base com 1000+ empresas, com rastreabilidade e alertas.",
      year: "2026",
      role: "Automação + Regras de negócio",
      stack: ["JavaScript", "Integrações", "Automação"],
      metrics: { performance: "—", seo: "—", acessibilidade: "—" },
      links: { demo: "", repo: "" }
    },
    {
      id: "bot-notas",
      title: "Bot — Ativa/Desativa Coletas de Notas Fiscais (Sistema Próprio)",
      category: "bot",
      tags: ["Integração", "RPA", "Processos"],
      summary:
        "Automação para controlar coletas de notas fiscais em sistema interno, reduzindo falhas manuais e acelerando o fluxo operacional.",
      year: "2026",
      role: "Automação + Integração com sistema",
      stack: ["JavaScript", "Automação", "Sistemas"],
      metrics: { performance: "—", seo: "—", acessibilidade: "—" },
      links: { demo: "", repo: "" }
    }
  ],

  testimonials: [
    {
      text:
        "Entrega muito acima do esperado: visual forte, organizado e com atenção aos detalhes.",
      name: "Cliente (exemplo)",
      role: "Empresa de serviços",
      stars: 5
    },
    {
      text:
        "A automação reduziu retrabalho e aumentou a rastreabilidade do processo.",
      name: "Gestor (exemplo)",
      role: "Operações",
      stars: 5
    },
    {
      text:
        "Ótima comunicação e processo por etapas. Ficou fácil aprovar e evoluir o projeto.",
      name: "Cliente (exemplo)",
      role: "Negócio local",
      stars: 5
    }
  ]
};

/** ==========================
 * UTILS
 * ========================== */
function debounce(fn, wait = 150){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
}
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function toast(message, type = "ok"){
  const el = $("#toast");
  el.className = `toast is-show toast--${type}`;
  el.textContent = message;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-show"), 3200);
}

function buildWaLink(phone, message){
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${phone}?text=${text}`;
}

/** ==========================
 * THEME
 * ========================== */
function initTheme(){
  const saved = localStorage.getItem("theme");
  if(saved) document.documentElement.setAttribute("data-theme", saved);

  const btn = $("#themeToggle");
  const updateIcon = () => {
    const t = document.documentElement.getAttribute("data-theme") || "dark";
    btn.querySelector(".icon").textContent = t === "light" ? "☀" : "☾";
  };
  updateIcon();

  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateIcon();
    toast(`Tema: ${next === "light" ? "claro" : "escuro"}`, "ok");
  });
}

/** ==========================
 * NAV
 * ========================== */
function initNav(){
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if(!toggle || !menu) return;

  const close = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

  $$("#navMenu a").forEach(a => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") close(); });
  document.addEventListener("click", (e) => {
    if(!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

/** ==========================
 * SCROLL UI
 * ========================== */
function initScrollUI(){
  const bar = $("#scrollBar");
  const backToTop = $("#backToTop");

  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if(bar) bar.style.width = `${p}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if(backToTop){
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior:"smooth" }));
  }
}

/** ==========================
 * COUNTERS
 * ========================== */
function initCounters(){
  const els = $$("[data-count]");
  if(!els.length) return;

  const animate = (el) => {
    const to = Number(el.getAttribute("data-count")) || 0;
    const dur = 900;
    const start = performance.now();

    const step = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const val = Math.floor(to * (0.15 + 0.85 * p));
      el.textContent = String(val);
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = String(to);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        animate(ent.target);
        io.unobserve(ent.target);
      }
    });
  }, { threshold: 0.35 });

  els.forEach(el => io.observe(el));
}

/** ==========================
 * PORTFOLIO
 * ========================== */
let currentFilter = "all";
let currentSearch = "";

function getVisibleProjects(){
  const q = currentSearch.trim().toLowerCase();
  return DATA.portfolio.filter(p => {
    const byFilter = currentFilter === "all" ? true : p.category === currentFilter;
    const hay = `${p.title} ${p.summary} ${p.tags.join(" ")} ${p.stack.join(" ")}`.toLowerCase();
    const bySearch = q ? hay.includes(q) : true;
    return byFilter && bySearch;
  });
}

function renderPortfolio(){
  const grid = $("#portfolioGrid");
  if(!grid) return;

  const items = getVisibleProjects();
  if(!items.length){
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <strong>Nenhum projeto encontrado.</strong>
        <p style="margin:8px 0 0; color: var(--muted);">Tente remover filtros ou buscar por outro termo.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(p => `
    <article class="card project">
      <div class="project__thumb" aria-hidden="true"></div>
      <div class="project__body">
        <h3 class="project__title">${escapeHtml(p.title)}</h3>
        <div class="project__meta">
          <span class="pill-mini">${escapeHtml(p.year)}</span>
          <span class="pill-mini">${escapeHtml(p.category)}</span>
          ${p.tags.slice(0,2).map(t => `<span class="pill-mini">${escapeHtml(t)}</span>`).join("")}
        </div>
        <p class="project__desc">${escapeHtml(p.summary)}</p>
      </div>
      <div class="project__actions">
        <button class="btn btn--soft" type="button" data-open="${escapeHtml(p.id)}">Detalhes</button>
        <a class="btn btn--ghost" href="#contato">Quero um projeto</a>
      </div>
    </article>
  `).join("");

  $$("[data-open]", grid).forEach(btn => {
    btn.addEventListener("click", () => openProject(btn.getAttribute("data-open")));
  });
}

function initPortfolioControls(){
  $$(".chip[data-filter]").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".chip[data-filter]").forEach(c => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });
      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      currentFilter = chip.getAttribute("data-filter");
      renderPortfolio();
    });
  });

  const search = $("#portfolioSearch");
  if(search){
    search.addEventListener("input", debounce((e) => {
      currentSearch = e.target.value || "";
      renderPortfolio();
    }, 120));
  }
}

/** ==========================
 * MODAL
 * ========================== */
function initModal(){
  const modal = $("#projectModal");
  if(!modal) return;

  const closeEls = $$("[data-modal-close]", modal);

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  closeEls.forEach(el => el.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  window.__closeModal = close;
}

function openProject(id){
  const p = DATA.portfolio.find(x => x.id === id);
  if(!p) return;

  const modal = $("#projectModal");
  const body = $("#modalBody");
  if(!modal || !body) return;

  const demoLabel = p.links.demo ? "Ver demo" : "Sem link público";
  const repoLabel = p.links.repo ? "Ver repositório" : "Privado";

  body.innerHTML = `
    <div class="modal__header">
      <div>
        <h3 class="modal__title">${escapeHtml(p.title)}</h3>
        <p class="modal__sub">${escapeHtml(p.summary)}</p>
        <div class="modal__tags">
          ${p.tags.map(t => `<span class="pill-mini">${escapeHtml(t)}</span>`).join("")}
          ${p.stack.map(s => `<span class="pill-mini">${escapeHtml(s)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="modal__grid">
      <div class="kv">
        <span class="kv__k">Categoria</span>
        <span class="kv__v">${escapeHtml(p.category)}</span>
      </div>
      <div class="kv">
        <span class="kv__k">Ano</span>
        <span class="kv__v">${escapeHtml(p.year)}</span>
      </div>
      <div class="kv">
        <span class="kv__k">Papel</span>
        <span class="kv__v">${escapeHtml(p.role)}</span>
      </div>
      <div class="kv">
        <span class="kv__k">Indicadores</span>
        <span class="kv__v">${escapeHtml(p.metrics.performance)} perf • ${escapeHtml(p.metrics.seo)} SEO • ${escapeHtml(p.metrics.acessibilidade)} A11y</span>
      </div>
    </div>

    <div class="modal__actions">
      ${
        p.links.demo
          ? `<a class="btn btn--primary" href="${escapeHtml(p.links.demo)}" target="_blank" rel="noopener">
              ${demoLabel}
              <span class="btn__shine" aria-hidden="true"></span>
            </a>`
          : `<button class="btn btn--primary" type="button" disabled>
              ${demoLabel}
              <span class="btn__shine" aria-hidden="true"></span>
            </button>`
      }

      ${
        p.links.repo
          ? `<a class="btn btn--soft" href="${escapeHtml(p.links.repo)}" target="_blank" rel="noopener">${repoLabel}</a>`
          : `<button class="btn btn--soft" type="button" disabled>${repoLabel}</button>`
      }

      <button class="btn btn--ghost" type="button" onclick="window.__closeModal()">Fechar</button>
    </div>
  `;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/** ==========================
 * TESTIMONIALS
 * ========================== */
function initTestimonials(){
  const track = $("#testimonialsTrack");
  const dots = $("#testimonialsDots");
  const prev = $("#prevTestimonial");
  const next = $("#nextTestimonial");
  if(!track || !dots || !prev || !next) return;

  let index = 0;

  const render = () => {
    track.innerHTML = DATA.testimonials.map(t => `
      <article class="testimonial">
        <p class="testimonial__text">“${escapeHtml(t.text)}”</p>
        <div class="testimonial__who">
          <div>
            <div class="testimonial__name">${escapeHtml(t.name)}</div>
            <div class="testimonial__role">${escapeHtml(t.role)}</div>
          </div>
          <div class="stars" aria-label="${t.stars} estrelas">${"★".repeat(t.stars)}${"☆".repeat(5 - t.stars)}</div>
        </div>
      </article>
    `).join("");

    dots.innerHTML = DATA.testimonials.map((_, i) =>
      `<span class="dot-btn ${i===index ? "is-active":""}"></span>`
    ).join("");

    update();
  };

  const update = () => {
    track.style.transform = `translateX(${-index * 100}%)`;
    $$(".dot-btn", dots).forEach((d, i) => d.classList.toggle("is-active", i === index));
  };

  const clamp = (i) => (i + DATA.testimonials.length) % DATA.testimonials.length;
  const go = (i) => { index = clamp(i); update(); };

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));

  let startX = 0;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive:true });
  track.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    if(Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
  });

  setInterval(() => go(index + 1), 7000);
  render();
}

/** ==========================
 * FAQ
 * ========================== */
function initFAQ(){
  const acc = $("#faqAccordion");
  if(!acc) return;

  const items = $$(".accordion__item", acc);
  items.forEach((btn) => {
    const panel = btn.nextElementSibling;

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";

      items.forEach(b => {
        b.setAttribute("aria-expanded", "false");
        b.nextElementSibling.hidden = true;
        const icon = b.querySelector(".accordion__icon");
        if(icon) icon.textContent = "+";
      });

      btn.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;

      const icon = btn.querySelector(".accordion__icon");
      if(icon) icon.textContent = expanded ? "+" : "–";
    });
  });
}

/** ==========================
 * PDF (JS -> abre uma página e manda imprimir/salvar como PDF)
 * ========================== */
function initPdf(){
  const b1 = $("#downloadPdf");
  const b2 = $("#downloadPdf2");

  const handler = () => {
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=720");
    if(!w){
      toast("Seu navegador bloqueou o pop-up. Permita pop-ups para gerar o PDF.", "warn");
      return;
    }

    const projectsHtml = DATA.portfolio.map(p => `
      <div style="padding:12px 0; border-bottom:1px solid #ddd;">
        <div style="font-weight:800; font-size:16px;">${escapeHtml(p.title)}</div>
        <div style="color:#444; margin-top:6px;">${escapeHtml(p.summary)}</div>
        <div style="margin-top:8px; color:#666; font-size:13px;">
          <b>Categoria:</b> ${escapeHtml(p.category)} • <b>Ano:</b> ${escapeHtml(p.year)} • <b>Papel:</b> ${escapeHtml(p.role)}
        </div>
        <div style="margin-top:6px; color:#666; font-size:13px;">
          <b>Stack:</b> ${escapeHtml(p.stack.join(", "))} • <b>Tags:</b> ${escapeHtml(p.tags.join(", "))}
        </div>
      </div>
    `).join("");

    w.document.write(`
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Portfólio — ${escapeHtml(DATA.profile.name)}</title>
        <style>
          body{ font-family: Arial, sans-serif; margin: 26px; color:#111; }
          h1{ margin:0; font-size: 22px; }
          .muted{ color:#666; margin-top:6px; }
          .top{ display:flex; justify-content:space-between; gap:12px; margin-bottom:16px; }
          .box{ border:1px solid #ddd; border-radius:12px; padding:14px; }
          .grid{ display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin:14px 0 0; }
          @media print{
            .no-print{ display:none; }
            body{ margin: 14mm; }
          }
        </style>
      </head>
      <body>
        <div class="top">
          <div>
            <h1>${escapeHtml(DATA.profile.name)} — Portfólio</h1>
            <div class="muted">Programador • UI/UX • Sites • Automação • Bots • Consultoria</div>
          </div>
          <div class="box">
            <div><b>E-mail:</b> ${escapeHtml(DATA.profile.email)}</div>
            <div><b>WhatsApp:</b> +${escapeHtml(DATA.profile.whatsapp)}</div>
            <div><b>GitHub:</b> ${escapeHtml(DATA.profile.links.github)}</div>
          </div>
        </div>

        <div class="box">
          <b>Resumo</b>
          <div class="muted" style="margin-top:6px;">
            Projetos focados em entrega real: landing pages com conversão, plataforma (NeonCore) e automações corporativas em escala.
          </div>

          <div class="grid">
            <div class="box">
              <b>Resultados</b>
              <div class="muted" style="margin-top:6px;">• Monitoramento em 1000+ empresas</div>
              <div class="muted">• Redução de falhas manuais e retrabalho</div>
              <div class="muted">• Processos com logs e rastreabilidade</div>
            </div>
            <div class="box">
              <b>Serviços</b>
              <div class="muted" style="margin-top:6px;">• Sites (institucional/portfólio/multi-serviços)</div>
              <div class="muted">• UI/UX (layout premium e componentes)</div>
              <div class="muted">• Bots e automações (monitoramento e integrações)</div>
              <div class="muted">• Suporte e consultoria</div>
            </div>
          </div>
        </div>

        <h2 style="margin:18px 0 10px;">Projetos</h2>
        ${projectsHtml}

        <div class="no-print" style="margin-top:18px;">
          <button onclick="window.print()" style="padding:10px 14px; border-radius:10px; border:1px solid #111; background:#111; color:#fff; cursor:pointer;">
            Imprimir / Salvar como PDF
          </button>
          <span style="color:#666; margin-left:10px;">Dica: escolha “Salvar como PDF” na impressora.</span>
        </div>
      </body>
      </html>
    `);

    w.document.close();
    toast("PDF aberto em nova aba. Use 'Imprimir' → 'Salvar como PDF'.", "ok");
  };

  if(b1) b1.addEventListener("click", handler);
  if(b2) b2.addEventListener("click", handler);
}

/** ==========================
 * CONTACT (WhatsApp + Email copy + envio real)
 * ========================== */
function initContact(){
  // copiar email
  const copyBtn = $("#copyEmail");
  if(copyBtn){
    copyBtn.setAttribute("data-copy", DATA.profile.email);
    copyBtn.textContent = DATA.profile.email;
    copyBtn.addEventListener("click", async () => {
      try{
        await navigator.clipboard.writeText(DATA.profile.email);
        toast("E-mail copiado!", "ok");
      }catch{
        toast("Não consegui copiar automaticamente. Copie manualmente.", "warn");
      }
    });
  }

  // WhatsApp com mensagem pronta
  const wa = $("#waLink") || $$('a[href^="https://wa.me/"]')[0];
  if(wa){
    wa.href = buildWaLink(DATA.profile.whatsapp, WHATSAPP_PRESET_MESSAGE);
  }

  // Form
  const form = $("#contactForm");
  if(!form) return;

  const setError = (name, msg) => {
    const field = $(`[name="${name}"]`)?.closest(".field");
    const el = $(`[data-error-for="${name}"]`);
    if(field) field.classList.toggle("is-invalid", Boolean(msg));
    if(el) el.textContent = msg || "";
  };

  const validate = () => {
    let ok = true;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const service = form.service.value.trim();
    const budget = form.budget.value.trim();
    const message = form.message.value.trim();

    ["name","email","service","budget","message"].forEach(k => setError(k, ""));

    if(name.length < 2){ setError("name", "Digite seu nome (mín. 2 letras)."); ok = false; }
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailValid){ setError("email", "Informe um e-mail válido."); ok = false; }
    if(!service){ setError("service", "Selecione um tipo de serviço."); ok = false; }
    if(!budget){ setError("budget", "Selecione uma faixa de orçamento."); ok = false; }
    if(message.length < 10){ setError("message", "Detalhe melhor (mín. 10 caracteres)."); ok = false; }

    return ok;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if(!validate()){
      toast("Revise os campos destacados.", "err");
      return;
    }

    if(!FORM_ENDPOINT){
      toast("Para envio real, configure FORM_ENDPOINT no app.js (Formspree).", "warn");
      return;
    }

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      service: form.service.value.trim(),
      budget: form.budget.value.trim(),
      message: form.message.value.trim(),
      source: "site-portfolio"
    };

    const btn = form.querySelector('button[type="submit"]');
    const old = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Enviando...";

    try{
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type":"application/json", "Accept":"application/json" },
        body: JSON.stringify(payload)
      });

      if(!res.ok){
        throw new Error("Falha ao enviar.");
      }

      toast("Mensagem enviada! Vou te responder em breve.", "ok");
      form.reset();
    }catch{
      toast("Não consegui enviar agora. Tente novamente ou chame no WhatsApp.", "err");
    }finally{
      btn.disabled = false;
      btn.textContent = old;
    }
  });
}

/** ==========================
 * YEAR
 * ========================== */
function initYear(){
  const y = $("#year");
  if(y) y.textContent = String(new Date().getFullYear());
}

/** ==========================
 * START
 * ========================== */
function main(){
  initTheme();
  initNav();
  initScrollUI();
  initCounters();

  initModal();
  initPortfolioControls();
  renderPortfolio();

  initTestimonials();
  initFAQ();
  initContact();
  initPdf();
  initYear();
}

document.addEventListener("DOMContentLoaded", main);
