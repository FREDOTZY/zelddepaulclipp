const clipForm = document.getElementById('clipForm');
const videoLink = document.getElementById('videoLink');
const chooseFile = document.getElementById('chooseFile');
const fileInput = document.getElementById('fileInput');
const uploadZone = document.getElementById('uploadZone');
const progressCard = document.getElementById('progressCard');
const progressBar = document.getElementById('progressBar');
const percent = document.getElementById('percent');
const progressText = document.getElementById('progressText');
const clipList = document.getElementById('clipList');
const aiResult = document.getElementById('aiResult');

function startProgress(sourceName = 'video') {
  if (!progressCard || !progressBar || !percent || !progressText) return null;

  progressCard.classList.remove('hidden');

  let value = 0;
  progressBar.style.width = '0%';
  percent.textContent = '0%';
  progressText.textContent = `Menganalisis ${sourceName}...`;

  const timer = setInterval(() => {
    value += 10;
    if (value >= 90) value = 90;

    progressBar.style.width = `${value}%`;
    percent.textContent = `${value}%`;

    if (value >= 90) clearInterval(timer);
  }, 300);

  return timer;
}

function finishProgress(message) {
  if (!progressBar || !percent || !progressText) return;

  progressBar.style.width = '100%';
  percent.textContent = '100%';
  progressText.textContent = message;
}

function showAIResult(text) {
  if (!aiResult) return;

  aiResult.innerHTML = String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replace(/\n/g, '<br>');
}

function addClip(sourceName) {
  if (!clipList) return;

  const article = document.createElement('article');
  article.className = 'clip-card';
  article.innerHTML = `
    <div class="thumb">▶</div>
    <div>
      <h3>Clip dari ${sourceName}</h3>
      <p>Status: video berhasil dipilih.</p>
    </div>
    <button type="button">Export</button>
  `;

  clipList.prepend(article);
}

if (clipForm && videoLink) {
  clipForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const link = videoLink.value.trim();

    if (!link) {
      videoLink.focus();
      videoLink.placeholder = 'Masukkan link video dulu';
      return;
    }

    const timer = startProgress('link video');

    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoLink: link })
      });

      const data = await response.json();

      if (timer) clearInterval(timer);

      if (!response.ok || !data.success) {
        finishProgress('Gagal diproses');
        showAIResult(data.error || 'Backend AI gagal memproses request.');
        return;
      }

      finishProgress('Selesai! Hasil AI berhasil dibuat.');
      showAIResult(data.result);
    } catch (error) {
      if (timer) clearInterval(timer);
      finishProgress('Koneksi backend gagal');
      showAIResult('Backend AI gagal terhubung. Pastikan deploy Netlify sudah benar dan API key sudah dimasukkan.');
    }
  });
}

if (chooseFile && fileInput) {
  chooseFile.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];

    if (!file) return;

    const timer = startProgress(file.name);

    setTimeout(() => {
      if (timer) clearInterval(timer);
      finishProgress('Video berhasil dipilih.');
      addClip(file.name);
    }, 2200);
  });
}

if (uploadZone) {
  uploadZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    uploadZone.classList.add('dragging');
  });

  uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragging');
  });

  uploadZone.addEventListener('drop', (event) => {
    event.preventDefault();
    uploadZone.classList.remove('dragging');

    const file = event.dataTransfer.files[0];

    if (!file) return;

    const timer = startProgress(file.name);

    setTimeout(() => {
      if (timer) clearInterval(timer);
      finishProgress('Video berhasil dipilih.');
      addClip(file.name);
    }, 2200);
  });
}

/* ===== Background Music Loop ===== */

const bgMusic = document.getElementById('bgMusic');

if (bgMusic) {
  bgMusic.volume = 0.22;

  const playMusic = async () => {
    try {
      await bgMusic.play();
    } catch (error) {
      console.log('Autoplay musik diblok browser. Musik akan aktif setelah layar diketuk.');
    }
  };

  playMusic();

  document.addEventListener('click', playMusic, {
    once: true
  });
}
