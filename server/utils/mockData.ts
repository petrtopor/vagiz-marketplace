import type { Product } from "~/types/product";

// Просто для примера добавим несколько товаров
// В реальном приложении изображения лучше хранить в /public/images/
// и использовать пути типа '/images/product1.jpg'
export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Смартфон Alpha",
    description: "Современный смартфон с отличной камерой.",
    price: 59990,
    image: "https://via.placeholder.com/150/0000FF/FFFFFF?text=Phone+Alpha",
    category: "Смартфоны",
    brand: "TechCorp",
    rating: 4.5,
  },
  {
    id: "2",
    name: "Ноутбук Beta",
    description: "Мощный ноутбук для работы и игр.",
    price: 129990,
    image: "https://via.placeholder.com/150/FF0000/FFFFFF?text=Laptop+Beta",
    category: "Ноутбуки",
    brand: "CompSys",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Наушники Gamma",
    description: "Беспроводные наушники с шумоподавлением.",
    price: 15990,
    image:
      "https://via.placeholder.com/150/00FF00/FFFFFF?text=Headphones+Gamma",
    category: "Аудио",
    brand: "SoundWave",
    rating: 4.2,
  },
  {
    id: "4",
    name: "Планшет Delta",
    description: "Легкий и удобный планшет.",
    price: 34990,
    image: "https://via.placeholder.com/150/FFFF00/000000?text=Tablet+Delta",
    category: "Планшеты",
    brand: "TechCorp",
    rating: 4.0,
  },
  {
    id: "5",
    name: "Смарт-часы Epsilon",
    description: "Стильные часы с фитнес-трекером.",
    price: 19990,
    image: "https://via.placeholder.com/150/FF00FF/FFFFFF?text=Watch+Epsilon",
    category: "Носимые устройства",
    brand: "CompSys",
    rating: 4.6,
  },
  {
    id: "6",
    name: "Фотоаппарат Zeta",
    description: "Профессиональная камера для фото.",
    price: 89990,
    image: "https://via.placeholder.com/150/00FFFF/000000?text=Camera+Zeta",
    category: "Фототехника",
    brand: "PhotoGear",
    rating: 4.9,
  },
  {
    id: "7",
    name: "Клавиатура Eta",
    description: "Механическая клавиатура для геймеров.",
    price: 8990,
    image: "https://via.placeholder.com/150/C0C0C0/000000?text=Keyboard+Eta",
    category: "Аксессуары",
    brand: "GameStuff",
    rating: 4.3,
  },
  {
    id: "8",
    name: "Мышь Theta",
    description: "Эргономичная беспроводная мышь.",
    price: 4990,
    image: "https://via.placeholder.com/150/808080/FFFFFF?text=Mouse+Theta",
    category: "Аксессуары",
    brand: "TechCorp",
    rating: 4.1,
  },
  {
    id: "9",
    name: "Монитор Iota",
    description: "Большой монитор с высоким разрешением.",
    price: 45990,
    image: "https://via.placeholder.com/150/800000/FFFFFF?text=Monitor+Iota",
    category: "Мониторы",
    brand: "CompSys",
    rating: 4.7,
  },
  {
    id: "10",
    name: "Принтер Kappa",
    description: "Многофункциональное устройство для дома.",
    price: 12990,
    image: "https://via.placeholder.com/150/808000/FFFFFF?text=Printer+Kappa",
    category: "Оргтехника",
    brand: "PrintWell",
    rating: 3.9,
  },
  {
    id: "11",
    name: "Смартфон Alpha Pro",
    description: "Улучшенная версия смартфона Alpha.",
    price: 79990,
    image: "https://via.placeholder.com/150/000080/FFFFFF?text=Phone+Alpha+Pro",
    category: "Смартфоны",
    brand: "TechCorp",
    rating: 4.7,
  },
  {
    id: "12",
    name: "Ноутбук Beta Lite",
    description: "Легкий и компактный ноутбук.",
    price: 99990,
    image:
      "https://via.placeholder.com/150/800080/FFFFFF?text=Laptop+Beta+Lite",
    category: "Ноутбуки",
    brand: "CompSys",
    rating: 4.4,
  },
  {
    id: "13",
    name: "Наушники Gamma Pro",
    description: "Премиальные беспроводные наушники.",
    price: 25990,
    image:
      "https://via.placeholder.com/150/008080/FFFFFF?text=Headphones+Gamma+Pro",
    category: "Аудио",
    brand: "SoundWave",
    rating: 4.9,
  },
  {
    id: "14",
    name: "Планшет Delta Max",
    description: "Планшет с большим экраном.",
    price: 49990,
    image:
      "https://via.placeholder.com/150/800000/FFFFFF?text=Tablet+Delta+Max",
    category: "Планшеты",
    brand: "TechCorp",
    rating: 4.3,
  },
  {
    id: "15",
    name: "Смарт-часы Epsilon Sport",
    description: "Часы для активного спорта.",
    price: 24990,
    image:
      "https://via.placeholder.com/150/000000/FFFFFF?text=Watch+Epsilon+Sport",
    category: "Носимые устройства",
    brand: "CompSys",
    rating: 4.8,
  },
];

// Функция для получения уникальных значений свойств для фильтров
export const getUniqueValues = (products: Product[], key: keyof Product) => {
  const values = products.map((p) => p[key]);
  return [...new Set(values)].sort(); // Возвращаем отсортированный массив уникальных значений
};
