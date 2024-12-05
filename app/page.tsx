'use client';

import React, { useState } from 'react';
import R5 from '../public/chariot.jpg';
import Image from 'next/image';
import MemoizedFilterComponent from './components/filtre';

// FAKE DATA (toDo: replace with real data in db)
const items = [
  { base: "Base 1", price: "80.00€", departments: ['Tôlerie'], materials: ['AIO'] },
  { base: "Base 2", price: "120.00€", departments: ['Montage'], materials: ['TRILOGIQ'] },
  { base: "Base 3", price: "110.00€", departments: ['Tôlerie'], materials: ['INDEVA'] },
  { base: "Base 4", price: "130.00€", departments: ['Montage'], materials: ['AIO'] },
  { base: "Base 5", price: "80.00€", departments: ['Tôlerie'], materials: ['TRILOGIQ'] },
  { base: "Base 6", price: "120.00€", departments: ['Montage'], materials: ['INDEVA'] },
  { base: "Base 7", price: "90.00€", departments: ['Tôlerie'], materials: ['AIO'] },
  { base: "Base 8", price: "125.00€", departments: ['Montage'], materials: ['TRILOGIQ'] },
];

const Page = () => {
  // Calculer les prix minimum et maximum
  const prices = items.map((item) => parseFloat(item.price.replace('€', '')));
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  // Filtrage des items en fonction des filtres actifs
  const filteredItems = items.filter((item) => {
    const itemPrice = parseFloat(item.price.replace('€', ''));
    const matchesPrice = itemPrice >= priceRange[0] && itemPrice <= priceRange[1];
    const matchesDepartment =
      selectedDepartments.length === 0 || selectedDepartments.some((dep) => item.departments.includes(dep));
    const matchesMaterial =
      selectedMaterials.length === 0 || selectedMaterials.some((mat) => item.materials.includes(mat));
    return matchesPrice && matchesDepartment && matchesMaterial;
  });

  return (
    <div className="grid grid-cols-4 gap-4 items-start">
      {/* Colonne de filtres */}
      <div className="col-span-4 sm:col-span-1 sm:sticky static top-4 h-fit">
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
      </div>

      {/* Grille des cartes */}
      <div className="col-span-4 sm:col-span-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item, index) => (
            <div
              key={index}
              className="aspect-square bg-white rounded-lg shadow-md border p-4 flex flex-col"
            >
              <div className="flex-1 flex items-center justify-center">
              <Image
                  src={R5.src}
                  alt={`Image ${item.base}`}
                  className="max-h-full max-w-full object-contain"
                  width={500} // ou la largeur réelle
                  height={500} // ou la hauteur réelle
                />
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-gray-800 font-medium">{item.base}</span>
                <span className="text-gray-600">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
