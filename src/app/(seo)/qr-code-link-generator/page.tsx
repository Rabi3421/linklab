import SeoLandingPage from '../components/SeoLandingPage';
import { buildSeoLandingMetadata, getSeoLandingPage } from '@/lib/seo/landing-pages';

const page = getSeoLandingPage('qr-code-link-generator');

export const metadata = buildSeoLandingMetadata(page);

export default function QrCodeLinkGeneratorPage() {
  return <SeoLandingPage page={page} />;
}

