import '../styles/Homepage.css';
import Caroussel from '../components/Carousel';
import Categories from '../components/Categories';
import Homeproducts from '../components/Homeproducts';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet';
import { useEffect } from 'react';

const HomePage = () => {
    // ✅ Ensure title resets on back navigation
    useEffect(() => {
        document.title = "Ygames - Boutique de jeux vidéo à Tlemcen";
    }, []);

    return (
        <div>
            {/* SEO improvements */}
            <Helmet>
                {/* Title & Meta */}
                <title>Ygames - Boutique de jeux vidéo à Tlemcen</title>
                <meta name="description" content="Ygames, boutique de jeux vidéo à Tlemcen, propose un vaste choix de jeux pour toutes les consoles avec un service exceptionnel." />
                <meta name="keywords" content="jeux vidéo, consoles, Tlemcen, Ygames, accessoires gaming" />
                <meta name="robots" content="index, follow" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="Ygames - Boutique de jeux vidéo à Tlemcen" />
                <meta property="og:description" content="Ygames, boutique de jeux vidéo à Tlemcen, propose un vaste choix de jeux pour toutes les consoles avec un service exceptionnel." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.ygames.shop" />
                <meta property="og:image" content="https://www.ygames.shop/favicon.png" />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Ygames - Boutique de jeux vidéo à Tlemcen" />
                <meta name="twitter:description" content="Ygames, boutique de jeux vidéo à Tlemcen, propose un vaste choix de jeux pour toutes les consoles avec un service exceptionnel." />
                <meta name="twitter:image" content="https://www.ygames.shop/favicon.png" />

                {/* Canonical URL */}
                <link rel="canonical" href="https://www.ygames.shop" />

                {/* LocalBusiness structured data */}
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "Store",
                      "name": "Ygames",
                      "image": "https://www.ygames.shop/favicon.png",
                      "address": {
                        "@type": "PostalAddress",
                        "streetAddress": "Votre adresse exacte à Tlemcen",
                        "addressLocality": "Tlemcen",
                        "addressCountry": "DZ"
                      },
                      "url": "https://www.ygames.shop",
                      "telephone": "0675509293",
                      "sameAs": [
                        "https://www.facebook.com/profile.php?id=100063536980308",
                        "https://www.instagram.com/y_games__/",
                        "https://maps.app.goo.gl/iu7zsA4DLqwJkcsZ6",
                        "https://linktr.ee/ygamesdz"
                      ]
                    }
                    `}
                </script>
            </Helmet>

            <div className='searchbar-space'></div>

            <main className="home-page">
                <Caroussel />
                <Categories />
                <Homeproducts />
                <Footer />
            </main>
        </div>
    );
}

export default HomePage;
