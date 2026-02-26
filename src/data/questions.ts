import { Question } from '@/types/leishcheck';

export const questions: Question[] = [
  {
    text: 'Você mora em área rural ou de mata?',
    icon: '🌿',
    weight: 10,
    audioText: 'Pergunta 1. Você mora em área rural ou de mata?',
  },
  {
    text: 'Já viajou para locais com casos de leishmaniose?',
    icon: '🌿',
    weight: 10,
    audioText: 'Pergunta 2. Já viajou para locais com casos de leishmaniose?',
  },
  {
    text: 'Possui lesão na pele que não cicatriza?',
    icon: '🩹',
    weight: 20,
    audioText: 'Pergunta 3. Possui lesão na pele que não cicatriza?',
  },
  {
    text: 'A lesão está crescendo com o tempo?',
    icon: '📈',
    weight: 15,
    audioText: 'Pergunta 4. A lesão está crescendo com o tempo?',
  },
  {
    text: 'A lesão não dói e tem aspecto ulcerado?',
    icon: '🔍',
    weight: 20,
    audioText: 'Pergunta 5. A lesão não dói e tem aspecto ulcerado?',
  },
  {
    text: 'Houve contato com animais infectados?',
    icon: '🐕',
    weight: 10,
    audioText: 'Pergunta 6. Houve contato com animais infectados?',
  },
  {
    text: 'Mora em área endêmica?',
    icon: '🌿',
    weight: 10,
    audioText: 'Pergunta 7. Mora em área endêmica?',
  },
  {
    text: 'Já teve leishmaniose antes?',
    icon: '📋',
    weight: 10,
    audioText: 'Pergunta 8. Já teve leishmaniose antes?',
  },
  {
    text: 'A ferida tem mais de 2 semanas?',
    icon: '📅',
    weight: 15,
    audioText: 'Pergunta 9. A ferida tem mais de 2 semanas?',
  },
  {
    text: 'A lesão surgiu após picada de inseto?',
    icon: '🦟',
    weight: 15,
    audioText: 'Pergunta 10. A lesão surgiu após picada de inseto?',
  },
];

export const MAX_SCORE = questions.reduce((sum, q) => sum + q.weight, 0);
