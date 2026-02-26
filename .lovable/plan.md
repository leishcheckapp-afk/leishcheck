

# Redesign Premium do PDF + Polish Visual de Todas as Telas

## Visao Geral

O PDF atual e basico demais: texto simples sem hierarquia visual, sem cores de fundo, sem badges, sem separadores elegantes. As telas do app ja tem um visual bom com glass-cards e gradients, mas podem ser elevadas com micro-interacoes e detalhes visuais que causam o efeito "UAU".

## 1. PDF Premium — Redesign Completo

O `generatePDF.ts` sera reescrito com um layout profissional de relatorio medico:

```text
┌─────────────────────────────────────────┐
│  ████████████████████████████████████████│  ← Header band verde (retangulo colorido)
│                                         │
│        LEISHCHECK                       │
│        Relatorio de Triagem             │
│        Data: 26/02/2026 14:30           │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│     ┌─────────────────────────────┐     │
│     │   ██ 45% — Risco Medio     │     │  ← Badge colorido com fundo
│     │   Orientacao resumida...    │     │
│     └─────────────────────────────┘     │
│                                         │
│  ▐ DADOS DO PACIENTE                    │  ← Barra lateral colorida + titulo bold
│  │ Idade: 32  |  Genero: Masculino      │
│  │ Local: Belem - PA                    │
│                                         │
│  ▐ RESPOSTAS DO QUESTIONARIO            │
│  │ 1. Mora em area rural?     [✓ Sim]   │  ← Linhas zebradas alternadas
│  │ 2. Viajou para locais...   [✗ Nao]   │
│  │ ...                                  │
│                                         │
│  ─────────────────────────────────────  │
│  ⚠ AVISO LEGAL                          │
│  Este relatorio nao constitui...        │
│                                         │
│  ████████████████████████████████████████│  ← Footer band
│        leishcheck.app                   │
└─────────────────────────────────────────┘
```

Tecnicas usadas (todas suportadas pelo jsPDF sem dependencias extras):
- **Retangulos coloridos** (`doc.setFillColor` + `doc.rect`) para header/footer bands
- **Retangulo de resultado** com fundo colorido (verde/amarelo/vermelho) com opacidade
- **Barra lateral** nos titulos de secao (retangulo fino colorido a esquerda)
- **Linhas zebradas** nas respostas do questionario (retangulos cinza alternados)
- **Tipografia hierarquica** — titulo 22pt, secoes 14pt bold, corpo 10pt
- **Rodape** com numero de pagina e URL do app
- **Margem lateral** elegante com linha vertical decorativa

## 2. Polish Visual das Telas — Detalhes "UAU"

### Home (`Home.tsx`)
- Adicionar um subtle shimmer/glow pulsante no logo (CSS keyframe `glow-pulse`)
- Badge de versao com borda gradiente sutil

### Consent (`Consent.tsx`)
- Step indicator (1/4) no topo como na UserDataPage — consistencia visual

### UserDataPage (`UserDataPage.tsx`)
- Step indicator ja existe, mas os steps futuros devem ter um estilo mais elegante (outline em vez de solid cinza)

### Questionnaire (`Questionnaire.tsx`)
- Card da pergunta com sombra mais pronunciada e borda gradiente sutil

### Result (`Result.tsx`)
- Adicionar um confetti/particles sutil no resultado de baixo risco
- Glow mais intenso no circulo SVG

### HistoryDetail (`HistoryDetail.tsx`)
- Sem mudancas — ja usa PageHeader elegante

### Education (`Education.tsx`)
- Sem mudancas significativas — ja tem bom visual

## 3. Detalhes Tecnicos

**Arquivo principal editado:**
- `src/lib/generatePDF.ts` — reescrita completa com layout premium

**Arquivos com polish sutil:**
- `src/index.css` — adicionar keyframe `glow-pulse` para o logo da Home
- `src/pages/Home.tsx` — classe `animate-glow-pulse` no logo
- `src/pages/Consent.tsx` — adicionar step indicator consistente com UserDataPage

**Nenhuma dependencia nova.** Tudo feito com jsPDF nativo (rect, setFillColor, setTextColor, line).

## 4. Cores do PDF por Nivel de Risco

| Nivel | Header Band | Badge BG | Badge Text |
|-------|-------------|----------|------------|
| low | RGB(46,125,50) | RGB(232,245,233) | RGB(27,94,32) |
| medium | RGB(245,166,35) | RGB(255,248,225) | RGB(230,81,0) |
| high | RGB(211,47,47) | RGB(255,235,238) | RGB(183,28,28) |

