require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const { Category, Table, Offer } = require('./models/index');
const User = require('./models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/burger-king-pos';

const categories = [
  { name: 'Burgers', slug: 'burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=400&auto=format&fit=crop', displayOrder: 1 },
  { name: 'Chicken', slug: 'chicken', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&h=400&auto=format&fit=crop', displayOrder: 2 },
  { name: 'Meals', slug: 'meals', image: 'https://images.unsplash.com/photo-1594212699903-ec8a3ecc50f1?q=80&w=400&h=400&auto=format&fit=crop', displayOrder: 3 },
  { name: 'Sides', slug: 'sides', image: 'https://images.unsplash.com/photo-1630384066242-17a178021547?q=80&w=400&h=400&auto=format&fit=crop', displayOrder: 4 },
  { name: 'Beverages', slug: 'beverages', image: 'https://images.unsplash.com/photo-1543250606-2c18af2b6833?q=80&w=400&h=400&auto=format&fit=crop', displayOrder: 5 },
  { name: 'Desserts', slug: 'desserts', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=400&h=400&auto=format&fit=crop', displayOrder: 6 },
];

const tables = [
  { tableNumber: '1', floor: 'Ground Floor', seats: 4 },
  { tableNumber: '2', floor: 'Ground Floor', seats: 2 },
  { tableNumber: '3', floor: 'Ground Floor', seats: 6 },
  { tableNumber: '4', floor: 'Ground Floor', seats: 4 },
  { tableNumber: '5', floor: 'Ground Floor', seats: 4 },
  { tableNumber: '6', floor: 'Ground Floor', seats: 8 },
  { tableNumber: '7', floor: 'First Floor', seats: 2 },
  { tableNumber: '8', floor: 'First Floor', seats: 4 },
  { tableNumber: '9', floor: 'First Floor', seats: 6 },
  { tableNumber: '10', floor: 'First Floor', seats: 4 },
];

const offers = [
  { title: '20% OFF on Meals', description: 'Get 20% off on all combo meals above ₹300', code: 'MEAL20', type: 'percentage', value: 20, minOrderValue: 300, maxDiscount: 100, endDate: new Date('2025-12-31'), badge: '🔥 HOT' },
  { title: '₹50 OFF First Order', description: 'New users get flat ₹50 off on first order', code: 'NEWBK50', type: 'flat', value: 50, minOrderValue: 150, endDate: new Date('2025-12-31'), badge: '👑 NEW' },
  { title: 'Crown Member 10% OFF', description: 'Exclusive 10% for Crown loyalty members', code: 'CROWN10', type: 'percentage', value: 10, minOrderValue: 200, maxDiscount: 80, endDate: new Date('2025-12-31'), badge: '👑 VIP' },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await Promise.all([Category.deleteMany(), Product.deleteMany(), Table.deleteMany(), Offer.deleteMany()]);

  // Insert categories
  const cats = await Category.insertMany(categories);
  const catMap = {};
  cats.forEach(c => catMap[c.slug] = c._id);
  console.log('Categories seeded');

  // Insert products
  const products = [
    { name: 'Whopper Supreme', description: 'Flame-grilled beef patty with fresh lettuce, tomato, onions, pickles, ketchup and mayo', category: catMap.burgers, basePrice: 249, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop', imageEmoji: '🍔', isVeg: false, isBestseller: true, calories: 660 },
    { name: 'Double Whopper', description: 'Two flame-grilled beef patties with all the Whopper toppings', category: catMap.burgers, basePrice: 349, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=400&fit=crop', imageEmoji: '🍔', isVeg: false, isBestseller: true, calories: 900 },
    { name: 'Spicy Paneer Burger', description: 'Spicy paneer patty with jalapeño mayo and crispy lettuce', category: catMap.burgers, basePrice: 179, image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?w=600&h=400&fit=crop', imageEmoji: '🌶️', isVeg: true, isBestseller: true, isSpicy: true, calories: 480 },
    { name: 'Veggie Bean Burger', description: 'Plant-based bean patty with fresh veggies and tangy sauce', category: catMap.burgers, basePrice: 149, image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&h=400&fit=crop', imageEmoji: '🥗', isVeg: true, calories: 380 },
    { name: 'Crispy Chicken Burger', description: 'Golden crispy fried chicken fillet with special BK sauce', category: catMap.chicken, basePrice: 199, image: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=600&h=400&fit=crop', imageEmoji: '🍗', isVeg: false, isBestseller: true, calories: 540 },
    { name: 'Spicy Crispy Chicken', description: 'Extra hot crispy chicken with sriracha mayo', category: catMap.chicken, basePrice: 219, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&h=400&fit=crop', imageEmoji: '🍗', isVeg: false, isSpicy: true, calories: 590 },
    { name: 'Chicken Strips (5pc)', description: 'Crispy chicken tenders with your choice of dipping sauce', category: catMap.chicken, basePrice: 229, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&h=400&fit=crop', imageEmoji: '🍗', isVeg: false, calories: 450 },
    { name: 'Whopper Meal', description: 'Whopper + Large BK Hi-Fries + Large Soft Drink', category: catMap.meals, basePrice: 399, image: 'https://tse2.mm.bing.net/th/id/OIP.mpDoSwLP-VQx-fG3DWljMgHaD4?w=1200&h=628&rs=1&pid=ImgDetMain&o=7&rm=3', imageEmoji: '🍱', isVeg: false, isBestseller: true },
    { name: 'Crispy Chicken Meal', description: 'Crispy Chicken Burger + Fries + Drink', category: catMap.meals, basePrice: 349, image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=600&h=400&fit=crop', imageEmoji: '🍱', isVeg: false },
    { name: 'Paneer Meal', description: 'Spicy Paneer Burger + Medium Fries + Soft Drink', category: catMap.meals, basePrice: 329, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db76?w=600&h=400&fit=crop', imageEmoji: '🍱', isVeg: true },
    { name: 'BK Hi-Fries (Regular)', description: 'Crispy golden salted fries', category: catMap.sides, basePrice: 79, image: 'https://cdn.prod.website-files.com/631b4b4e277091ef01450237/636becf2e2fd494baea6d11a_Fries%201.png', imageEmoji: '🍟', isVeg: true, isBestseller: true, calories: 320 },
    { name: 'BK Hi-Fries (Large)', description: 'Large crispy golden salted fries', category: catMap.sides, basePrice: 99, image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=400&fit=crop', imageEmoji: '🍟', isVeg: true, calories: 480 },
    { name: 'Peri Peri Fries', description: 'Crispy fries tossed in peri peri spice', category: catMap.sides, basePrice: 109, image: 'https://images.unsplash.com/photo-1518013431102-124b8156143f?w=600&h=400&fit=crop', imageEmoji: '🍟', isVeg: true, isSpicy: true },
    { name: 'Onion Rings', description: 'Beer-battered crispy onion rings', category: catMap.sides, basePrice: 89, image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=600&h=400&fit=crop', imageEmoji: '🧅', isVeg: true, calories: 290 },
    { name: 'Chocolate Thick Shake', description: 'Rich creamy chocolate milkshake', category: catMap.beverages, basePrice: 149, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=400&fit=crop', imageEmoji: '🥤', isVeg: true, isBestseller: true },
    { name: 'Vanilla Thick Shake', description: 'Classic creamy vanilla milkshake', category: catMap.beverages, basePrice: 149, image: 'https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=600&h=400&fit=crop', imageEmoji: '🥛', isVeg: true },
    { name: 'Strawberry Shake', description: 'Fresh strawberry blended milkshake', category: catMap.beverages, basePrice: 149, image: 'https://images.unsplash.com/photo-1553177595-4de2bb0842b9?w=600&h=400&fit=crop', imageEmoji: '🍓', isVeg: true },
    { name: 'Mango Smoothie', description: 'Real mango blended with cream', category: catMap.beverages, basePrice: 129, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=400&fit=crop', imageEmoji: '🥭', isVeg: true },
    { name: 'Cold Coffee', description: 'Refreshing cold brew iced coffee', category: catMap.beverages, basePrice: 119, image: 'https://images.unsplash.com/photo-1517701604599-bb24b316874c?w=600&h=400&fit=crop', imageEmoji: '☕', isVeg: true },
    { name: 'Pepsi / Coke', description: 'Chilled carbonated soft drink', category: catMap.beverages, basePrice: 59, image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=600&h=400&fit=crop', imageEmoji: '🥤', isVeg: true },
    { name: 'Soft Serve Cone', description: 'Classic vanilla soft serve ice cream', category: catMap.desserts, basePrice: 39, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=600&h=400&fit=crop', imageEmoji: '🍦', isVeg: true },
    { name: 'Chocolate Sundae', description: 'Vanilla soft serve with hot fudge', category: catMap.desserts, basePrice: 79, image: 'https://tse4.mm.bing.net/th/id/OIP.gAuGq2BDyrudMU_flIl8FgHaLH?rs=1&pid=ImgDetMain&o=7&rm=3', imageEmoji: '🍨', isVeg: true, isBestseller: true },
    { name: 'Strawberry Sundae', description: 'Vanilla soft serve with strawberry sauce', category: catMap.desserts, basePrice: 79, image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=600&h=400&fit=crop', imageEmoji: '🍨', isVeg: true },
    { name: 'Warm Apple Pie', description: 'Flaky crust with warm cinnamon apple filling', category: catMap.desserts, basePrice: 69, image: 'https://images.unsplash.com/photo-1571506191039-245593129ba0?w=600&h=400&fit=crop', imageEmoji: '🥧', isVeg: true },
  ];

  await Product.insertMany(products);
  console.log('Products seeded');

  // Insert tables (with QR tokens)
  const { v4: uuidv4 } = require('uuid');
  await Table.insertMany(tables.map(t => ({ ...t, qrToken: uuidv4() })));
  console.log('Tables seeded');

  // Insert offers
  await Offer.insertMany(offers);
  console.log('Offers seeded');

  // Create admin user
  const existing = await User.findOne({ email: 'admin@bkcrown.com' });
  if (!existing) {
    await User.create({ name: 'Admin User', email: 'admin@bkcrown.com', phone: '9999999999', password: 'admin123', role: 'admin' });
    console.log('Admin user created: admin@bkcrown.com / admin123');
  }

  await User.findOne({ email: 'staff@bkcrown.com' }) ||
    await User.create({ name: 'Staff Member', email: 'staff@bkcrown.com', phone: '8888888888', password: 'staff123', role: 'staff' });
  console.log('Staff user: staff@bkcrown.com / staff123');

  console.log('\n✅ Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
