'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';

const materials = ['AIO', 'TRILOGIQ', 'INDEVA']; // Replace with dynamic data if needed
const accessories = Array(8).fill('Accessory'); // Mock accessory data

const BasePage = () => {
  const { base } = useParams(); // Get the base parameter from the URL
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Calculate total price dynamically (you can adjust the logic as needed)
  const basePrice = 100; // Example base price
  const totalPrice = basePrice * quantity;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Base {base}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 border rounded-lg w-full h-96 flex justify-center items-center">
            <img
              src="/placeholder.jpg"
              alt={`Image of ${base}`}
              className="object-contain max-h-full max-w-full"
            />
          </div>
        </div>

        {/* Information Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Description</h2>
            <p className="text-gray-600">Description de la base, du nombre max d’accessoires, etc.</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Matériaux :</label>
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="" disabled>
                Sélectionnez un matériau
              </option>
              {materials.map((material, index) => (
                <option key={index} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Quantité :</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>

          <div className="mb-4">
            <span className="block text-gray-700 font-medium mb-2">Prix total :</span>
            <span className="text-xl font-bold">{totalPrice.toFixed(2)} €</span>
          </div>

          <button className="w-full bg-yellow-500 text-white rounded-lg px-4 py-2 hover:bg-yellow-600">
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* Accessories Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Accessoires :</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {accessories.map((accessory, index) => (
            <div
              key={index}
              className="aspect-square bg-gray-100 border rounded-lg flex justify-center items-center"
            >
              <span className="text-gray-500">{accessory}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BasePage;
