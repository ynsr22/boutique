import { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SearchContext } from '../components/search';
import logo from '../../public/logo_renault.png';
import bag from '../../public/bag.svg';
import logo_responsive from '../../public/logo_renault_responsive.png';

interface HeaderProps {
  cartCount: number;
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
    />
  </svg>
);

const SearchBar = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => (
  <form
    className="flex items-center w-64 h-9 bg-white rounded-full overflow-hidden border"
    onSubmit={(e) => e.preventDefault()}
  >
    <input
      type="search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Recherche..."
      className="flex-grow px-3 py-1 text-gray-700 bg-transparent focus:outline-none"
    />
    <button
      type="submit"
      className="flex items-center justify-center w-10 h-full bg-black text-white hover:bg-gray-800 transition-colors"
    >
      <SearchIcon />
    </button>
  </form>
);

const CartIcon = ({ count }: { count: number }) => (
  <Link href="/panier">
    <div className="relative flex-shrink-0 cursor-pointer hover:bg-white rounded-full p-2 transition-colors">
      <Image src={bag} alt="Shopping bag" width={30} height={30} />
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </div>
  </Link>
);

const Header = ({ cartCount }: HeaderProps) => {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  return (
    <header className="w-full h-14 bg-[#FFEA2F] flex items-center justify-between px-4 relative">
      <div className="flex items-center absolute left-4">
        <Link href="/" className="flex items-center">
          <Image
            src={logo}
            alt="Logo Renault"
            width={110}
            height={40}
            priority
            className="hidden sm:block"
          />
          <Image
            src={logo_responsive}
            alt="Logo Renault Responsive"
            width={35}
            height={35}
            priority
            className="block sm:hidden"
          />
        </Link>
      </div>
      <div className="flex justify-center items-center w-full">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      </div>
      <div className="flex items-center absolute right-4">
        <CartIcon count={cartCount} />
      </div>
    </header>
  );
};

const Navigation = () => (
  <nav className="w-full h-10 bg-black">
    <div className="max-w-6xl mx-auto h-full flex justify-center items-center">
      <div className="flex items-center space-x-2 text-white hover:text-[#FFEA2F] transition-colors">
        <Link
          href="/notice"
          className="h-full flex justify-center items-center gap-1 group py-2 px-4"
        >
          <span>Notice d&#39;utilisation</span>
        </Link>
      </div>
    </div>
  </nav>
);

export { Header, Navigation };
