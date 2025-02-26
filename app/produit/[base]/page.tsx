"use client";

import { useParams } from "next/navigation";
import { useState, useMemo, useCallback, memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import R5 from "../../../public/chariot.jpg";

// Types
type Material = "AIO" | "TRILOGIQ" | "INDEVA";

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
const MATERIALS: readonly Material[] = ["AIO", "TRILOGIQ", "INDEVA"] as const;
const BASE_PRICE = 100;
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 100;

const ACCESSORY_CATEGORIES: AccessoryCategories = {
  support: {
    name: "Supports",
    items: [
      { id: 1, name: "Support Simple", price: 50, image: "/support1.jpg" },
      { id: 2, name: "Support Double", price: 75, image: "/support2.jpg" },
      { id: 3, name: "Support 3", price: 75, image: "/support3.jpg" },
      { id: 4, name: "Support 4", price: 75, image: "/support4.jpg" },
      { id: 5, name: "Support 5", price: 75, image: "/support5.jpg" },
      { id: 6, name: "Support 6", price: 75, image: "/support6.jpg" },
    ],
  },
  fixation: {
    name: "Fixations",
    items: [
      { id: 7, name: "Fixation Standard", price: 30, image: "/fixation1.jpg" },
      { id: 8, name: "Fixation Premium", price: 45, image: "/fixation2.jpg" },
    ],
  },
  eclairage: {
    name: "Éclairage",
    items: [
      { id: 9, name: "LED Standard", price: 60, image: "/led1.jpg" },
      { id: 10, name: "LED Premium", price: 90, image: "/led2.jpg" },
    ],
  },
} as const;

// Components
const AccessoryCard = memo(
  ({ accessory, isSelected, onClick }: AccessoryCardProps) => (
    <div
      className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 
      ${isSelected ? "border-yellow-500 bg-yellow-50" : "border-gray-200 hover:border-yellow-300"}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === "Enter" && onClick()}
    >
      <div className="relative w-full h-32 mb-2">
        <Image
          src={R5}
          alt={accessory.name}
          fill
          className="object-cover rounded"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRg=="
        />
      </div>
      <h3 className="text-sm font-medium text-gray-800">{accessory.name}</h3>
      <p className="text-xs text-gray-600">
        {accessory.price.toLocaleString()}€
      </p>
    </div>
  ),
);

AccessoryCard.displayName = "AccessoryCard";

const OrderSummary = memo(
  ({
    quantity,
    selectedMaterial,
    selectedAccessories,
    totalPrice,
  }: OrderSummaryProps) => (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4 shadow-sm">
      <h3 className="text-md font-semibold mb-2 text-gray-800">
        Résumé de la commande
      </h3>
      <div className="text-sm text-gray-700 space-y-1">
        <p>
          <span className="font-medium">Base :</span>{" "}
          {BASE_PRICE.toLocaleString()}€ x {quantity}
        </p>
        <p>
          <span className="font-medium">Matériau :</span> {selectedMaterial}
        </p>
        {Object.entries(selectedAccessories).map(
          ([categoryKey, accessoryId]) => {
            const accessory = ACCESSORY_CATEGORIES[categoryKey]?.items.find(
              (item) => item.id === accessoryId,
            );
            return (
              accessory && (
                <p key={categoryKey}>
                  <span className="font-medium">{accessory.name} :</span>{" "}
                  {accessory.price.toLocaleString()}€
                </p>
              )
            );
          },
        )}
        <hr className="my-2" />
        <p className="text-lg font-bold">
          Total : {totalPrice.toLocaleString()}€
        </p>
      </div>
    </div>
  ),
);

OrderSummary.displayName = "OrderSummary";

const BasePage = () => {
  const { base } = useParams();
  const [selectedMaterial, setSelectedMaterial] = useState<Material>(
    MATERIALS[0],
  );
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [selectedAccessories, setSelectedAccessories] = useState<
    Record<string, number>
  >({});
  const [showNotification, setShowNotification] = useState(false);

  const totalPrice = useMemo(() => {
    const accessoriesTotal = Object.entries(selectedAccessories).reduce(
      (sum, [categoryKey, accessoryId]) => {
        const accessory = ACCESSORY_CATEGORIES[categoryKey]?.items.find(
          (item) => item.id === accessoryId,
        );
        return sum + (accessory?.price ?? 0);
      },
      0,
    );

    return BASE_PRICE * quantity + accessoriesTotal;
  }, [selectedAccessories, quantity]);

  const handleQuantityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(
        Math.max(MIN_QUANTITY, Number(e.target.value)),
        MAX_QUANTITY,
      );
      setQuantity(value);
    },
    [],
  );

  const toggleAccessory = useCallback(
    (categoryKey: string, accessoryId: number) => {
      setSelectedAccessories((prev) => ({
        ...prev,
        [categoryKey]:
          prev[categoryKey] === accessoryId ? undefined : accessoryId,
      }));
    },
    [],
  );

  const handleAddToCart = useCallback(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const newItem = {
      base,
      material: selectedMaterial,
      quantity,
      accessories: Object.entries(selectedAccessories).map(
        ([category, id]) => ({
          category,
          ...ACCESSORY_CATEGORIES[category].items.find((acc) => acc.id === id),
        }),
      ),
      price: BASE_PRICE,
      totalPrice,
    };
    cart.push(newItem);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    console.log("Ajouté au panier:", newItem);

    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }, [base, selectedMaterial, quantity, selectedAccessories, totalPrice]);

  if (!base) {
    return <div className="p-4 text-center">Base non trouvée</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* En-tête */}
      <div className="mb-6 border-b pb-3">
        <h1 className="text-2xl font-bold text-gray-800">{base}</h1>
        <p className="text-sm text-gray-500">
          Choisissez les options et ajoutez au panier.
        </p>
      </div>

      {/* SECTION PRINCIPALE EN 2 COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Colonne 1 : Image à hauteur fixe */}
        <div className="relative w-full h-64 lg:h-96 rounded overflow-hidden">
          <Image
            src={R5}
            alt={`Base ${base}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Colonne 2 : Contenu flexible (pas de scroll interne) */}
        <div className="flex flex-col space-y-4">
          {/* Ligne unique pour Matériau + Quantité */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            {/* Matériau */}
            <div className="w-full">
              <label
                htmlFor="material"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Matériau
              </label>
              <select
                id="material"
                value={selectedMaterial}
                onChange={(e) =>
                  setSelectedMaterial(e.target.value as Material)
                }
                className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none 
                  focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
              >
                {MATERIALS.map((material) => (
                  <option key={material} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantité */}
            <div className="w-full">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantité
              </label>
              <input
                id="quantity"
                type="number"
                min={MIN_QUANTITY}
                max={MAX_QUANTITY}
                value={quantity}
                onChange={handleQuantityChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded focus:outline-none 
                  focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-colors"
              />
            </div>
          </div>

          {/* Résumé de la commande */}
          <OrderSummary
            quantity={quantity}
            selectedMaterial={selectedMaterial}
            selectedAccessories={selectedAccessories}
            totalPrice={totalPrice}
          />

          {/* Bouton d'ajout au panier */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-500 text-white rounded-md px-4 py-2 font-semibold 
              shadow hover:bg-yellow-600 transition-colors duration-300"
          >
            Ajouter au panier
          </button>
        </div>
      </div>

      {/* SECTION ACCESSOIRES */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Accessoires
        </h2>
        {Object.entries(ACCESSORY_CATEGORIES).map(([key, category]) => (
          <div key={key} className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-3">
              {category.name}
            </h3>
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

      {/* NOTIFICATION D'AJOUT AU PANIER */}
      {showNotification && (
        <div
          className="
            fixed 
            bottom-4 
            left-1/2 
            transform 
            -translate-x-1/2 
            bg-green-600 
            text-white 
            px-6 
            py-3 
            rounded-lg 
            shadow-md 
            text-center 
            z-50 
            animate-fadeInOut
          "
        >
          Article ajouté au panier !
        </div>
      )}
    </div>
  );
};

export default BasePage;
