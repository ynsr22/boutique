'use client';

import React, { useCallback, memo } from "react";
import { Slider } from "@mui/material";

const FILTER_CONFIG = {
  departments: ['Tôlerie', 'Montage'],
  materials: ['AIO', 'TRILOGIQ', 'INDEVA'],
};

const sliderStyles = {
  color: 'black',
  '& .MuiSlider-thumb': {
    backgroundColor: 'black',
    border: '2px solid white',
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#ccc',
  },
  '& .MuiSlider-mark': {
    color: 'black',
  },
  '& .MuiSlider-markLabel': {
    fontSize: '0.75rem',
  },
};

const FilterSection = memo(({ 
  title, 
  isOpen, 
  onToggle, 
  children 
}: { 
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <section>
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center py-2 px-3 border-b text-left text-lg font-bold"
    >
      {title}
      <span>{isOpen ? "−" : "+"}</span>
    </button>
    {isOpen && <div className="p-2">{children}</div>}
  </section>
));

FilterSection.displayName = "FilterSection";

const FilterComponent: React.FC<{
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  selectedDepartments: string[];
  setSelectedDepartments: React.Dispatch<React.SetStateAction<string[]>>;
  selectedMaterials: string[];
  setSelectedMaterials: React.Dispatch<React.SetStateAction<string[]>>;
  minPrice: number;
  maxPrice: number;
}> = ({
  priceRange,
  setPriceRange,
  selectedDepartments,
  setSelectedDepartments,
  selectedMaterials,
  setSelectedMaterials,
  minPrice,
  maxPrice,
}) => {
  const [openSections, setOpenSections] = React.useState({
    department: false,
    material: false,
    price: false,
  });

  const toggleSection = useCallback((section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const toggleSelection = useCallback((currentSelections: string[], itemToToggle: string): string[] =>
    currentSelections.includes(itemToToggle)
      ? currentSelections.filter((item) => item !== itemToToggle)
      : [...currentSelections, itemToToggle],
  []);

  const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as [number, number]);
  }, [setPriceRange]);

  const handleDepartmentChange = useCallback((department: string) => {
    setSelectedDepartments((prev) => toggleSelection(prev, department));
  }, [toggleSelection, setSelectedDepartments]);

  const handleMaterialChange = useCallback((material: string) => {
    setSelectedMaterials((prev) => toggleSelection(prev, material));
  }, [toggleSelection, setSelectedMaterials]);

  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white">
      <FilterSection
        title="Départements"
        isOpen={openSections.department}
        onToggle={() => toggleSection('department')}
      >
        {FILTER_CONFIG.departments.map((dept) => (
          <label key={dept} className="block">
            <input
              type="checkbox"
              checked={selectedDepartments.includes(dept)}
              onChange={() => handleDepartmentChange(dept)}
              className="mr-2"
            />
            {dept}
          </label>
        ))}
      </FilterSection>

      <FilterSection
        title="Matériaux"
        isOpen={openSections.material}
        onToggle={() => toggleSection('material')}
      >
        {FILTER_CONFIG.materials.map((material) => (
          <label key={material} className="block">
            <input
              type="checkbox"
              checked={selectedMaterials.includes(material)}
              onChange={() => handleMaterialChange(material)}
              className="mr-2"
            />
            {material}
          </label>
        ))}
      </FilterSection>

      <FilterSection
        title="Prix"
        isOpen={openSections.price}
        onToggle={() => toggleSection('price')}
      >
        <Slider
          value={priceRange}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          min={minPrice}
          max={maxPrice}
          step={10}
          marks={[
            { value: minPrice, label: `${minPrice}€` },
            { value: (minPrice + maxPrice) / 2, label: `${Math.round((minPrice + maxPrice) / 2)}€` },
            { value: maxPrice, label: `${maxPrice}€` },
          ]}
          sx={sliderStyles}
        />
        <div className="flex justify-between items-center text-sm mt-2">
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {priceRange[0]}€
          </span>
          <span className="font-medium">−</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full">
            {priceRange[1]}€
          </span>
        </div>
      </FilterSection>
    </div>
  );
};

const MemoizedFilterComponent = memo(FilterComponent);

// Ajout explicite du displayName après le memo
MemoizedFilterComponent.displayName = "FilterComponent";

export default MemoizedFilterComponent;
