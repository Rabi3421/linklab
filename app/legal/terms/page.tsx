import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Mail, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - LinkLab',
  description: 'LinkLab\'s terms of service governing your use of our URL shortening and management platform.',
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col">
      <section className="container px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Terms of Service</h1>
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
                Welcome to LinkLab! These Terms of Service govern your use of our URL shortening and management platform. 
                By using our services, you agree to be bound by these terms.
              </p>
            </div>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using LinkLab's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. 
              If you do not agree with any of these terms, you are prohibited from using our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>LinkLab provides URL shortening, analytics, and related services including but not limited to:</p>
            <ul>
              <li>URL shortening and customization</li>
              <li>Click analytics and reporting</li>
              <li>QR code generation</li>
              <li>UTM parameter management</li>
              <li>Custom domain integration</li>
              <li>API access for developers</li>
            </ul>

            <h2>3. User Accounts</h2>
            
            <h3>Account Registration</h3>
            <p>To access certain features, you must create an account by providing accurate and complete information. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
              <li>Ensuring your information remains current and accurate</li>
            </ul>

            <h3>Account Eligibility</h3>
            <p>You must be at least 13 years old to use our services. If you are under 18, you must have permission from a parent or guardian.</p>

            <h2>4. Acceptable Use Policy</h2>
            <p>You agree not to use LinkLab for any unlawful or prohibited activities, including but not limited to:</p>

            <h3>Prohibited Content</h3>
            <ul>
              <li>Illegal, fraudulent, or misleading content</li>
              <li>Malware, viruses, or other harmful code</li>
              <li>Spam, phishing, or unsolicited commercial messages</li>
              <li>Copyrighted material without proper authorization</li>
              <li>Adult content, hate speech, or harassment</li>
              <li>Content that violates others' privacy or rights</li>
            </ul>

            <h3>Prohibited Activities</h3>
            <ul>
              <li>Attempting to gain unauthorized access to our systems</li>
              <li>Interfering with or disrupting our services</li>
              <li>Bypassing rate limits or usage restrictions</li>
              <li>Creating multiple accounts to evade limitations</li>
              <li>Reverse engineering or copying our services</li>
              <li>Using our services to compete with us</li>
            </ul>

            <h2>5. Service Plans and Billing</h2>
            
            <h3>Free Services</h3>
            <p>We offer limited free services subject to usage restrictions. Free accounts may have limitations on features, analytics retention, and support.</p>

            <h3>Paid Services</h3>
            <p>Paid plans are billed in advance on a monthly or annual basis. By subscribing to a paid plan, you agree to:</p>
            <ul>
              <li>Pay all fees associated with your chosen plan</li>
              <li>Automatic renewal unless cancelled</li>
              <li>Price changes with 30 days notice</li>
              <li>No refunds for partial months (except as required by law)</li>
            </ul>

            <h3>Cancellation</h3>
            <p>You may cancel your subscription at any time. Cancellations take effect at the end of your current billing period. We do not provide refunds for unused portions of paid plans except where required by applicable law.</p>

            <h2>6. Intellectual Property Rights</h2>
            
            <h3>Our Rights</h3>
            <p>LinkLab and its content are protected by copyright, trademark, and other intellectual property laws. We retain all rights to:</p>
            <ul>
              <li>The LinkLab platform and software</li>
              <li>Our trademarks, logos, and branding</li>
              <li>Documentation, analytics, and reporting features</li>
              <li>Aggregated, anonymized usage data</li>
            </ul>

            <h3>Your Rights</h3>
            <p>You retain ownership of the content you submit to our service. By using LinkLab, you grant us a license to:</p>
            <ul>
              <li>Store and process your URLs and associated data</li>
              <li>Provide analytics and reporting services</li>
              <li>Use aggregated, anonymized data to improve our services</li>
            </ul>

            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our collection and use of your information is governed by our{' '}
              <Link href="/legal/privacy" className="text-primary hover:underline">Privacy Policy</Link>, 
              which is incorporated into these Terms by reference.
            </p>

            <h2>8. Service Availability and Modifications</h2>
            
            <h3>Service Availability</h3>
            <p>While we strive for high availability, we cannot guarantee uninterrupted service. We may experience downtime for maintenance, updates, or unforeseen issues.</p>

            <h3>Service Changes</h3>
            <p>We reserve the right to modify, suspend, or discontinue any part of our services at any time with or without notice. We will provide reasonable notice for material changes that affect paid features.</p>

            <h2>9. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, LinkLab shall not be liable for any indirect, incidental, special, 
              consequential, or punitive damages, including but not limited to loss of profits, data, or use, 
              even if we have been advised of the possibility of such damages.
            </p>
            <p>
              Our total liability to you for any claim arising from or related to these Terms or our services 
              shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>

            <h2>10. Indemnification</h2>
            <p>
              You agree to indemnify and hold LinkLab harmless from any claims, damages, losses, or expenses 
              arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
            </p>

            <h2>11. Termination</h2>
            
            <h3>Termination by You</h3>
            <p>You may terminate your account at any time by contacting us or through your account settings.</p>

            <h3>Termination by Us</h3>
            <p>We may suspend or terminate your account immediately if you:</p>
            <ul>
              <li>Violate these Terms of Service</li>
              <li>Fail to pay fees when due</li>
              <li>Engage in fraudulent or illegal activities</li>
              <li>Pose a security risk to our platform or users</li>
            </ul>

            <h3>Effect of Termination</h3>
            <p>Upon termination, your right to use our services ceases immediately. We may delete your data according to our data retention policies, though some information may be retained for legal or operational purposes.</p>

            <h2>12. Dispute Resolution</h2>
            
            <h3>Governing Law</h3>
            <p>These Terms are governed by the laws of the State of California, United States, without regard to conflict of law principles.</p>

            <h3>Dispute Resolution Process</h3>
            <p>For any disputes arising from these Terms or our services:</p>
            <ol>
              <li><strong>Direct Resolution:</strong> Contact us first to attempt informal resolution</li>
              <li><strong>Mediation:</strong> If informal resolution fails, we encourage mediation</li>
              <li><strong>Arbitration:</strong> Binding arbitration through a recognized arbitration service</li>
              <li><strong>Class Action Waiver:</strong> You agree not to participate in class action lawsuits</li>
            </ol>

            <h2>13. General Provisions</h2>
            
            <h3>Entire Agreement</h3>
            <p>These Terms constitute the entire agreement between you and LinkLab regarding our services.</p>

            <h3>Severability</h3>
            <p>If any provision of these Terms is found unenforceable, the remaining provisions will remain in full force.</p>

            <h3>Assignment</h3>
            <p>We may assign these Terms or our rights and obligations without notice. You may not assign your rights without our written consent.</p>

            <h3>Updates to Terms</h3>
            <p>We may update these Terms from time to time. We will notify you of material changes by:</p>
            <ul>
              <li>Email notification to registered users</li>
              <li>Prominent notice on our website</li>
              <li>In-app notification</li>
            </ul>
            <p>Continued use after changes indicates acceptance of the updated Terms.</p>

            <h2>14. Contact Information</h2>
            <p>If you have questions about these Terms of Service, please contact us:</p>
            
            <div className="rounded-lg border bg-card p-6 not-prose">
              <div className="flex items-start gap-4">
                <Mail className="mt-1 h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="font-medium">Email:</p>
                  <p className="text-muted-foreground">legal@linklab.com</p>
                  
                  <p className="mt-4 font-medium">Mailing Address:</p>
                  <p className="text-muted-foreground">
                    LinkLab Inc.<br />
                    Legal Department<br />
                    123 Market Street, Suite 456<br />
                    San Francisco, CA 94105<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 border-t pt-8">
              <p className="text-sm text-muted-foreground">
                These Terms of Service are effective as of December 24, 2024. For our Privacy Policy, please visit{' '}
                <Link href="/legal/privacy" className="text-primary hover:underline">
                  our Privacy Policy page
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}