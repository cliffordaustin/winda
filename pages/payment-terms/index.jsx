import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import ListItem from "../../components/ui/ListItem";
import Head from "next/head";

const PaymentTerms = ({ userProfile }) => {
  return (
    <div className="">
      <Head>
        <title>Winda.guide | Payment terms</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <article className="mb-24">
        <h1 className="text-center font-bold text-3xl">
          Payment Terms of Service
        </h1>

        <div className="mt-6 mb-10 px-6 sm:px-16">
          <h2 className="font-bold text-sm mb-4">
            Last Updated on 28th August 2022
          </h2>

          <p className="mb-3">
            These Payments Terms of Service (“Payment Terms”) are a binding
            legal agreement between you and Numinous Holdings Ltd (“Winda
            Platform”). When these Payment Terms mention “Winda,” “we,” “us,” or
            “our,” it refers to Numinous Holdings Ltd.
          </p>

          <p className="mb-3">
            Winda Platform provides payment services to Customers and Service
            Providers booking and listing of Accommodations, Activities, or
            transport. These payment services may include (if available) the
            following (collectively, “Payment Services”):
          </p>

          <p className="mb-3">
            Collecting payments from Customers (“Incoming payments”) by charging
            the payment method associated with their Winda accounts, such as
            credit card, debit card, mobile payment account, bank account or
            PayPal account (“Payment Method”); Releasing payments to Service
            Providers (“Payout”) through their bank or mobile money accounts
            (“Payout Method”); Payment collection services; and In order to use
            the Payment Services, you must be at least 18 years old, must have a
            Winda account in good standing in accordance with the Winda Terms of
            Service (“Terms”), and must keep your payment and personal
            information accurate and complete.
          </p>

          <h1 className="font-bold !text-base mb-2">
            1. Your use of the Payment Services
          </h1>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              1.1 Verification. You authorize the Winda Platform, directly or
              through third parties, to make any inquiries we consider necessary
              to verify your identity and the information you provide. This may
              include (i) screening you against third-party databases or other
              sources, (ii) requesting reports from service providers, (iii)
              asking you to provide a form of government identification (e.g.,
              driver’s license or passport), your date of birth, your address,
              and other information; or (iv) requiring you to take steps to
              confirm ownership of your email address, Payment Method(s) or
              Payout Method(s). Winda reserves the right to terminate, suspend,
              or limit access to the Payment Services in the event we are unable
              to obtain or verify any of this information.
            </p>
            <p>
              1.2 Additional Terms. Your access to or use of certain Payment
              Services may be subject to or require you to accept additional
              terms and conditions. If there is a conflict between these Payment
              Terms and terms and conditions applicable to a specific Payment
              Service, the latter terms and conditions will take precedence with
              respect to your use of or access to that Payment Service, unless
              specified otherwise.
            </p>
          </div>

          <h1 className="font-bold !text-base mb-2">2. Customer Terms</h1>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              2.1 Adding a Payment Method. When you add a Payment Method to your
              Winda account, you will be asked to provide billing information
              such as name, billing address, and financial instrument
              information either to Airbnb Payments or its third-party payment
              processor(s). You authorize Winda and its payment service
              providers to collect and store your Payment Method information.
            </p>
            <p>
              2.2 Payment Method Verification. When you add or use a new Payment
              Method, Winda may verify the Payment Method by (i) authorizing
              your Payment Method for one or two nominal amounts via a payment
              service provider, and asking you to confirm those amounts, or (ii)
              requiring you to upload a billing statement. We may, and retain
              the right to, initiate refunds of these amounts from your Payment
              Method. When you add a Payment Method during checkout, we will
              automatically save and add that Payment Method to your Winda
              account so it can be used for a future transaction. You can remove
              the Payment Method from your Winda account as long as it is not
              associated with an active or future reservation.
            </p>
            <p>
              2.3 Payment Authorization. You allow Winda to charge your Payment
              Method (including charging more than one payment method), either
              directly or indirectly, for all fees due (including any applicable
              taxes) in connection with your Winda account, including Damage
              Claim amounts in accordance with the Winda Terms of Service.
            </p>
            <p>
              2.4 Automatic Update of Payment Method. If your Payment Method’s
              account information changes (e.g., account number, routing number,
              expiration date) as a result of re-issuance or otherwise, we may
              acquire that information from our financial services partners or
              your bank and automatically update your Payment Method on file.
            </p>
            <p>
              2.5 Timing of Payment. Winda generally charges the Total Price due
              after the Service provider accepts your booking request. Winda may
              offer alternative options for the timing and manner of payment.
              Any additional fees for using those alternative payment options
              will be displayed via the Winda Platform and included in the Total
              Price, and you agree to pay such fees by selecting the payment
              option. Additional terms and conditions may apply for the use of
              an alternative payment option.
            </p>

            <p>
              2.6 Currency. Airbnb Payments will process each transaction in the
              currency you select via the Winda Platform. The currencies
              available to make payments may be limited for regulatory or
              operational reasons based on factors such as your selected Payment
              Method or your country of residence. Any such limitations will be
              communicated via the Winda Platform, and you will be prompted to
              select a different currency or Payment Method. Certain fees may
              apply and the amount listed on your card statement may be
              different from the amount shown at checkout. For example, if you
              make a booking using a U.S. issued card, but select Euro as your
              currency, your payment may be processed outside the U.S., and
              banks and credit card companies may impose international
              transaction fees and foreign exchange fees. In addition, if you
              select to pay with a currency that is different than your Payment
              Method&apos;s billing currency, your bank or credit card company
              may convert the payment amount to your billing currency associated
              with your Payment Method, based on an exchange rate and fee amount
              determined solely by your bank. Winda is not responsible for any
              such fees and disclaims all liability in this regard. Please
              contact your bank or credit card company if you have any questions
              about these fees or the applicable exchange rate.
            </p>
            <p>
              2.7 Booking Request Status. If a requested booking is declined
              because the service is not available, we will provide an
              alternative service for you to choose upon which you will be
              charged a new amount, if you wish to book the service. If you
              cancel the booking request before it is accepted by the Service
              Provider, or Winda cancels the booking, any amounts collected by
              Winda and due to you, will be refunded to you, and any
              pre-authorization of your Payment Method will be released (if
              applicable).
            </p>
            <p>
              2.8 Payment Restrictions. Winda reserves the right to decline or
              limit payments that we believe (i) may violate Winda’s risk
              management policies or procedures, (ii) may violate these Payments
              Terms or the Terms, (iii) are unauthorized, fraudulent, or
              illegal; or (iv) expose you, Winda, or others to risks
              unacceptable to Winda.
            </p>
            <p>
              2.9 Payment Service Providers. Payment Methods may involve the use
              of third-party payment service providers. These payment service
              providers may charge you additional fees when processing payments
              in connection with the Payment Services, and Winda is not
              responsible for any such fees and disclaims all liability in this
              regard. Your Payment Method may also be subject to additional
              terms of use. Please review them before using your Payment Method.
            </p>
            <p>
              2.10 Your Payment Method, Your Responsibility. Winda is not
              responsible for any loss suffered by you as a result of incorrect
              Payment Method information provided by you.
            </p>
            <p>2.11 Different Ways to Pay</p>
            <p>2.11.1 Payment Plan</p>

            <p>
              2.11.1.1 Winda may make available to Customers the option to pay a
              portion of the booking’s Total Price at the time of booking and
              pay the remainder of the Total Price at a later time no later than
              45 days prior to check-in (“Payment Plan”). Availability of this
              option may depend on the service provided.
            </p>

            <p>
              2.11.1.2 If you choose a Payment Plan, the Winda will notify you
              during check out of the amount, currency, and schedule of each
              payment due. On the following payment due date, Winda will
              automatically charge the original Payment Method you used to make
              the booking.
            </p>

            <p>
              2.11.1.3 If you make a modification to a booking made with a
              Payment Plan, Winda will notify you of the revised payment
              schedule, as applicable. If the modification increases your Total
              Price, you may be required to make an additional partial payment
              of the new Total Price at the time of the modification.
            </p>

            <p>
              2.11.1.4 You agree that by selecting a Payment Plan, you may not
              be able to pay for the booking with a different Payment Method or
              pursuant to a different payment schedule.
            </p>

            <p>
              2.11.1.5 If Winda is unable to collect your payment, we will
              notify you of such a declined payment, and require you to complete
              the payment using an alternative Payment Method within 48 hours of
              the notice. If you fail to complete the payment, you authorize
              Winda to cancel the booking on your behalf. If the booking is
              canceled, you will be refunded based on our cancellation policy.
              You acknowledge that you may incur fees for cancellations pursuant
              to the cancellation policy.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">
            3. Service Provider Terms
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              3.1 Payment Collection. Winda may collect a portion or the Total
              Price of a booking at the time the Customer booking request is
              accepted by the Service Provider.
            </p>

            <p>
              3.2 Valid Payout Method. In order to receive a Payout, you must
              have a valid Payout Method linked to your Winda.
            </p>
            <p>
              3.3 Timing of Payout. Subject to and conditional upon successful
              receipt of the payments from the Customer, Winda will generally
              initiate Payouts to your selected Payout Method 72 hours after
              receipt of the Payment, this may be longer depending on the payout
              duration by Winda’s Payment Service Provider.
            </p>

            <p>
              3.4 Payout. Your Payout for a booking will be the Total Price less
              applicable Winda commissions and fees like applicable taxes. In
              the event of cancellation of a confirmed booking, Winda will remit
              the amount you are due (if any) as provided in the Terms and
              applicable cancellation policy.
            </p>

            <p>
              3.5 Payout Restrictions. Winda may temporarily place a hold,
              suspend, or cancel any Payout for purposes of preventing unlawful
              activity or fraud, risk assessment, security, or completing an
              investigation; or if we are unable to verify your identity, or to
              obtain or verify the requested information. Furthermore, Winda may
              temporarily place a hold on, suspend, or delay initiating or
              processing any Payout due to you under the Terms as a result of
              high volume Booking cancellations or modifications arising from a
              Force Majeure Event (as defined below).
            </p>

            <p>
              3.6 Currency Conversion. Airbnb Payments will remit your Payouts
              in the currency you select. The currencies available may be
              limited for regulatory or operational reasons based on factors
              such as your selected Payout Method,or your country of residence.
              Any such limitations will be communicated by Winda, and you will
              be prompted to select a different currency or Payout Method. Note
              that payment service providers may impose transaction, currency
              conversion or other fees based on the currency or Payout Method
              you select, and Winda is not responsible for any such fees and
              disclaims all liability in this regard.
            </p>

            <p>
              3.7 Payment Service Providers. Payout Methods may involve the use
              of third-party payment service providers. These payment service
              providers may charge you additional fees when processing Payouts
              in connection with the Payment Services (including deducting
              charges from the Payout amount), and Winda is not responsible for
              any such fees and disclaims all liability in this regard. Your
              Payout Method may also be subject to additional terms of use.
              Please review them before using your Payout Method.
            </p>

            <p>
              3.8 Handling of Funds. Winda may combine amounts that it collects
              from Customers and invest them as permitted under applicable laws.
              Winda will retain any interest it earns on those investments.
            </p>

            <p>
              3.9 Your Payout Method, Your Responsibility. Winda is not
              responsible for any loss suffered by you as a result of incorrect
              Payout Method information provided by you.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">4. Collections</div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              4.1 If Winda is unable to collect any amounts you owe under the
              Terms and these Payments Terms, we may engage in collection
              efforts to recover such amounts from you.
            </p>

            <p>
              4.2 Winda will deem any owed amounts overdue when: (a) for
              authorized charges, fourteen (14) days have elapsed after Winda
              first attempts to charge your Payment Method and (b) for
              withholdings from a service provider’s future Payouts, sixty (60)
              days have elapsed after the adjustment is made to the Service
              Provider’s account or the associated services have been provided,
              whichever is later.
            </p>

            <p>
              4.3 You hereby explicitly agree that all communications in
              relation to amounts owed will be made by electronic mail or by
              phone, as provided to Winda by you. Such communications may be
              made by Winda, or by anyone on their behalf, including but not
              limited to a third-party collection agent.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">
            5. Payment Processing Errors
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              5.1 Winda will take the necessary steps to rectify any payment
              processing errors that we become aware of. These steps may include
              crediting or debiting (as appropriate) the original Payout Method
              or Payment Method used or selected by you so that you end up
              receiving or paying the correct amount. This may be performed by
              Winda or a third party such as your financial institution. We may
              also take steps to recover funds sent to you in error (including
              but not limited to an event of duplicate payments made to you due
              to a processing error), by reducing, setting off, and/or debiting
              the number of such funds from any future Payouts owed to you.
            </p>

            <p>
              5.2 To the extent you receive any funds in error, you agree to
              immediately return such funds to Winda.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">6. Refunds</div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              6.1 Any refunds or credits due to a Member pursuant to the Terms,
              Cancellation Policy will be initiated and remitted by Winda in
              accordance with these Payments Terms.
            </p>

            <p>
              6.2 Winda will initiate the refund process immediately. In certain
              instances, the refund process may include the option to receive
              credit in lieu of a cash refund; if this option is made available
              to you, the timing of your refund will be communicated via the
              Winda Platform. The time it takes to receive any cash refund or
              for any pre-authorization of your Payment Method to be released
              will vary based on the Payment Method and any applicable payment
              system (e.g., Visa, Mastercard, etc.) rules. In the event of a
              Force Majeure Event that may affect the processing and settlement
              of refunds, Winda will initiate and process the refund as soon as
              practicable.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">
            7. Damage Claims and Damage Amounts
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              7.1 If Winda determines that you are responsible for Damage Claim
              amounts, pursuant to the Terms, you authorize Winda to charge the
              Payment Method used to make the booking in order to collect Damage
              Claim amounts, up to a maximum amount as set by Winda that may
              vary by country/region. If Winda is unable to collect from the
              Payment Method used to make the booking, you agree that Winda may
              charge any other Payment Method on file in your Winda account at
              the time of the Damage Claim (unless you have previously removed
              the authorization to charge such Payment Method(s)).
            </p>

            <p>
              7.2 You agree that Winda may seek to recover from you under any
              insurance policies you maintain and that Winda may also pursue
              against you any remedies it may have available, including, but not
              limited to, referral to a collections agency, or pursuit of causes
              of action or claims against you, including in relation to a Damage
              Claim, or payment requests made by Service Providers.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">
            8. Prohibited Activities
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              8.1 You are solely responsible for compliance with any and all
              laws, rules, regulations, and tax obligations that may apply to
              your use of the Payment Services. In connection with your use of
              the Payment Services, you may not and you agree that you will not
              and will not assist or enable others to:
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-3 ml-4">
            <ListItem className="!text-base">
              breach or circumvent any applicable laws or regulations;
            </ListItem>

            <ListItem className="!text-base">
              breach or circumvent any agreements with third parties,
              third-party rights, or the Terms, Additional Legal Terms,
              Policies, or Standards;
            </ListItem>

            <ListItem className="!text-base">
              use the Payment Services for any commercial or other purposes that
              are not expressly permitted by these Payments Terms;
            </ListItem>

            <ListItem className="!text-base">
              register or use any Payment Method or Payout Method with your
              Winda account that is not yours or you do not have the
              authorization to use;
            </ListItem>

            <ListItem className="!text-base">
              avoid, bypass, remove, deactivate, impair, descramble, or
              otherwise circumvent any technological measure implemented by
              Winda or any of Winda’s providers or any other third party to
              protect the Payment Services;
            </ListItem>

            <ListItem className="!text-base">
              take any action that damages or adversely affects, or could damage
              or adversely affect, the performance or proper functioning of the
              Payment Services;
            </ListItem>

            <ListItem className="!text-base">
              attempt to decipher, decompile, disassemble, or reverse engineer
              any of the software used to provide the Payment Services; or
            </ListItem>

            <ListItem className="!text-base">
              violate or infringe anyone else’s rights or otherwise cause harm
              to anyone.
            </ListItem>
          </div>

          <div className="font-bold !text-base mb-2">9. Force Majeure</div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              Winda shall not be liable for any delay or failure to fulfill any
              obligation under these Payments Terms resulting from causes
              outside the reasonable control of Winda, including, but not
              limited to, acts of God, natural disasters, war, terrorism, riots,
              embargoes, acts of civil or military authorities, fire, floods,
              accidents, pandemics, epidemics or disease, strikes or shortages
              of transportation facilities, fuel, energy, labor or materials
              (“Force Majeure Event”).
            </p>
          </div>

          <div className="font-bold !text-base mb-2">10. Disclaimers</div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              10.1 If you choose to use Winda’s Payment Services, you do so
              voluntarily and at your sole risk. To the maximum extent permitted
              by law, the Payment Services are provided “as is”, without
              warranty of any kind, either express or implied.
            </p>

            <p>
              10.2 Notwithstanding Winda’s appointment as the limited payment
              collection agent of Service Providers, Winda explicitly disclaims
              all liability for any act or omission of any Customer or other
              third party. Winda does not have any duties or obligations for
              each Service Provider except to the extent expressly set forth in
              these Payments Terms, and any additional duties or obligations as
              may be implied by law are, to the maximum extent permitted by
              applicable law, expressly excluded.
            </p>

            <p>
              10.3 If we choose to conduct identity verification on any
              Customer, to the extent permitted by applicable law, we disclaim
              warranties of any kind, either express or implied, that such
              checks will identify prior misconduct by a Customer or guarantee
              that a Customer will not engage in misconduct in the future.
            </p>

            <p>
              10.4 The foregoing disclaimers apply to the maximum extent
              permitted by law. You may have other statutory rights or
              warranties which cannot lawfully be excluded. However, the
              duration of any statutorily required warranties shall be limited
              to the maximum extent (if any) permitted by law.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">11. Liability</div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              11.1 You acknowledge and agree that, to the maximum extent
              permitted by law, the entire risk arising out of your access to
              and use of Winda’s Payment Services remains with you. If you
              permit or authorize another person to use your Winda account in
              any way, you are responsible for the actions taken by that person.
              Neither Winda nor any other party involved in creating, producing,
              or delivering the Payment Services will be liable for any
              incidental, special, exemplary, or consequential damages,
              including lost profits, loss of data or loss of goodwill, service
              interruption, computer damage or system failure or the cost of
              substitute products or services, or for any damages for personal
              or bodily injury or emotional distress arising out of or in
              connection with (i) these Payments Terms, (ii) from the use of or
              inability to use the Payment Services, or (iii) from any
              communications, interactions, or meetings with other Customer or
              other persons with whom you communicate, interact, transact, or
              meet with as a result of your use of the Payment Services, whether
              based on warranty, contract, tort (including negligence), product
              liability, or any other legal theory, and whether or not Winda has
              been informed of the possibility of such damage, even if a limited
              remedy set forth herein is found to have failed of its essential
              purpose. Except for our obligations to pay amounts to applicable
              Service Providers pursuant to these Payments Terms, in no event
              will Winda aggregate liability arising out of or in connection
              with these Payments Terms and your use of the Payment Services
              including, but not limited to, from your use of or inability to
              use the Payment Services, exceed (i) the amounts you have paid or
              owe for bookings via the Winda Platform as a Customer in the
              twelve (12) month period prior to the event giving rise to the
              liability, or if you are a Service Provider, the amounts paid by
              Winda to you in the twelve (12) month period prior to the event
              giving rise to the liability, or (ii) one hundred U.S. dollars
              (US$100), if no such payments have been made, as applicable. The
              limitations of damages set forth above are fundamental elements of
              the basis of the bargain between Winda and you. Some jurisdictions
              do not allow the exclusion or limitation of liability for
              consequential or incidental damages, so the above limitation may
              not apply to you. If you reside outside of the U.S., this does not
              affect Winda’s liability for death or personal injury arising from
              its negligence, nor for fraudulent misrepresentation,
              misrepresentation as to a fundamental matter, or any other
              liability which cannot be excluded or limited under applicable
              law.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">12. Indemnification</div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              To the maximum extent permitted by applicable law, you agree to
              release, defend (at Winda’s option), indemnify, and hold Winda and
              its affiliates and subsidiaries, and their officers, directors,
              employees, and agents, harmless from and against any claims,
              liabilities, damages, losses, and expenses, including, without
              limitation, reasonable legal and accounting fees, arising out of
              or in any way connected with (i) your breach of these Payments
              Terms; (ii) your improper use of the Payment Services; (iii) your
              failure, or our failure at your direction, to accurately report,
              collect or remit taxes; or (iv) your breach of any laws,
              regulations, or third-party rights.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">
            13. Modification, Term, Termination, and other Measures
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              13.1 Modification. Except as otherwise required by applicable law,
              Winda may modify these Payments Terms at any time. If we make
              material changes to these Payment Terms, we will post the revised
              Payment Terms on the Winda Platform and update the “Last Updated”
              date at the top of these Payment Terms. If you are affected by the
              modification, we will also provide you with notice of the
              modifications at least thirty (30) days before the date they
              become effective.
            </p>

            <p>
              13.2 Term. This agreement between you and Winda reflected by these
              Payment Terms is effective when you create a Winda account or use
              the Payment Services and remains in effect until either you or we
              terminate this agreement.
            </p>

            <p>
              13.3 Termination. You may terminate this agreement at any time by
              sending us an email or by deleting your Winda account. Terminating
              this agreement will also serve as notice to cancel your Winda
              account pursuant to the Terms. Without limiting our rights
              specified below, Winda may terminate this agreement for
              convenience at any time by giving you thirty (30) days notice via
              email to your registered email address. Winda may also terminate
              this agreement immediately without notice if (i) you have
              materially breached your obligations under this agreement; (ii)
              you have provided inaccurate, fraudulent, outdated, or incomplete
              information; (iii) you have violated applicable laws, regulations,
              or third-party rights; or (iv) Winda believes in good faith that
              such action is reasonably necessary to protect other Customers,
              Winda, or third parties.
            </p>

            <p>
              13.4 Suspension and Other Measures. Winda may limit or temporarily
              or permanently suspend your use of or access to the Payment
              Services (i) to comply with applicable law, or the order or
              request of a court, law enforcement, or other administrative
              agency or governmental body, (ii) if you have breached these
              Payments Terms, the Terms, applicable laws, regulations or
              third-party rights, (iii) if you have provided inaccurate,
              fraudulent, outdated, or incomplete information regarding a
              Payment Method or Payout Method, (iv) for any amounts you owe
              under these Payments Term that are overdue or in default, or (v)
              if Winda believes in good faith that such action is reasonably
              necessary to protect the personal safety or property of Winda, its
              Customers, Service Providers, or third parties, or to prevent
              fraud or other illegal activity. Further, for unsuccessful payment
              due to card expiration, insufficient funds, or otherwise, we may
              temporarily suspend your access to the Payment Services until we
              can charge a valid Payment Method.
            </p>

            <p>
              13.5 Appeal. If Winda takes any of the measures described in
              Sections 13.3 and 13.4 you may appeal such a decision by
              contacting customer service.
            </p>

            <p>
              13.6 Effect of Termination. If you cancel your partnership with us
              as a Service Provider or Winda takes any of the measures described
              above, we may provide a full refund to any Customers with
              confirmed booking(s), and you will not be entitled to any
              compensation for pending or confirmed bookings that were canceled.
              If you cancel your Winda account as a Customer, Winda will
              initiate a refund for any confirmed booking(s) based on the
              Service Provider’s cancellation policy. If your access to or use
              of the Payment Services has been suspended or limited or this
              agreement has been terminated by us, you may not register a new
              Winda account or attempt to access and use the Payment Services
              through a Winda account of another Customer.
            </p>
          </div>

          <div className="font-bold !text-base mb-2">
            14. Governing Law and Dispute Resolution
          </div>

          <div className="flex flex-col gap-2 mb-3">
            These Terms are governed by and construed in accordance with Kenya
            law. If you are acting as a consumer and if mandatory statutory
            consumer protection regulations in your country of residence contain
            provisions that are more beneficial for you, such provisions shall
            apply irrespective of the choice of Kenyan law. As a consumer, you
            may bring any judicial proceedings relating to these Terms before
            the competent court of your place of residence or the competent
            court of Winda’s place of business in Kenya. If Winda wishes to
            enforce any of its rights against you as a consumer, we may do so
            only in the courts of the jurisdiction in which you are a resident.
            If you are acting as a business, you agree to submit to the
            exclusive jurisdiction of the Kenyan courts.
          </div>

          <div className="font-bold !text-base mb-2">
            15. Dispute Resolution and Arbitration Agreement.
          </div>

          <div className="flex flex-col gap-2 mb-3">
            <p>
              15.1 Overview of Dispute Resolution Process. Winda is committed to
              participating in a consumer-friendly dispute resolution process.
              To that end, these Terms provide for a two-part process for
              individuals to whom this Section 15 applies: (1) an informal
              negotiation directly with Winda’s customer service team (described
              in paragraph 15.2, below), and if necessary (2) a binding
              arbitration administered by the London Court of International
              Arbitration (“LCIA”). You and Winda each retain the right to seek
              relief in small claims court as an alternative to arbitration.
            </p>

            <p>
              15.2 Mandatory Pre-Arbitration Dispute Resolution and
              Notification. At least 30 days prior to initiating an arbitration,
              you and Winda each agree to notify the other party of the dispute
              in writing and attempt in good faith to negotiate an informal
              resolution. You must send your notice of the dispute to Winda by
              mailing it to Winda’s address: P.O. Box 1345, 00606, Sarit Center,
              Westlands, Nairobi, Kenya. Winda will send its notice of dispute
              to the email address associated with your Winda account. A notice
              of dispute must include: the party’s name and preferred contact
              information, a brief description of the dispute, and the relief
              sought. If the parties are unable to resolve the dispute within
              the 30-day period, only then may either party commence arbitration
              by filing a written Demand for Arbitration with the LCIA and
              providing a copy to the other party as specified in the LCIA
              Rules.
            </p>

            <p>
              15.3 Agreement to Arbitrate. You and Winda mutually agree that any
              dispute, claim or controversy arising out of or relating to these
              Terms or the applicability, breach, termination, validity,
              enforcement or interpretation thereof, or any use of the Winda
              Platform, Travel Services, or any Content (collectively,
              “Disputes”) will be settled by binding individual arbitration (the
              “Arbitration Agreement”). If there is a dispute about whether this
              Arbitration Agreement can be enforced or applies to our Dispute,
              you and Winda agree that the arbitrator will decide that issue.
            </p>

            <p>
              15.4 Arbitration Rules and Governing Law. The arbitration will be
              administered by LCIA in accordance with the Consumer Arbitration
              Rules and/or other LCIA arbitration rules determined to be
              applicable by the LCIA.
            </p>
          </div>
        </div>
      </article>

      <div className="">
        <Footer></Footer>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  try {
    const token = getToken(context);

    if (token) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_baseURL}/user/`,
        {
          headers: {
            Authorization: "Token " + token,
          },
        }
      );

      return {
        props: {
          userProfile: response.data[0],
        },
      };
    }

    return {
      props: {
        userProfile: "",
      },
    };
  } catch (error) {
    if (error.response.status === 401) {
      return {
        redirect: {
          permanent: false,
          destination: "/logout",
        },
      };
    } else {
      return {
        props: {
          userProfile: "",
        },
      };
    }
  }
}

PaymentTerms.propTypes = {};

export default PaymentTerms;
