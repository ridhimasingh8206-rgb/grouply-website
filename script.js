/* ==========================================================
   Grouply – script
   1. Site configuration (edit this to connect the waitlist form)
   2. Mobile navigation + active link highlighting
   3. Sample dashboard (DEMO DATA ONLY)
   4. Waitlist form (honest about whether anything is saved)
   ========================================================== */

/* ---------- 1. CONFIGURATION ---------- */
const CONFIG = {
  // Paste a form-service endpoint here (for example a Formspree URL such as
  // "https://formspree.io/f/xxxxxxxx"). While this is empty, the form runs in
  // DEMO mode: it validates input but sends and saves NOTHING.
  // See README.md for step-by-step instructions.
  formEndpoint: "",

  // Optional: add your own contact email so the footer "Contact" link opens an
  // email draft. If empty, "Contact" simply scrolls to the waitlist form.
  contactEmail: ""
};

/* ---------- 2. NAVIGATION ---------- */
(function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("nav-menu");

  function setOpen(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });

  // Highlight the nav link for the section currently in view
  const links = [...document.querySelectorAll(".nav-links a")];
  const targets = links.map(a => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    targets.forEach(t => io.observe(t));
  }

  // Optional contact email
  if (CONFIG.contactEmail) {
    const c = document.getElementById("contact-link");
    c.setAttribute("href", "mailto:" + CONFIG.contactEmail);
  }
})();

/* ---------- 3. SAMPLE DASHBOARD (DEMO DATA ONLY) ---------- */
(function initDashboard() {
  // All names, tasks and statuses below are invented for illustration.
  const members = [
    { id: "A", name: "Aarav", color: "#e9e1fa" },
    { id: "M", name: "Meera", color: "#fbe7f4" },
    { id: "K", name: "Kabir", color: "#e2ecfc" },
    { id: "S", name: "Sana",  color: "#d8f3e8" }
  ];
  const tasks = [
    { title: "Research market trends", owner: "A", due: "Due Mon", status: "done" },
    { title: "Collect references",     owner: "S", due: "Due Mon", status: "done" },
    { title: "Draft slides 1 to 4",    owner: "M", due: "Due Tue", status: "doing" },
    { title: "Design the poster",      owner: "K", due: "Due Wed", status: "todo" },
    { title: "Draft slides 5 to 8",    owner: "A", due: "Due Thu", status: "doing" },
    { title: "Rehearse and finalise",  owner: "M", due: "Due Fri", status: "todo" }
  ];
  const next = { todo: "doing", doing: "done", done: "todo" };
  const label = { todo: "Not started", doing: "In progress", done: "Done" };

  const list = document.getElementById("task-list");
  const memberList = document.getElementById("member-list");
  const fill = document.getElementById("progress-fill");
  const bar = document.getElementById("progress-bar");
  const value = document.getElementById("progress-value");
  const sub = document.getElementById("progress-sub");
  const memberById = Object.fromEntries(members.map(m => [m.id, m]));

  function render() {
    list.innerHTML = "";
    tasks.forEach((t, i) => {
      const m = memberById[t.owner];
      const li = document.createElement("li");
      const b = document.createElement("button");
      b.type = "button";
      b.className = "task";
      b.dataset.status = t.status;
      b.setAttribute("aria-label", `${t.title}, owner ${m.name}, ${t.due}, status ${label[t.status]}. Select to change status.`);
      b.innerHTML = `
        <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
        <span>
          <span class="task-name">${t.title}</span>
          <span class="task-meta"><span class="avatar" style="background:${m.color}">${m.id}</span>${m.name} &middot; ${t.due}</span>
        </span>
        <span class="status">${label[t.status]}</span>`;
      b.addEventListener("click", () => { tasks[i].status = next[t.status]; render(); });
      li.appendChild(b);
      list.appendChild(li);
    });

    const done = tasks.filter(t => t.status === "done").length;
    const pct = Math.round((done / tasks.length) * 100);
    fill.style.width = pct + "%";
    value.textContent = pct + "%";
    bar.setAttribute("aria-valuenow", pct);
    sub.textContent = `${done} of ${tasks.length} sample tasks done`;

    memberList.innerHTML = "";
    members.forEach(m => {
      const mine = tasks.filter(t => t.owner === m.id);
      const mineDone = mine.filter(t => t.status === "done").length;
      const w = mine.length ? Math.round((mineDone / mine.length) * 100) : 0;
      const li = document.createElement("li");
      li.className = "member";
      li.innerHTML = `<span>${m.name}</span>
        <span class="bar" aria-hidden="true"><span class="bar-fill" style="width:${w}%"></span></span>
        <span class="member-count">${mineDone}/${mine.length}</span>`;
      memberList.appendChild(li);
    });
  }
  render();
})();

/* ---------- 4. WAITLIST FORM ---------- */
(function initForm() {
  const form = document.getElementById("waitlist-form");
  const status = document.getElementById("form-status");
  const banner = document.getElementById("demo-banner");
  const btn = document.getElementById("submit-btn");
  const live = Boolean(CONFIG.formEndpoint);

  // The "demo" banner is only hidden once a real endpoint is configured.
  if (live) banner.hidden = true;

  const rules = {
    fullName: v => v.trim().length >= 2 ? "" : "Enter your full name.",
    phone: v => /^\+?[0-9][0-9\s\-()]{6,17}$/.test(v.trim()) && v.replace(/\D/g, "").length >= 7 && v.replace(/\D/g, "").length <= 15
      ? "" : "Enter a valid phone number (7 to 15 digits, optionally starting with +).",
    college: v => v.trim().length >= 2 ? "" : "Enter your college name.",
    email: v => v.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Enter a valid email address, or leave this blank."
  };

  function setError(name, msg) {
    const input = form.elements[name];
    const out = document.getElementById(name + "-error");
    out.textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) input.setAttribute("aria-describedby", name + "-error"); else input.removeAttribute("aria-describedby");
  }

  function validate() {
    let firstBad = null;
    Object.keys(rules).forEach(name => {
      const msg = rules[name](form.elements[name].value);
      setError(name, msg);
      if (msg && !firstBad) firstBad = form.elements[name];
    });
    const consentOk = form.elements.consent.checked;
    setError("consent", consentOk ? "" : "Please tick the box so we know you agree to be contacted.");
    if (!consentOk && !firstBad) firstBad = form.elements.consent;
    return firstBad;
  }

  function show(type, html) {
    status.hidden = false;
    status.dataset.type = type;
    status.innerHTML = html;
  }

  // Clear an error as soon as the user fixes the field
  Object.keys(rules).forEach(name => {
    form.elements[name].addEventListener("input", () => setError(name, rules[name](form.elements[name].value)));
  });
  form.elements.consent.addEventListener("change", () => {
    setError("consent", form.elements.consent.checked ? "" : "Please tick the box so we know you agree to be contacted.");
  });

  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.hidden = true;
    const bad = validate();
    if (bad) { bad.focus(); return; }

    // DEMO MODE: no endpoint configured. Nothing is sent or stored.
    if (!live) {
      show("demo", "<strong>Demo only: nothing was sent or saved.</strong> This form isn't connected to a database or form service yet, so your details were not stored anywhere. To make it collect real sign-ups, follow the steps in README.md.");
      return;
    }

    // LIVE MODE: send to the configured endpoint and only report success if it says so.
    btn.disabled = true;
    const original = btn.textContent;
    btn.textContent = "Sending...";
    try {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      });
      if (res.ok) {
        form.reset();
        show("success", "<strong>Thanks, you're on the list.</strong> Your details were sent to the form service. We'll contact you about Grouply's prototype and updates.");
      } else {
        show("error", "<strong>Your details were not saved.</strong> The form service returned an error. Please try again in a moment.");
      }
    } catch (err) {
      show("error", "<strong>Your details were not saved.</strong> We couldn't reach the form service. Check your internet connection and try again.");
    } finally {
      btn.disabled = false;
      btn.textContent = original;
    }
  });
})();
