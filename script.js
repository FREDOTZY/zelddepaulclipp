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

function startGenerate(sourceName = 'video') {
  if (!progressCard || !progressBar || !percent || !progressText) {
    alert('Elemen progress belum lengkap di index.html');
    return;
  }

  progressCard.classList.remove('hidden');

  let value = 0;
  progressBar.style.width = '0%';
  percent.textContent = '0%';
  progressText.textContent = `Menganalisis ${sourceName}...`;

  const steps = [
    'Mencari hook paling kuat...',
    'Membuat caption otomatis...',
    'Mengatur rasio 9:16...',
    'Menyiapkan hasil export...'
  ];

  const timer = setInterval(() => {
    value += Math.floor(Math.random() * 13) + 6;

    if (value >= 100) {
      value = 100;
    }

    progressBar.style.width = `${value}%`;
    percent.textContent = `${value}%`;
    progressText.textContent = steps[Math.min(Math.floor(value / 28), steps.length - 1)];

    if (value === 100) {
      clearInterval(timer);
      progressText.textContent = 'Selesai! Clip baru berhasil dibuat.';
      addClip(sourceName);
    }
  }, 420);
}

function addClip(sourceName) {
  if (!clipList) {
    return;
  }

  const article = document.createElement('article');
  article.className = 'clip-card';
  article.innerHTML = `
    <div class="thumb">▶</div>
    <div>
      <h3>New Viral Clip</h3>
      <p>${sourceName} • Viral score 96</p>
    </div>
    <button type="button">Export</button>
  `;

  clipList.prepend(article);
}

if (chooseFile && fileInput) {
  chooseFile.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];

    if (file) {
      startGenerate(file.name);
    }
  });
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

    startGenerate('link video');

    try {
      const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          videoLink: link
        })
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        alert(data.error || 'Backend AI gagal diproses');
        return;
      }

      if (data.success) {
        alert(data.result);
      } else {
        alert(data.error || 'AI tidak memberi hasil');
      }
    } catch (error) {
      console.log(error);
      alert('Backend AI gagal terhubung. Pastikan sudah deploy di Netlify dan function generate.js sudah benar.');
    }
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

    if (file) {
      startGenerate(file.name);
    }
  });
}
