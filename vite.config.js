import { defineConfig } from 'vite';

export default defineConfig({
  transformIndexHtml(html) {
    // 1. Remueve de raíz el script defectuoso que rompe la cabecera
    let htmlCorregido = html.replace(/<script>[\s\S]*?<\/script>/, '');
    
    // 2. Inyecta el script del micrófono de forma segura al final de la página
    const scriptMicrofono = `
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          if (!SpeechRecognition) return;

          document.querySelectorAll('textarea').forEach((textarea) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'no-print';
            btn.innerHTML = '🎙️ Dictar por voz';
            btn.style.cssText = 'display:inline-flex; align-items:center; gap:4px; background:#1a5276; color:white; border:none; padding:5px 12px; border-radius:6px; font-weight:600; font-size:0.75rem; cursor:pointer; margin-top:5px; transition: background 0.2s; align-self: flex-start; width: max-content;';
            
            textarea.parentNode.insertBefore(btn, textarea.nextSibling);

            let recognition = null;
            let textoFijo = '';

            btn.addEventListener('click', () => {
              if (recognition) { recognition.stop(); return; }

              recognition = new SpeechRecognition();
              recognition.lang = 'es-ES';
              recognition.continuous = true;
              recognition.interimResults = true;
              textoFijo = textarea.value;

              recognition.onstart = () => {
                btn.style.background = '#c0392b';
                btn.innerHTML = '🛑 Escuchando...';
              };

              recognition.onresult = (e) => {
                let intermedio = '';
                for (let i = e.resultIndex; i < e.results.length; ++i) {
                  if (e.results[i].isFinal) textoFijo += e.results[i].transcript + ' ';
                  else intermedio += e.results[i].transcript;
                }
                textarea.value = textoFijo + intermedio;
                if (typeof sync === 'function') sync();
              };

              recognition.onend = () => {
                btn.style.background = '#1a5276';
                btn.innerHTML = '🎙️ Dictar por voz';
                recognition = null;
              };

              recognition.start();
            });
          });
        });
      </script>
    `;
    return htmlCorregido.replace('</body>', `${scriptMicrofono}</body>`);
  }
});
