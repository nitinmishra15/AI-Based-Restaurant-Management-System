import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ activeCategory, searchQuery, onAddToOrder }) {
  const products = [
    {
      id: 'masala-dosa',
      name: 'Masala Dosa',
      category: 'parathas-rolls',
      rating: 4.8,
      description: 'Crispy rice crepe filled with spiced potato mash, served with coconut chutney and sambar.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'vada-pav-duo',
      name: 'Vada Pav Duo',
      category: 'street-bites',
      rating: 4.6,
      description: 'The iconic Mumbai street food burger with spicy garlic chutney and a fried green chili.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?auto=format&fit=crop&q=80&w=600',
    },
    {
      id: 'mango-lassi',
      name: 'Mango Lassi',
      category: 'chai-coffee',
      rating: 4.9,
      description: 'Creamy yogurt drink with fresh Alphonso mangoes, garnished with cardamom and saffron.',
      price: 150,
      image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600',
    },
  ];

  // Filter products based on search query and category
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = !activeCategory || prod.category === activeCategory;
    const matchesSearch = !searchQuery || prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-6 lg:px-8 py-4">
      <div className="max-w-[1440px] mx-auto">
        {/* Products Flex List */}
        <div className="flex flex-wrap gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAdd={onAddToOrder} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
