
(function () {
  'use strict';

// Data Banks
  const FIRST_NAMES = ['Aiden', 'Maya', 'Noah', 'Zara', 'Leo', 'Priya', 'Ethan', 'Amara', 'Kai', 'Sofia', 'Ravi', 'Elena', 'Omar', 'Lucia', 'Jonas', 'Nia'];
  const LAST_NAMES = ['Chen', 'Okafor', 'Silva', 'Kapoor', 'Nguyen', 'Martinez', 'Andersson', 'Kobayashi', 'Rossi', 'Haddad', 'Novak', 'Fischer'];
  const DOMAINS = ['example.com', 'mailbox.io', 'inboxly.net', 'workmail.co', 'devmail.app'];
  const CITIES = ['Austin', 'Lisbon', 'Nairobi', 'Osaka', 'Toronto', 'Wellington', 'Kolkata', 'Berlin', 'Santiago', 'Dubai'];
  const COUNTRIES = ['United States', 'Portugal', 'Kenya', 'Japan', 'Canada', 'New Zealand', 'India', 'Germany', 'Chile', 'UAE'];
  const CATEGORIES = ['Electronics', 'Home & Garden', 'Sports', 'Books', 'Fashion', 'Toys', 'Automotive', 'Health', 'Music', 'Outdoors'];
  const PRODUCT_ADJ = ['Compact', 'Wireless', 'Ergonomic', 'Portable', 'Smart', 'Rugged', 'Lightweight', 'Modular', 'Precision', 'Adaptive'];
  const PRODUCT_NOUN = ['Speaker', 'Backpack', 'Controller', 'Sensor', 'Charger', 'Monitor', 'Tracker', 'Beacon', 'Console', 'Hub'];
  const WORDS = ['signal', 'vector', 'nimbus', 'quartz', 'atlas', 'ember', 'drift', 'lumen', 'cipher', 'orbit', 'relay', 'pulse'];
  const STREETS = ['Maple Ave', 'Harbor Rd', 'Sunset Blvd', 'King St', '5th Ave', 'Birch Ln', 'Market St'];

  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const pad = (n) => String(n).padStart(2, '0');

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function randomDate() {
    const start = new Date(2019, 0, 1).getTime();
    const end = new Date(2026, 11, 31).getTime();
    const d = new Date(start + Math.random() * (end - start));
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function randomTimestamp() {
    const start = new Date(2024, 0, 1).getTime();
    const end = Date.now();
    const d = new Date(start + Math.random() * (end - start));
    return d.toISOString();
  }

// App state
  let fieldIdCounter = 0;

  const state = {
    resourceName: 'items',
    schema: [],
    mockData: [],
    endpoints: [],
    requests: [],
    postmanRequests: [],
    validation: null // { valid: bool, missing: [] }
  };

  const DEFAULT_SCHEMA = [
    { name: 'id', type: 'uuid', required: true, example: '' },
    { name: 'name', type: 'text', required: true, example: '' },
    { name: 'email', type: 'email', required: true, example: '' },
    { name: 'price', type: 'price', required: false, example: '' },
    { name: 'isActive', type: 'boolean', required: false, example: '' }
  ];

// DOM references
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const el = {
    nlInput: $('#nlInput'),
    openapiInput: $('#openapiInput'),
    postmanInput: $('#postmanInput'),
    postmanPreview: $('#postmanPreview'),
    postmanList: $('#postmanList'),
    resourceNameInput: $('#resourceNameInput'),
    schemaTableBody: $('#schemaTableBody'),
    mockCount: $('#mockCount'),
    jsonViewer: $('#jsonViewer'),
    endpointsList: $('#endpointsList'),
    endpointsEmpty: $('#endpointsEmpty'),
    testerMethod: $('#testerMethod'),
    testerEndpoint: $('#testerEndpoint'),
    testerResponseWrap: $('#testerResponseWrap'),
    testerResponse: $('#testerResponse'),
    testerStatusBadge: $('#testerStatusBadge'),
    testerLatency: $('#testerLatency'),
    testerSize: $('#testerSize'),
    sdkCode: $('#sdkCode'),
    telemetryList: $('#telemetryList'),
    telemetryEmpty: $('#telemetryEmpty'),
    validationBanner: $('#validationBanner'),
    statEndpoints: $('#statEndpoints'),
    statSchemas: $('#statSchemas'),
    statObjects: $('#statObjects'),
    statRequests: $('#statRequests'),
    statValidation: $('#statValidation'),
    toastContainer: $('#toastContainer'),
    progressBarFill: $('#progressBarFill')
  };

  let activeSdkTab = 'javascript';

 // Toast notifications
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast${type ? ' toast--' + type : ''}`;
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 2600);
  }

 // Loading UI
  function showProgress() {
    el.progressBarFill.style.width = '30%';
    setTimeout(() => { el.progressBarFill.style.width = '75%'; }, 150);
  }

  function hideProgress() {
    el.progressBarFill.style.width = '100%';
    setTimeout(() => { el.progressBarFill.style.width = '0%'; }, 350);
  }

  function withLoading(button, work, delay) {
    if (button) {
      button.classList.add('is-loading');
      button.disabled = true;
    }
    showProgress();
    return new Promise((resolve) => {
      setTimeout(() => {
        work();
        if (button) {
          button.classList.remove('is-loading');
          button.disabled = false;
        }
        hideProgress();
        resolve();
      }, delay || 550);
    });
  }

// Tabs
  function wireTabGroup(buttonSelector, dataAttr, panelSelector, panelAttr, onSwitch) {
    $$(buttonSelector).forEach((btn) => {
      btn.addEventListener('click', () => {
        $$(buttonSelector).forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const key = btn.getAttribute(dataAttr);
        $$(panelSelector).forEach((p) => {
          p.classList.toggle('is-active', p.getAttribute(panelAttr) === key);
        });
        if (onSwitch) onSwitch(key);
      });
    });
  }

  wireTabGroup('.tab-btn[data-tab]', 'data-tab', '.input-tab-panel', 'data-panel');
  wireTabGroup('.tab-btn[data-otab]', 'data-otab', '.output-tab-panel', 'data-opanel');
  wireTabGroup('.tab-btn[data-sdk]', 'data-sdk', null, null, (key) => {
    activeSdkTab = key;
    renderSdk();
  });
  // sdk tabs don't have a matching panel group (single output area), override:
  $$('.tab-btn[data-sdk]').forEach((btn) => {
    btn.addEventListener('click', () => {
      $$('.tab-btn[data-sdk]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
    });
  });

// Natural language parser
  function inferResourceName(text) {
    const match = text.match(/for\s+(?:an?|the)\s+([a-zA-Z\s]+?)(?:\.|,|\n|$)/i);
    if (match) {
      const words = match[1].trim().split(/\s+/).slice(-2);
      return words.join('_').toLowerCase().replace(/[^a-z0-9_]/g, '') || 'items';
    }
    return 'items';
  }

  function inferFieldType(fieldName) {
    const f = fieldName.toLowerCase();
    if (f === 'id' || f.endsWith('id')) return 'uuid';
    if (f.includes('email')) return 'email';
    if (f.includes('price') || f.includes('cost') || f.includes('amount') || f.includes('salary')) return 'price';
    if (f.includes('phone') || f.includes('mobile')) return 'phone';
    if (f.includes('url') || f.includes('link') || f.includes('website')) return 'url';
    if (f.includes('category') || f.includes('genre') || f.includes('type') || f.includes('tag')) return 'category';
    if (f.includes('date') && !f.includes('updated') && !f.includes('created')) return 'date';
    if (f.includes('timestamp') || f.includes('createdat') || f.includes('updatedat') || f.includes('year')) return 'timestamp';
    if (f.startsWith('is') || f.startsWith('has') || f.includes('active') || f.includes('premium') || f.includes('available') || f.includes('verified')) return 'boolean';
    if (f.includes('rating') || f.includes('age') || f.includes('stock') || f.includes('quantity') || f.includes('count') || f.includes('number') || f.includes('score')) return 'number';
    if (f.includes('tags') || f.includes('items') || f.includes('list')) return 'array';
    if (f.includes('address') || f.includes('meta') || f.includes('details')) return 'object';
    if (f.includes('name') || f.includes('title') || f.includes('author') || f.includes('description')) return 'text';
    return 'text';
  }

  function parseNaturalLanguage() {
    const text = el.nlInput.value.trim();
    if (!text) {
      showToast('Describe your API first', 'error');
      return;
    }

    const resource = inferResourceName(text);

    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const fieldCandidates = [];

    lines.forEach((line) => {
      // strip bullets / dashes / numbering
      const cleaned = line.replace(/^[-*•\d.)\s]+/, '').trim();
      if (!cleaned) return;
      // Ignore descriptive sentences
      if (/^(create|each|the|an? |generate|build)/i.test(cleaned) && cleaned.split(' ').length > 3) return;
      // split comma separated fields on one line too
      cleaned.split(',').forEach((part) => {
        const word = part.trim().replace(/[.:;]+$/, '');
        if (word && /^[a-zA-Z][a-zA-Z0-9_\s]*$/.test(word) && word.split(' ').length <= 3) {
          fieldCandidates.push(word.replace(/\s+/g, ''));
        }
      });
    });

    let fields = [...new Set(fieldCandidates)];
    if (fields.length === 0) {
      showToast('Could not detect fields — try listing them one per line', 'error');
      return;
    }
    if (fields.length > 14) fields = fields.slice(0, 14);

    state.schema = fields.map((name) => ({
      name,
      type: inferFieldType(name),
      required: name.toLowerCase() === 'id' || fields.indexOf(name) < 2,
      example: ''
    }));

    state.resourceName = resource;
    el.resourceNameInput.value = resource;

    renderSchemaTable();
    regenerateEndpoints();
    showToast(`Schema generated: ${fields.length} fields detected`, 'success');
  }

  // OpenAPI Import

  function mapOpenApiType(prop) {
    if (!prop) return 'text';
    const format = (prop.format || '').toLowerCase();
    const type = (prop.type || '').toLowerCase();
    if (format === 'uuid') return 'uuid';
    if (format === 'email') return 'email';
    if (format === 'date') return 'date';
    if (format === 'date-time') return 'timestamp';
    if (format === 'uri' || format === 'url') return 'url';
    if (type === 'integer' || type === 'number') return 'number';
    if (type === 'boolean') return 'boolean';
    if (type === 'array') return 'array';
    if (type === 'object') return 'object';
    return 'text';
  }

  function parseOpenApi() {
    const raw = el.openapiInput.value.trim();
    if (!raw) {
      showToast('Paste an OpenAPI JSON spec first', 'error');
      return;
    }
    let spec;
    try {
      spec = JSON.parse(raw);
    } catch (e) {
      showToast('Invalid JSON — check your OpenAPI spec syntax', 'error');
      return;
    }

    const schemas = (spec.components && spec.components.schemas) || spec.definitions || {};
    const schemaNames = Object.keys(schemas);

    if (schemaNames.length === 0) {
      showToast('No schemas found under components.schemas', 'error');
      return;
    }

    const firstName = schemaNames[0];
    const firstSchema = schemas[firstName];
    const props = firstSchema.properties || {};
    const required = firstSchema.required || [];

    const fields = Object.keys(props).map((name) => ({
      name,
      type: mapOpenApiType(props[name]),
      required: required.includes(name),
      example: props[name].example !== undefined ? String(props[name].example) : ''
    }));

    if (fields.length === 0) {
      showToast('Schema has no properties to import', 'error');
      return;
    }

    state.schema = fields;
    state.resourceName = firstName.toLowerCase();
    el.resourceNameInput.value = state.resourceName;

    renderSchemaTable();
    regenerateEndpoints();

    const pathCount = spec.paths ? Object.keys(spec.paths).length : 0;
    showToast(`Imported "${firstName}" — ${fields.length} fields, ${pathCount} paths detected`, 'success');
  }

// Postman import
  function flattenPostmanItems(items, out) {
    (items || []).forEach((item) => {
      if (item.item) {
        flattenPostmanItems(item.item, out);
      } else if (item.request) {
        const method = (item.request.method || 'GET').toUpperCase();
        let url = item.request.url;
        if (url && typeof url === 'object') url = url.raw || (url.path || []).join('/');
        out.push({ name: item.name || 'Untitled Request', method, url: url || '' });
      }
    });
  }

  function parsePostman() {
    const raw = el.postmanInput.value.trim();
    if (!raw) {
      showToast('Paste a Postman collection first', 'error');
      return;
    }
    let collection;
    try {
      collection = JSON.parse(raw);
    } catch (e) {
      showToast('Invalid JSON — check your Postman collection syntax', 'error');
      return;
    }

    const requests = [];
    flattenPostmanItems(collection.item, requests);

    if (requests.length === 0) {
      showToast('No requests found in this collection', 'error');
      return;
    }

    state.postmanRequests = requests;
    el.postmanPreview.hidden = false;
    el.postmanList.innerHTML = requests.map((r) => `
      <li><span class="method-badge method-badge--${r.method.toLowerCase()}">${r.method}</span> ${escapeHtml(r.name)} <span style="color:var(--text-faint)">${escapeHtml(r.url)}</span></li>
    `).join('');

    // infer a resource name from the first request URL
    const firstUrl = requests[0].url || '';
    const segments = firstUrl.split('/').filter((s) => s && !s.includes('{') && !s.includes(':'));
    const guess = segments[segments.length - 1] || 'items';
    state.resourceName = guess.toLowerCase();
    el.resourceNameInput.value = state.resourceName;

    if (state.schema.length === 0) {
      state.schema = DEFAULT_SCHEMA.map((f) => ({ ...f }));
      renderSchemaTable();
    }

    regenerateEndpoints();
    showToast(`Imported ${requests.length} requests from collection`, 'success');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

// Schema builder
  const FIELD_TYPES = ['text', 'number', 'boolean', 'email', 'uuid', 'date', 'timestamp', 'array', 'object', 'url', 'phone', 'category', 'price'];

  function renderSchemaTable() {
    el.schemaTableBody.innerHTML = '';
    state.schema.forEach((field, index) => {
      const rowId = 'field-' + (fieldIdCounter++);
      const tr = document.createElement('tr');
      tr.dataset.index = index;

      const typeOptions = FIELD_TYPES.map((t) => `<option value="${t}" ${t === field.type ? 'selected' : ''}>${t}</option>`).join('');

      tr.innerHTML = `
        <td><input type="text" class="field-name-input" value="${escapeHtml(field.name)}" spellcheck="false"></td>
        <td><select class="field-type-input">${typeOptions}</select></td>
        <td class="field-required-cell"><input type="checkbox" class="field-required-input" ${field.required ? 'checked' : ''}></td>
        <td><input type="text" class="field-example-input" placeholder="auto" value="${escapeHtml(field.example || '')}" spellcheck="false"></td>
        <td><button class="btn-delete-field" title="Delete field">&times;</button></td>
      `;
      el.schemaTableBody.appendChild(tr);

      tr.querySelector('.field-name-input').addEventListener('input', (e) => {
        state.schema[index].name = e.target.value;
        updateStats();
      });
      tr.querySelector('.field-type-input').addEventListener('change', (e) => {
        state.schema[index].type = e.target.value;
      });
      tr.querySelector('.field-required-input').addEventListener('change', (e) => {
        state.schema[index].required = e.target.checked;
      });
      tr.querySelector('.field-example-input').addEventListener('input', (e) => {
        state.schema[index].example = e.target.value;
      });
      tr.querySelector('.btn-delete-field').addEventListener('click', () => {
        state.schema.splice(index, 1);
        renderSchemaTable();
        updateStats();
      });
    });

    updateStats();
  }

  function addField() {
    state.schema.push({ name: `field${state.schema.length + 1}`, type: 'text', required: false, example: '' });
    renderSchemaTable();
  }

// Mock data generation
  function generateValueForField(field) {
    if (field.example) return field.example;
    const name = field.name.toLowerCase();

    switch (field.type) {
      case 'uuid':
        return uuid();
      case 'number':
        if (name.includes('rating')) return rand(1, 5);
        if (name.includes('age')) return rand(13, 80);
        if (name.includes('stock') || name.includes('quantity')) return rand(0, 500);
        return rand(1, 1000);
      case 'boolean':
        return Math.random() > 0.5;
      case 'email':
        return `${pick(FIRST_NAMES).toLowerCase()}.${pick(LAST_NAMES).toLowerCase()}@${pick(DOMAINS)}`;
      case 'date':
        return randomDate();
      case 'timestamp':
        if (name.includes('year')) return String(rand(2019, 2026));
        return randomTimestamp();
      case 'array':
        return Array.from({ length: rand(1, 3) }, () => pick(WORDS));
      case 'object':
        if (name.includes('address')) {
          return { street: `${rand(10, 999)} ${pick(STREETS)}`, city: pick(CITIES), country: pick(COUNTRIES) };
        }
        return { note: pick(WORDS), verified: Math.random() > 0.5 };
      case 'url':
        return `https://${pick(WORDS)}.dev/${name}`;
      case 'phone':
        return `+1-${rand(200, 999)}-${rand(200, 999)}-${rand(1000, 9999)}`;
      case 'category':
        if (name.includes('genre')) return pick(['Fiction', 'Sci-Fi', 'Mystery', 'Romance', 'Non-Fiction', 'Fantasy']);
        return pick(CATEGORIES);
      case 'price':
        return Number((Math.random() * 480 + 5).toFixed(2));
      case 'text':
      default:
        if (name.includes('title') || name.includes('product')) return `${pick(PRODUCT_ADJ)} ${pick(PRODUCT_NOUN)}`;
        if (name.includes('name') && !name.includes('username')) return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
        if (name.includes('username')) return `${pick(FIRST_NAMES).toLowerCase()}${rand(10, 99)}`;
        if (name.includes('author')) return `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
        if (name.includes('city')) return pick(CITIES);
        if (name.includes('country')) return pick(COUNTRIES);
        if (name.includes('description') || name.includes('bio')) {
          return `A ${pick(PRODUCT_ADJ).toLowerCase()} solution built around ${pick(WORDS)} and ${pick(WORDS)}.`;
        }
        return `${pick(WORDS)}-${pick(WORDS)}`;
    }
  }

  function generateMockObject(withId) {
    const obj = {};
    state.schema.forEach((field) => {
      if (!field.name) return;
      obj[field.name] = generateValueForField(field);
    });
    return obj;
  }

  function generateMockData() {
    if (state.schema.length === 0) {
      showToast('Add at least one field to the schema first', 'error');
      return;
    }
    const count = Math.min(100, Math.max(1, parseInt(el.mockCount.value, 10) || 10));
    state.mockData = Array.from({ length: count }, () => generateMockObject());
    renderJsonViewer(state.mockData);
    runValidation();
    updateStats();
    showToast(`Generated ${count} mock objects`, 'success');
  }

  // JSON Syntax Highlighting + Viewer
  function syntaxHighlight(json) {
    const str = JSON.stringify(json, null, 2);
    const escaped = escapeHtml(str);
    return escaped.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|null|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          cls = /:$/.test(match) ? 'json-key' : 'json-string';
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  }

  function renderJsonViewer(data) {
    if (!data || data.length === 0) {
      el.jsonViewer.innerHTML = '<code class="json-empty">// Generate mock data to see output here</code>';
      return;
    }
    el.jsonViewer.innerHTML = `<code>${syntaxHighlight(data)}</code>`;
  }

  function copyJson() {
    if (state.mockData.length === 0) {
      showToast('Nothing to copy yet', 'error');
      return;
    }
    navigator.clipboard.writeText(JSON.stringify(state.mockData, null, 2))
      .then(() => showToast('JSON copied to clipboard', 'success'))
      .catch(() => showToast('Copy failed — try manually selecting the text', 'error'));
  }

  function downloadJson() {
    if (state.mockData.length === 0) {
      showToast('Nothing to download yet', 'error');
      return;
    }
    const blob = new Blob([JSON.stringify(state.mockData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.resourceName || 'mock-data'}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    showToast('Downloaded JSON file', 'success');
  }

   // Endpoints
  function regenerateEndpoints() {
    const resource = (state.resourceName || 'items').replace(/\s+/g, '_').toLowerCase();
    state.resourceName = resource;
    state.endpoints = [
      { method: 'GET', path: `/api/${resource}` },
      { method: 'GET', path: `/api/${resource}/:id` },
      { method: 'POST', path: `/api/${resource}` },
      { method: 'PUT', path: `/api/${resource}/:id` },
      { method: 'DELETE', path: `/api/${resource}/:id` }
    ];
    renderEndpoints();
    el.testerEndpoint.value = `/api/${resource}`;
    updateStats();
  }

  function renderEndpoints() {
    if (state.endpoints.length === 0) {
      el.endpointsEmpty.hidden = false;
      el.endpointsList.innerHTML = '';
      return;
    }
    el.endpointsEmpty.hidden = true;
    el.endpointsList.innerHTML = state.endpoints.map((ep) => `
      <li class="endpoint-item">
        <span class="method-badge method-badge--${ep.method.toLowerCase()}">${ep.method}</span>
        <span class="endpoint-url">${ep.path}</span>
        <span class="endpoint-full">https://mockapi.local${ep.path}</span>
      </li>
    `).join('');
  }

  // Validation
  function runValidation() {
    const requiredFields = state.schema.filter((f) => f.required).map((f) => f.name);
    const missing = new Set();

    state.mockData.forEach((obj) => {
      requiredFields.forEach((name) => {
        if (obj[name] === undefined || obj[name] === null || obj[name] === '') {
          missing.add(name);
        }
      });
    });

    const valid = missing.size === 0;
    state.validation = { valid, missing: [...missing] };

    el.validationBanner.hidden = false;
    if (valid) {
      el.validationBanner.className = 'validation-banner validation-banner--success';
      el.validationBanner.textContent = '✓ Schema Valid — all required fields present across generated objects.';
    } else {
      el.validationBanner.className = 'validation-banner validation-banner--error';
      el.validationBanner.textContent = `✗ Schema Validation Failed — missing required propert${missing.size > 1 ? 'ies' : 'y'}: ${[...missing].join(', ')}`;
    }
    updateStats();
    return valid;
  }

  // API Tester
  function simulateResponse(method, path) {
    const isCollection = !/\/:?id$|\/\d+$|\/[a-f0-9-]{8,}$/i.test(path) && !path.includes('%id%');
    // determine if path targets a single item (ends in something other than the bare resource)
    const resourceBase = `/api/${state.resourceName}`;
    const targetsItem = path.replace(/\/$/, '') !== resourceBase;

    if (state.mockData.length === 0) {
      return { status: 404, body: { error: 'No mock data generated yet. Click "Generate Mock Data" first.' } };
    }

    switch (method) {
      case 'GET':
        if (targetsItem) {
          return { status: 200, body: state.mockData[0] };
        }
        return { status: 200, body: state.mockData };
      case 'POST': {
        const created = generateMockObject();
        return { status: 201, body: created };
      }
      case 'PUT': {
        const updated = { ...state.mockData[0], ...generateMockObject() };
        return { status: 200, body: updated };
      }
      case 'DELETE':
        return { status: 200, body: { success: true, message: 'Resource deleted' } };
      default:
        return { status: 405, body: { error: 'Method not allowed' } };
    }
  }

  function sendTestRequest() {
    const method = el.testerMethod.value;
    const path = el.testerEndpoint.value.trim() || `/api/${state.resourceName}`;
    const btn = $('#btnSend');

    withLoading(btn, () => {
      const latency = rand(18, 240);
      const { status, body } = simulateResponse(method, path);
      const json = JSON.stringify(body);
      const sizeBytes = new Blob([json]).size;

      el.testerResponseWrap.hidden = false;
      el.testerStatusBadge.textContent = status;
      el.testerStatusBadge.className = `status-badge${status >= 400 ? ' status-badge--error' : ''}`;
      el.testerLatency.textContent = `${latency} ms`;
      el.testerSize.textContent = `${sizeBytes} B`;
      el.testerResponse.innerHTML = `<code>${syntaxHighlight(body)}</code>`;

      logTelemetry(method, path, status, latency, sizeBytes);
    }, rand(300, 700));
  }

// Telemetry
  function logTelemetry(method, path, status, latency, size) {
    const schemaValid = state.validation ? state.validation.valid : true;
    const entry = {
      method, path, status, latency, size,
      schemaValid,
      time: new Date().toLocaleTimeString()
    };
    state.requests.unshift(entry);
    if (state.requests.length > 50) state.requests.pop();
    renderTelemetry();
    updateStats();
  }

  function renderTelemetry() {
    if (state.requests.length === 0) {
      el.telemetryEmpty.hidden = false;
      return;
    }
    el.telemetryEmpty.hidden = true;

    el.telemetryList.innerHTML = state.requests.map((r) => `
      <div class="log-entry">
        <span class="log-method log-method--${r.method.toLowerCase()}">${r.method}</span>
        <span class="log-endpoint">${escapeHtml(r.path)}</span>
        <span class="${r.status >= 400 ? 'log-status--err' : 'log-status--ok'}">${r.status} ${r.status >= 400 ? 'ERR' : 'OK'}</span>
        <span>${r.latency} ms</span>
        <span>${r.size} B</span>
        <span class="${r.schemaValid ? 'log-schema--valid' : 'log-schema--invalid'}">${r.schemaValid ? 'Valid' : 'Invalid'}</span>
        <span class="log-time">${r.time}</span>
      </div>
    `).join('');
  }