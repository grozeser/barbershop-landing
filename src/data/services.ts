export interface Service {
  id: string;
  name: string;
  description: string;
  /** минуты */
  duration: number;
  /** рубли */
  price: number;
}

export interface ServiceGroup {
  title: string;
  items: Service[];
}

export const serviceGroups: ServiceGroup[] = [
  {
    title: 'Стрижки',
    items: [
      {
        id: 'haircut',
        name: 'Мужская стрижка',
        description: 'Консультация, мытьё головы, стрижка и укладка',
        duration: 60,
        price: 2800,
      },
      {
        id: 'clipper',
        name: 'Стрижка машинкой',
        description: 'Одна насадка или плавный переход',
        duration: 30,
        price: 1600,
      },
      {
        id: 'long',
        name: 'Стрижка на длинные волосы',
        description: 'Ножницы, филировка, укладка',
        duration: 75,
        price: 3200,
      },
    ],
  },
  {
    title: 'Борода и бритьё',
    items: [
      {
        id: 'beard',
        name: 'Моделирование бороды',
        description: 'Форма, контур, уход маслом',
        duration: 45,
        price: 1800,
      },
      {
        id: 'shave',
        name: 'Королевское бритьё',
        description: 'Опасная бритва, горячие полотенца, холодный компресс',
        duration: 45,
        price: 2500,
      },
      {
        id: 'head-shave',
        name: 'Бритьё головы',
        description: 'Опасной бритвой, с уходом для кожи',
        duration: 45,
        price: 2200,
      },
    ],
  },
  {
    title: 'Комплексы',
    items: [
      {
        id: 'haircut-beard',
        name: 'Стрижка и борода',
        description: 'Самое популярное сочетание',
        duration: 90,
        price: 4200,
      },
      {
        id: 'father-son',
        name: 'Отец и сын',
        description: 'Две стрижки в соседних креслах',
        duration: 60,
        price: 4400,
      },
    ],
  },
  {
    title: 'Детям и дополнительно',
    items: [
      {
        id: 'kids',
        name: 'Детская стрижка',
        description: 'Для мальчиков от 4 до 12 лет',
        duration: 45,
        price: 1900,
      },
      {
        id: 'camo',
        name: 'Камуфляж седины',
        description: 'Естественный оттенок без эффекта окрашивания',
        duration: 30,
        price: 1700,
      },
      {
        id: 'styling',
        name: 'Укладка',
        description: 'Средство на выбор и совет по домашнему уходу',
        duration: 15,
        price: 800,
      },
    ],
  },
];

export const services = serviceGroups.flatMap((group) => group.items);
