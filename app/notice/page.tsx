import { FC, memo } from "react";
import Head from "next/head";

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

Section.displayName = "Section";

// Main Notice component
const Notice: FC = memo(() => {
  const sections = [
    {
      title: "1. Introduction",
      content: (
        <p className="text-gray-700 mb-4">
          Cette notice est un exemple temporaire pour illustrer
          l&apos;utilisation d&apos;un site web en cours de développement. Le
          contenu sera mis à jour à mesure que le projet avance et que les
          fonctionnalités finales seront définies.
        </p>
      ),
    },
    {
      title: "2. Objectifs du site",
      content: (
        <ul className="list-disc pl-6 text-gray-700">
          <li className="mb-2">
            Faciliter la commande des moyens logistiques non motorisés.
          </li>
          <li className="mb-2">
            Centraliser les informations pour une meilleure gestion.
          </li>
          <li className="mb-2">
            Offrir une interface intuitive inspirée des boutiques en ligne.
          </li>
        </ul>
      ),
    },
    {
      title: "3. Fonctionnalités futures",
      content: (
        <p className="text-gray-700 mb-4">
          Les fonctionnalités incluront la consultation des produits, la
          configuration personnalisée, et la gestion des commandes. Des mises à
          jour régulières garantiront l&apos;évolution et l&apos;amélioration de
          l&apos;expérience utilisateur.
        </p>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Notice Exemple</title>
        <meta
          name="description"
          content="Exemple de notice d'utilisation pour un site web en développement."
        />
        <meta name="keywords" content="notice exemple, site web" />
      </Head>
      <div className="p-8 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Notice Exemple</h1>
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

Notice.displayName = "Notice";

// Page component
const Page: FC = () => (
  <main>
    <Notice />
  </main>
);

export default Page;
