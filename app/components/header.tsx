import { useState, useEffect, useCallback ,useContext } from 'react';
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

const NoticeIcon = () => (
  <svg
    width="18"
    height="22"
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="stroke-white group-hover:stroke-[#FFEA2F] transition-colors"
  >
    <path
      d="M12.0001 1.40002V5.00002C12.0001 5.66277 12.5373 6.20002 13.2001 6.20002H16.8001M5.40008 6.20002H7.80008M5.40008 9.80002H12.6001M5.40008 13.4H12.6001M15.0001 3.20002C14.466 2.72217 13.9118 2.1554 13.5619 1.7873C13.3291 1.54236 13.0074 1.40002 12.6695 1.40002H3.5998C2.27432 1.40002 1.19981 2.47453 1.1998 3.80001L1.19971 18.2C1.1997 19.5254 2.27421 20.6 3.5997 20.6L14.3997 20.6C15.7252 20.6 16.7997 19.5255 16.7998 18.2001L16.8001 5.47786C16.8001 5.17102 16.683 4.87606 16.4701 4.65516C16.0763 4.24667 15.4187 3.57454 15.0001 3.20002Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchBar = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (query: string) => void }) => (
  <form
    className="flex items-center w-full max-w-[256px] h-9 bg-white rounded-full overflow-hidden border"
    onSubmit={(e) => e.preventDefault()}
  >
    <input
      type="search"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Recherche..."
      className="w-full min-w-0 px-3 py-1 text-gray-700 bg-transparent focus:outline-none"
    />
    <button
      type="submit"
      className="flex-shrink-0 flex items-center justify-center w-10 h-full bg-black text-white hover:bg-gray-800 transition-colors"
    >
      <SearchIcon />
    </button>
  </form>
);

const CartIcon = () => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = useCallback(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  }, []);

  useEffect(() => {
    updateCartCount(); // Mise à jour initiale

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [updateCartCount]);

  return (
    <Link href="/panier">
      <div className="relative flex-shrink-0 cursor-pointer hover:bg-white rounded-full p-2 transition-colors">
        <Image src={bag} alt="Shopping bag" width={30} height={30} />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </div>
    </Link>
  );
};



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
          <NoticeIcon />
          <span>Notice d&#39;utilisation</span>
        </Link>
      </div>
    </div>
  </nav>
);

export { Header, Navigation };
