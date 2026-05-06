import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('bulk-url-shortener');

export const metadata = buildSeoLandingMetadata(page);

export default function BulkUrlShortenerPage() {
  return <SeoLandingPage page={page} />;
}

