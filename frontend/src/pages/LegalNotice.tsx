import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LegalNotice: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Legal Notice
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none space-y-8">

            {/* Website Information */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">1. Website Information</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Website:</strong> www.monunterra.in</p>
                </div>
              </div>
            </section>

            {/* Company Information */}
            {/* <section>
              <h2 className="text-2xl font-bold text-black mb-4">2. Company Information</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Company Name:</strong> [Company Legal Name]</p>
                  <p><strong>Registration Number:</strong> [Company Registration Number]</p>
                  <p><strong>Registered Address:</strong> [Complete Registered Address]</p>
                  <p><strong>Business Address:</strong> [Business Operation Address]</p>
                  <p><strong>Country of Incorporation:</strong> India</p>
                  <p><strong>GST Number:</strong> [GST Registration Number]</p>
                </div>
              </div>
            </section> */}

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">3. Contact Information</h2>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3 text-gray-700">
                  <p><strong>Email:</strong> contact.trippechalo.in@gmail.com</p>
                  <p><strong>Phone:</strong> +91 9685609494 / +91 9669614697</p>
                  <p><strong>Customer Support:</strong> contact.trippechalo.in@gmail.com</p>
                  <p><strong>Business Hours:</strong> Monday to Friday, 9:00 AM to 6:00 PM (IST)</p>
                </div>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">4. Intellectual Property Rights</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  All content on this website, including but not limited to text, graphics, logos, images, photographs,
                  audio clips, digital downloads, data compilations, and software, is the property of Mounterra or its
                  content suppliers and is protected by Indian and international copyright laws.
                </p>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">4.1 Trademarks</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Mounterra, our logo, and all related names, logos, product and service names, designs, and slogans
                    are trademarks of Mounterra or its affiliates or licensors.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">4.2 Copyright Notice</h3>
                  <p className="text-gray-700 leading-relaxed">
                    © 2024 Mounterra. All rights reserved. No part of this website may be reproduced, distributed,
                    or transmitted in any form or by any means without our prior written permission.
                  </p>
                </div>
              </div>
            </section>

            {/* Disclaimer */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">5. Disclaimer</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law,
                  Mounterra excludes all representations, warranties, conditions, and other terms which might otherwise
                  be implied by statute, common law, or the law of equity.
                </p>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">5.1 Content Accuracy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    While we strive to ensure the accuracy of information on our website, we make no warranties about
                    the completeness, reliability, and accuracy of this information.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">5.2 External Links</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Our website may contain links to external websites. We have no control over the content and nature
                    of these sites and are not responsible for their content or privacy practices.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                Mounterra shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting
                from your use of our services or website, even if we have been advised of the possibility of such damages.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">7. Governing Law and Jurisdiction</h2>
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  This Legal Notice and any disputes arising out of or in connection with it shall be governed by and
                  construed in accordance with the laws of India.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Any legal action or proceeding arising under this Legal Notice will be brought exclusively in the
                  courts located in Bhopal, and the parties hereby consent to personal jurisdiction and venue therein.
                </p>
              </div>
            </section>

            {/* Regulatory Compliance */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">8. Regulatory Compliance</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">8.1 Tourism Regulations</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Mounterra operates in compliance with applicable tourism and travel regulations in India.
                    All our tour operators and service providers are licensed and certified as required by law.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">8.2 Consumer Protection</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We are committed to protecting consumer rights and operate in accordance with the Consumer
                    Protection Act and other applicable consumer protection laws.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">8.3 Data Protection</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We comply with applicable data protection and privacy laws, including the Information Technology
                    Act, 2000 and related rules for the protection of personal data.
                  </p>
                </div>
              </div>
            </section>

            {/* Indemnification */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">9. Indemnification</h2>
              <p className="text-gray-700 leading-relaxed">
                You agree to indemnify, defend, and hold harmless Mounterra, its officers, directors, employees,
                agents, and third parties, for any losses, costs, liabilities, and expenses relating to or arising
                out of your use of or inability to use the website or services, your violation of any terms, or your
                violation of any rights of a third party.
              </p>
            </section>

            {/* Severability */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">10. Severability</h2>
              <p className="text-gray-700 leading-relaxed">
                If any provision of this Legal Notice is found to be unenforceable or invalid, that provision will
                be limited or eliminated to the minimum extent necessary so that this Legal Notice will otherwise
                remain in full force and effect and enforceable.
              </p>
            </section>

            {/* Modifications */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">11. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                Mounterra reserves the right to modify this Legal Notice at any time. Any changes will be effective
                immediately upon posting on our website. Your continued use of the website after any such changes
                constitutes your acceptance of the new Legal Notice.
              </p>
            </section>

            {/* Contact for Legal Matters */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">12. Legal Inquiries</h2>
              <p className="text-gray-700 leading-relaxed">
                For any legal inquiries, notices, or concerns regarding this Legal Notice, please contact us:
              </p>
              <div className="bg-gray-50 rounded-xl p-6 mt-4">
                <p className="text-gray-700"><strong>Legal Department:</strong> contact.trippechalo.in@gmail.com</p>
                <p className="text-gray-700"><strong>Address:</strong> Spring Valley, Katara Hills, Bhopal</p>
                <p className="text-gray-700"><strong>Phone:</strong> 9685609494</p>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              This Legal Notice is effective as of the date last updated above and governs your use of Mounterra's
              website and services. Please review this notice periodically for any changes.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LegalNotice;