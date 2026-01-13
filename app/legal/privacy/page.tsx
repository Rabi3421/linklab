import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Mail, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - LinkLab',
  description: 'LinkLab\'s privacy policy explaining how we collect, use, and protect your personal information.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col">
      <section className="container px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
            <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last updated: December 24, 2024
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none dark:prose-invert">
            <div className="rounded-lg border bg-muted/30 p-6 mb-8">
              <p className="mb-0">
                At LinkLab, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>
            </div>

            <h2>1. Information We Collect</h2>
            
            <h3>Information You Provide to Us</h3>
            <ul>
              <li><strong>Account Information:</strong> When you create an account, we collect your name, email address, and password.</li>
              <li><strong>URL Data:</strong> The original URLs you shorten and any custom aliases you create.</li>
              <li><strong>Payment Information:</strong> For paid plans, we collect billing information through our secure payment processors.</li>
              <li><strong>Communications:</strong> Information you provide when you contact us for support or feedback.</li>
            </ul>

            <h3>Information We Collect Automatically</h3>
            <ul>
              <li><strong>Analytics Data:</strong> Click data, geographic location, referrer information, device type, and browser information for shortened links.</li>
              <li><strong>Usage Information:</strong> How you interact with our service, including features used and time spent.</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers.</li>
              <li><strong>Cookies:</strong> We use cookies and similar technologies to enhance your experience and analyze usage patterns.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our URL shortening and analytics services</li>
              <li>Process transactions and send related information</li>
              <li>Send administrative information, updates, and security alerts</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Generate analytics and insights about link performance</li>
              <li>Detect, prevent, and address technical issues and security vulnerabilities</li>
              <li>Comply with legal obligations and enforce our terms of service</li>
            </ul>

            <h2>3. Information Sharing and Disclosure</h2>
            <p>We do not sell or rent your personal information to third parties. We may share your information in the following circumstances:</p>
            
            <h3>With Your Consent</h3>
            <p>We may share your information when you give us explicit consent to do so.</p>

            <h3>Service Providers</h3>
            <p>We may share information with third-party service providers who perform services on our behalf, such as:</p>
            <ul>
              <li>Cloud hosting and storage providers</li>
              <li>Payment processors</li>
              <li>Analytics providers</li>
              <li>Customer support platforms</li>
            </ul>

            <h3>Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to valid legal requests, such as:</p>
            <ul>
              <li>Subpoenas or court orders</li>
              <li>Government investigations</li>
              <li>Protection of our rights, property, or safety</li>
              <li>Prevention of fraud or illegal activities</li>
            </ul>

            <h2>4. Data Retention</h2>
            <p>We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specifically:</p>
            <ul>
              <li><strong>Account Information:</strong> Retained while your account is active and for a reasonable period after closure</li>
              <li><strong>Link Data:</strong> Retained indefinitely to ensure shortened links continue to work</li>
              <li><strong>Analytics Data:</strong> Retained according to your plan (7 days for free accounts, up to unlimited for business plans)</li>
              <li><strong>Communication Records:</strong> Retained for up to 3 years for customer service purposes</li>
            </ul>

            <h2>5. Data Security</h2>
            <p>We implement appropriate technical and organizational security measures to protect your personal information, including:</p>
            <ul>
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection practices</li>
              <li>Incident response procedures</li>
            </ul>
            
            <p>However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>

            <h2>6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information:</p>

            <h3>Access and Portability</h3>
            <p>You can access and download your account information and link data through your dashboard.</p>

            <h3>Correction and Updates</h3>
            <p>You can update your account information at any time through your account settings.</p>

            <h3>Deletion</h3>
            <p>You can request deletion of your account and associated data. Note that some information may be retained for legal or operational purposes.</p>

            <h3>Marketing Communications</h3>
            <p>You can opt out of marketing emails by clicking the unsubscribe link or updating your preferences in your account settings.</p>

            <h3>Cookies</h3>
            <p>You can control cookies through your browser settings, though this may affect service functionality.</p>

            <h2>7. International Data Transfers</h2>
            <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers, including:</p>
            <ul>
              <li>Standard contractual clauses</li>
              <li>Adequacy decisions by relevant authorities</li>
              <li>Certification programs</li>
            </ul>

            <h2>8. Children's Privacy</h2>
            <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.</p>

            <h2>9. Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
            <ul>
              <li>Posting the updated policy on our website</li>
              <li>Sending an email notification to registered users</li>
              <li>Providing notice through our service interface</li>
            </ul>
            <p>Your continued use of our services after any changes indicates your acceptance of the updated policy.</p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy or our privacy practices, please contact us:</p>
            
            <div className="rounded-lg border bg-card p-6 not-prose">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">privacy@linklab.com</p>
                  
                  <p className="mt-4 font-medium">Mailing Address:</p>
                  <p className="text-muted-foreground">
                    LinkLab Inc.<br />
                    123 Market Street, Suite 456<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t pt-8">
              <p className="text-sm text-muted-foreground">
                This Privacy Policy is effective as of December 24, 2024. For our Terms of Service, please visit{' '}
                <Link href="/legal/terms" className="text-primary hover:underline">
                  our Terms of Service page
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}