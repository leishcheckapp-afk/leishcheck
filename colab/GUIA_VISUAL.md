# 📸 Guia Visual - Como Usar o Google Colab

## 🌐 Passo 1: Acessar Google Colab

1. Abra seu navegador (Chrome, Edge, Firefox)
2. Digite na barra de endereço: **https://colab.research.google.com/**
3. Pressione Enter
4. Faça login com sua conta Google (se necessário)

---

## 📤 Passo 2: Upload do Notebook

### 2.1. Tela Inicial do Colab

Você verá uma janela com várias abas:
- Examples
- Recent
- Google Drive
- GitHub
- **Upload** ← Clique aqui

### 2.2. Fazer Upload

1. Clique na aba **"Upload"**
2. Você verá um botão **"Choose File"** ou **"Escolher arquivo"**
3. Clique nele
4. Navegue até: `C:\Aplicativos\Neumaria\leishcheck\colab\`
5. Selecione: **`train_leishcheck.ipynb`**
6. Clique em **"Abrir"**
7. Aguarde alguns segundos (barra de progresso aparecerá)

### 2.3. Notebook Aberto

Você verá:
- Título: "🦟 LeishCheck - Treinamento do Modelo de IA"
- Várias células de código e texto
- Menu superior com: File, Edit, View, Insert, Runtime, Tools, Help

---

## ⚙️ Passo 3: Configurar GPU (IMPORTANTE!)

### 3.1. Abrir Configurações

No menu superior:
1. Clique em **"Runtime"** (ou "Ambiente de execução")
2. No menu que abrir, clique em **"Change runtime type"** (ou "Alterar tipo de ambiente de execução")

### 3.2. Selecionar GPU

Uma janela popup abrirá com:

**Notebook settings** (Configurações do notebook)

- **Runtime type**: Python 3
- **Hardware accelerator**: None ← Clique aqui

Opções que aparecerão:
- None
- **T4 GPU** ← Selecione esta
- TPU

### 3.3. Salvar

1. Clique no botão **"Save"** (Salvar) no canto inferior direito
2. A janela fechará
3. No canto superior direito, você verá: "Connected" e um ícone de RAM/Disk

---

## ▶️ Passo 4: Executar o Notebook

### 4.1. Executar Todas as Células

No menu superior:
1. Clique em **"Runtime"** (Ambiente de execução)
2. Clique em **"Run all"** (Executar tudo)

### 4.2. Autorizar Google Drive (Primeira Vez)

Uma mensagem aparecerá:

**"This notebook requires access to your Google Drive files"**
(Este notebook requer acesso aos seus arquivos do Google Drive)

1. Clique no botão **"Connect to Google Drive"** (Conectar ao Google Drive)
2. Uma nova janela abrirá
3. Selecione sua conta Google (a mesma que tem as imagens)
4. Clique em **"Allow"** (Permitir)
5. A janela fechará automaticamente

### 4.3. Acompanhar Execução

Você verá:
- Células sendo executadas uma por uma
- Ícone de "play" girando ao lado de cada célula
- Saída (output) aparecendo abaixo de cada célula
- Barra de progresso em algumas células

**Tempo estimado**: 50-60 minutos

---

## 📊 Passo 5: Acompanhar Progresso

### 5.1. Células Importantes

**Célula 1**: Instalação de dependências (~2 min)
```
Installing collected packages: ...
✅ Dependências instaladas
```

**Célula 2**: Conectar ao Drive (~1 min)
```
Mounted at /content/drive
✅ Encontradas XXXX imagens de leishmaniose
✅ Encontradas XXXX imagens de não-leishmaniose
```

**Célula 3**: Dividir dataset (~5-10 min)
```
🔄 Dividindo dataset...
📊 Processando leishmaniose:
   Copiando XXXX imagens para treino...
✅ Dataset dividido com sucesso!
```

**Célula 7**: Treinar Fase 1 (~15-20 min)
```
Epoch 1/20
████████████████ 100% - loss: 0.5 - accuracy: 0.75
Epoch 2/20
...
✅ Fase 1 concluída
```

**Célula 8**: Fine-tuning (~10-15 min)
```
Epoch 1/15
████████████████ 100% - loss: 0.3 - accuracy: 0.87
...
✅ Fine-tuning concluído
```

**Célula 9**: Avaliar modelo
```
📈 Métricas Finais:
  Accuracy: 0.8750
  Precision: 0.8600
  Recall: 0.9100
```

**Célula 12**: Download do modelo
```
✅ Modelo compactado e pronto para download
```

---

## 📥 Passo 6: Download dos Arquivos

### 6.1. Download Automático

Quando a **Célula 12** executar, um arquivo será baixado automaticamente:
- Nome: `tfjs_model_vYYYYMMDD_HHMM.zip`
- Tamanho: ~7-10 MB
- Local: Pasta de Downloads do seu navegador

### 6.2. Download Manual (se necessário)

Se o download não iniciar automaticamente:

1. No painel esquerdo, clique no ícone de **pasta** (Files)
2. Você verá uma lista de arquivos
3. Procure por: `tfjs_model_vYYYYMMDD_HHMM.zip`
4. Clique com botão direito no arquivo
5. Clique em **"Download"**

### 6.3. Metadados

Repita o processo para baixar:
- `model_metadata_vYYYYMMDD_HHMM.json`

---

## ✅ Verificar Sucesso

### Sinais de que deu certo:

1. ✅ Célula 9 mostra: **Accuracy ≥ 0.85** (85%)
2. ✅ Célula 10 mostra gráficos de treinamento
3. ✅ Célula 11 mostra: **"✅ Modelo exportado para TensorFlow.js"**
4. ✅ Célula 12 faz download do ZIP
5. ✅ Arquivo ZIP tem 7-10 MB

---

## 🐛 Problemas Comuns

### Problema 1: "Pasta não encontrada"

**Sintoma**: Célula 2 mostra:
```
⚠️ Pasta não encontrada: /content/drive/...
```

**Solução**:
1. Execute a **Célula 2.1** (logo abaixo da Célula 2)
2. Ela vai buscar automaticamente os caminhos corretos
3. Copie o caminho que aparecer
4. Volte na **Célula 2**
5. Cole o caminho correto
6. Execute a Célula 2 novamente

### Problema 2: "Out of memory"

**Sintoma**: Erro durante treinamento:
```
ResourceExhaustedError: OOM when allocating tensor
```

**Solução**:
1. Na **Célula 3**, altere:
   ```python
   MAX_IMAGES_PER_CLASS = 1000  # Reduzir para teste
   ```
2. **Runtime** → **Restart runtime**
3. **Runtime** → **Run all**

### Problema 3: GPU não disponível

**Sintoma**: Treinamento muito lento (>2 horas)

**Solução**:
1. **Runtime** → **Change runtime type**
2. Verificar se **T4 GPU** está selecionado
3. Se não estiver disponível, aguardar alguns minutos e tentar novamente
4. Google Colab tem limite de uso de GPU gratuita

### Problema 4: Sessão desconectou

**Sintoma**: Mensagem "Runtime disconnected"

**Solução**:
1. Clique em **"Reconnect"**
2. Se perdeu o progresso, execute **Runtime** → **Run all** novamente
3. Dica: Mantenha a aba do Colab aberta e ativa

---

## 💡 Dicas

### Economizar Tempo

- Use `MAX_IMAGES_PER_CLASS = 1000` para teste rápido (~15 min)
- Só use todas as imagens quando estiver satisfeito

### Manter Sessão Ativa

- Não feche a aba do Colab
- Não deixe o computador dormir
- Mova o mouse de vez em quando

### Verificar GPU

No início do notebook, você deve ver:
```
GPU 0: Tesla T4 (UUID: GPU-...)
```

Se não aparecer, a GPU não está ativada.

---

## 📞 Precisa de Ajuda?

Se ainda tiver problemas:

1. Tire um print da tela mostrando o erro
2. Anote qual célula deu erro
3. Copie a mensagem de erro completa
4. Consulte a seção de Troubleshooting no `GUIA_RAPIDO.md`

---

**Boa sorte com o treinamento! 🚀**
