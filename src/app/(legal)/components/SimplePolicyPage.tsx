import AuthenticationAwareHeader from '@/components/common/AuthenticationAwareHeader';
import Footer from '@/app/homepage/components/Footer';

interface SimplePolicyPageProps {
  title: string;
  description: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export default function SimplePolicyPage({ title, description, sections }: SimplePolicyPageProps) {
  return (
    <>
      <AuthenticationAwareHeader isAuthenticated={false} />
      <main className="min-h-screen bg-[#1e2129] pt-[60px] text-white">
        <section className="border-b border-white/5 py-20 lg:py-24">
          <div className="mx-auto max-w-[900px] px-4 sm:px-6 lg:px-8">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-amber-400">
              LinkLab
            </p>
            <h1 className="text-4xl font-bold text-white lg:text-5xl">{title}</h1>
            <p className="mt-5 text-lg leading-8 text-white/55">{description}</p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-[900px] space-y-5 px-4 sm:px-6 lg:px-8">
            {sections.map((section) => (
              <article key={section.heading} className="rounded-2xl border border-white/8 bg-white/[0.03] p-6">
                <h2 className="text-xl font-bold text-white">{section.heading}</h2>
                <p className="mt-3 text-sm leading-7 text-white/52">{section.body}</p>
              </article>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
}

