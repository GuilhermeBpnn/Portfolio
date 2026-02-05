/* =========================
   Helpers
========================= */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function debounce(fn, wait = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toast(message, type = "ok") {
  const el = $("#toast");
  if (!el) return;
  el.className = `toast is-show toast--${type}`;
  el.textContent = message;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-show"), 3200);
}

function buildWaLink(phoneE164, message) {
  return `https://wa.me/${phoneE164}?text=${encodeURIComponent(message || "")}`;
}

/* =========================
   Config / Data
========================= */
const CONFIG = {
  whatsappMessage:
    "Olá Guilherme! Vim pelo seu site e gostaria de um orçamento. Podemos conversar?"
};

const DATA = {
  profile: {
    name: "Guilherme Ataides",
    email: "guilhermeb.ataides@gmail.com",
    whatsapp: "5562982012982",
    github: "https://github.com/GuilhermeBpnn"
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
      links: { demo: "", repo: "" }
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
  ]
};

/* =========================
   Theme
========================= */
function initTheme() {
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  const btn = $("#themeToggle");
  if (!btn) return;

  const updateIcon = () => {
    const t = document.documentElement.getAttribute("data-theme") || "dark";
    const icon = btn.querySelector(".icon");
    if (icon) icon.textContent = t === "light" ? "☀" : "☾";
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

/* =========================
   Mobile Nav
========================= */
function initNav() {
  const toggle = $("#navToggle");
  const menu = $("#navMenu");
  if (!toggle || !menu) return;

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

  $$("#navMenu a").forEach((a) => a.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

/* =========================
   Scroll UI
========================= */
function initScrollUI() {
  const bar = $("#scrollBar");
  const backToTop = $("#backToTop");

  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (bar) bar.style.width = `${p}%`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }
}

/* =========================
   Hero Counters
========================= */
function initCounters() {
  const els = $$("[data-count]");
  if (!els.length) return;

  const animate = (el) => {
    const to = Number(el.getAttribute("data-count")) || 0;
    const duration = 900;
    const start = performance.now();

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const val = Math.floor(to * (0.15 + 0.85 * p));
      el.textContent = String(val);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(to);
    };

    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          animate(ent.target);
          io.unobserve(ent.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  els.forEach((el) => io.observe(el));
}

/* =========================
   Portfolio (filter/search)
========================= */
const portfolioState = {
  filter: "all",
  search: ""
};

function getVisibleProjects() {
  const q = portfolioState.search.trim().toLowerCase();

  return DATA.portfolio.filter((p) => {
    const byFilter = portfolioState.filter === "all" ? true : p.category === portfolioState.filter;
    const hay = `${p.title} ${p.summary} ${p.tags.join(" ")} ${p.stack.join(" ")}`.toLowerCase();
    const bySearch = q ? hay.includes(q) : true;
    return byFilter && bySearch;
  });
}

function renderPortfolio() {
  const grid = $("#portfolioGrid");
  if (!grid) return;

  const items = getVisibleProjects();

  if (!items.length) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;">
        <strong>Nenhum projeto encontrado.</strong>
        <p style="margin:8px 0 0; color: var(--muted);">Tente remover filtros ou buscar por outro termo.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = items
    .map(
      (p) => `
      <article class="card project">
        <div class="project__thumb" aria-hidden="true"></div>
        <div class="project__body">
          <h3 class="project__title">${escapeHtml(p.title)}</h3>
          <div class="project__meta">
            <span class="pill-mini">${escapeHtml(p.year)}</span>
            <span class="pill-mini">${escapeHtml(p.category)}</span>
            ${p.tags.slice(0, 2).map((t) => `<span class="pill-mini">${escapeHtml(t)}</span>`).join("")}
          </div>
          <p class="project__desc">${escapeHtml(p.summary)}</p>
        </div>
        <div class="project__actions">
          <button class="btn btn--soft" type="button" data-open="${escapeHtml(p.id)}">Detalhes</button>
          <a class="btn btn--ghost" href="#contato">Quero um projeto</a>
        </div>
      </article>
    `
    )
    .join("");

  $$("[data-open]", grid).forEach((btn) => {
    btn.addEventListener("click", () => openProject(btn.getAttribute("data-open")));
  });
}

function initPortfolioControls() {
  $$(".chip[data-filter]").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip[data-filter]").forEach((c) => {
        c.classList.remove("is-active");
        c.setAttribute("aria-selected", "false");
      });

      chip.classList.add("is-active");
      chip.setAttribute("aria-selected", "true");
      portfolioState.filter = chip.getAttribute("data-filter") || "all";
      renderPortfolio();
    });
  });

  const input = $("#portfolioSearch");
  if (input) {
    input.addEventListener(
      "input",
      debounce((e) => {
        portfolioState.search = e.target.value || "";
        renderPortfolio();
      }, 120)
    );
  }
}

/* =========================
   Modal
========================= */
function initModal() {
  const modal = $("#projectModal");
  if (!modal) return;

  const close = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  $$("[data-modal-close]", modal).forEach((el) => el.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });

  window.__closeModal = close;
}

function openProject(id) {
  const project = DATA.portfolio.find((p) => p.id === id);
  if (!project) return;

  const modal = $("#projectModal");
  const body = $("#modalBody");
  if (!modal || !body) return;

  const demo = project.links?.demo || "";
  const repo = project.links?.repo || "";

  body.innerHTML = `
    <div class="modal__header">
      <div>
        <h3 class="modal__title">${escapeHtml(project.title)}</h3>
        <p class="modal__sub">${escapeHtml(project.summary)}</p>
        <div class="modal__tags">
          ${project.tags.map((t) => `<span class="pill-mini">${escapeHtml(t)}</span>`).join("")}
          ${project.stack.map((s) => `<span class="pill-mini">${escapeHtml(s)}</span>`).join("")}
        </div>
      </div>
    </div>

    <div class="modal__grid">
      <div class="kv"><span class="kv__k">Categoria</span><span class="kv__v">${escapeHtml(project.category)}</span></div>
      <div class="kv"><span class="kv__k">Ano</span><span class="kv__v">${escapeHtml(project.year)}</span></div>
      <div class="kv"><span class="kv__k">Papel</span><span class="kv__v">${escapeHtml(project.role)}</span></div>
      <div class="kv">
        <span class="kv__k">Indicadores</span>
        <span class="kv__v">${escapeHtml(project.metrics.performance)} perf • ${escapeHtml(project.metrics.seo)} SEO • ${escapeHtml(project.metrics.acessibilidade)} A11y</span>
      </div>
    </div>

    <div class="modal__actions">
      ${
        demo
          ? `<a class="btn btn--primary" href="${escapeHtml(demo)}" target="_blank" rel="noopener">Ver demo<span class="btn__shine" aria-hidden="true"></span></a>`
          : `<button class="btn btn--primary" type="button" disabled>Sem link público<span class="btn__shine" aria-hidden="true"></span></button>`
      }
      ${
        repo
          ? `<a class="btn btn--soft" href="${escapeHtml(repo)}" target="_blank" rel="noopener">Repositório</a>`
          : `<button class="btn btn--soft" type="button" disabled>Privado</button>`
      }
      <button class="btn btn--ghost" type="button" onclick="window.__closeModal()">Fechar</button>
    </div>
  `;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

/* =========================
   PDF (open + print)
========================= */
function initPdf() {
  const handler = () => {
    const w = window.open("", "_blank", "noopener,noreferrer,width=900,height=720");
    if (!w) {
      toast("Permita pop-ups para gerar o PDF.", "warn");
      return;
    }

    const projectsHtml = DATA.portfolio
      .map(
        (p) => `
        <div style="padding:12px 0;border-bottom:1px solid #ddd;">
          <div style="font-weight:800;font-size:16px;">${escapeHtml(p.title)}</div>
          <div style="color:#444;margin-top:6px;">${escapeHtml(p.summary)}</div>
          <div style="margin-top:8px;color:#666;font-size:13px;">
            <b>Categoria:</b> ${escapeHtml(p.category)} • <b>Ano:</b> ${escapeHtml(p.year)} • <b>Papel:</b> ${escapeHtml(p.role)}
          </div>
          <div style="margin-top:6px;color:#666;font-size:13px;">
            <b>Stack:</b> ${escapeHtml(p.stack.join(", "))} • <b>Tags:</b> ${escapeHtml(p.tags.join(", "))}
          </div>
        </div>
      `
      )
      .join("");

    w.document.write(`
      <!doctype html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Portfólio — ${escapeHtml(DATA.profile.name)}</title>
        <style>
          body{ font-family: Arial, sans-serif; margin: 26px; color:#111; }
          h1{ margin:0; font-size: 22px; }
          .muted{ color:#666; margin-top:6px; }
          .top{ display:flex; justify-content:space-between; gap:12px; margin-bottom:16px; }
          .box{ border:1px solid #ddd; border-radius:12px; padding:14px; }
          @media print{ .no-print{ display:none; } body{ margin: 14mm; } }
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
            <div><b>GitHub:</b> ${escapeHtml(DATA.profile.github)}</div>
          </div>
        </div>

        <h2 style="margin:18px 0 10px;">Projetos</h2>
        ${projectsHtml}

        <div class="no-print" style="margin-top:18px;">
          <button onclick="window.print()" style="padding:10px 14px;border-radius:10px;border:1px solid #111;background:#111;color:#fff;cursor:pointer;">
            Imprimir / Salvar como PDF
          </button>
          <span style="color:#666; margin-left:10px;">Escolha “Salvar como PDF”.</span>
        </div>
      </body>
      </html>
    `);

    w.document.close();
    toast("PDF aberto em nova aba.", "ok");
  };

  $("#downloadPdf")?.addEventListener("click", handler);
  $("#downloadPdf2")?.addEventListener("click", handler);
}

/* =========================
   Contact (no form)
========================= */
function initContact() {
  const copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(DATA.profile.email);
        toast("E-mail copiado!", "ok");
      } catch {
        toast("Copie manualmente.", "warn");
      }
    });
  }

  const wa = $("#waLink") || $("#waCta") || $$('a[href^="https://wa.me/"]')[0];
  if (wa) {
    wa.href = buildWaLink(DATA.profile.whatsapp, CONFIG.whatsappMessage);
  }
}

/* =========================
   WhatsApp Floating Button
========================= */
function initWhatsAppFloatingButton() {
  if ($("#waFloat")) return;

  const a = document.createElement("a");
  a.id = "waFloat";
  a.href = buildWaLink(DATA.profile.whatsapp, CONFIG.whatsappMessage);
  a.target = "_blank";
  a.rel = "noopener";
  a.setAttribute("aria-label", "Chamar no WhatsApp");

  a.innerHTML = `
    <span aria-hidden="true">💬</span>
    <span class="waFloat__text">WhatsApp</span>
  `;

  document.body.appendChild(a);
}

/* =========================
   Year
========================= */
function initYear() {
  const y = $("#year");
  if (y) y.textContent = String(new Date().getFullYear());
}

/* =========================
   Boot
========================= */
function main() {
  initTheme();
  initNav();
  initScrollUI();
  initCounters();

  initModal();
  initPortfolioControls();
  renderPortfolio();

  initPdf();
  initContact();
  initWhatsAppFloatingButton();
  initYear();
}

document.addEventListener("DOMContentLoaded", main);
