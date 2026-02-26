import { useEffect } from 'react';

export function VLibrasWidget() {
  useEffect(() => {
    // Check if already loaded
    if (document.getElementById('vlibras-script')) return;
    // Skip loading when offline — widget is non-essential
    if (!navigator.onLine) return;

    // Create the widget container first
    const widgetDiv = document.createElement('div');
    widgetDiv.setAttribute('vw', '');
    widgetDiv.classList.add('enabled');
    const accessButton = document.createElement('div');
    accessButton.setAttribute('vw-access-button', '');
    accessButton.classList.add('active');
    widgetDiv.appendChild(accessButton);
    const pluginWrapper = document.createElement('div');
    pluginWrapper.setAttribute('vw-plugin-wrapper', '');
    const topWrapper = document.createElement('div');
    topWrapper.className = 'vw-plugin-top-wrapper';
    pluginWrapper.appendChild(topWrapper);
    widgetDiv.appendChild(pluginWrapper);
    document.body.appendChild(widgetDiv);

    const script = document.createElement('script');
    script.id = 'vlibras-script';
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      try {
        new (window as any).VLibras.Widget('https://vlibras.gov.br/app');
      } catch (e) {
        console.warn('VLibras failed to initialize:', e);
      }
    };
    document.head.appendChild(script);

    return () => {};
  }, []);

  return null;
}
