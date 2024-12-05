import { FC, memo } from 'react';
import Head from 'next/head';

// Separate Section component for reusability and better organization
interface SectionProps {
  title: string;
  content: React.ReactNode;
}

const Section: FC<SectionProps> = memo(({ title, content }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {content}
  </section>
));

Section.displayName = 'Section';

// Main Notice component
const Notice: FC = memo(() => {
  const sections = [
    {
      title: "1. Installation",
      content: (
        <p className="text-gray-700 mb-4">
          Connectez l&#39;appareil à une prise électrique. Assurez-vous que tous les composants sont correctement assemblés avant la première utilisation.
        </p>
      )
    },
    {
      title: "2. Utilisation",
      content: (
        <ul className="list-disc pl-6 text-gray-700">
          <li className="mb-2">Allumez l&#39;appareil en appuyant sur le bouton principal</li>
          <li className="mb-2">Sélectionnez le mode désiré parmi les options disponibles</li>
          <li className="mb-2">Ajustez les paramètres selon vos besoins</li>
        </ul>
      )
    },
    {
      title: "3. Précautions",
      content: (
        <p className="text-gray-700 mb-4">
          Ne pas utiliser près d&#39;une source d&#39;eau. Tenir hors de portée des enfants. Débrancher après utilisation.
        </p>
      )
    }
  ];

  return (
    <>
    <Head>
      <title>Panier</title>
      <meta name="description" content="Accédez à votre panier." />
      <meta name="keywords" content="panier" />
    </Head>
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notice d&#39;utilisation</h1>
      {sections.map((section, index) => (
        <Section 
          key={index}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
    </>
  );
});

Notice.displayName = 'Notice';

// Page component
const Page: FC = () => (
  <main>
    <Notice />
  </main>
);

export default Page;
