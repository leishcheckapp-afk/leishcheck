

# Plano: Correcoes de Navegacao, Step Indicator, Redesign Premium do PDF e Telas, Gap Analysis do PRD

---

## 1. Remover Step Indicator 1-2-3-4

O fluxo real do app e: Consentimento → Dados → Questionario (10 perguntas uma a uma) → Imagem → Resultado. O step indicator de 4 passos nao faz sentido e confunde o usuario.

**Acao:**
- **Consent.tsx** (linhas 49-55): Remover o bloco `{[1, 2, 3, 4].map(...)}`
- **UserDataPage.tsx** (linhas 34-41): Remover o bloco `{[1, 2, 3, 4].map(...)}`

---

## 2. Corrigir Botoes de Voltar

O problema: o PageHeader em UserDataPage nao tem `backTo` definido, entao usa `navigate(-1)` que pode ir para qualquer lugar.

**Correcoes em cada pagina:**

| Pagina | backTo atual | backTo correto |
|--------|-------------|----------------|
| UserDataPage.tsx | nenhum (usa navigate(-1)) | `/consentimento` |
| Questionnaire.tsx | custom handleBack: q>0 volta pergunta, q===0 vai `/dados` | OK - ja esta correto |
| ImageUpload.tsx | nenhum (usa navigate(-1)) | Precisa voltar ao questionario - adicionar `backTo="/questionario"` |
| Education.tsx | `backTo="/"` | OK |
| History.tsx | `backTo="/"` | OK |
| HistoryDetail.tsx | `backTo="/historico"` | OK |
| Consent.tsx | `backTo="/"` | OK |

**Acoes:**
- **UserDataPage.tsx**: Adicionar `backTo="/consentimento"` no PageHeader
- **ImageUpload.tsx**: Adicionar `backTo="/questionario"` no PageHeader. Tambem precisamos garantir que ao voltar do ImageUpload, o questionario mostre a ultima pergunta (a 10a). Para isso, antes de navegar para `/questionario`, chamar `goToQuestion(questions.length - 1)` no store

---

## 3. Redesign Premium do PDF

O PDF atual esta basico — header com banda de cor solida, texto simples, sem hierarquia visual. Vou redesenhar como um relatorio medico premium.

**Novo design do PDF (`src/lib/generatePDF.ts`):**

- **Header**: Gradiente suave com duas tonalidades da cor do risco (nao cor solida chapada). Logo "LEISHCHECK" com subtitulo "Relatorio de Triagem Clinica" em fonte maior. Data formatada elegantemente
- **Badge de resultado**: Card com bordas arredondadas maiores, sombra simulada com retangulos sobrepostos, icone circular com porcentagem grande dentro, titulo do risco e descricao com melhor tipografia
- **Dados do paciente**: Layout em grid com icones simulados (bullets elegantes), separadores finos, tipografia refinada
- **Respostas do questionario**: Tabela com header estilizado, colunas bem definidas, badges Sim/Nao com cores mais sofisticadas, zebra striping mais sutil, numeracao com circulos
- **Disclaimer**: Box com borda dupla, icone de alerta melhor posicionado
- **Footer**: Linha fina elegante com gradiente, versao do app, data
- **Tipografia geral**: Tamanhos maiores, mais espacamento, melhor hierarquia visual

---

## 4. Redesign Visual de Todas as Telas do App

Aplicar um nivel senior de polish em todas as telas. O design atual ja e bom mas pode ser elevado:

### Home.tsx
- Adicionar animacao de entrada mais sofisticada no logo (scale + opacity com spring)
- Melhorar espacamento entre elementos
- Adicionar sutil gradiente radial de fundo mais elaborado
- Versao do app com estilo mais discreto

### Consent.tsx
- Melhorar o card de consentimento com sombra mais refinada
- Adicionar icone decorativo no topo do termo
- Checkbox area com melhor feedback visual
- Botao de aceitar com animacao de pulse sutil quando habilitado

### UserDataPage.tsx
- Campos de input com focus states mais elegantes (ring colorido)
- Labels com icones melhor alinhados
- Card com divisores sutis entre campos
- Animacao de entrada dos campos em stagger

### Questionnaire.tsx
- Card da pergunta com sombra mais dramatica e borda gradiente
- Botoes Sim/Nao com feedback haptico visual mais forte
- Barra de progresso com gradiente animado
- Numero da pergunta com badge circular estilizado

### ImageUpload.tsx
- Area de drop zone com borda animada (dashed pulsante)
- Preview da imagem com overlay gradiente sutil
- Botoes de acao com melhor hierarquia visual

### Result.tsx
- Circulo de risco com glow mais intenso e animado
- Cards de orientacao com bordas coloridas laterais
- Botoes de acao com icones mais proeminentes
- Animacoes de entrada mais dramaticas em stagger

### Education.tsx
- Cards das fases com numeracao mais estilizada (circulos com gradiente)
- Separadores visuais entre secoes
- Card de prevencao com destaque visual maior

### History.tsx / HistoryDetail.tsx
- Cards de historico com hover effect mais sofisticado
- Badge de risco com glow sutil
- Lista de respostas com layout mais refinado

---

## 5. Gap Analysis — PRD vs Implementacao Atual

### Implementado e funcional:
- Fluxo completo: Home → Consent → Dados → Questionario → Imagem → Resultado
- Questionario com 10 perguntas, pesos corretos, calculo de risco
- PWA com Workbox, offline-first
- IndexedDB com Dexie (historico de sessoes)
- Dark Mode com toggle e persistencia
- i18n com pt-BR, en-US, es-419
- VLibras integrado
- Modo audio com Web Speech API
- Geracao de PDF
- Consentimento LGPD com expiracao de 90 dias
- prefers-reduced-motion respeitado
- Acessibilidade (aria-labels, alto contraste, areas de toque grandes)

### Gaps identificados no PRD (itens faltantes):

| Item | PRD Secao | Status | Prioridade |
|------|-----------|--------|------------|
| Imagens educativas reais (mosquito-palha, fases de lesao) | 11.1, 11.2 | Faltam imagens reais - apenas texto | Media |
| Modelo TensorFlow.js para analise de imagem | 4.5, 10.3 | Nao implementado - apenas upload | Baixa (v2) |
| Prompt de instalacao PWA customizado (A2HS) | 6.3 | Nao implementado | Media |
| Versao do app no rodape da Home | 4.2 | Implementado (badge v1.0) | OK |
| Fala rate 0.8 (devagar) | 4.8 | Nao configurado explicitamente | Baixa |
| Audio MP3 pre-gravados para offline | 4.8 | Usa apenas Web Speech API | Media |
| Conteudo da secao educativa com carrossel de imagens | 4.7 | Apenas texto, sem carrossel/galeria | Media |
| Compartilhar resultado (nao no PRD v1, mas util) | - | Nao implementado | Sugestao |

Nota: O PRD marca como "Fora do Escopo v1.0" itens como login, dashboard admin, push notifications, telemedicina — esses estao corretamente ausentes.

---

## Arquivos a Editar

| Arquivo | Mudancas |
|---------|----------|
| `src/pages/Consent.tsx` | Remover step indicator |
| `src/pages/UserDataPage.tsx` | Remover step indicator, fix backTo |
| `src/pages/ImageUpload.tsx` | Fix backTo, polish visual |
| `src/lib/generatePDF.ts` | Redesign completo do PDF premium |
| `src/pages/Home.tsx` | Polish visual senior |
| `src/pages/Questionnaire.tsx` | Polish visual, barra de progresso melhorada |
| `src/pages/Result.tsx` | Polish visual, animacoes mais refinadas |
| `src/pages/Education.tsx` | Polish visual, cards mais elegantes |
| `src/pages/History.tsx` | Polish visual |
| `src/pages/HistoryDetail.tsx` | Polish visual |

## Detalhes Tecnicos

**PDF redesign** — O `generatePDF.ts` sera reescrito com:
- Header com gradiente simulado via multiplos retangulos sobrepostos com opacidades diferentes
- Circulo de risco desenhado com `doc.circle()` e texto central
- Tabela de respostas com header colorido, linhas de grid finas, badges pill-shaped
- Tipografia com hierarquia clara: 24px titulo, 14px subtitulos, 10px corpo
- Espacamento generoso (line-height visual de ~8mm entre itens)
- Melhor uso de cores: tons pasteis para backgrounds, cores saturadas para acentos

**Telas** — Mudancas sao primariamente CSS/Tailwind (classes, sombras, espacamentos, animacoes Framer Motion). Nenhuma mudanca de logica ou estado.

**Build error** — O `tsconfig.json` ja tem `skipLibCheck: true`. O erro do dexie.d.ts e do ambiente do Lovable e nao afeta o build real.

