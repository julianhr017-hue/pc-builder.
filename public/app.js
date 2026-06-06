(() => {
  const $ = (id) => document.getElementById(id);

  const fallbackParts = {
    cpus: [
      { id: "", name: "Selecciona procesador", socket: "", ram: "", tdp: 0, igpu: false },
      { id: "r5_5600", name: "AMD Ryzen 5 5600", socket: "AM4", ram: "DDR4", tdp: 65, igpu: false },
      { id: "r5_7600", name: "AMD Ryzen 5 7600", socket: "AM5", ram: "DDR5", tdp: 65, igpu: true },
      { id: "r7_7800x3d", name: "AMD Ryzen 7 7800X3D", socket: "AM5", ram: "DDR5", tdp: 120, igpu: true },
      { id: "i5_12400f", name: "Intel Core i5-12400F", socket: "LGA1700", ram: "DDR4/DDR5", tdp: 65, igpu: false },
      { id: "i5_13600k", name: "Intel Core i5-13600K", socket: "LGA1700", ram: "DDR4/DDR5", tdp: 125, igpu: true }
    ],
    boards: [
      { id: "", name: "Selecciona placa madre", socket: "", ram: "", form: "", m2: 0 },
      { id: "b550m", name: "B550M AM4 DDR4", socket: "AM4", ram: "DDR4", form: "mATX", m2: 1 },
      { id: "x570_atx", name: "X570 ATX AM4 DDR4", socket: "AM4", ram: "DDR4", form: "ATX", m2: 2 },
      { id: "b650_atx", name: "B650 ATX AM5 DDR5", socket: "AM5", ram: "DDR5", form: "ATX", m2: 2 },
      { id: "x670_atx", name: "X670 ATX AM5 DDR5", socket: "AM5", ram: "DDR5", form: "ATX", m2: 3 },
      { id: "h610_ddr4", name: "H610 LGA1700 DDR4", socket: "LGA1700", ram: "DDR4", form: "mATX", m2: 1 },
      { id: "b760_ddr5", name: "B760 LGA1700 DDR5", socket: "LGA1700", ram: "DDR5", form: "ATX", m2: 2 },
      { id: "z790_ddr5", name: "Z790 LGA1700 DDR5", socket: "LGA1700", ram: "DDR5", form: "ATX", m2: 3 }
    ],
    ram: [
      { id: "", name: "Selecciona memoria RAM", type: "", capacity: 0 },
      { id: "ddr4_16", name: "16 GB DDR4 3200 MHz", type: "DDR4", capacity: 16 },
      { id: "ddr4_32", name: "32 GB DDR4 3600 MHz", type: "DDR4", capacity: 32 },
      { id: "ddr5_16", name: "16 GB DDR5 5600 MHz", type: "DDR5", capacity: 16 },
      { id: "ddr5_32", name: "32 GB DDR5 6000 MHz", type: "DDR5", capacity: 32 },
      { id: "ddr5_64", name: "64 GB DDR5 6000 MHz", type: "DDR5", capacity: 64 }
    ],
    gpus: [
      { id: "", name: "Sin tarjeta gráfica seleccionada", tdp: 0, psu: 0, length: 0 },
      { id: "rx6600", name: "AMD Radeon RX 6600", tdp: 132, psu: 500, length: 240 },
      { id: "rtx4060", name: "NVIDIA GeForce RTX 4060", tdp: 115, psu: 550, length: 250 },
      { id: "rtx4070s", name: "NVIDIA GeForce RTX 4070 Super", tdp: 220, psu: 650, length: 300 },
      { id: "rx7800xt", name: "AMD Radeon RX 7800 XT", tdp: 263, psu: 700, length: 320 },
      { id: "rtx4080s", name: "NVIDIA GeForce RTX 4080 Super", tdp: 320, psu: 750, length: 340 }
    ],
    psus: [
      { id: "", name: "Selecciona fuente de poder", watts: 0, rating: "" },
      { id: "500b", name: "500W 80+ Bronze", watts: 500, rating: "Bronze" },
      { id: "550b", name: "550W 80+ Bronze", watts: 550, rating: "Bronze" },
      { id: "650g", name: "650W 80+ Gold", watts: 650, rating: "Gold" },
      { id: "750g", name: "750W 80+ Gold", watts: 750, rating: "Gold" },
      { id: "850g", name: "850W 80+ Gold", watts: 850, rating: "Gold" }
    ],
    cases: [
      { id: "", name: "Selecciona gabinete", supports: [], gpuMax: 0 },
      { id: "matx_compact", name: "Gabinete compacto mATX", supports: ["mATX"], gpuMax: 280 },
      { id: "mid_atx", name: "Gabinete Mid Tower ATX", supports: ["ATX", "mATX"], gpuMax: 330 },
      { id: "large_atx", name: "Gabinete grande ATX", supports: ["ATX", "mATX"], gpuMax: 380 }
    ],
    coolers: [
      { id: "", name: "Selecciona disipador", sockets: [], tdp: 0 },
      { id: "stock_am4", name: "Disipador stock AM4/AM5 básico", sockets: ["AM4", "AM5"], tdp: 90 },
      { id: "air_150", name: "Disipador de aire 150W", sockets: ["AM4", "AM5", "LGA1700"], tdp: 150 },
      { id: "air_220", name: "Disipador torre 220W", sockets: ["AM4", "AM5", "LGA1700"], tdp: 220 },
      { id: "aio_240", name: "Enfriamiento líquido 240 mm", sockets: ["AM4", "AM5", "LGA1700"], tdp: 260 }
    ],
    storage: [
      { id: "", name: "Selecciona almacenamiento", type: "", watts: 0 },
      { id: "ssd_sata_1tb", name: "SSD SATA 1 TB", type: "SATA", watts: 4 },
      { id: "nvme_1tb", name: "SSD NVMe M.2 1 TB", type: "M.2", watts: 6 },
      { id: "nvme_2tb", name: "SSD NVMe M.2 2 TB", type: "M.2", watts: 8 }
    ]
  };

  const state = {
    token: localStorage.getItem("pc_builder_token") || "",
    user: JSON.parse(localStorage.getItem("pc_builder_user") || "null"),
    parts: fallbackParts,
    selection: {},
    analysis: null
  };

  const selectIds = {
    cpu: "cpuSelect",
    board: "boardSelect",
    ram: "ramSelect",
    gpu: "gpuSelect",
    psu: "psuSelect",
    case: "caseSelect",
    cooler: "coolerSelect",
    storage: "storageSelect"
  };

  function toast(message) {
    const msg = $("toastMessage");
    const toastEl = $("mainToast");
    if (msg) msg.innerHTML = message;
    if (window.bootstrap && toastEl) bootstrap.Toast.getOrCreateInstance(toastEl).show();
    else console.log(message);
  }

  async function request(url, options = {}) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
          ...(options.headers || {})
        }
      });
      const data = await response.json();
      if (!response.ok) toast(data.message || "Error en la petición.");
      return data;
    } catch (error) {
      return { ok: false, message: "No se pudo conectar con la API.", error: error.message };
    }
  }

  function jsonToBox(id, data) {
    const el = $(id);
    if (el) el.textContent = JSON.stringify(data, null, 2);
  }

  function fillSelect(id, items) {
    const select = $(id);
    if (!select) return;
    select.innerHTML = items.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
  }

  function fillAllSelects(parts = state.parts) {
    fillSelect("cpuSelect", parts.cpus || fallbackParts.cpus);
    fillSelect("boardSelect", parts.boards || fallbackParts.boards);
    fillSelect("ramSelect", parts.ram || fallbackParts.ram);
    fillSelect("gpuSelect", parts.gpus || fallbackParts.gpus);
    fillSelect("psuSelect", parts.psus || fallbackParts.psus);
    fillSelect("caseSelect", parts.cases || fallbackParts.cases);
    fillSelect("coolerSelect", parts.coolers || fallbackParts.coolers);
    fillSelect("storageSelect", parts.storage || fallbackParts.storage);
  }

  async function loadParts() {
    fillAllSelects(fallbackParts);

    const data = await request("/api/pc/parts");
    if (data.ok && data.parts) {
      state.parts = data.parts;
      fillAllSelects(data.parts);
    } else {
      state.parts = fallbackParts;
      toast("Catálogo local cargado. La API no respondió, pero los selectores funcionan.");
    }
  }

  function part(list, id) {
    return (state.parts[list] || fallbackParts[list]).find(item => item.id === id) || (state.parts[list] || fallbackParts[list])[0];
  }

  function readSelection() {
    const selection = {};
    for (const [key, id] of Object.entries(selectIds)) {
      selection[key] = $(id)?.value || "";
    }
    state.selection = selection;
    return selection;
  }

  function localAnalyze(selection = readSelection()) {
    const cpu = part("cpus", selection.cpu);
    const board = part("boards", selection.board);
    const ram = part("ram", selection.ram);
    const gpu = part("gpus", selection.gpu);
    const psu = part("psus", selection.psu);
    const pcCase = part("cases", selection.case);
    const cooler = part("coolers", selection.cooler);
    const storage = part("storage", selection.storage);

    const results = [];
    let checks = 0;
    let passed = 0;

    function add(type, title, message) { results.push({ type, title, message }); }
    function check(condition, okTitle, okMessage, badTitle, badMessage) {
      checks++;
      if (condition) { passed++; add("ok", okTitle, okMessage); }
      else add("bad", badTitle, badMessage);
    }

    if (cpu.id && board.id) check(cpu.socket === board.socket, "Socket compatible", `${cpu.name} usa ${cpu.socket}.`, "Socket incompatible", `${cpu.name} usa ${cpu.socket}, pero la placa usa ${board.socket}.`);
    else add("warn", "CPU o placa incompleta", "Selecciona procesador y placa madre.");

    if (board.id && ram.id) check(board.ram === ram.type, "RAM compatible", `La placa soporta ${board.ram}.`, "RAM incompatible", `La placa usa ${board.ram}, pero seleccionaste ${ram.type}.`);
    else add("warn", "RAM incompleta", "Selecciona placa y memoria RAM.");

    if (board.id && pcCase.id) check((pcCase.supports || []).includes(board.form), "Gabinete compatible", `El gabinete soporta ${board.form}.`, "Gabinete incompatible", `La placa es ${board.form}, pero el gabinete no la soporta.`);
    else add("warn", "Gabinete incompleto", "Selecciona gabinete y placa madre.");

    if (gpu.id && pcCase.id) check(gpu.length <= pcCase.gpuMax, "GPU cabe en gabinete", `La GPU mide ${gpu.length} mm.`, "GPU demasiado grande", `La GPU mide ${gpu.length} mm y el gabinete acepta ${pcCase.gpuMax} mm.`);
    else if (!gpu.id) add("warn", "GPU no seleccionada", "Si el CPU no tiene gráficos integrados, necesitarás GPU.");

    const estimatedWatts = Math.round(90 + (cpu.tdp || 0) + (gpu.tdp || 0) + (storage.watts || 0));
    const recommendedPsu = Math.max(gpu.psu || 0, Math.ceil((estimatedWatts * 1.45) / 50) * 50, 450);

    if (psu.id) check(psu.watts >= recommendedPsu, "Fuente suficiente", `Fuente de ${psu.watts}W para recomendado de ${recommendedPsu}W.`, "Fuente insuficiente", `Fuente de ${psu.watts}W, recomendado ${recommendedPsu}W.`);
    else add("warn", "Fuente no seleccionada", `Se recomienda una fuente de al menos ${recommendedPsu}W.`);

    if (cpu.id && cooler.id) check((cooler.sockets || []).includes(cpu.socket) && cooler.tdp >= cpu.tdp, "Enfriamiento adecuado", `El disipador soporta ${cpu.socket}.`, "Enfriamiento insuficiente", `El disipador no cumple socket o TDP.`);
    else add("warn", "Disipador incompleto", "Selecciona CPU y disipador.");

    if (cpu.id && !cpu.igpu && !gpu.id) { checks++; add("bad", "Falta GPU", `${cpu.name} no tiene gráficos integrados.`); }
    else if (cpu.id && (cpu.igpu || gpu.id)) { checks++; passed++; add("ok", "Salida de video cubierta", gpu.id ? "Hay GPU dedicada." : "El CPU tiene gráficos integrados."); }

    const score = checks ? Math.round((passed / checks) * 100) : 0;
    return { score, estimatedWatts, recommendedPsu, results };
  }

  function renderAnalysis(data) {
    const analysis = data.analysis || data;
    state.analysis = analysis;

    const list = $("compatibilityList");
    if (list) {
      list.innerHTML = (analysis.results || []).map(item => {
        const icon = item.type === "ok" ? "bi-check-circle-fill" : item.type === "bad" ? "bi-x-octagon-fill" : "bi-exclamation-triangle-fill";
        return `<div class="compat ${item.type}"><i class="bi ${icon}"></i><div><b>${item.title}</b><p class="small mb-0">${item.message}</p></div></div>`;
      }).join("");
    }

    const score = analysis.score || 0;
    if ($("scoreRing")) $("scoreRing").style.setProperty("--deg", `${score * 3.6}deg`);
    if ($("scoreText")) $("scoreText").textContent = `${score}%`;
    if ($("specWatt")) $("specWatt").textContent = `${analysis.estimatedWatts || 0}W`;
    if ($("specPsu")) $("specPsu").textContent = `${analysis.recommendedPsu || 0}W mínimo`;
    if ($("scoreMessage")) {
      $("scoreMessage").textContent = score >= 90 ? "Armado muy compatible." : score >= 65 ? "Armado aceptable." : "Revisa conflictos o piezas faltantes.";
    }
  }

  async function analyze() {
    const selection = readSelection();
    const apiData = await request("/api/pc/analyze", { method: "POST", body: JSON.stringify({ selection }) });
    if (apiData.ok && apiData.analysis) renderAnalysis(apiData);
    else renderAnalysis(localAnalyze(selection));
  }

  function localSuggestions(selection = readSelection()) {
    const board = part("boards", selection.board);
    const cpu = part("cpus", selection.cpu);
    const gpu = part("gpus", selection.gpu);
    const groups = [];

    if (cpu.id && !board.id) groups.push({ title: "Placas compatibles", items: (state.parts.boards || []).filter(b => b.id && b.socket === cpu.socket).map(b => b.name) });
    if (board.id && !selection.ram) groups.push({ title: "RAM compatible", items: (state.parts.ram || []).filter(r => r.id && r.type === board.ram).map(r => r.name) });
    if (gpu.id && !selection.psu) groups.push({ title: "Fuentes sugeridas", items: (state.parts.psus || []).filter(p => p.id && p.watts >= (gpu.psu || 500)).map(p => p.name) });
    if (!groups.length) groups.push({ title: "Recomendación", items: ["Usa las pre-creaciones de baja, media o alta gama para cargar un armado completo."] });
    return groups;
  }

  function renderSuggestions(groups) {
    const box = $("recommendationList");
    if (!box) return;
    box.innerHTML = groups.map(group => `<div class="compat warn"><i class="bi bi-lightbulb-fill"></i><div><b>${group.title}</b><ul class="small mt-2 mb-0">${group.items.map(item => `<li>${item}</li>`).join("")}</ul></div></div>`).join("");
  }

  async function suggest() {
    const selection = readSelection();
    const apiData = await request("/api/pc/suggest", { method: "POST", body: JSON.stringify({ selection }) });
    if (apiData.ok && apiData.recommendations) renderSuggestions(apiData.recommendations);
    else renderSuggestions(localSuggestions(selection));
  }

  function setSelectValue(id, value) {
    const el = $(id);
    if (el) el.value = value;
  }

  function applyPreset(name, ids) {
    setSelectValue("cpuSelect", ids.cpu);
    setSelectValue("boardSelect", ids.board);
    setSelectValue("ramSelect", ids.ram);
    setSelectValue("gpuSelect", ids.gpu);
    setSelectValue("psuSelect", ids.psu);
    setSelectValue("caseSelect", ids.case);
    setSelectValue("coolerSelect", ids.cooler);
    setSelectValue("storageSelect", ids.storage);
    if ($("presetInfo")) $("presetInfo").innerHTML = `<b>${name}</b> cargada. Puedes analizarla, modificar piezas o guardarla con una cuenta.`;
    analyze();
    suggest();
    toast(`${name} cargada.`);
  }

  function presetLow() {
    applyPreset("PC de baja gama", { cpu: "i5_12400f", board: "h610_ddr4", ram: "ddr4_16", gpu: "rx6600", psu: "500b", case: "matx_compact", cooler: "air_150", storage: "ssd_sata_1tb" });
  }

  function presetMid() {
    applyPreset("PC de media gama", { cpu: "r5_5600", board: "b550m", ram: "ddr4_32", gpu: "rtx4060", psu: "550b", case: "mid_atx", cooler: "air_150", storage: "nvme_1tb" });
  }

  function presetHigh() {
    applyPreset("PC de alta gama", { cpu: "r7_7800x3d", board: "b650_atx", ram: "ddr5_32", gpu: "rtx4080s", psu: "850g", case: "large_atx", cooler: "aio_240", storage: "nvme_2tb" });
  }

  function syncSessionUI() {
    const active = !!state.user;
    if ($("sessionLabel")) $("sessionLabel").textContent = active ? state.user.name : "Login";
    if ($("sessionText")) $("sessionText").innerHTML = active ? `Sesión activa como <b>${state.user.name}</b> (${state.user.role}).` : "Sin sesión activa.";
    if ($("builderSessionStatus")) $("builderSessionStatus").textContent = active ? state.user.name : "Invitado";
  }

  function authMsg(message, type = "info") {
    const cls = type === "ok" ? "alert-success" : type === "bad" ? "alert-danger" : "alert-dark";
    ["apiOutput", "modalAuthOutput"].forEach(id => {
      const el = $(id);
      if (!el) return;
      el.className = `alert ${cls} border-secondary ${id === "modalAuthOutput" ? "mt-4" : ""} mb-0`;
      el.innerHTML = message;
    });
  }

  function setSession(token, user) {
    state.token = token;
    state.user = user;
    localStorage.setItem("pc_builder_token", token);
    localStorage.setItem("pc_builder_user", JSON.stringify(user));
    syncSessionUI();
  }

  function clearSession() {
    state.token = "";
    state.user = null;
    localStorage.removeItem("pc_builder_token");
    localStorage.removeItem("pc_builder_user");
    syncSessionUI();
  }

  async function register() {
    const data = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: $("registerName")?.value || "",
        email: $("registerEmail")?.value || "",
        password: $("registerPassword")?.value || "",
        role: $("registerRole")?.value || "user"
      })
    });
    if (data.token) {
      setSession(data.token, data.user);
      authMsg(`Registro correcto. Bienvenido, <b>${data.user.name}</b>.`, "ok");
      toast("Usuario registrado.");
    } else authMsg(data.message || "No se pudo registrar.", "bad");
  }

  async function login() {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: $("loginEmail")?.value || "",
        password: $("loginPassword")?.value || ""
      })
    });
    if (data.token) {
      setSession(data.token, data.user);
      authMsg(`Inicio de sesión correcto. Entraste como <b>${data.user.name}</b>.`, "ok");
      toast("Login correcto.");
    } else authMsg(data.message || "No se pudo iniciar sesión.", "bad");
  }

  async function me() {
    const data = await request("/api/users/me");
    if (data.ok) authMsg(`Perfil activo: <b>${data.user.name}</b> (${data.user.role}).`, "ok");
    else authMsg(data.message || "No se pudo consultar el perfil.", "bad");
  }

  async function saveBuild() {
    if (!state.token) {
      toast("Inicia sesión para guardar.");
      if (window.bootstrap && $("modalAuth")) bootstrap.Modal.getOrCreateInstance($("modalAuth")).show();
      return;
    }
    await analyze();
    const data = await request("/api/builds", { method: "POST", body: JSON.stringify({ name: "Armado PC-BUILDER", parts: readSelection(), analysis: state.analysis }) });
    jsonToBox("dashboardOutput", data);
    if (data.ok) toast("Armado guardado.");
  }

  async function myBuilds() { jsonToBox("dashboardOutput", await request("/api/builds")); }
  async function adminUsers() { jsonToBox("dashboardOutput", await request("/api/users")); }
  async function adminBuilds() { jsonToBox("dashboardOutput", await request("/api/builds/admin/all")); }

  function copyBuild() {
    const summary = JSON.stringify({ parts: readSelection(), score: state.analysis?.score || 0 }, null, 2);
    navigator.clipboard?.writeText(summary).then(() => toast("Resumen copiado."), () => toast("No se pudo copiar."));
  }

  function clearBuild() {
    Object.values(selectIds).forEach(id => setSelectValue(id, ""));
    if ($("presetInfo")) $("presetInfo").innerHTML = "Selecciona una pre-creación de baja, media o alta gama para cargar componentes automáticamente.";
    analyze();
    suggest();
  }

  async function sendContact(event) {
    event.preventDefault();
    const data = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: $("contactName")?.value || "",
        email: $("contactEmail")?.value || "",
        subject: $("contactSubject")?.value || "",
        message: $("contactMessage")?.value || ""
      })
    });
    if ($("apiOutput") && data.ok) authMsg("Consulta enviada en modo demostración.", "ok");
    else if ($("apiOutput")) authMsg(data.message || "No se pudo enviar la consulta.", "bad");
    if (data.ok) toast("Consulta enviada.");
  }

  function bindClick(id, fn) {
    const el = $(id);
    if (el) el.addEventListener("click", fn);
  }

  function bindEvents() {
    bindClick("registerBtn", register);
    bindClick("loginBtn", login);
    bindClick("logoutBtn", () => { clearSession(); authMsg("Sesión cerrada. Ya no hay usuario activo."); toast("Sesión cerrada."); });
    bindClick("modalLogoutBtn", () => { clearSession(); authMsg("Sesión cerrada. Ya no hay usuario activo."); toast("Sesión cerrada."); });
    bindClick("meBtn", me);

    bindClick("demoAdminBtn", () => {
      if ($("registerName")) $("registerName").value = "Admin Demo";
      if ($("registerEmail")) $("registerEmail").value = "admin@correo.com";
      if ($("registerRole")) $("registerRole").value = "admin";
      if ($("loginEmail")) $("loginEmail").value = "admin@correo.com";
      if ($("loginPassword")) $("loginPassword").value = "123456";
      toast("Datos de admin cargados.");
    });

    ["presetLowBtn", "presetLowBtnCard"].forEach(id => bindClick(id, presetLow));
    ["presetMidBtn", "presetMidBtnCard"].forEach(id => bindClick(id, presetMid));
    ["presetHighBtn", "presetHighBtnCard"].forEach(id => bindClick(id, presetHigh));

    bindClick("analyzeBtn", analyze);
    bindClick("suggestBtn", suggest);
    bindClick("saveBuildBtn", saveBuild);
    bindClick("copyBuildBtn", copyBuild);
    bindClick("clearBuildBtn", clearBuild);
    bindClick("myBuildsBtn", myBuilds);
    bindClick("adminUsersBtn", adminUsers);
    bindClick("adminBuildsBtn", adminBuilds);

    document.querySelectorAll(".part").forEach(select => select.addEventListener("change", () => { analyze(); suggest(); }));

    const contactForm = $("contactForm");
    if (contactForm) contactForm.addEventListener("submit", sendContact);
    bindClick("fillContactBtn", () => {
      if ($("contactName")) $("contactName").value = "Alumno demo";
      if ($("contactEmail")) $("contactEmail").value = "alumno@demo.com";
      if ($("contactMessage")) $("contactMessage").value = "Quiero revisar mi armado de PC.";
    });

    bindClick("themeToggle", () => {
      const html = document.documentElement;
      const next = html.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
      html.setAttribute("data-bs-theme", next);
    });
  }

  document.addEventListener("DOMContentLoaded", async () => {
    bindEvents();
    syncSessionUI();
    await loadParts();
    await analyze();
    await suggest();
  });
})();
