import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsAndConditions: React.FC = () => {
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
              Terms & Conditions
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

            {/* Part I: General Provisions */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h2 className="text-3xl font-bold text-blue-800 mb-2">PART I: GENERAL PROVISIONS</h2>
            </div>

            {/* Introduction and Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">1. Introduction and Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to TrippeChalo. These Terms and Conditions ("Terms") constitute a legally binding agreement governing your access to and use of the TrippeChalo website, our mobile, tablet, and other smart device applications, and all associated services (collectively, the "Platform"). The Platform is owned and operated by Mounterra Innovations LLP, a company incorporated under the laws of India (hereinafter referred to as "TrippeChalo," "the Company," "We," "Us," or "Our").
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                This document applies to all persons who access or use the Platform, including individuals who discover, browse, or book services ("Users"), and the individuals, businesses, or entities who list, offer, and provide those services ("Vendors"). Users and Vendors are collectively referred to as "You" or "Your."
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By accessing, browsing, registering for, or using the Platform in any manner, you acknowledge that you have read, understood, and unconditionally agree to be bound by these Terms, our Privacy Policy, and any other policies, guidelines, or rules referenced herein or published on the Platform from time to time. If you do not agree to these Terms, you must immediately cease all use of the Platform.
              </p>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
                <h3 className="text-xl font-semibold text-black mb-2">TrippeChalo's Role as a Discovery-First Meta-Search Platform and Intermediary</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  It is imperative to understand the fundamental role of TrippeChalo. The Platform is a technology-driven, discovery-first meta-search and aggregation service. Our primary function is to act as a neutral facilitator, connecting Users with a diverse range of third-party Vendors who are the independent providers of treks, adventure activities, hyperlocal events, eco-friendly travel experiences, and other related services ("Services").
                </p>
                <p className="text-gray-700 leading-relaxed">
                  TrippeChalo is an "intermediary" as defined under India's Information Technology Act, 2000, and its associated rules. Our role is strictly limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mt-3">
                  <li>Providing a digital marketplace for Vendors to list and promote their Services.</li>
                  <li>Offering a search and discovery engine for Users to find and compare these Services.</li>
                  <li>Facilitating the booking and payment process between Users and Vendors.</li>
                </ul>
              </div>
            </section>

            {/* Scope of TrippeChalo Services */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">2. Scope of TrippeChalo Services</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The services provided by TrippeChalo through the Platform are limited to making available a curated online marketplace and technology platform. Our scope of services includes:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4 mb-6">
                <li><strong>Discovery and Curation:</strong> We provide a platform where Vendors can showcase their curated experiences, and Users can discover unique and hyperlocal travel opportunities.</li>
                <li><strong>Search and Comparison:</strong> We offer tools that enable Users to search, filter, and compare various Services offered by different Vendors based on factors like location, activity type, price, and availability.</li>
                <li><strong>Booking Facilitation:</strong> We provide a secure and streamlined interface for Users to book Services directly with Vendors and facilitate the transfer of payments from Users to Vendors for confirmed bookings.</li>
              </ul>

              <div className="bg-red-50 border-l-4 border-red-400 p-4 my-6">
                <h3 className="text-xl font-semibold text-black mb-2">Explicit Disclaimers on Scope of Services</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  To avoid any ambiguity, you explicitly acknowledge and agree that TrippeChalo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li><strong>Does Not Provide Travel Services:</strong> TrippeChalo does not own, create, sell, resell, provide, control, manage, offer, deliver, or supply any of the Services listed on the Platform.</li>
                  <li><strong>Is Not an Agent:</strong> TrippeChalo is not and does not act as an agent in any capacity for any User or Vendor, except for the limited and specified purpose of acting as a payment collection agent.</li>
                  <li><strong>Does Not Guarantee Vendor Offerings:</strong> TrippeChalo has no control over and does not guarantee the existence, quality, safety, suitability, legality, or appropriateness of any Vendor's listing or Service.</li>
                </ul>
              </div>
            </section>

            {/* Eligibility and Account Registration */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">3. Eligibility and Account Registration</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Eligibility to Use</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Use of the TrippeChalo Platform is restricted to individuals and entities who are legally competent to enter into binding contracts under the Indian Contract Act, 1872. To access and use the Platform or register a TrippeChalo account, you must be an individual who is at least 18 years of age or a duly organized, validly existing business, organization, or other legal entity in good standing under the laws of the country you are established in.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Account Registration</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To access certain features of the Platform, such as making or accepting a booking, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Bookings for Third Parties and Minors</h3>
                  <p className="text-gray-700 leading-relaxed">
                    If you make a booking on behalf of additional guests, you are required to ensure that every individual in the group is made aware of and agrees to these Terms and any additional terms and conditions, rules, and restrictions imposed by the Vendor. You, as the primary account holder making the booking, represent and warrant that you have the authority to act on behalf of all individuals included in the booking.
                  </p>
                </div>
              </div>
            </section>

            {/* Part II: Obligations of Platform Participants */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8 mt-12">
              <h2 className="text-3xl font-bold text-blue-800 mb-2">PART II: OBLIGATIONS OF PLATFORM PARTICIPANTS</h2>
              <p className="text-blue-700">
                To ensure a transparent, safe, and efficient marketplace, the responsibilities of each party—the User, the Vendor, and TrippeChalo—are clearly defined.
              </p>
            </div>

            {/* Responsibilities Table */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">Table 1: Summary of Key Responsibilities</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 rounded-lg">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">The User (Consumer)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">The Vendor (Service Provider)</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">TrippeChalo (The Platform)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Provide accurate personal and payment information for all participants.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Provide accurate, complete, and non-misleading listings, including clear inclusions/exclusions.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Provide a robust technology platform for discovering and booking Services.</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Read, understand, and comply with all Vendor-specific rules, requirements, and policies before booking.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Ensure all offered Services comply with applicable local laws, safety standards, and regulations.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Facilitate payments securely between the User and the Vendor as a limited payment collection agent.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Conduct oneself in a respectful, safe, and lawful manner during the experience.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Deliver the Service safely and as described in the listing.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Maintain the functionality, availability, and security of the Platform.</td>
                    </tr>
                    <tr className="bg-gray-25">
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Communicate any issues or grievances directly with the Vendor first as the service provider.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Maintain all necessary and valid licenses, permits, and insurance for their operations.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Provide a grievance redressal mechanism for issues related to the Platform's functionality or a breach of these Terms.</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Fulfill all payment obligations for booked Services in a timely manner.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Set and clearly communicate their own cancellation, refund, and rescheduling policies on their listing.</td>
                      <td className="border border-gray-300 px-4 py-3 text-gray-700">Act as a neutral intermediary and not as a tour operator, travel agent, or service provider.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">4. User Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a User of the TrippeChalo Platform, you agree to adhere to the following responsibilities:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Accuracy of Information:</strong> You are solely responsible for providing accurate, complete, and current information for yourself and all other participants included in a booking.</li>
                <li><strong>Compliance with Vendor Rules and Requirements:</strong> Each Service listed on the Platform is subject to the specific terms, conditions, rules, and policies of the Vendor providing it.</li>
                <li><strong>Proper Conduct and Safety:</strong> You agree to conduct yourself in a manner that is lawful, respectful, and does not endanger yourself, the Vendor's staff, other participants, or the local environment.</li>
                <li><strong>Payment Obligations:</strong> You agree to pay all applicable fees, charges, and taxes associated with any booking you make through the Platform.</li>
                <li><strong>Travel Documentation and Legal Compliance:</strong> You are solely responsible for ensuring that you and all members of your party are in possession of all necessary travel documents.</li>
              </ul>
            </section>

            {/* Vendor Responsibilities */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">5. Vendor Responsibilities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As a Vendor listing your Services on the TrippeChalo Platform, you agree to the following responsibilities:
              </p>
              <ul className="list-disc list-inside space-y-3 text-gray-700 ml-4">
                <li><strong>Authenticity and Accuracy of Listings:</strong> You represent and warrant that all information you provide in your listings is accurate, complete, current, and not misleading in any way.</li>
                <li><strong>Legal and Safety Compliance:</strong> You represent and warrant that you possess all necessary licenses, permits, registrations, and regulatory approvals required to legally offer and operate your Services.</li>
                <li><strong>Quality and Delivery of Service:</strong> You are solely and exclusively responsible for the quality, safety, execution, and overall delivery of the Services you offer.</li>
                <li><strong>Pricing, Invoicing, and Taxation:</strong> You are responsible for setting the prices for your Services and must raise a valid invoice compliant with all applicable tax laws.</li>
              </ul>
            </section>

            {/* Prohibited Activities */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All Users and Vendors are strictly prohibited from using the TrippeChalo Platform to engage in any of the following activities:
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Unlawful Conduct</h3>
                  <p className="text-gray-700 leading-relaxed">Using the Platform for any purpose that is illegal, fraudulent, or violates any applicable central, state, local, or international law or regulation.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2">Platform Integrity and Security</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    <li>Using any robot, spider, scraper, deep-link, or other automated means to access, acquire, copy, or monitor any portion of the Platform</li>
                    <li>Attempting to gain unauthorized access to any part of the Platform, other accounts, or any systems or networks connected to the Platform</li>
                    <li>Taking any action that imposes an unreasonable or disproportionately large load on our infrastructure</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Part III: Bookings, Financials, and Cancellations */}
            <div className="bg-green-50 rounded-xl p-6 mb-8 mt-12">
              <h2 className="text-3xl font-bold text-green-800 mb-2">PART III: BOOKINGS, FINANCIALS, AND CANCELLATIONS</h2>
            </div>

            {/* Booking, Payments, and Fees */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">7. Booking, Payments, and Fees</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">The Booking Process</h3>
                  <p className="text-gray-700 leading-relaxed">
                    When a User completes the checkout process for a Service on the Platform, it constitutes an offer to purchase that Service from the Vendor. A booking is considered confirmed only when the User receives a booking confirmation email, voucher, or similar notification from TrippeChalo on behalf of the Vendor.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Payment Processing</h3>
                  <p className="text-gray-700 leading-relaxed">
                    All payments made through the Platform are processed via secure, third-party payment gateways. By providing your payment information, you authorize us (acting as the Vendor's limited payment collection agent) to charge the total booking amount to your selected payment method.
                  </p>
                </div>
              </div>
            </section>

            {/* Cancellation and Refund Policy */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">8. Cancellation and Refund Policy</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Primacy of the Vendor's Cancellation Policy</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You acknowledge and agree that the cancellation, refund, and rescheduling policy for any Service booked through the Platform is determined and set solely by the Vendor offering that Service. The Vendor's specific policy will be displayed on the Service listing page at the time of booking.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">TrippeChalo's Limited Role in Refunds</h3>
                  <p className="text-gray-700 leading-relaxed">
                    TrippeChalo's role in the refund process is that of a facilitator. Once a refund is approved by the Vendor in accordance with their policy, TrippeChalo will process the refund to the User's original mode of payment within 7-14 business days after the funds have been successfully received by us from the Vendor.
                  </p>
                </div>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">12. Limitation of Liability</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Platform Provided "As Is"</h3>
                  <p className="text-gray-700 leading-relaxed">
                    You expressly agree that your use of the TrippeChalo Platform is at your sole risk. The Platform and all services, content, and information made available through it are provided on an "as is" and "as available" basis, without warranties of any kind, either express or implied.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Exclusion of Liability</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To the fullest extent permissible under applicable law, TrippeChalo, including its affiliates, officers, directors, employees, and agents, shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising out of or in connection with personal injury, property damage, vendor acts or omissions, service disruptions, platform use, or user/vendor disputes.
                  </p>
                </div>
              </div>
            </section>

            {/* Dispute Resolution and Governing Law */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">13. Dispute Resolution and Governing Law</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Governing Law</h3>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms and your use of the Platform shall be governed by, and construed in accordance with, the laws of the Republic of India, without regard to its conflict of law principles.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Arbitration Clause</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Any dispute, controversy, claim, or difference of any kind whatsoever arising out of or in connection with this agreement shall be referred to and finally resolved by arbitration administered in accordance with the rules of the India International Arbitration Centre (IIAC).
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-black mb-4">16. Contact Information and Grievance Officer</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">General Support</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    For general inquiries, customer support, or assistance with bookings, please contact us at:
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700"><strong>Email:</strong> contact.trippechalo.in@gmail.com</p>
                    <p className="text-gray-700"><strong>Phone:</strong> +91 9685609494 / +91 9669614697</p>
                    <p className="text-gray-700"><strong>Address:</strong> Spring Valley, Katara Hills, Bhopal</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">Grievance Officer</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    In compliance with the Information Technology Act, 2000, and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, we have appointed a Grievance Officer to address any grievances or complaints from users regarding a breach of these Terms, the Privacy Policy, or any other matter related to the use of the Platform.
                  </p>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700"><strong>Email:</strong> contact.trippechalo.in@gmail.com</p>
                    <p className="text-gray-700"><strong>Address:</strong> Spring Valley, Katara Hills, Bhopal</p>
                    <p className="text-gray-700"><strong>Phone:</strong> 9685609494</p>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-4">
                    We will acknowledge the receipt of your complaint within 24 hours and will endeavor to resolve it within 15 days from the date of its receipt.
                  </p>
                </div>
              </div>
            </section>

          </div>

          {/* Footer Note */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              By continuing to use Mounterra, you acknowledge that you have read, understood,
              and agree to be bound by these Terms and Conditions.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;