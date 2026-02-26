import { useEffect } from 'react';

export function VLibrasWidget() {
  useEffect(() => {
    // Check if already loaded
    if (document.getElementById('vlibras-script')) return;

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

    return () => {
      // Don't remove on unmount since VLibras manages its own lifecycle
    };
  }, []);

  return <div vw="true" className="enabled"><div vw-access-button="true" className="active" /></div>;
}
