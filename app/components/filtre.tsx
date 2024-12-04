'use client';

import React, { useState, useCallback, memo } from "react";
import { Slider } from "@mui/material";

const FILTER_CONFIG = {
    departments: ['Tôlerie', 'Montage'],
    materials: ['AIO', 'TRILOGIQ', 'INDEVA']
} as const;

// Styles constants pour éviter les re-renders
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

// Composant séparé pour la section de filtre
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
        {isOpen && children}
    </section>
));

const FilterComponent: React.FC = () => {
    const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
    const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
    const [openSections, setOpenSections] = useState({
        department: false,
        material: false,
        price: false
    });

    const toggleSection = useCallback((section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    }, []);

    const toggleSelection = useCallback((currentSelections: string[], itemToToggle: string): string[] => 
        currentSelections.includes(itemToToggle)
            ? currentSelections.filter(item => item !== itemToToggle)
            : [...currentSelections, itemToToggle],
    []);

    const handleDepartmentChange = useCallback((department: string) => {
        setSelectedDepartments(prev => toggleSelection(prev, department));
    }, [toggleSelection]);

    const handleMaterialChange = useCallback((material: string) => {
        setSelectedMaterials(prev => toggleSelection(prev, material));
    }, [toggleSelection]);

    const handleSliderChange = useCallback((event: Event, newValue: number | number[]) => {
        setPriceRange(newValue as [number, number]);
    }, []);

    return (
        <div className="w-full p-4 border rounded-lg shadow-md bg-white">
            <FilterSection 
                title="Département"
                isOpen={openSections.department}
                onToggle={() => toggleSection('department')}
            >
                <div className="p-2">
                    {FILTER_CONFIG.departments.map(dept => (
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
                </div>
            </FilterSection>

            <FilterSection 
                title="Matériaux"
                isOpen={openSections.material}
                onToggle={() => toggleSection('material')}
            >
                <div className="p-2">
                    {FILTER_CONFIG.materials.map(material => (
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
                </div>
            </FilterSection>

            <FilterSection 
                title="Prix"
                isOpen={openSections.price}
                onToggle={() => toggleSection('price')}
            >
                <div className="p-4">
                    <Slider
                        value={priceRange}
                        onChange={handleSliderChange}
                        valueLabelDisplay="auto"
                        min={0}
                        max={1000}
                        step={10}
                        disableSwap
                        marks={[
                            { value: 0, label: "0" },
                            { value: 500, label: "500" },
                            { value: 1000, label: "1000" },
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
                </div>
            </FilterSection>
        </div>
    );
};

export default memo(FilterComponent);
