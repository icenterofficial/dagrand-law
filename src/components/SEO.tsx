import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  schema?: object;
}

export const SEO = ({ title, description, keywords, image, type = 'website', schema }: SEOProps) => {
  const location = useLocation();
  const siteUrl = 'https://dagrand.net'; // Production URL
  const fullUrl = `${siteUrl}${location.pathname}`;

  const defaultDescription = "Dagrand Law Office is a leading boutique law firm in Cambodia providing strategic, insightful, and globally informed legal services in Corporate, Tax, Real Estate, and Dispute Resolution.";
  const defaultImage = "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"; 
  const defaultKeywords = "Cambodia Law Firm, Legal Services Phnom Penh, Corporate Lawyer Cambodia, Tax Law, Real Estate Law, Dispute Resolution, Dagrand Law Office";

  const metaDescription = description || defaultDescription;
  const metaImage = image || defaultImage;
  const metaKeywords = keywords ? `${keywords}, ${defaultKeywords}` : defaultKeywords;
  const finalTitle = title.includes("Dagrand") ? title : `${title} | Dagrand Law Office`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Dagrand Law Office" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data (JSON-LD) for Google Rich Results */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      
      {!schema && type === 'website' && (
         <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LegalService",
            "name": "Dagrand Law Office",
            "image": defaultImage,
            "@id": siteUrl,
            "url": siteUrl,
            "telephone": "+85598539910",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Floor 1, Building No. 162, Street 51 corner Street 334, Sangkat Boeung Keng Kang 1",
              "addressLocality": "Phnom Penh",
              "addressCountry": "KH"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 11.5564,
              "longitude": 104.9282
            },
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday"
              ],
              "opens": "09:00",
              "closes": "17:00"
            },
            "sameAs": [
              "https://kh.linkedin.com/company/dagrand-law-office",
              "https://www.facebook.com/dagrandlawoffice"
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};