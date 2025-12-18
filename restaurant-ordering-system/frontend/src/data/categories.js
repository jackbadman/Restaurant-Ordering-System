const categories = [
  {
    id: 'doner',
    name: 'Doner',
    description: 'Freshly carved doner with salad and sauces.',
    image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=60',
    items: [
      { name: 'Chicken Doner', description: 'Marinated chicken doner, slow-cooked and freshly carved, served with salad.', price: 8.0 },
      { name: 'Lamb Doner', description: 'Traditional lamb doner, seasoned and slow-roasted, carved to order.', price: 9.0 },
      { name: 'Mixed Doner', description: 'Combination of chicken and lamb doner, freshly carved and served with salad.', price: 8.5 }
    ],
  },
  {
    id: 'shish',
    name: 'Shish',
    description: 'Chargrilled skewers with warm flatbread.',
    image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=60',
    items: [
      { name: 'Chicken Shish', description: 'Marinated chicken pieces grilled on skewers and served with salad.', price: 8.5 },
      { name: 'Lamb Shish', description: 'Tender lamb chunks marinated and chargrilled on skewers.', price: 9.5 },
      { name: 'Mixed Shish', description: 'Chicken and lamb shish skewers, chargrilled and served together.', price: 9.0 }
    ],
  },
  {
    id: 'kofte',
    name: 'Kofte',
    description: 'Spiced minced kebabs, charcoal grilled.',
    image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=60',
    items: [
      { name: 'Chicken Kofte', description: 'Lightly spiced minced chicken kofte, grilled over charcoal.', price: 9.0 },
      { name: 'Lamb Kofte', description: 'Seasoned minced lamb kofte, charcoal grilled for a smoky flavour.', price: 10.0 },
      { name: 'Mixed Kofte', description: 'Combination of chicken and lamb kofte, grilled and served fresh.', price: 9.5 },
    ],
  },
  {
    id: 'drinks',
    name: 'Drinks',
    description: 'Soft drinks and chilled refreshments.',
     image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=60',
    items: [
      { name: 'Ayran', description: 'Traditional Turkish yoghurt drink, lightly salted and served chilled.', price: 2.5 },
      { name: 'Fanta', description: 'Chilled orange-flavoured carbonated soft drink.', price: 2.0 },
      { name: 'Coke', description: 'Classic chilled cola soft drink.', price: 2.0 },
      { name: 'sparkling Water', description: 'Bottled sparkling mineral water, served chilled.', price: 1.5 }
    ],
  },
  {
    id: 'sides',
    name: 'Sides',
    description: 'Perfect add-ons to your main.',
    image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=60',
    items: [
      { name: 'Fries', description: 'Crispy golden fries, lightly salted.', price: 4.5 },
      { name: 'Salad', description: 'Fresh mixed salad with lettuce, tomato, and cucumber.', price: 3.5 },
      { name: 'Mixed Sauce Selection', description: 'Selection of house sauces including garlic mayo and chilli.', price: 1.5 }
    ],
  },
]

export default categories
