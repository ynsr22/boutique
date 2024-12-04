// page.tsx
import FilterComponent from './components/filtre';
import R5 from '../public/chariot.jpg';

// FAKE DATA (toDo: replace with real data in db)
const items = [
  { base: "Base 1", price: "80.00€" },
  { base: "Base 2", price: "120.00€" },
  { base: "Base 3", price: "110.00€" },
  { base: "Base 4", price: "130.00€" },
  { base: "Base 5", price: "80.00€" },
  { base: "Base 6", price: "120.00€" },
  { base: "Base 7", price: "90.00€" },
  { base: "Base 8", price: "125.00€" },
];

const Page = () => (
  <div className="grid grid-cols-4 gap-4 items-start">
    {/* Colonne de filtres */}
    <div className="col-span-4 sm:col-span-1 sm:sticky static top-4 h-fit">
      <FilterComponent />
    </div>

    {/* Grille des cartes */}
    <div className="col-span-4 sm:col-span-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="aspect-square bg-white rounded-lg shadow-md border p-4 flex flex-col"
          >
            <div className="flex-1 flex items-center justify-center">
              {/* Placeholder image - remplacez src avec votre image réelle */}
              <img
                src={R5.src}
                alt={`Image ${item.base}`}
                className="max-h-full max-w-full object-contain"
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

export default Page;
