'use client';

{/* toDo: ajouter taille image fixe*/}

import { useParams } from 'next/navigation';
import { useState, useMemo, useCallback, memo } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/navigation';
import R5 from '../../public/chariot.jpg';

// Types
type Material = 'AIO' | 'TRILOGIQ' | 'INDEVA';

interface Accessory {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly image: string;
}

interface AccessoryCategory {
  readonly name: string;
  readonly items: readonly Accessory[];
}

interface AccessoryCategories {
  readonly [key: string]: AccessoryCategory;
}

interface OrderSummaryProps {
  readonly quantity: number;
  readonly selectedMaterial: Material;
  readonly selectedAccessories: Record<string, number>;
  readonly totalPrice: number;
}

interface AccessoryCardProps {
  readonly accessory: Accessory;
  readonly isSelected: boolean;
  readonly onClick: () => void;
}

// Constants
const MATERIALS: readonly Material[] = ['AIO', 'TRILOGIQ', 'INDEVA'] as const;
const BASE_PRICE = 100;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;

const ACCESSORY_CATEGORIES: AccessoryCategories = {
  support: {
    name: 'Supports',
    items: [
      { id: 1, name: 'Support Simple', price: 50, image: '/support1.jpg' },
      { id: 2, name: 'Support Double', price: 75, image: '/support2.jpg' },
      { id: 3, name: 'Support 3', price: 75, image: '/support3.jpg' },
      { id: 4, name: 'Support 4', price: 75, image: '/support4.jpg' },
      { id: 5, name: 'Support 5', price: 75, image: '/support5.jpg' },
      { id: 6, name: 'Support 6', price: 75, image: '/support6.jpg' },
    ],
  },
  fixation: {
    name: 'Fixations',
    items: [
      { id: 7, name: 'Fixation Standard', price: 30, image: '/fixation1.jpg' },
      { id: 8, name: 'Fixation Premium', price: 45, image: '/fixation2.jpg' },
    ],
  },
  eclairage: {
    name: 'Éclairage',
    items: [
      { id: 9, name: 'LED Standard', price: 60, image: '/led1.jpg' },
      { id: 10, name: 'LED Premium', price: 90, image: '/led2.jpg' },
    ],
  },
} as const;

// Components
const AccessoryCard = memo(({ accessory, isSelected, onClick }: AccessoryCardProps) => (
  <div
    className={`p-2 border rounded cursor-pointer transition-colors ${
      isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300'
    }`}
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === 'Enter' && onClick()}
  >
    <Image
      src={R5}
      alt={accessory.name}
      className="w-full h-32 object-cover mb-2 rounded"
      loading="lazy"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg=="
    />
    <h3 className="text-sm font-medium">{accessory.name}</h3>
    <p className="text-xs text-gray-600">{accessory.price.toLocaleString()}€</p>
  </div>
));

AccessoryCard.displayName = 'AccessoryCard';

const OrderSummary = memo(({ quantity, selectedMaterial, selectedAccessories, totalPrice }: OrderSummaryProps) => (
  <div className="bg-gray-50 p-2 rounded">
    <h3 className="text-sm font-semibold mb-1">Résumé de la commande</h3>
    <div className="text-xs">
      <p>Base: {BASE_PRICE.toLocaleString()}€ x {quantity}</p>
      <p>Matériau: {selectedMaterial}</p>
      {Object.entries(selectedAccessories).map(([categoryKey, accessoryId]) => {
        const accessory = ACCESSORY_CATEGORIES[categoryKey]?.items.find(
          (item) => item.id === accessoryId
        );
        return accessory && (
          <p key={categoryKey}>
            {accessory.name}: {accessory.price.toLocaleString()}€
          </p>
        );
      })}
      <div className="border-t pt-1 mt-1" />
      <p className="text-base font-bold">Total: {totalPrice.toLocaleString()}€</p>
    </div>
  </div>
));

OrderSummary.displayName = 'OrderSummary';

const BasePage = () => {
  const { base } = useParams();
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(MATERIALS[0]);
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [selectedAccessories, setSelectedAccessories] = useState<Record<string, number>>({});

  const totalPrice = useMemo(() => {
    const accessoriesTotal = Object.entries(selectedAccessories).reduce(
      (sum, [categoryKey, accessoryId]) => {
        const accessory = ACCESSORY_CATEGORIES[categoryKey]?.items.find(
          (item) => item.id === accessoryId
        );
        return sum + (accessory?.price ?? 0);
      },
      0
    );
    return BASE_PRICE * quantity + accessoriesTotal;
  }, [selectedAccessories, quantity]);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(MIN_QUANTITY, Number(e.target.value)), MAX_QUANTITY);
    setQuantity(value);
  }, []);

  const toggleAccessory = useCallback((categoryKey: string, accessoryId: number) => {
    setSelectedAccessories((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === accessoryId ? undefined : accessoryId,
    }));
  }, []);

  const handleAddToCart = useCallback(() => {
    // TODO: Implement cart functionality
    console.log('Adding to cart:', {
      base,
      material: selectedMaterial,
      quantity,
      accessories: selectedAccessories,
      totalPrice,
    });
  }, [base, selectedMaterial, quantity, selectedAccessories, totalPrice]);

  if (!base) return <div>Base non trouvée</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-xl font-bold mb-4 text-gray-800">Base {base}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Image
          src={R5}
          alt={`Base ${base}`}
          className="w-full h-auto rounded"
          priority
        />

        <div className="space-y-3">
          <div>
            <label htmlFor="material" className="text-sm text-gray-700">Matériau:</label>
            <select
              id="material"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value as Material)}
              className="mt-1 block w-full p-1 border border-gray-300 rounded"
            >
              {MATERIALS.map((material) => (
                <option key={material} value={material}>{material}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="quantity" className="text-sm text-gray-700">Quantité:</label>
            <input
              id="quantity"
              type="number"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={handleQuantityChange}
              className="mt-1 block w-full p-1 border border-gray-300 rounded"
            />
          </div>

          <OrderSummary
            quantity={quantity}
            selectedMaterial={selectedMaterial}
            selectedAccessories={selectedAccessories}
            totalPrice={totalPrice}
          />

          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-500 text-white rounded px-3 py-1 hover:bg-yellow-600 transition-colors"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Accessoires</h2>
        {Object.entries(ACCESSORY_CATEGORIES).map(([key, category]) => (
          <div key={key} className="mb-4">
            <h3 className="text-md font-medium mb-2">{category.name}</h3>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={20}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              loop={true}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
            >
              {category.items.map((accessory) => (
                <SwiperSlide key={accessory.id}>
                  <AccessoryCard
                    accessory={accessory}
                    isSelected={selectedAccessories[key] === accessory.id}
                    onClick={() => toggleAccessory(key, accessory.id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BasePage;