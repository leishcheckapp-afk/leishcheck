

# Offline Completo + Verificacao do Fluxo

## Resultado da Verificacao de Fluxo

Testei a triagem completa no mobile (390x844): Home → Consent → UserData → Questionnaire (10 perguntas) → Image Upload → Result. Tudo funciona corretamente. O `pb-24` na Result page garante que o disclaimer final fica visivel acima dos botoes flutuantes. O step indicator no Consent esta correto (1/4).

## Problema de Build: Dexie TypeScript

O erro `TS1540` em `dexie.d.ts` vem do type checker do Lovable sendo mais estrito que o `skipLibCheck: true` configurado no `tsconfig.app.json`. A solucao e adicionar `"skipLibCheck": true` tambem no `tsconfig.json` raiz para garantir cobertura total.

## Estrategia Offline Completa

O app ja tem a base PWA (`vite-plugin-pwa` com Workbox), mas tem 3 pontos que quebram offline:

### 1. Google Fonts (Poppins) — Dependencia externa

**Problema:** A linha 1 do `index.css` faz `@import url('https://fonts.googleapis.com/css2?family=Poppins:...')`. Offline, essa requisicao falha e o app fica sem a fonte principal.

**Solucao:** O Workbox ja tem runtime caching para `fonts.googleapis.com` e `fonts.gstatic.com` com estrategia `CacheFirst`. Isso significa que apos a primeira visita online, a fonte fica cacheada e funciona offline. Mas para garantia total, vou melhorar a configuracao adicionando a fonte ao `warmCache` do Workbox — assim ela e pre-cacheada automaticamente na instalacao do SW.

Alternativa mais robusta: manter o `@import` (para nao precisar hospedar arquivos woff2) mas garantir que o runtime caching cobre todas as variantes.

### 2. VLibras Widget — Script externo

**Problema:** O VLibras carrega `https://vlibras.gov.br/app/vlibras-plugin.js` dinamicamente. Offline, o script nao carrega e o widget nao aparece.

**Solucao:** Adicionar tratamento gracioso — o widget simplesmente nao aparece quando offline, sem erros. Ja funciona assim (o `onload` so executa se o script carregar), mas vou adicionar uma verificacao explicita `navigator.onLine` para evitar a tentativa de carregar o script quando offline, eliminando erros de rede no console.

### 3. Google Maps Link — Link externo

**Problema:** O botao "Encontrar UBS" abre `https://www.google.com/maps/search/UBS+perto+de+mim`. Offline, abre uma pagina em branco.

**Solucao:** Verificar `navigator.onLine` antes de abrir. Se offline, mostrar um toast informando que a funcao precisa de internet, com instrucoes para procurar UBS quando voltar a ficar online.

### 4. Melhorias no Workbox

- Adicionar `navigateFallbackDenylist: [/^\/~oauth/]` conforme recomendacao do knowledge file
- Adicionar `runtimeCaching` para a URL do VLibras com `NetworkOnly` (nao faz sentido cachear um script de 3rd party grande)
- Garantir que o `offlineFallback` funcione para todas as rotas SPA

### 5. Indicador de Status Offline

Adicionar um banner sutil no topo quando o usuario esta offline, informando que o app esta funcionando em modo offline. Usa `navigator.onLine` + eventos `online`/`offline`.

## Arquivos Editados

| Arquivo | Mudanca |
|---------|---------|
| `tsconfig.json` | Adicionar `skipLibCheck: true` |
| `vite.config.ts` | Adicionar `navigateFallbackDenylist`, melhorar caching |
| `src/components/VLibrasWidget.tsx` | Verificar `navigator.onLine` antes de carregar script |
| `src/pages/Result.tsx` | Verificar online antes de abrir Google Maps, toast offline |
| `src/components/OfflineBanner.tsx` | Novo componente — banner de status offline |
| `src/App.tsx` | Adicionar OfflineBanner |

## Detalhes Tecnicos

**OfflineBanner.tsx** — Componente que escuta `window.addEventListener('online'/'offline')` e mostra um banner fixo no topo com `"Voce esta offline — o app continua funcionando"` em amarelo sutil. Desaparece automaticamente quando volta online.

**Result.tsx** — O botao "Encontrar UBS" fara:
```
if (!navigator.onLine) {
  toast.warning('Sem conexao. Quando voltar online, busque "UBS perto de mim" no Google Maps.');
  return;
}
window.open(url, '_blank');
```

**VLibrasWidget.tsx** — Antes de criar o script:
```
if (!navigator.onLine) return; // Skip loading when offline
```

**vite.config.ts** — Workbox config atualizado:
```
workbox: {
  navigateFallbackDenylist: [/^\/~oauth/],
  maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
  runtimeCaching: [
    { Google Fonts — CacheFirst (ja existe) },
  ],
}
```

## Funcionalidades que ja funcionam offline

- Toda a triagem (questionario, calculo de risco, resultado)
- Historico (IndexedDB via Dexie — totalmente local)
- Geracao de PDF (jsPDF — sem dependencia de rede)
- Dark mode, audio (Web Speech API local), troca de idioma
- Todas as paginas (pre-cacheadas pelo Workbox)

