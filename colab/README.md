# 🧠 Treinamento do Modelo LeishCheck

Esta pasta contém o notebook Google Colab para treinar o modelo de IA de detecção de Leishmaniose.

## 📁 Arquivos

- **train_leishcheck.ipynb** - Notebook principal de treinamento
- **GUIA_RAPIDO.md** - Guia passo a passo para executar o notebook
- **README.md** - Este arquivo

## 🚀 Como Usar

### Opção 1: Abrir Diretamente no Colab

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/)

1. Clique no badge acima
2. **File** → **Upload notebook**
3. Selecione `train_leishcheck.ipynb`
4. Siga o [GUIA_RAPIDO.md](./GUIA_RAPIDO.md)

### Opção 2: Via GitHub

Se o projeto estiver no GitHub:

```
https://colab.research.google.com/github/SEU_USUARIO/leishcheck/blob/main/colab/train_leishcheck.ipynb
```

## 📊 Dataset

O notebook está configurado para usar as imagens do Google Drive:

- **Leishmaniose**: 10.000+ imagens
  - Link: https://drive.google.com/drive/folders/19Uy62U3a8Bw7AePjlZ0dlhgkfPWSTxas
  
- **Não-leishmaniose**: 10.000+ imagens
  - Link: https://drive.google.com/drive/folders/17nMMVEJh9Pm21-JZCs-R4hgxyPm2mW0C

## 🎯 Resultados Esperados

Com 20.000+ imagens:

- **Accuracy**: 85-90%
- **Precision**: 85-90%
- **Recall**: 90-95%
- **Tamanho do modelo**: 7-10 MB
- **Tempo de treinamento**: ~50-60 minutos (GPU T4)

## 🔧 Configurações

### GPU Gratuita

O notebook usa GPU T4 gratuita do Google Colab:
- **Limite**: ~12 horas por sessão
- **RAM**: 12-15 GB
- **Velocidade**: ~10x mais rápido que CPU

### Parâmetros Principais

```python
IMG_SIZE = 224          # Tamanho de entrada (MobileNetV2)
BATCH_SIZE = 32         # Batch size (reduzir se out of memory)
EPOCHS_PHASE1 = 20      # Épocas fase 1 (base congelada)
EPOCHS_PHASE2 = 15      # Épocas fase 2 (fine-tuning)
SPLIT_RATIO = 0.8       # 80% treino, 20% validação
```

## 📈 Processo de Treinamento

### Fase 1: Transfer Learning (Base Congelada)

- Base: MobileNetV2 pré-treinada (ImageNet)
- Camadas customizadas: Dense(256) → Dense(128) → Dense(2)
- Learning rate: 0.001
- Épocas: 20

### Fase 2: Fine-Tuning

- Descongela últimas 30 camadas
- Learning rate: 0.0001 (10x menor)
- Épocas: 15

### Data Augmentation

- Rotação: ±20°
- Shift: ±20%
- Zoom: ±20%
- Flip horizontal
- Brightness: 80-120%

## 📤 Output

O notebook gera:

1. **Modelo TensorFlow.js**
   - `model.json` - Arquitetura
   - `group1-shard*.bin` - Pesos

2. **Metadados**
   - Versão
   - Métricas (accuracy, precision, recall)
   - Total de imagens treinadas
   - Data de criação

3. **Visualizações**
   - Curvas de treinamento
   - Matriz de confusão
   - Amostras do dataset

## 🔄 Retreinamento

### Quando retreinar?

- A cada 3 meses (manutenção)
- Ao adicionar 1.000+ novas imagens
- Se accuracy cair abaixo de 80%
- Feedback de profissionais de saúde

### Como retreinar?

1. Adicionar novas imagens no Google Drive
2. Abrir notebook no Colab
3. **Runtime** → **Run all**
4. Aguardar conclusão
5. Fazer upload da nova versão para Supabase

## 🐛 Problemas Comuns

### Out of Memory

```python
# Reduzir batch size
BATCH_SIZE = 16  # ou 8
```

### Treinamento Lento

- Verificar se GPU está ativada
- Usar menos imagens para teste: `MAX_IMAGES_PER_CLASS = 1000`

### Accuracy Baixa

- Aumentar épocas: `epochs=30`
- Verificar balanceamento do dataset
- Aumentar data augmentation

## 📚 Recursos

- [TensorFlow.js](https://www.tensorflow.org/js)
- [MobileNetV2 Paper](https://arxiv.org/abs/1801.04381)
- [Transfer Learning Guide](https://www.tensorflow.org/tutorials/images/transfer_learning)
- [Google Colab FAQ](https://research.google.com/colaboratory/faq.html)

## 📝 Notas

- O modelo é exportado em formato TensorFlow.js para rodar no navegador
- Quantização reduz tamanho em ~30% com perda mínima de accuracy
- GPU T4 é gratuita mas tem limite de uso diário
- Salve checkpoints regularmente durante treinamento longo

---

**Desenvolvido para o projeto LeishCheck** 🦟
