import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import ListItem from "../../components/ui/ListItem";
import Link from "next/link";
import Head from "next/head";

const TermsOfService = ({ userProfile }) => {
  return (
    <div>
      <Head>
        <title>Winda.guide | Terms of service</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <h1 className="text-center font-bold text-3xl">Terms of service</h1>

      <article className="mt-6 mb-10 px-6 sm:px-10">
        <div className="flex flex-col gap-2">
          <p>
            These Terms of Service (“Terms”) are a binding legal agreement
            between you and Numinous Holdings Ltd (“Winda”) that govern your
            right to use the winda.guide website, and other offerings from
            Winda.guide collectively known as (“Winda Platform”). When used in
            these terms, “Provider”, “Winda,” “we,” “us,” or “our” refers to
            Numinous Holdings Ltd.
          </p>

          <p>
            Winda Platform offers an online location that enables users
            (“Customers”) to book a variety of travel services (“Services”) ie.
            accommodations (“Accommodation”), activities, activities, events
            (“Activities”), and transportation (“Transport”). These travel
            services are offered by providers that we contractually work with to
            sell these services on their behalf. You must register an account to
            access and use many features of Winda, and must keep your account
            information accurate. As the provider of the Winda website, Winda
            does not own, control, offer or manage any listings, activities, or
            transport services. Winda is a platform that gives access to these
            services and organizes them on behalf of guests in the capacity of a
            travel agency.
          </p>

          <p>
            We maintain other terms and policies that supplement these Terms
            like our Privacy Policy, which describes our collection and use of
            personal data, and our Payments Terms, which govern any payment
            services provided to Customers by Winda’s website.
          </p>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-lg">1. Actions on Winda’s website</h1>

          <div className="mt-2 flex flex-col gap-3">
            <p>
              1.1 Browsing. You can browse through different curated trips put
              together by Winda, view them, add in your dates of travel, book
              them as they are, or request to make changes to the curated by way
              of leaving us a message online, via WhatsApp text, calling, or by
              email.
            </p>
            <p>
              1.2 Searching. You can search for Services by using criteria such
              as travel destination and the number of guests. You can also use
              filters to refine your search results. Search results are based on
              their relevance to your search and other criteria. Relevance
              considers factors like price, type of service, the number of
              people, reviews, and popularity.
            </p>{" "}
            <p>
              1.3 Booking. When you book a Listing, you are agreeing to pay all
              charges for your booking including the Listing price, applicable
              fees like Winda’s service fee, offline fees, taxes, and any other
              items identified during checkout (collectively, “Total Price”).
              You are also agreeing that Winda may charge the Payment Method (as
              defined in the Payment Terms) used to book the Listing in order to
              collect Damage Claim (as defined in these Terms) amounts. When you
              receive the booking confirmation, a contract for Services (a
              &quot;Reservation&quot;) is formed directly between you and the
              accommodation, activities, and/or transport providers (“Service
              Providers”). In addition to these Terms, you will be subject to,
              and responsible for complying with, all terms of the Reservation,
              including without limitation, the cancellation policy, and any
              other rules, standards, policies, or requirements identified in
              the Listing or during checkout that apply to the Reservation. It
              is your responsibility to read and understand these rules,
              standards, policies, and requirements prior to booking a Listing.
            </p>
            <p>
              1.4 Accommodation Reservations. An Accommodation Reservation is a
              limited license to enter, occupy and use the Accommodation. The
              Service provider retains the right to grant you entry into the
              accommodation, If you stay past checkout, they have the right to
              charge you in a manner consistent with applicable law. You may not
              exceed the maximum number of allowed Customers.
            </p>{" "}
            <p>
              1.5 Activities Reservations. This Reservation entitles you to
              participate in, attend, or use that Service. You are responsible
              for confirming that you, and anyone you invite, meet minimum age,
              proficiency, fitness, or other requirements. You are responsible
              for informing the Service Provider of any medical or physical
              conditions, or other circumstances that may impact your ability to
              participate, attend or use the Service. Except where expressly
              authorized, you may not allow any person to join a Service unless
              they are included as an additional guest during the booking
              process.
            </p>{" "}
            <p>
              1.6 Transport Reservations. This Reservation entitles you to use
              that transport Service. You are responsible for confirming the
              number of people booked for the service, that you, and anyone you
              invite, meet the minimum age, proficiency, fitness, or other
              requirements for using the relevant transport service. Where
              required should you hire a vehicle without a driver, you are
              responsible for having the relevant document proving your ability
              to operate the hired vehicle. All vehicles that are hired have
              insurance which is included in the rental price. You are
              responsible for informing the Service Provider of any medical or
              physical conditions, or other circumstances that may impact your
              ability to use the Service.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-lg">2. Cancellations, and Refunds</h1>

          <div className="mt-2 flex flex-col gap-2">
            <p>
              2.1 Cancellations, Travel Issues, and Refunds. In general, if you
              cancel a reservation, the amount refunded to you is determined by
              the cancellation policy that applies to that reservation. But, in
              certain situations, other policies take precedence and determine
              what amount is refunded to you. If something outside your control
              requires you to cancel a reservation, you may be entitled to a
              partial or full refund under our cancellation policy under
              extenuating circumstances. If the Service Provider cancels, or you
              activity a Travel Issue (as defined in the cancellation policy),
              you may be entitled to rebooking assistance or a partial or full
              refund under our cancellation policy.
            </p>
            <p>
              2.2 Booking Modifications. You are able to make modifications to
              your booking but that will dall under travel concierge services
              which incur any additional charges. Please refer to our website in
              the section: Travel Concierge. Customers are responsible for any
              booking modifications they make through us or on their behalf
              (&quot;Booking Modifications&quot;) and agree to pay any
              additional amounts, fees, or taxes associated with any Booking
              Modification.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-bold text-lg">3. Customer Responsibilities</div>

          <div className="mt-2">
            <p>
              You are responsible for your own acts and omissions and are also
              responsible for the acts and omissions of anyone you invite to
              join or provide access to any Services. For example, this means:
              (i) you are responsible for leaving an Accommodation, Transport
              and Activity (where applicable) in the condition it was in when
              you arrived, (ii) you are responsible for paying all Damage Claim
              amounts necessary to cover damage that you, your guest(s), cause
              to a Service, and (iii) you must act with integrity, treat others
              with respect and comply with applicable laws at all times. If your
              service reservation includes an additional guest who is a minor or
              if you bring a minor to any Service, you must be legally
              authorized to act on behalf of the minor and you are solely
              responsible for the supervision of that minor.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <div className="font-bold text-lg">4. Taxes</div>

          <div className="mt-2">
            <p>
              4.1 Service Provider Taxes. As a Service Provider, you are
              responsible for determining and fulfilling your obligations under
              applicable laws to report, collect, remit or include in your price
              any applicable VAT or other indirect taxes, occupancy taxes,
              tourist, income, or other taxes (&quot;Taxes&quot;).
            </p>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="font-bold text-lg">5. General Terms</h1>

          <div className="mt-2 flex flex-col gap-2">
            <p>
              5.1 Reviews After each Service, Customers and Service Providers
              will have an opportunity to review each other. Your Review must be
              accurate and may not contain any discriminatory, offensive,
              defamatory, or other language that violates our Content section
              below. Reviews are not verified by Winda for accuracy and may be
              incorrect or misleading.
            </p>{" "}
            <p>
              5.2 Content Parts of the Winda Platform enable you to provide
              feedback, text, photos, audio, video, information, and other
              content (“Content”). By providing Content, in whatever form and
              through whatever means, you grant Winda a non-exclusive,
              worldwide, royalty-free, sub-licensable, and transferable license,
              for the term of the protection of the rights so licensed, to
              access, use, store, copy, modify, prepare derivative works of,
              distribute, publish, transmit, stream, broadcast, and otherwise
              exploit in any manner such Content to provide and/or promote the
              Winda Platform, in any media or platform, known or unknown to date
              and in particular on the Internet and social networks. If Content
              includes personal information, such Content will only be used for
              these purposes if such use complies with applicable data
              protection laws in accordance with our Privacy Policy. Where Winda
              pays for the creation of Content or facilitates its creation,
              Winda may own that Content, in which case supplemental terms or
              disclosures will say that. You are solely responsible for all
              Content that you provide and warrant that you either own it or are
              authorized to grant Winda the rights described in these Terms. You
              are responsible and liable if any of your Content violates or
              infringes the intellectual property or privacy rights of any third
              party. Content must comply with our Content Policy, which
              prohibits, among other things, discriminatory, obscene, harassing,
              deceptive, violent, and illegal content.
            </p>{" "}
            <p>5.3 Winda Platform Rules</p>{" "}
            <p>
              5.3.1 Rules. You must follow these rules and must not help or
              induce others to break or circumvent these rules. Act with
              integrity and treat others with respect Do not lie, misrepresent
              something or someone, or pretend to be someone else. Be polite and
              respectful when you communicate or interact with others. Do not
              discriminate against or harass others. Do not scrape, hack,
              reverse engineer, compromise or impair the Winda Platform Do not
              use bots, crawlers, scrapers or other automated means to access or
              collect data or other content from or otherwise interact with the
              Winda Platform. Do not hack, avoid, remove, impair, or otherwise
              attempt to circumvent any security or technological measure used
              to protect the Winda Platform or Content. Do not decipher,
              decompile, disassemble or reverse engineer any of the software or
              hardware used to provide the Winda Platform. Do not take any
              action that could damage or adversely affect the performance or
              proper functioning of the Winda Platform. Only use the Winda
              Platform as authorized by these Terms or another agreement with us
              You may only use another Customer’s personal information as
              necessary to facilitate a transaction using the Winda Platform as
              authorized by these Terms. Do not use the Winda Platform, our
              messaging tools, or Customer’s personal information to send
              commercial messages without their express consent. You may use
              Content made available through the Winda Platform solely as
              necessary to enable your use of the Winda Platform as a Customer
              or Service Provider. Do not use Content unless you have permission
              from the Content owner or the use is authorized by us in these
              Terms or another agreement you have with us. Do not request, make
              or accept a booking or any payment outside of the Winda Platform
              to avoid paying fees, taxes, or for any other reason. Do not
              require or encourage Customers to open an account, leave a review,
              or otherwise interact, with a third-party website, application or
              service before, during, or after a reservation, unless authorized
              by Winda. Do not engage in any practices that are intended to
              manipulate our search algorithm. Do not book Travel Services
              unless you are actually using the Services. Do not use, copy,
              display, mirror, or frame the Winda Platform, any Content, any
              Winda branding, or any page layout or design without our consent.
              Honor your legal obligations Understand and follow the laws that
              apply to you, including privacy, data protection, and export laws.
              If you provide us with someone else’s personal information, you:
              (i) must do so in compliance with applicable law, (ii) must be
              authorized to do so, and (iii) authorize us to process that
              information under our Privacy Policy. Do not use the name, logo,
              branding, or trademarks of Winda or others without permission. Do
              not use or register any domain name, social media handle, trade
              name, trademark, branding, logo, or other source identifiers that
              may be confused with Winda branding. Do not offer or solicit
              prostitution or participate in or facilitate human trafficking.
            </p>{" "}
            <p>
              5.4 Reporting Violations. If you believe that a Customer, Listing,
              or Content poses an imminent risk of harm to a person or property,
              you should immediately contact local authorities before contacting
              Winda. In addition, if you believe that a Customer, Listing, or
              Content has violated our Standards, you should report your
              concerns to Winda. If you reported an issue to local authorities,
              Winda may request a copy of that report. Except as required by
              law, we are not obligated to take action in response to any
              report.
            </p>{" "}
            <p>
              5.5 Copyright Notifications. If you believe that Content on the
              Winda Platform infringes copyrights, please notify us.
            </p>{" "}
            <p>5.6 Termination, Suspension, and other Measures.</p>{" "}
            <p>
              5.6.1 Term. The agreement between you and Winda reflected by these
              Terms remains in effect until either you or we terminate the
              agreement in accordance with these Terms.
            </p>{" "}
            <p>
              5.6.2 Termination. You may terminate this agreement at any time by
              sending us an email or by deleting your account. Winda may
              terminate this agreement for any reason by giving you 30 days’
              notice via email or using any other contact information you have
              provided for your account. Winda may also terminate this agreement
              immediately and without prior notice and stop providing access to
              the Winda Platform if (i) you materially breach these Terms or our
              Additional Legal Terms, or Policies, (ii) you violate applicable
              laws, or (iii) such action is necessary to protect the personal
              safety or property of Winda, its Customers, or third parties (for
              example in the case of fraudulent behavior of a Customer), or (iv)
              your account has been inactive for more than two years.
            </p>{" "}
            <p>
              5.6.3 Customer Violations. If (i) you breach these Terms, our
              Additional Legal Terms, Policies, or our Standards, (ii) you
              violate applicable laws, regulations, or third party rights, (vi)
              you have repeatedly canceled confirmed bookings or failed to
              respond to booking requests without a valid reason, or (vii) such
              action is necessary to protect the personal safety or property of
              Winda’s Service Provider, its Customers, or third parties, Winda
              may:
            </p>
            <div className="flex flex-col gap-2 ml-2">
              <ListItem>
                suspend or limit your access to or use of the Winda Platform
                and/or your account; suspend or remove Listings, Reviews, or
                other Content;
              </ListItem>

              <ListItem>
                cancel pending or confirmed bookings; or In case of non-material
                violations or where otherwise appropriate, you will be given
                notice of any intended measure by Winda and an opportunity to
                resolve the issue, unless such notification would (i) prevent or
                impede the detection or prevention of fraud or other illegal
                activities, (ii) harm the legitimate interests of other
                Customers or third parties, or (iii) contravene applicable laws.
              </ListItem>
            </div>
            <p>
              5.6.4 Winda may take any action it determines is reasonably
              necessary to comply with applicable law, or the order or request
              of a court, law enforcement, or other administrative agency or
              governmental body, including the measures described above in
              Section 5.6.3.
            </p>
            <p>
              5.6.5 If you are a Service Provider and request to terminate your
              Winda account, any confirmed booking(s) will be automatically be
              cancelled and you will be required to issue a full refund of any
              confirmed bookings if released, otherwise the Customers will
              receive a full refund if we still hold the funds. If you terminate
              your account as a Customer, any confirmed booking(s) will be
              automatically canceled and any refund will depend upon the terms
              of the cancellation policy. When this agreement has been
              terminated, you are not entitled to a restoration of your account
              or any of your Content. If your access to or use of the Winda
              Platform has been limited, or your Winda account has been
              suspended, or this agreement has been terminated by us, you may
              not register a new account or access or use the Winda Platform
              through an account of another Customer.
            </p>{" "}
            <p>
              6. Modification of these Terms When we propose changes to these
              Terms, we will post the revised Terms on the Winda Platform and
              update the “Last Updated” date at the top of these Terms. We will
              provide you with notice of the proposed changes by email at least
              thirty (30) days before the date they become effective. If the
              proposed changes to these Terms are material, you will be asked to
              explicitly accept the revised Terms. Such notice will also inform
              you about your right to reject the proposed changes, the timeframe
              to do so, and your right to terminate the Agreement at any time
              before the effective date of the proposed changes as provided in
              these Terms.
            </p>{" "}
            <p>
              7. Resolving Complaints and Damage Claims If a Service Provider
              has valid evidence that you, or your guest(s), culpably damaged
              their property, or real or personal property the complaining
              Service Provider is responsible for, including consequential
              damages, (&quot;Damage Claim&quot;), and notify Winda to seek
              compensation through Winda. You will be notified of the Damage
              Claim and given an opportunity to respond within 7 days. If you
              agree to pay, Winda will collect the amount of the Damage Claim
              from you. Winda may also pursue against you any remedies it may
              have available under applicable law, including referral of the
              matter to a collections agency, and/or pursuit of available causes
              of action and/or claims against you. You agree to cooperate in
              good faith, provide any information Winda requests, execute
              documents, and take further reasonable action, in connection with
              Damage Claims, Customer/Service Provider complaints, claims under
              insurance policies, or other claims related to your provision or
              use of Services. You may appeal a decision by Winda by contacting
              our customer service. Any decisions made by Winda in relation to a
              Damage Claim do not affect your contractual and statutory rights.
              Your right to take legal action before a court of law remains
              unaffected.
            </p>{" "}
            <p>
              8. Winda’s Role We offer you the right to use a platform that
              enables Customers to, search and book curated trips organized by
              us and Services provided by Service Partners that we work with.
              When Customers make or accept a booking, they are entering into a
              contract directly with the Service Provider. Winda is not and does
              not become a party to or another participant in any contractual
              relationship between the Customer and Service Provider. While we
              work hard to ensure our Customers have great activities using
              Winda, we do not and cannot control the conduct or performance of
              the Service Providers or Customers and do not guarantee (i) the
              existence, quality, safety, suitability, or legality of any
              Listings or Services or (ii) the truth or accuracy of any Listing
              descriptions, Reviews, or other Content provided by Customers or
              Service Providers. Customers and Service Providers agree to
              cooperate with and assist Winda in good faith, and to provide
              Winda with such information, and take such actions as may be
              reasonably requested by Winda with respect to any investigation
              undertaken by Winda regarding the use or abuse of the Winda
              Platform.
            </p>{" "}
            <p>
              9. Customer Accounts You must register an account to access and
              use many features of the Winda Platform. Registration is only
              permitted for legal entities, partnerships and natural persons who
              are 18 years or older. You represent and warrant that you are not
              a person or entity barred from using the Winda Platform under the
              laws of Kenya, your place of residence, or any other applicable
              jurisdiction. You must provide accurate, current, and complete
              information during registration and keep your account information
              up-to-date. You may not register more than one account or transfer
              your account to someone else. You are responsible for maintaining
              the confidentiality and security of your account credentials and
              may not disclose your credentials to any third party. You must
              immediately notify Winda if you suspect that your credentials have
              been lost, stolen, or your account is otherwise compromised. You
              are responsible and liable for activities conducted through your
              Winda Account, unless such activities are not authorized by you
              and you are not otherwise negligent (such as failing to report the
              unauthorized use or loss of your credentials).
            </p>{" "}
            <p>
              10. Disclaimer We do not endorse or warrant the existence,
              conduct, performance, safety, quality, legality or suitability of
              any Customer, Service Provider, Listing, or third party and we do
              not warrant that verification, identity, or background checks
              conducted on Customers or Service Providers (if any) will identify
              past misconduct or prevent future misconduct.
            </p>{" "}
            <p>
              11. Liability Winda is liable under statutory provisions for
              intent and gross negligence by us, our legal representatives,
              directors, or other vicarious agents. The same applies to the
              assumption of guarantees or any other strict liability, or in case
              of a culpable injury to life, limb, or health. For any negligent
              breaches of essential contractual obligations by us, our legal
              representatives, directors, or other vicarious agents Winda’s
              liability is limited to the typically occurring foreseeable
              damages. Essential contractual obligations are such duties of
              Winda in whose proper fulfillment you regularly trust and must
              trust for the proper execution of the contract. Any additional
              liability of Winda is excluded.
            </p>{" "}
            <p>
              12. Indemnification To the maximum extent permitted by applicable
              law, you agree to release, defend (at Winda’s option), indemnify,
              and hold Winda (including other affiliates, and their personnel)
              harmless from and against any claims, liabilities, damages,
              losses, and expenses, including, without limitation, reasonable
              legal and accounting fees, arising out of or in any way connected
              with: (i) your breach of these Terms (including any supplemental
              or additional terms that apply to a product or feature) or our
              Additional Legal Terms, Policies, or Standards, (ii) your improper
              use of the Winda Platform, (iii) your interaction with any
              Customer, stay at an Accommodation, participation in an activity
              or use of transport services, including without limitation any
              injuries, losses or damages (whether compensatory, direct,
              incidental, consequential or otherwise) of any kind arising in
              connection with or as a result of such interaction, stay,
              participation or use, (iv) your failure, or our failure at your
              direction, to accurately report, collect or remit Taxes, or (v)
              your breach of any laws, regulations or third party rights such as
              intellectual property or privacy rights. The indemnification
              obligation only applies if and to the extent that the claims,
              liabilities, damages, losses, and expenses have been adequately
              caused by your culpable breach of a contractual obligation.
            </p>{" "}
            <p>
              13. Applicable law and Jurisdiction These Terms are governed by
              and construed in accordance with Kenya law. If you are acting as a
              consumer and if mandatory statutory consumer protection
              regulations in your country of residence contain provisions that
              are more beneficial for you, such provisions shall apply
              irrespective of the choice of Kenyan law. As a consumer, you may
              bring any judicial proceedings relating to these Terms before the
              competent court of your place of residence or the competent court
              of Winda’s place of business in Kenya. If Winda wishes to enforce
              any of its rights against you as a consumer, we may do so only in
              the courts of the jurisdiction in which you are a resident. If you
              are acting as a business, you agree to submit to the exclusive
              jurisdiction of the Kenyan courts.
            </p>{" "}
            <p>14. Miscellaneous</p>{" "}
            <p>
              14.1 No Waiver. Winda’s failure to enforce any right or provision
              in these Terms will not constitute a waiver of such right or
              provision unless acknowledged and agreed to by us in writing.
              Except as expressly set forth in these Terms, the exercise by
              either party of any of its remedies under these Terms will be
              without prejudice to its other remedies under these Terms or
              otherwise permitted under law.
            </p>{" "}
            <p>
              14.2 Assignment. You may not assign, transfer or delegate this
              agreement or your rights and obligations hereunder without Winda’s
              prior written consent. Winda may without restriction assign,
              transfer, or delegate this agreement and any rights and
              obligations hereunder, at its sole discretion, with 30 days’ prior
              notice. Your right to terminate this agreement at any time
              pursuant to Section 5.6 remains unaffected.
            </p>{" "}
            <p>
              14.3 Notice. Unless specified otherwise, any notices or other
              communications to Customers or Service Providers permitted or
              required under this agreement, will be provided electronically and
              given by Winda via email, Winda Platform notification, messaging
              service (including SMS and WhatsApp), or any other contact method
              we enable you to provide.
            </p>
            <p>
              14.4 Third-Party Services. The Winda Platform may contain links to
              third-party websites, applications, services, or resources
              (“Third-Party Services”) that are subject to different terms and
              privacy practices. Winda is not responsible or liable for any
              aspect of such Third-Party Services and links to such Third-Party
              Services are not an endorsement.
            </p>{" "}
            <p>
              14.5 Google Terms. Some areas of the Winda Platform implement
              Google Maps/Earth mapping services, including Google Maps API(s).
              Your use of Google Maps/Earth is subject to the Google Maps/Google
              Earth Additional Terms of Service.
            </p>{" "}
            <p>
              14.6 Winda Platform Content. Content made available through the
              Winda Platform may be protected by copyright, trademark, and/or
              other laws of Kenya and other countries. You acknowledge that all
              intellectual property rights for that Content are the exclusive
              property of Winda and/or its licensors and agree that you will not
              remove, alter or obscure any copyright, trademark, service mark or
              other proprietary rights notices. You may not use, copy, adapt,
              modify, prepare derivative works of, distribute, license, sell,
              transfer, publicly display, publicly perform, transmit, broadcast
              or otherwise exploit any Content accessed through the Winda
              Platform except to the extent you are the legal owner of that
              Content or as expressly permitted in these Terms. Subject to your
              compliance with these Terms, Winda grants you a limited,
              non-exclusive, non-sublicensable, revocable, non-transferable
              license to (i) download and use the Application on your personal
              device(s); and (ii) access and view the Content made available on
              or through the Winda Platform and accessible to you, solely for
              your personal and non-commercial use.
            </p>{" "}
            <p>
              14.7 Force Majeure. Winda shall not be liable for any delay or
              failure to perform resulting from causes outside its reasonable
              control, including, but not limited to, acts of God, war,
              terrorism, riots, embargoes, acts of civil or military
              authorities, fire, floods, accidents, epidemics or disease,
              strikes or shortages of transportation facilities, fuel, energy,
              labor or materials.
            </p>{" "}
            <p>
              14.8 Emails and SMS. You will receive administrative
              communications from us using the email address or other contact
              information you provide for your Winda account. Enrollment in
              additional email subscription programs will not affect the
              frequency of these administrative emails, though you should expect
              to receive additional emails specific to the program(s) to which
              you have subscribed. You may also receive promotional emails from
              us. No fee is charged for these promotional emails, but
              third-party data rates could apply. You can control whether you
              receive promotional emails using the notification preferences in
              your account settings. Please note that you will not be able to
              take advantage of certain promotions if you disable certain
              communication settings or do not have a Winda Account.
            </p>{" "}
            <p>
              14.9 Contact Us If you have any questions about these Terms please
              email or whatsApp us.
            </p>
            <p>15. Dispute Resolution and Arbitration Agreement.</p>{" "}
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
            </p>{" "}
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
            <p>
              16. Additional Distribution Channels Winda operates an affiliate
              program through which Listings may be featured on third-party
              websites, such as those for online travel sites, media outlets,
              loyalty programs, and search aggregators. Listings may also appear
              in advertisements for Winda published on third-party websites from
              time to time.
            </p>
          </div>
        </div>
      </article>

      <div>
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

TermsOfService.propTypes = {};

export default TermsOfService;
