

# Plano: Correcoes de Conformidade PRD, Bug de Dark Mode, Imagens Educativas e Teste E2E

Analise completa do PRD v1.2 versus a implementacao atual, correcoes identificadas, e adicionais solicitados pelo usuario.

---

## 1. Bug: Campo "Cidade" com cor diferente no Dark Mode

O campo de Input usa `bg-background` como classe base. No dark mode, `--background` e `150 12% 7%` (escuro). Porem, o input text nao esta usando a variavel de cor correta — provavelmente esta herdando uma cor de texto errada ou o background do input nao contrasta adequadamente.

**Problema real:** O componente `Input` em `src/components/ui/input.tsx` usa `bg-background` que e correto, mas a imagem do usuario mostra que o campo "Cidade" esta com um fundo diferente dos outros campos (parece mais claro/destacado, provavelmente o estado de focus ou o autocomplete do browser).

**Correcao:**
- Em `src/components/ui/input.tsx`: Adicionar estilos para autocomplete do browser no dark mode (`autofill:shadow-[0_0_0_30px_hsl(var(--card))_inset]` e `autofill:text-fill-color`) para que campos preenchidos pelo autocomplete mantenham a cor correta
- Tambem adicionar `bg-card` em vez de `bg-background` para os inputs ficarem com o mesmo fundo do card que os contem

---

## 2. Botao "Iniciar Triagem" deve SEMPRE ir para Consentimento

**Problema:** Na `Home.tsx` (linhas 23-26), `handleStart` verifica se o consentimento e valido e pula direto para `/dados`. O PRD diz que o fluxo e sempre: Home → Consentimento → Dados → Questionario → Imagem → Resultado.

**Porem**, relendo o PRD secao 13 regra 19: "O termo de consentimento aceito e armazenado por 90 dias; apos esse periodo, e solicitado novamente." Isso implica que se o consentimento ainda e valido, pode pular. Mas o usuario pediu explicitamente que "Quando clicar em iniciar triagem deve ir pra pagina de privacidade (consentimento)".

**Correcao em `Home.tsx`:**
- Mudar `handleStart` para sempre navegar para `/consentimento`
- Na pagina de Consentimento, se o consentimento ja e valido, mostrar uma mensagem tipo "Voce ja aceitou os termos" com opcao de prosseguir direto ou reler

**Alternativa mais simples (recomendada):** Sempre ir para `/consentimento`. Se o consentimento ja esta valido, o Consent.tsx pode mostrar um estado simplificado com botao "Continuar" ja habilitado sem precisar re-scroll e re-aceitar.

---

## 3. Imagens Educativas Reais (PRD secoes 11.1, 11.2)

O PRD exige imagens reais do mosquito-palha e das 3 fases de lesao na secao educativa. Atualmente a pagina Education.tsx so tem texto.

**Abordagem:** Usar a IA de geracao de imagens (Lovable AI — `google/gemini-2.5-flash-image`) para gerar imagens educativas ilustrativas de alta qualidade via uma edge function. As imagens serao geradas uma unica vez e armazenadas no Storage do backend.

**Porem**, imagens geradas por IA de lesoes medicas podem ser imprecisas. Para um app de saude, e melhor usar ilustracoes didaticas do que fotos realistas falsas.

**Plano alternativo mais seguro:** Gerar ilustracoes educativas (estilo infografico medico, nao fotos realistas) usando a IA de imagem, com prompts claros como "medical educational illustration of sandfly mosquito, infographic style, clean background" e "medical educational diagram showing stages of cutaneous leishmaniasis lesion, illustration style". Isso evita imagens realistas falsas e respeita o carater educativo.

**Implementacao:**
- Criar edge function `generate-education-images` que gera 5 imagens (mosquito full, mosquito zoom, lesao fase 1-3) via `google/gemini-3-pro-image-preview`
- Salvar no Storage do backend em bucket `education-images`
- No `Education.tsx`, carregar as imagens do Storage com fallback para placeholder
- Adicionar um mecanismo de cache local para as imagens (service worker ja faz pre-cache)

**Arquivos:**
| Arquivo | Mudanca |
|---------|---------|
| `supabase/functions/generate-education-images/index.ts` | **Novo** — Gera imagens educativas via IA |
| `src/pages/Education.tsx` | Adicionar galeria de imagens com carrossel |
| `src/locales/*/translation.json` | Adicionar chaves para alt-text das imagens |

---

## 4. Teste E2E da Analise de IA

O usuario pediu para testar o fluxo completo com imagem + IA. Vou verificar se a edge function `analyze-lesion` esta deployada e funcionando, e corrigir qualquer problema.

**Acoes:**
- Verificar se a edge function `analyze-lesion` esta deployada
- Testar chamando-a diretamente
- Verificar que o fluxo ImageUpload → analyzeImage → calculateResult → Result funciona

---

## 5. Gap Analysis PRD Completo — Itens Pendentes

### Conformes (OK):
- Fluxo completo implementado
- 10 perguntas com pesos corretos (MAX_SCORE = 135)
- PWA com manifest, icons, service worker
- IndexedDB com Dexie (historico)
- Dark Mode com toggle e persistencia
- i18n com pt-BR, en-US, es-419
- VLibras integrado
- Modo audio com Web Speech API (rate 0.8 configurado)
- PDF gerado com design premium
- Consentimento LGPD com 90 dias
- prefers-reduced-motion respeitado
- Acessibilidade (aria-labels, areas de toque grandes)
- Analise de imagem com IA (Gemini via edge function)
- Prompt A2HS customizado
- Navegacao com botoes de voltar corretos

### Nao-conformes a corrigir neste plano:

| Item PRD | Status | Correcao |
|----------|--------|----------|
| Iniciar Triagem sempre vai para Consentimento | Pula se consentimento valido | Corrigir Home.tsx |
| Campo Cidade cor errada no dark mode | Bug visual | Corrigir Input e UserDataPage |
| Imagens educativas reais (mosquito, lesoes) | Apenas texto | Gerar via IA e adicionar |
| Consent.tsx: scroll obrigatorio antes do checkbox | Implementado | OK |
| Consent.tsx: icone de escudo no topo | Implementado (Shield) | OK |
| Questionario: todas perguntas devem ser respondidas (regra 20 PRD) | Permite avancar sem responder (handleAnswer so avanca se clica Sim/Nao) | OK - so avanca quando clica |
| Resultado: "NUNCA usar palavras diagnostico ou confirmado" (regra 3 PRD) | Verificar textos | OK - usa "triagem" e "risco" |
| Historico: botao "Iniciar Triagem" vai para `/consentimento` | OK (linha 38) | OK |
| Audio: rate 0.8 | Configurado (AudioToggle.tsx linha 28) | OK |

### Fora do escopo v1.0 (corretamente ausentes):
- Login/autenticacao
- Dashboard admin
- Push notifications
- Telemedicina
- TensorFlow.js local (usando Gemini cloud como alternativa superior)

---

## 6. Resumo de Todos os Arquivos a Editar

| Arquivo | Mudanca |
|---------|---------|
| `src/pages/Home.tsx` | `handleStart` sempre navega para `/consentimento` |
| `src/pages/Consent.tsx` | Se consentimento ja valido, mostrar estado simplificado com botao "Continuar" |
| `src/components/ui/input.tsx` | Fix autocomplete dark mode styling |
| `src/pages/Education.tsx` | Adicionar galeria de imagens educativas com imagens do Storage |
| `supabase/functions/generate-education-images/index.ts` | **Novo** — Gerar imagens educativas via IA |
| `src/locales/pt-BR/translation.json` | Chaves para alt-text imagens + estado consentimento valido |
| `src/locales/en-US/translation.json` | Idem |
| `src/locales/es-419/translation.json` | Idem |

## 7. Detalhes Tecnicos

### Input Dark Mode Fix
O `input.tsx` precisa de classes para lidar com o autocomplete do browser:
```
[&:-webkit-autofill]:bg-card [&:-webkit-autofill]:[-webkit-text-fill-color:hsl(var(--foreground))] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]
```

### Consent.tsx — Estado "ja aceito"
Se `checkConsentValid()` retorna true ao entrar na pagina:
- Mostrar card simplificado: "Voce ja aceitou os termos em [data]"
- Botao "Continuar" habilitado direto
- Link "Reler termos" que expande o texto completo
- Isso respeita a regra dos 90 dias do PRD sem forcar o usuario a reler toda vez

### Imagens Educativas
A edge function `generate-education-images` sera chamada uma unica vez (pelo dev ou automaticamente na primeira carga). As imagens ficam no Storage bucket `education-images` e sao carregadas no Education.tsx via URL publica.

Prompts para geracao:
1. "Medical educational illustration of a sandfly (Lutzomyia), small mosquito-like insect, clean infographic style, white background, labeled diagram showing key features like small size and hairy wings"
2. "Medical educational illustration showing 3 stages of cutaneous leishmaniasis skin lesion: Stage 1 small red papule, Stage 2 open ulcer with raised borders, Stage 3 large advanced lesion, infographic style, clean labeled diagram"

Se o Storage nao tiver as imagens, o Education.tsx mostra os textos existentes como fallback (graceful degradation).

### Deploy e Teste
- A edge function `analyze-lesion` ja deve estar deployada
- Testar o fluxo completo apos implementacao
- Verificar se o modelo `google/gemini-2.5-pro` responde corretamente com tool calling

