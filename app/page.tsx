"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MemoizedFilterComponent from "./components/filtre";
import { SearchContext } from "./components/search";
import { Suspense } from "react";
import { SkeletonCard } from "./components/SkeletonCard";
import { ProductCard } from "./components/ProductCard";

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchQuery } = useContext(SearchContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  // États pour les filtres
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [initialPriceRange, setInitialPriceRange] = useState<[number, number]>([
    0, 0,
  ]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedMaterials, setSelectedMaterials] = useState([]);

  // État pour le tri
  const [sortOption, setSortOption] = useState("price-asc");

  // Récupérer la valeur de tri depuis l'URL au chargement
  useEffect(() => {
    const sortFromUrl = searchParams.get("sort");
    if (sortFromUrl) {
      setSortOption(sortFromUrl);
    }
  }, [searchParams]);

  // Mettre à jour l'URL quand le tri change
  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);

    // Créer un nouvel objet URLSearchParams à partir des params actuels
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", newSortOption);

    // Mettre à jour l'URL sans rechargement de page
    router.push(`?${params.toString()}`);
  };

  // Récupération des données avec gestion d'erreur améliorée
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        // URL de l'API avec variables d'environnement
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        const response = await fetch(apiUrl, { signal });
        if (!response.ok) {
          throw new Error(`Erreur serveur: ${response.status}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }

        // Normalisation des données
        const normalizedData = data.map((item) => ({
          ...item,
          prix:
            typeof item.prix === "string" ? parseFloat(item.prix) : item.prix,
          id: item.id || `product-${Math.random().toString(36).substr(2, 9)}`,
        }));

        setItems(normalizedData);

        // Calcul des prix min/max
        if (normalizedData.length > 0) {
          const prices = normalizedData.map((item) => item.prix);
          const minPrice = Math.floor(Math.min(...prices));
          const maxPrice = Math.ceil(Math.max(...prices));

          setInitialPriceRange([minPrice, maxPrice]);

          // Vérifier si des filtres sont dans l'URL
          const minFromUrl = searchParams.get("min");
          const maxFromUrl = searchParams.get("max");

          setPriceRange([
            minFromUrl ? parseInt(minFromUrl) : minPrice,
            maxFromUrl ? parseInt(maxFromUrl) : maxPrice,
          ]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Erreur API:", err);
          setError(
            "Impossible de charger les produits. Veuillez réessayer plus tard.",
          );
        }
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();

    // Nettoyage de la requête en cas de démontage du composant
    return () => controller.abort();
  }, [searchParams]);

  // Filtrage et tri optimisés avec useMemo
  const filteredAndSortedItems = useMemo(() => {
    // Filtrage des éléments
    const filtered = items.filter((item) => {
      // Filtre par prix
      const matchesPrice =
        item.prix >= priceRange[0] && item.prix <= priceRange[1];

      // Filtre par recherche
      const matchesSearch =
        !searchQuery ||
        item.nom.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtre par département (si implémenté)
      const matchesDepartment =
        selectedDepartments.length === 0 ||
        (item.departement && selectedDepartments.includes(item.departement));

      // Filtre par matériau (si implémenté)
      const matchesMaterial =
        selectedMaterials.length === 0 ||
        (item.materiau && selectedMaterials.includes(item.materiau));

      return (
        matchesPrice && matchesSearch && matchesDepartment && matchesMaterial
      );
    });

    // Tri des éléments filtrés
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.prix - b.prix;
        case "price-desc":
          return b.prix - a.prix;
        case "name-asc":
          return a.nom.localeCompare(b.nom);
        case "name-desc":
          return b.nom.localeCompare(a.nom);
        default:
          return 0;
      }
    });
  }, [
    items,
    priceRange,
    searchQuery,
    selectedDepartments,
    selectedMaterials,
    sortOption,
  ]);

  // Pagination (à implémenter complètement)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);

  // Obtenir les éléments pour la page actuelle
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedItems, currentPage]);

  // Changer de page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Génération des numéros de page
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Génération de skeletons avec une quantité dynamique
  const skeletonCount = Math.min(itemsPerPage, items.length || itemsPerPage);
  const skeletonCards = Array(skeletonCount)
    .fill(0)
    .map((_, index) => <SkeletonCard key={`skeleton-${index}`} />);

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar des filtres */}
          <aside className="md:col-span-1">
            <div className="sticky top-8">
              <Suspense
                fallback={
                  <div className="h-40 bg-gray-100 animate-pulse rounded" />
                }
              >
                <MemoizedFilterComponent
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  minPrice={initialPriceRange[0]}
                  maxPrice={initialPriceRange[1]}
                  selectedDepartments={selectedDepartments}
                  setSelectedDepartments={setSelectedDepartments}
                  selectedMaterials={selectedMaterials}
                  setSelectedMaterials={setSelectedMaterials}
                />
              </Suspense>

              <div className="flex items-center text-sm mt-4">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2">
                  Trier par:
                </label>
                <select
                  id="sort"
                  className="text-sm border border-gray-300 rounded p-2 bg-white"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="name-asc">Nom A-Z</option>
                  <option value="name-desc">Nom Z-A</option>
                </select>
              </div>

              {filteredAndSortedItems.length > 0 && !loading && (
                <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-100">
                  <p className="text-sm text-yellow-700">
                    {filteredAndSortedItems.length}{" "}
                    {filteredAndSortedItems.length === 1
                      ? "produit trouvé"
                      : "produits trouvés"}
                  </p>
                </div>
              )}

              {/* Bouton pour réinitialiser tous les filtres */}
              {(priceRange[0] !== initialPriceRange[0] ||
                priceRange[1] !== initialPriceRange[1] ||
                selectedDepartments.length > 0 ||
                selectedMaterials.length > 0 ||
                searchQuery) && (
                <button
                  onClick={() => {
                    setPriceRange(initialPriceRange);
                    setSelectedDepartments([]);
                    setSelectedMaterials([]);
                    // Réinitialiser l'URL
                    router.push("/");
                  }}
                  className="w-full mt-4 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Réinitialiser tous les filtres
                </button>
              )}
            </div>
          </aside>

          {/* Grille des produits */}
          <section className="md:col-span-3">
            {/* Gestion des erreurs */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
                <button
                  className="ml-auto bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
                  onClick={() => window.location.reload()}
                >
                  Réessayer
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletonCards}
              </div>
            ) : filteredAndSortedItems.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center border border-gray-200 shadow-sm">
                <svg
                  className="w-16 h-16 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-4">
                  Essayez de modifier vos filtres ou votre recherche.
                </p>
                <button
                  onClick={() => {
                    setPriceRange(initialPriceRange);
                    setSelectedDepartments([]);
                    setSelectedMaterials([]);
                    router.push("/");
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mb-2"
                >
                  Réinitialiser les filtres
                </button>
                <p className="text-gray-600 mb-4">
                  Contacter Yanis pour des moyens spécifiques.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentItems.map((item) => (
                  <ProductCard key={item.id || item.nom} item={item} />
                ))}
              </div>
            )}

            {/* Pagination (fonctionnelle) */}
            {!loading && filteredAndSortedItems.length > itemsPerPage && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Précédent
                  </button>

                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`px-3 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                        currentPage === number
                          ? "bg-blue-50 text-blue-600"
                          : "bg-white text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    Suivant
                  </button>
                </nav>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
