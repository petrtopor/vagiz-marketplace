export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string; // Путь к изображению (может быть URL или локальный путь)
  category: string; // Свойство для фильтрации
  brand: string; // Свойство для фильтрации
  rating: number; // Свойство для сортировки/фильтрации (0-5)
}
