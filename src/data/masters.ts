export interface Master {
  id: string;
  name: string;
  /** имя в дательном падеже для кнопки «Записаться к …» */
  dative: string;
  level: 'Барбер' | 'Топ-барбер' | 'Бренд-барбер';
  experience: string;
  specialty: string;
}

export const masters: Master[] = [
  {
    id: 'artem',
    name: 'Артём Волков',
    dative: 'Артёму',
    level: 'Бренд-барбер',
    experience: '9 лет',
    specialty: 'Классические формы, королевское бритьё, сложные бороды',
  },
  {
    id: 'alina',
    name: 'Алина Ветрова',
    dative: 'Алине',
    level: 'Топ-барбер',
    experience: '7 лет',
    specialty: 'Работа ножницами, длинные волосы, текстурные стрижки',
  },
  {
    id: 'denis',
    name: 'Денис Орлов',
    dative: 'Денису',
    level: 'Топ-барбер',
    experience: '5 лет',
    specialty: 'Фейды, кроп, чистые переходы машинкой',
  },
  {
    id: 'mark',
    name: 'Марк Соколов',
    dative: 'Марку',
    level: 'Барбер',
    experience: '3 года',
    specialty: 'Детские стрижки и камуфляж седины',
  },
];
