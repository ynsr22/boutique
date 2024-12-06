"use client";

import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation'; // Utilitaire pour afficher une page 404

// Simulez vos items disponibles
const items = [
  { base: 'base_1' },
  { base: 'base_2' },
  { base: 'base_3' },
  { base: 'base_4' },
  { base: 'base_5' },
  { base: 'base_6' },
  { base: 'base_7' },
  { base: 'base_8' },
];

const BasePage = () => {
  const params = useParams();
  const base = params.base; // Paramètre dynamique de l'URL

  // Vérifiez si la base existe
  const isValidBase = items.some((item) => item.base === base);

  if (!isValidBase) {
    notFound(); // Redirige automatiquement vers une page 404 si la base est invalide
  }

  return (
    <div>
      <h1>Détails pour {base}</h1>
      <p>Voici les informations spécifiques à la base : {base}.</p>
    </div>
  );
};

export default BasePage;
