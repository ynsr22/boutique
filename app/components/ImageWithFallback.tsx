// Composant de placeholder d'image optimisé
import Image from "next/image";
import { useState } from "react";

export const ImageWithFallback = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-48 bg-gray-50">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        className={`max-h-48 object-contain transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setImgSrc("/placeholder.jpg");
          setIsLoading(false);
        }}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={false}
        {...props}
      />
    </div>
  );
};
