import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  type?: string;
  image?: string;
  schema?: any; // JSON-LD structured data
}

const defaultDescription = "Full-Stack AI Software Engineer. I architect production-ready web applications that orchestrate complex multi-modal AI models, handle messy data, and solve real-world problems.";
const defaultTitle = "John Matveyev — Full-Stack AI Software Engineer";
const siteUrl = "https://matveyev.ai";

export function SEO({
  title = defaultTitle,
  description = defaultDescription,
  canonical = "",
  type = "website",
  image = "/og.png",
  schema,
}: SEOProps) {
  const url = `${siteUrl}${canonical}`;

  // Default Person schema
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "John Matveyev",
    url: siteUrl,
    jobTitle: "Full-Stack AI Software Engineer",
    sameAs: [
      "https://github.com/johnmatveyev",
      "https://linkedin.com/in/johnmatveyev",
    ],
  };

  const schemaData = schema || defaultSchema;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={url} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData).replace(/</g, '\\u003c') }} />
    </Helmet>
  );
}
