# 🚀 Guia Rápido - Treinar Modelo no Google Colab

## 📋 Pré-requisitos

- ✅ Conta Google
- ✅ Imagens organizadas no Google Drive:
  - **Leishmaniose**: https://drive.google.com/drive/folders/19Uy62U3a8Bw7AePjlZ0dlhgkfPWSTxas
  - **Não-leishmaniose**: https://drive.google.com/drive/folders/17nMMVEJh9Pm21-JZCs-R4hgxyPm2mW0C

---

## 🎯 Passo a Passo

### 1. Abrir Notebook no Colab

1. Acesse: https://colab.research.google.com/
2. **File** → **Upload notebook**
3. Selecione `colab/train_leishcheck.ipynb`
4. Aguarde o upload

### 2. Configurar GPU

1. **Runtime** → **Change runtime type**
2. **Hardware accelerator**: Selecione **T4 GPU**
3. Clique em **Save**

### 3. Executar Treinamento

#### Opção A: Execução Automática (Recomendado)

1. **Runtime** → **Run all**
2. Quando solicitado, autorize acesso ao Google Drive
3. Aguarde ~30-60 minutos

#### Opção B: Execução Passo a Passo

Execute cada célula sequencialmente:

1. **Célula 1**: Instalar dependências (~2 min)
2. **Célula 2**: Conectar ao Drive e verificar imagens (~1 min)
3. **Célula 2.1** (OPCIONAL): Se não encontrar imagens, execute para buscar automaticamente
4. **Célula 3**: Dividir dataset (~5-10 min com 20k imagens)
5. **Célula 4**: Visualizar amostras
6. **Célula 5**: Configurar data augmentation
7. **Célula 6**: Construir modelo
8. **Célula 7**: Treinar Fase 1 (~15-20 min)
9. **Célula 8**: Fine-tuning Fase 2 (~10-15 min)
10. **Célula 9**: Avaliar modelo
11. **Célula 10**: Visualizar curvas
12. **Célula 11**: Exportar para TensorFlow.js (~2 min)
13. **Célula 12**: Download do modelo
14. **Célula 13**: Gerar metadados

---

## ⚙️ Configurações Importantes

### Teste Rápido (1.000 imagens por classe)

Na **Célula 3**, altere:

```python
MAX_IMAGES_PER_CLASS = 1000  # Teste rápido (~10 min total)
```

### Treinamento Completo (todas as imagens)

```python
MAX_IMAGES_PER_CLASS = None  # Usar todas (~60 min total)
```

### Ajustar Caminhos (se necessário)

Na **Célula 2**, ajuste os caminhos:

```python
DRIVE_LEISH_PATH = '/content/drive/MyDrive/SEU_CAMINHO/leishimaniose'
DRIVE_NAO_LEISH_PATH = '/content/drive/MyDrive/SEU_CAMINHO/Nao_leishimaniose'
```

---

## 📊 Resultados Esperados

### Métricas Mínimas

- **Accuracy**: ≥ 85%
- **Precision**: ≥ 85%
- **Recall**: ≥ 90%

### Tamanho do Modelo

- **Sem quantização**: ~10-12 MB
- **Com quantização**: ~7-8 MB

---

## 📥 Após o Treinamento

### 1. Arquivos Gerados

O notebook faz download automático de:

- `tfjs_model_vYYYYMMDD_HHMM.zip` - Modelo TensorFlow.js
- `model_metadata_vYYYYMMDD_HHMM.json` - Metadados

### 2. Próximos Passos

1. **Extrair o ZIP**
   ```
   tfjs_model_v20260317_1430/
   ├── model.json
   ├── group1-shard1of1.bin
   └── (outros shards)
   ```

2. **Upload para Supabase Storage**
   - Vá em Storage → leish-models
   - Criar pasta: `v20260317_1430`
   - Upload de todos os arquivos

3. **Registrar no Banco**
   ```sql
   INSERT INTO model_versions (
     version, storage_path, accuracy, 
     precision_leish, recall_leish, 
     total_images_trained, is_active
   ) VALUES (
     '20260317_1430',
     'v20260317_1430/model.json',
     0.87, 0.86, 0.91, 20000, true
   );
   ```

---

## 🐛 Troubleshooting

### Erro: "Pasta não encontrada"

**Solução**: Execute a **Célula 2.1** para buscar automaticamente os caminhos corretos.

### Erro: "Out of memory"

**Soluções**:
1. Reduzir `BATCH_SIZE` de 32 para 16 (Célula 5)
2. Usar `MAX_IMAGES_PER_CLASS = 5000` para teste (Célula 3)
3. Reiniciar runtime: **Runtime** → **Restart runtime**

### Erro: "GPU not available"

**Solução**: Verificar se GPU está ativada:
- **Runtime** → **Change runtime type** → **T4 GPU**

### Treinamento muito lento

**Verificar**:
1. GPU está ativada? (deve aparecer "GPU 0: Tesla T4" no início)
2. Usar menos imagens para teste: `MAX_IMAGES_PER_CLASS = 1000`

### Accuracy muito baixa (< 70%)

**Possíveis causas**:
1. Imagens de baixa qualidade
2. Classes muito desbalanceadas
3. Poucas épocas de treinamento

**Soluções**:
1. Aumentar épocas: `epochs=30` (Células 7 e 8)
2. Verificar balanceamento do dataset (Célula 3 mostra)
3. Aumentar data augmentation (Célula 5)

---

## 💡 Dicas

### Economizar Tempo de GPU

- Use `MAX_IMAGES_PER_CLASS = 1000` para testes
- Só treine com dataset completo quando estiver satisfeito com a arquitetura

### Melhorar Accuracy

1. **Mais dados**: Adicionar mais imagens variadas
2. **Data augmentation**: Aumentar variações (Célula 5)
3. **Fine-tuning**: Descongelar mais camadas (Célula 8)
4. **Mais épocas**: Aumentar de 20 para 30-40

### Reduzir Tamanho do Modelo

Na **Célula 11**, usar quantização:

```python
tfjs.converters.save_keras_model(
    model,
    f'tfjs_model_v{VERSION}',
    quantization_dtype_map={'uint8': '*'}  # Reduz ~30% do tamanho
)
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verificar mensagens de erro no notebook
2. Consultar seção Troubleshooting acima
3. Verificar logs de cada célula
4. Reiniciar runtime e tentar novamente

---

## ⏱️ Tempo Estimado

| Etapa | Tempo (1k imgs) | Tempo (20k imgs) |
|-------|-----------------|------------------|
| Setup | 3 min | 3 min |
| Dividir dataset | 1 min | 10 min |
| Treinar Fase 1 | 5 min | 20 min |
| Fine-tuning | 3 min | 15 min |
| Exportar | 1 min | 2 min |
| **Total** | **~15 min** | **~50 min** |

---

**Boa sorte com o treinamento! 🚀**
