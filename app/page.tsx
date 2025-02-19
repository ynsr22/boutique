'use client';

import Link from 'next/link';
import React, { useState, useContext } from 'react';
import R5 from '../public/chariot.jpg';
import Image from 'next/image';
import MemoizedFilterComponent from './components/filtre';
import { SearchContext } from './components/search';

const items = [
  { base: 'Base 1', price: '80.00€', departments: ['Tôlerie'], materials: ['AIO'] },
  { base: 'Base 2', price: '120.00€', departments: ['Montage'], materials: ['TRILOGIQ'] },
  { base: 'Base 3', price: '110.00€', departments: ['Tôlerie'], materials: ['INDEVA'] },
  { base: 'Base 4', price: '130.00€', departments: ['Montage'], materials: ['AIO'] },
  { base: 'Base 5', price: '80.00€', departments: ['Tôlerie'], materials: ['TRILOGIQ'] },
  { base: 'Base 6', price: '120.00€', departments: ['Montage'], materials: ['INDEVA'] },
  { base: 'Base 7', price: '90.00€', departments: ['Tôlerie'], materials: ['AIO'] },
  { base: 'Base 8', price: '125.00€', departments: ['Montage'], materials: ['TRILOGIQ'] },
];

const Page = () => {
  const prices = items.map((item) => parseFloat(item.price.replace('€', '')));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const { searchQuery } = useContext(SearchContext);

  const filteredItems = items.filter((item) => {
    const itemPrice = parseFloat(item.price.replace('€', ''));
    const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    const matchesDepartment =
      selectedDepartments.length === 0 || selectedDepartments.some((dep) => item.departments.includes(dep));
    const matchesMaterial =
      selectedMaterials.length === 0 || selectedMaterials.some((mat) => item.materials.includes(mat));
    const matchesSearchQuery =
      searchQuery === '' || item.base.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPrice && matchesDepartment && matchesMaterial && matchesSearchQuery;
  });

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar des filtres */}
          <aside className="md:col-span-1 md:sticky md:top-8 h-fit">
            <MemoizedFilterComponent
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
              selectedMaterials={selectedMaterials}
              setSelectedMaterials={setSelectedMaterials}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </aside>

          {/* Grille des produits */}
          <section className="md:col-span-3">

            {filteredItems.length === 0 ? (
              <p className="text-center text-gray-600 mt-10">
                Aucun résultat trouvé.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                  <Link
                    key={index}
                    href={`/${item.base.replace(/\s+/g, '_').toLowerCase()}`}
                    className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col hover:shadow-lg transition-shadow duration-200"
                  >
                    <div className="flex-1 flex items-center justify-center mb-4">
                      <Image
                        src={R5.src}
                        alt={`Image de ${item.base}`}
                        className="max-h-48 object-contain"
                        width={300}
                        height={300}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.base}
                      </h3>
                      <span className="text-sm font-medium text-gray-600">
                        {item.price}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Page;
