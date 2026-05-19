function toggleNav(btn) {
    btn.classList.toggle('open');
    document.querySelector('.nav-links').classList.toggle('open');
  }

  function closeNav() {
    document.querySelector('.nav-toggle').classList.remove('open');
    document.querySelector('.nav-links').classList.remove('open');
  }

  function parseCSV(text) {
    const rows = [];
    const lines = text.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const fields = [];
      let field = '', inQ = false;
      for (let j = 0; j < line.length; j++) {
        const c = line[j];
        if (c === '"') { inQ = !inQ; }
        else if (c === ',' && !inQ) { fields.push(field); field = ''; }
        else { field += c; }
      }
      fields.push(field);
      rows.push(fields);
    }
    return rows;
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
