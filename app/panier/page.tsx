'use client';

import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Image from 'next/image';
import Link from 'next/link';
import R5 from '../../public/chariot.jpg';
import logoRenault from '../../public/renault.png'; // <-- On importe le logo localement

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
    // On convertit le logo importé en Base64 (partie asynchrone)
    // Si jamais la conversion pose souci, il est possible d'héberger l'image 
    // et de la charger via URL (doc.addImage('https://...logo_renault.png', ...)).



    // On dessine une barre de fond en haut pour un effet “professionnel”
    doc.setFillColor(242, 242, 242); // Gris très clair
    doc.rect(0, 0, 210, 40, 'F'); // Rectangle sur toute la largeur (A4 = 210mm)

    const logoBase64 = "data:image/png;base64,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"
    doc.addImage(logoBase64, 'PNG', 14, 8, 25, 18);

    // Titre "Bon de commande" en haut à droite
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('BON DE COMMANDE', 200, 15, { align: 'right' });

    // Information "Renault" ou autre
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Usine Renault de Sandouville', 200, 23, { align: 'right' });

    // ========================
    // 2. Informations de commande
    // ========================
    const currentDate = new Date().toLocaleDateString();
    doc.text(`Date : ${currentDate}`, 14, 50);
    // Exemple : numéro de commande fictif (peut être remplacé ou supprimé)
    doc.text(`Commande n°: ${Math.floor(Math.random() * 100000)}`, 14, 55);

    // Ligne de séparation
    doc.setLineWidth(0.5);
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 60, 196, 60);

    // ========================
    // 3. Tableau récapitulatif
    // ========================
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
        const accessoryTotal = item.accessories.reduce((sum, acc) => sum + acc.price, 0);
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
    const finalY = doc.lastAutoTable.finalY + 10;

    // On ajoute le total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total : ${calculateTotal()} €`, 14, finalY);

    // Exemple de commentaires ou conditions de vente
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    // ========================
    // 5. Pied de page
    // ========================
    // On place un pied de page qui apparaîtra en bas de page
    // (Pour gérer plusieurs pages, on peut utiliser les hooks d’autoTable ou addPage, etc.)
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100);
      // “i” est le numéro de la page ; pageCount est le total de pages
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
