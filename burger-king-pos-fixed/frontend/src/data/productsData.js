// Product database with real images
export const PRODUCTS_DATA = [
  // BURGERS
  {
    _id: 'whopper-supreme',
    name: 'Whopper Supreme',
    category: 'Burgers',
    description: 'Flame-grilled beef patty with fresh lettuce, tomato, onions, pickles, mayo and our signature sauce',
    basePrice: 249,
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop',
    isVeg: false,
    isBestseller: true,
    isSpicy: false,
    calories: 660,
    rating: 4.8,
    variants: [
      { name: 'Regular', price: 249 },
      { name: 'Combo (+ Fries + Drink)', price: 349 }
    ]
  },
  {
    _id: 'double-whopper',
    name: 'Double Whopper',
    category: 'Burgers',
    description: 'Two flame-grilled beef patties with double cheese, lettuce, tomato, onions and pickles',
    basePrice: 349,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop',
    isVeg: false,
    isBestseller: true,
    isSpicy: false,
    calories: 820,
    rating: 4.9,
    variants: [
      { name: 'Regular', price: 349 },
      { name: 'Combo', price: 449 }
    ]
  },
  {
    _id: 'crispy-chicken-burger',
    name: 'Crispy Chicken Burger',
    category: 'Burgers',
    description: 'Golden crispy chicken breast with special BK sauce, fresh lettuce and tomato',
    basePrice: 199,
    image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=400&fit=crop',
    isVeg: false,
    isBestseller: false,
    isSpicy: false,
    calories: 580,
    rating: 4.7,
    variants: [
      { name: 'Regular', price: 199 },
      { name: 'Combo', price: 299 }
    ]
  },
  {
    _id: 'spicy-paneer-burger',
    name: 'Spicy Paneer Burger',
    category: 'Burgers',
    description: 'Spicy paneer patty with jalapeño mayo, crispy lettuce and fresh tomato',
    basePrice: 179,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: true,
    isSpicy: true,
    calories: 520,
    rating: 4.6,
    variants: [
      { name: 'Regular', price: 179 },
      { name: 'Combo', price: 279 }
    ]
  },
  {
    _id: 'veggie-bean-burger',
    name: 'Veggie Bean Burger',
    category: 'Burgers',
    description: 'Plant-based bean patty with fresh vegetables and our special sauce',
    basePrice: 149,
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 450,
    rating: 4.5,
    variants: [
      { name: 'Regular', price: 149 },
      { name: 'Combo', price: 249 }
    ]
  },

  // CHICKEN
  {
    _id: 'chicken-strips',
    name: 'Chicken Strips',
    category: 'Chicken',
    description: '5 crispy golden chicken tenders with dipping sauce',
    basePrice: 229,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop',
    isVeg: false,
    isBestseller: false,
    isSpicy: false,
    calories: 520,
    rating: 4.7,
    variants: [
      { name: '5 Pieces', price: 229 },
      { name: '10 Pieces', price: 399 }
    ]
  },
  {
    _id: 'fried-chicken',
    name: 'Fried Chicken Box',
    category: 'Chicken',
    description: 'Crispy fried chicken pieces - juicy and flavorful',
    basePrice: 299,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop',
    isVeg: false,
    isBestseller: true,
    isSpicy: false,
    calories: 680,
    rating: 4.8,
    variants: [
      { name: '4 Pieces', price: 299 },
      { name: '8 Pieces', price: 499 }
    ]
  },

  // SIDES
  {
    _id: 'bk-fries',
    name: 'BK Hi-Fries',
    category: 'Sides',
    description: 'Crispy golden seasoned fries - available in Salted or Peri Peri',
    basePrice: 99,
    image: 'https://cdn.prod.website-files.com/631b4b4e277091ef01450237/636becf2e2fd494baea6d11a_Fries%201.png',
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    calories: 350,
    rating: 4.8,
    variants: [
      { name: 'Regular', price: 99 },
      { name: 'Large', price: 129 }
    ]
  },
  {
    _id: 'onion-rings',
    name: 'Onion Rings',
    category: 'Sides',
    description: 'Crispy beer-battered onion rings with ranch dip',
    basePrice: 89,
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 280,
    rating: 4.6,
    variants: [
      { name: 'Regular', price: 89 },
      { name: 'Large', price: 119 }
    ]
  },
  {
    _id: 'mac-n-cheese',
    name: 'Mac n Cheese',
    category: 'Sides',
    description: 'Creamy macaroni and cheese - comfort food at its best',
    basePrice: 149,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 420,
    rating: 4.7,
    variants: [
      { name: 'Regular', price: 149 },
      { name: 'Large', price: 199 }
    ]
  },

  // MEALS
  {
    _id: 'whopper-meal',
    name: 'Whopper Meal',
    category: 'Meals',
    description: 'Whopper + Large Fries + Large Drink + Dessert',
    basePrice: 399,
    image: 'https://tse2.mm.bing.net/th/id/OIP.mpDoSwLP-VQx-fG3DWljMgHaD4?w=1200&h=628&rs=1&pid=ImgDetMain&o=7&rm=3',
    isVeg: false,
    isBestseller: true,
    isSpicy: false,
    calories: 1200,
    rating: 4.9,
    variants: [
      { name: 'Regular Meal', price: 399 },
      { name: 'Family Meal (2)', price: 699 }
    ]
  },
  {
    _id: 'paneer-meal',
    name: 'Spicy Paneer Meal',
    category: 'Meals',
    description: 'Spicy Paneer Burger + Fries + Soft Drink + Dessert',
    basePrice: 329,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: true,
    calories: 1100,
    rating: 4.7,
    variants: [
      { name: 'Single', price: 329 },
      { name: 'Combo for 2', price: 599 }
    ]
  },
  {
    _id: 'family-feast',
    name: 'Family Feast',
    category: 'Meals',
    description: '2 Whoppers + 2 Chicken Burger + Large Fries + 2 Drinks',
    basePrice: 799,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561af1?w=600&h=400&fit=crop',
    isVeg: false,
    isBestseller: true,
    isSpicy: false,
    calories: 2200,
    rating: 4.9,
    variants: [
      { name: 'Family Feast', price: 799 }
    ]
  },

  // BEVERAGES
  {
    _id: 'chocolate-shake',
    name: 'Chocolate Thick Shake',
    category: 'Beverages',
    description: 'Creamy thick chocolate milkshake made with premium ice cream',
    basePrice: 149,
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    calories: 280,
    rating: 4.8,
    variants: [
      { name: 'Regular', price: 149 },
      { name: 'Large', price: 179 }
    ]
  },
  {
    _id: 'mango-smoothie',
    name: 'Mango Smoothie',
    category: 'Beverages',
    description: 'Fresh mango blended with ice cream and yogurt',
    basePrice: 129,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 200,
    rating: 4.7,
    variants: [
      { name: 'Regular', price: 129 },
      { name: 'Large', price: 159 }
    ]
  },
  {
    _id: 'cold-coffee',
    name: 'Cold Coffee',
    category: 'Beverages',
    description: 'Rich cold brew coffee with fresh cream and ice',
    basePrice: 119,
    image: 'https://images.unsplash.com/photo-1517701604599-bb24b316874c?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 150,
    rating: 4.6,
    variants: [
      { name: 'Regular', price: 119 },
      { name: 'Large', price: 149 }
    ]
  },
  {
    _id: 'soft-drinks',
    name: 'Soft Drinks',
    category: 'Beverages',
    description: 'Coca Cola, Sprite, Fanta and other beverages',
    basePrice: 79,
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    calories: 140,
    rating: 4.5,
    variants: [
      { name: 'Regular', price: 79 },
      { name: 'Large', price: 99 }
    ]
  },

  // DESSERTS
  {
    _id: 'soft-serve-cone',
    name: 'Soft Serve Cone',
    category: 'Desserts',
    description: 'Classic vanilla soft serve in a crispy cone',
    basePrice: 39,
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 120,
    rating: 4.5,
    variants: [
      { name: 'Single', price: 39 },
      { name: 'Double', price: 59 }
    ]
  },
  {
    _id: 'sundae',
    name: 'Sundae',
    category: 'Desserts',
    description: 'Soft serve with hot fudge, caramel or strawberry sauce',
    basePrice: 79,
    image: 'https://tse4.mm.bing.net/th/id/OIP.gAuGq2BDyrudMU_flIl8FgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3',
    isVeg: true,
    isBestseller: true,
    isSpicy: false,
    calories: 250,
    rating: 4.8,
    variants: [
      { name: 'Single Scoop', price: 79 },
      { name: 'Double Scoop', price: 119 }
    ]
  },
  {
    _id: 'apple-pie',
    name: 'Apple Pie',
    category: 'Desserts',
    description: 'Warm cinnamon apple pie in crispy pastry with vanilla ice cream',
    basePrice: 69,
    image: 'https://images.unsplash.com/photo-1571506191039-245593129ba0?w=600&h=400&fit=crop',
    isVeg: true,
    isBestseller: false,
    isSpicy: false,
    calories: 350,
    rating: 4.7,
    variants: [
      { name: 'Single Serving', price: 69 }
    ]
  },
];


export const CATEGORIES = [
  { _id: 'all', name: 'All', image: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=200&h=200&fit=crop' },
  { _id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop' },
  { _id: 'chicken', name: 'Chicken', image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=200&h=200&fit=crop' },
  { _id: 'sides', name: 'Sides', image: 'https://images.unsplash.com/photo-1630384066242-17a178021547?w=200&h=200&fit=crop' },
  { _id: 'meals', name: 'Meals', image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=200&h=200&fit=crop' },
  { _id: 'beverages', name: 'Beverages', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=200&h=200&fit=crop' },
  { _id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=200&h=200&fit=crop' },
];

export const OFFERS = [
  {
    _id: 'offer1',
    code: 'WELCOME50',
    title: '50% Off on First Order',
    description: 'Get 50% discount on your first order using code WELCOME50',
    discount: 50,
    minAmount: 200,
    maxDiscount: 500,
    type: 'percentage',
    active: true,
  },
  {
    _id: 'offer2',
    code: 'FLAT200',
    title: 'Flat ₹200 Off',
    description: 'Get ₹200 off on orders above ₹500',
    discount: 200,
    minAmount: 500,
    type: 'fixed',
    active: true,
  },
  {
    _id: 'offer3',
    code: 'FAMILY100',
    title: 'Family Combo Offer',
    description: '₹100 off on family meals',
    discount: 100,
    minAmount: 800,
    type: 'fixed',
    active: true,
  },
];
