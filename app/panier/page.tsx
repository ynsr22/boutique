'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Image from 'next/image';
import Link from 'next/link';
import R5 from '../../public/chariot.jpg';

const Panier = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(storedCart);
  }, []);

  const updateQuantity = (index, quantity) => {
    if (quantity < 1) return; // Empêche la saisie négative ou nulle
    const newCart = [...cart];
    newCart[index].quantity = quantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const accessoryTotal = item.accessories.reduce((sum, acc) => sum + acc.price, 0);
      return total + (item.price + accessoryTotal) * item.quantity;
    }, 0);
  };

  const generatePDF = async () => {
    // Instanciation du document
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  
    // Définition des métadonnées
    doc.setProperties({
      title: 'Bon de commande',
      subject: 'Détails de la commande'
    });
  
    // ========================
    // 1. Ajout du logo + En-tête
    // ========================
    // Par exemple, on dessine une barre de fond en haut
    doc.setFillColor(242, 242, 242); // Gris très clair
    doc.rect(0, 0, 210, 40, 'F'); // Rectangle sur toute la largeur (A4 = 210mm)
  
    // Titre "BON DE COMMANDE" en haut à droite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BON DE COMMANDE', 200, 15, { align: 'right' });
  
    // Information (exemple : "Usine Renault de Sandouville")
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Usine Renault de Sandouville', 200, 23, { align: 'right' });
  
    // ========================
    // 2. Informations de commande
    // ========================
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date : ${currentDate}`, 14, 50);
    // Exemple : numéro de commande fictif
    doc.text(`Commande n°: ${Math.floor(Math.random() * 100000)}`, 14, 55);
  
    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 60, 196, 60);
  
    // ========================
    // 3. Tableau récapitulatif
    // ========================
    // Assurez-vous d’avoir importé "jspdf-autotable" afin que doc.autoTable soit disponible
    autoTable(doc, {
      startY: 65,
      headStyles: {
        fillColor: [230, 230, 230],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      head: [
        [
          'Produit',
          'Matériau',
          'Accessoires',
          'Prix Module',
          'Prix Access.',
          'Quantité',
          'Sous-total'
        ]
      ],
      body: cart.map((item) => {
        const accessoryTotal = item.accessories.reduce(
          (sum, acc) => sum + acc.price,
          0
        );
        return [
          item.base,
          item.material,
          item.accessories.map((acc) => `${acc.name} (${acc.price} €)`).join(', ') || 'Aucun',
          `${item.price} €`,
          `${accessoryTotal} €`,
          item.quantity,
          `${(item.price + accessoryTotal) * item.quantity} €`
        ];
      })
    });
  
    // ========================
    // 4. Total et commentaires
    // ========================
    // Récupération de la position finale du tableau
    const finalY = (doc as any).lastAutoTable.finalY; // TypeScript ne connaît pas lastAutoTable
  
    // Ajout du total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total : ${calculateTotal()} €`, 14, finalY+10);
  
    // Exemple de commentaires ou conditions de vente
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    // Vous pouvez ajouter ici d'autres textes ou conditions
  
    // ========================
    // 5. Pied de page
    // ========================
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      // "i" est le numéro de la page ; pageCount est le total de pages
      doc.text(`Page ${i} / ${pageCount}`, 105, 290, { align: 'center' });
    }
  
    // ========================
    // 6. Enregistrement du PDF
    // ========================
    doc.save('bon-de-commande.pdf');
  };
  

  return (
    <div className="container mx-auto p-4">
      {/* Titre principal */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mon Panier</h1>
        <p className="text-sm text-gray-500 mt-1">
          Vérifiez vos articles et finalisez votre commande.
        </p>
      </div>

      {cart.length === 0 ? (
        // Si le panier est vide
        <div className="text-center mt-20">
          <p className="text-gray-600 mb-4">Votre panier est vide.</p>
          <Link
            href="/"
            className="inline-block bg-yellow-500 text-white px-6 py-2 rounded-lg shadow-md
                       hover:bg-yellow-600 transition-colors duration-300"
          >
            Retour à la boutique
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {cart.map((item, index) => {
              const accessoryTotal = item.accessories.reduce((sum, acc) => sum + acc.price, 0);
              const itemTotal = (item.price + accessoryTotal) * item.quantity;

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 flex gap-4 items-center 
                             shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-20 h-20 flex-shrink-0 relative">
                    <Image
                      src={R5}
                      alt={item.base}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-800">
                      {item.base} <span className="text-gray-600">({item.material})</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Accessoires :{' '}
                      {item.accessories.map((acc) => `${acc.name} (${acc.price} €)`).join(', ') || 'Aucun'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2 items-center text-sm">
                      <p className="bg-gray-100 px-2 py-1 rounded-md">
                        Prix Module : <strong>{item.price} €</strong>
                      </p>
                      <p className="bg-gray-100 px-2 py-1 rounded-md">
                        Prix Accessoires : <strong>{accessoryTotal} €</strong>
                      </p>
                      <p className="bg-gray-100 px-2 py-1 rounded-md">
                        Quantité : <strong>{item.quantity}</strong>
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-800 mt-2">
                      Total : {itemTotal} €
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                      className="border border-gray-300 px-2 py-1 w-16 text-center rounded-md 
                                 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 
                                 transition-colors duration-200"
                    />
                    <button
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 transition-colors text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Récapitulatif (colonne de droite) */}
          <div className="lg:sticky lg:top-16 flex flex-col gap-4 h-fit self-start p-4 border rounded-lg shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Récapitulatif</h2>
              <p className="text-sm text-gray-600">
                Vérifiez le total et générez votre PDF.
              </p>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">Total :</span>
                <span className="text-xl font-bold text-gray-800">
                  {calculateTotal()} €
                </span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={generatePDF}
                className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md
                           hover:bg-yellow-600 transition-colors duration-300 font-semibold"
              >
                Générer le PDF
              </button>
            </div>
            <div className="text-center mt-2">
              <Link
                href="/"
                className="inline-block text-sm text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Panier;
