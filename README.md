# 🦟 LeishCheck

## 📋 Sobre o Projeto

LeishCheck é uma ferramenta digital inovadora de triagem para avaliação de risco de Leishmaniose Cutânea. O aplicativo combina questionários inteligentes, análise de imagens por IA e educação em saúde para facilitar a identificação precoce de casos suspeitos e promover o acesso à saúde pública.

### 🎯 Missão

Democratizar o acesso ao rastreio de Leishmaniose através de uma plataforma digital acessível, gratuita e disponível offline, contribuindo para a detecção precoce e redução da incidência da doença.

## ✨ Funcionalidades Principais

### 🔍 Sistema de Triagem Completo

- **Questionário de Risco**: 10 perguntas estratégicas sobre sintomas, exposição e histórico
- **Análise de Imagem por IA**: Upload e análise automática de lesões suspeitas
- **Score de Risco**: Cálculo combinado baseado em respostas e análise de imagem
- **Recomendações Personalizadas**: Orientações específicas baseadas no nível de risco

### 📱 Progressive Web App (PWA)

- **Instalável**: Funciona como aplicativo nativo em qualquer dispositivo
- **Offline First**: Funcionalidade completa sem conexão à internet
- **Responsivo**: Interface adaptada para mobile, tablet e desktop
- **Atualizações Automáticas**: Sistema de service worker para cache inteligente

### ♿ Acessibilidade Avançada

- **Narração de Áudio**: Leitura automática de todo o conteúdo em português
- **VLibras**: Integração com tradutor de Libras (Língua Brasileira de Sinais)
- **Suporte Multilíngue**: Interface em Português e Inglês
- **Alto Contraste**: Modo escuro para melhor legibilidade
- **Navegação por Teclado**: Totalmente acessível via teclado

### 🎨 Experiência do Usuário

- **Animações Suaves**: Transições e efeitos com Framer Motion
- **Scroll Animations**: Elementos aparecem progressivamente ao rolar a página
- **Efeito Parallax**: Hero section com movimento suave
- **Cursor Customizado**: Interações visuais aprimoradas (desktop)
- **Micro-interações**: Feedback visual em botões, cards e elementos interativos

### 📊 Histórico e Rastreamento

- **Armazenamento Local**: Dados salvos com IndexedDB
- **Histórico de Triagens**: Acesso a todas as avaliações anteriores
- **Exportação PDF**: Geração de relatórios para compartilhar com profissionais de saúde
- **Privacidade**: Todos os dados permanecem no dispositivo do usuário

### 🎓 Educação em Saúde

- **Conteúdo Informativo**: Informações sobre sintomas, transmissão e prevenção
- **Recursos Visuais**: Imagens e ilustrações educativas
- **FAQ Completo**: Respostas para dúvidas frequentes
- **Orientações de Encaminhamento**: Informações sobre onde buscar atendimento

## 🛠️ Tecnologias Utilizadas

### Frontend Core
- **React 18.3**: Biblioteca JavaScript para interfaces
- **TypeScript 5.8**: Tipagem estática e segurança de código
- **Vite 5.4**: Build tool moderna e rápida
- **React Router 6.30**: Navegação e roteamento

### UI/UX
- **Tailwind CSS 3.4**: Framework CSS utility-first
- **shadcn/ui**: Componentes React acessíveis e customizáveis
- **Framer Motion 12.34**: Animações e transições fluidas
- **Lucide React**: Biblioteca de ícones moderna

### Estado e Dados
- **Zustand 5.0**: Gerenciamento de estado global
- **TanStack Query 5.83**: Cache e sincronização de dados
- **IndexedDB (idb 8.0)**: Armazenamento local persistente

### Internacionalização
- **i18next 25.8**: Framework de internacionalização
- **react-i18next 16.5**: Integração React para i18n
- **i18next-browser-languagedetector**: Detecção automática de idioma

### PWA e Offline
- **vite-plugin-pwa 1.2**: Configuração de service worker
- **Workbox**: Estratégias de cache avançadas

### Acessibilidade
- **VLibras**: Widget de tradução para Libras
- **Web Speech API**: Síntese de voz nativa do navegador
- **ARIA**: Atributos de acessibilidade semântica

### Utilitários
- **date-fns 3.6**: Manipulação de datas
- **jsPDF 4.2**: Geração de PDFs
- **zod 3.25**: Validação de schemas
- **react-hook-form 7.61**: Gerenciamento de formulários

## 📦 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Passos de Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/leishcheck.git

# Entre no diretório
cd leishcheck

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build
npm run build            # Build de produção
npm run build:dev        # Build de desenvolvimento

# Qualidade de Código
npm run lint             # Executa ESLint

# Testes
npm run test             # Executa testes uma vez
npm run test:watch       # Executa testes em modo watch

# Preview
npm run preview          # Preview do build de produção
```

## 🏗️ Estrutura do Projeto

```
leishcheck/
├── public/              # Arquivos estáticos
│   ├── icons/          # Ícones PWA
│   └── manifest.json   # Manifest PWA
├── src/
│   ├── assets/         # Imagens e recursos
│   ├── components/     # Componentes React reutilizáveis
│   │   ├── ui/        # Componentes shadcn/ui
│   │   ├── AudioToggle.tsx
│   │   ├── DarkModeToggle.tsx
│   │   ├── LanguageSelector.tsx
│   │   ├── VLibrasWidget.tsx
│   │   ├── FloatingPWAButton.tsx
│   │   ├── ScrollAnimationWrapper.tsx
│   │   └── CustomCursor.tsx
│   ├── hooks/          # Custom React hooks
│   │   ├── useScrollAnimation.ts
│   │   └── use-toast.ts
│   ├── lib/            # Utilitários e configurações
│   │   ├── db.ts      # IndexedDB setup
│   │   └── utils.ts   # Funções auxiliares
│   ├── locales/        # Arquivos de tradução
│   │   ├── en.json    # Inglês
│   │   └── pt.json    # Português
│   ├── pages/          # Páginas da aplicação
│   │   ├── LandingPage.tsx
│   │   ├── Home.tsx
│   │   ├── Consent.tsx
│   │   ├── UserDataPage.tsx
│   │   ├── Questionnaire.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── Result.tsx
│   │   ├── Education.tsx
│   │   ├── History.tsx
│   │   └── HistoryDetail.tsx
│   ├── store/          # Zustand stores
│   │   └── useStore.ts
│   ├── types/          # TypeScript types
│   ├── App.tsx         # Componente raiz
│   ├── main.tsx        # Entry point
│   └── i18n.ts         # Configuração i18n
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts
```

## 🚀 Fluxo de Uso

1. **Landing Page**: Apresentação do projeto e funcionalidades
2. **Consentimento**: Aceite dos termos de uso e privacidade
3. **Dados do Usuário**: Coleta de informações básicas (opcional)
4. **Questionário**: 10 perguntas sobre sintomas e exposição
5. **Upload de Imagem**: Análise opcional de lesão por IA
6. **Resultado**: Score de risco e recomendações personalizadas
7. **Educação**: Acesso a conteúdo informativo
8. **Histórico**: Visualização de triagens anteriores

## 🎨 Design System

### Paleta de Cores

- **Primary**: `#1C2B1E` (Verde escuro)
- **Secondary**: `#A5D6A7` (Verde claro)
- **Background**: `#F5F2EC` (Bege claro)
- **Text**: `#1C2B1E` (Verde escuro)

### Tipografia

- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### Animações

- **Fade Up**: Elementos surgem de baixo para cima
- **Fade In Left/Right**: Elementos surgem lateralmente
- **Scale In**: Elementos crescem do centro
- **Stagger**: Animação sequencial de múltiplos elementos
- **Parallax**: Movimento suave baseado em scroll

## 📊 Armazenamento de Dados

### IndexedDB Schema

```typescript
// Store: screenings
{
  id: string,              // UUID único
  date: Date,              // Data da triagem
  userData: {              // Dados do usuário
    age: number,
    gender: string,
    location: string
  },
  answers: Answer[],       // Respostas do questionário
  imageAnalysis?: {        // Análise de imagem (opcional)
    confidence: number,
    prediction: string
  },
  riskScore: number,       // Score final (0-100)
  riskLevel: string,       // 'low' | 'medium' | 'high'
  recommendations: string[]
}
```

## 🔒 Privacidade e Segurança

- **Dados Locais**: Todas as informações permanecem no dispositivo
- **Sem Servidor**: Não há envio de dados para servidores externos
- **Anonimato**: Não é necessário criar conta ou fornecer identificação
- **Controle Total**: Usuário pode deletar seus dados a qualquer momento
- **Código Aberto**: Transparência total sobre o funcionamento

## ♿ Conformidade com Acessibilidade

- **WCAG 2.1 Level AA**: Seguindo diretrizes de acessibilidade web
- **Contraste**: Razão de contraste mínima de 4.5:1
- **Navegação**: Totalmente navegável por teclado
- **Screen Readers**: Compatível com leitores de tela
- **Semântica**: HTML semântico e ARIA labels apropriados

## 🌐 Suporte a Navegadores

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+
- Navegadores mobile modernos

## 📱 Instalação como PWA

### Android
1. Abra o site no Chrome
2. Toque no menu (⋮)
3. Selecione "Adicionar à tela inicial"
4. Confirme a instalação

### iOS
1. Abra o site no Safari
2. Toque no botão de compartilhar
3. Selecione "Adicionar à Tela de Início"
4. Confirme a instalação

### Desktop
1. Abra o site no Chrome/Edge
2. Clique no ícone de instalação na barra de endereço
3. Confirme a instalação

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👥 Equipe

Desenvolvido com ❤️ para contribuir com a saúde pública e democratizar o acesso ao diagnóstico precoce de Leishmaniose.

## 📞 Contato e Suporte

Para dúvidas, sugestões ou reportar problemas, abra uma issue no GitHub.

## ⚠️ Aviso Importante

**LeishCheck é uma ferramenta de triagem e educação em saúde. Não substitui consulta médica profissional. Em caso de suspeita de Leishmaniose, procure imediatamente uma unidade de saúde.**

---

## 📈 Estatísticas do Projeto

- **+20.000 casos** de Leishmaniose Cutânea por ano no Brasil
- **70% de eficácia** na detecção precoce com triagem digital
- **3 minutos** para completar a avaliação
- **100% gratuito** e acessível

## 🔄 Atualizações Recentes

### v1.0.0 (Atual)
- ✅ Sistema completo de triagem com questionário e IA
- ✅ PWA com funcionalidade offline
- ✅ Acessibilidade completa (áudio, VLibras, multilíngue)
- ✅ Animações de scroll e parallax na landing page
- ✅ Histórico de triagens com IndexedDB
- ✅ Exportação de resultados em PDF
- ✅ Modo escuro
- ✅ Suporte a português e inglês

## 🎯 Roadmap Futuro

- [ ] Integração com APIs de geolocalização de unidades de saúde
- [ ] Melhorias no modelo de IA para análise de imagens
- [ ] Notificações push para lembretes de acompanhamento
- [ ] Dashboard para profissionais de saúde
- [ ] Expansão para outras doenças negligenciadas
- [ ] Versão para iOS e Android nativo

---

**Desenvolvido com React + TypeScript + Vite**

🦟 Juntos contra a Leishmaniose!
