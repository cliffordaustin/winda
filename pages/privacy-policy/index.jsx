import React from "react";
import PropTypes from "prop-types";
import Navbar from "../../components/Home/InHeaderNavbar";
import axios from "axios";

import getToken from "../../lib/getToken";
import Footer from "../../components/Home/Footer";
import Link from "next/link";
import ListItem from "../../components/ui/ListItem";
import Head from "next/head";

const PrivacyPolicy = ({ userProfile }) => {
  return (
    <div className="">
      <Head>
        <title>Winda.guide | Privacy Policy</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <Navbar
        userProfile={userProfile}
        logoImage="/images/winda_logo/horizontal-blue-font.png"
        isHomePage={true}
      ></Navbar>

      <article className="mb-24">
        <h1 className="text-center font-bold text-3xl">Privacy policy</h1>

        <div className="mt-6 mb-10 px-6 sm:px-16">
          <h2 className="font-bold text-sm mb-4">
            Last Updated on 28th August 2022
          </h2>
          <p>
            This Privacy Policy describes how Numinous Holdings Ltd. (“Winda”)
            and its affiliates (“we,” “us”), process personal information in
            relation to your use of the Winda Platform.
          </p>

          <h1 className="font-bold !text-base mb-1 mt-3">1.DEFINITIONS</h1>

          <p className="mb-2">
            Undefined terms in this Privacy Policy have the same definition as
            in our{" "}
            <Link href="/terms-of-service">
              <a>
                <div className="text-blue-500 underline inline">
                  Terms of Service
                </div>
              </a>
            </Link>{" "}
            (“Terms”).
          </p>

          <h1 className="font-bold !text-base mb-1">
            2.PERSONAL INFORMATION WE COLLECT
          </h1>

          <h1 className="font-bold !text-base mb-1">
            2.1 Information needed to use the Winda Platform.
          </h1>

          <p>
            We collect personal information about you when you use the Winda
            Platform. Without it, we may not be able to provide all services
            requested. This information includes:
          </p>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              <div>
                <span className="font-bold">
                  Contact Information, Account, and Profile Information
                </span>{" "}
                such as your first name, last name, phone number, email address,
                and date of birth, some of which will depend on the features you
                use.
              </div>
            </ListItem>

            <ListItem className="!text-base">
              <div>
                <span className="font-bold">
                  Identity Verification and Payment Information.
                </span>{" "}
                Passport or other travel document or Card information for the
                purpose of Bank account or payment account information.
              </div>
            </ListItem>
          </div>

          <h1 className="font-bold text-xl mb-1">
            2.2 Information you choose to give us.
          </h1>

          <p>
            You can choose to provide us with additional personal information.
            This information may include:
          </p>

          <div className="flex flex-col gap-2 ml-4 mb-3 mt-2">
            <ListItem className="!text-base">
              <div>
                <span className="font-bold">Information About Others</span>{" "}
                payment instrument belonging to another person or information
                about a co-traveler. By providing us with personal information
                about others, you certify that you have permission to provide
                that information to Winda for the purposes described in this
                Privacy Policy, have shared the Winda Privacy Policy with them,
                and they have read and understood that it applies to them.
              </div>
            </ListItem>

            <ListItem className="!text-base">
              <div>
                <span className="font-bold">Other Information.</span> Such as
                when you fill in a form, add information to your account,
                respond to surveys, post to community forums, participate in
                promotions, communicate with our customer care team and other
                Customers or Service Provider, or share your activity with us.
                This may include health or dietary information if you choose to
                share it with us.
              </div>
            </ListItem>
          </div>

          <h1 className="font-bold text-xl mb-1">
            2.3 Information Automatically Collected by Using the Winda Platform
            and our Payment Services.
          </h1>

          <p>
            When you use the Winda Platform and Payment Services, we
            automatically collect personal information. This information may
            include:
          </p>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              <div>
                <span className="font-bold">Geo-location Information.</span>{" "}
                Such as precise or approximate location determined from your IP
                address or mobile device’s GPS depending on your device
                settings. We may also collect this information when you’re not
                using the website if you enable this through your settings or
                device permissions.
              </div>
            </ListItem>

            <ListItem className="!text-base">
              <div>
                <span className="font-bold">Usage Information. </span> Such as
                the pages or content you view, searches for Listings, bookings
                you have made, and other actions on the Winda Platform.
              </div>
            </ListItem>

            <ListItem className="!text-base">
              <div>
                <span className="font-bold">
                  Log Data and Device Information.{" "}
                </span>{" "}
                Such as details about how you’ve used the Winda Platform
                (including if you clicked on links to third-party applications),
                IP address, access dates and times, hardware and software
                information, device information, device event information,
                unique identifiers, crash data, cookie data, and the pages
                you’ve viewed or engaged with before or after using the Winda
                Platform. We may collect this information even if you haven’t
                created a Winda account or logged in.
              </div>
            </ListItem>

            <div className="flex flex-col gap-2">
              <ListItem className="!text-base">
                <span className="font-bold">
                  We use cookies, mobile identifiers, tracking URLs, log data,
                  and similar technologies
                </span>{" "}
                <span className="inline">
                  to help provide, protect, and improve the Winda Platform. We
                  use these technologies for a number of purposes, such as:
                </span>
              </ListItem>

              <div className="ml-4 flex flex-col gap-2">
                <ListItem className="!text-base">
                  to enable you to use and access the Winda Platform and the
                  Payment Services
                </ListItem>

                <ListItem className="!text-base">
                  to enable, facilitate and streamline the functioning of and
                  your access to the Winda Platform
                </ListItem>

                <ListItem className="!text-base">
                  to enable, facilitate and streamline the functioning of and
                  your access to the Winda Platform
                </ListItem>

                <ListItem className="!text-base">
                  to better understand how you navigate through and interact
                  with the Winda Platform and to improve the Winda Platform
                </ListItem>
                <ListItem className="!text-base">
                  to serve you tailored advertising (such as on the Winda
                  Platform, emails, and on third-party websites)
                </ListItem>
                <ListItem className="!text-base">
                  to show you content (e.g., advertisements) that is more
                  relevant to you
                </ListItem>
                <ListItem className="!text-base">
                  to monitor and analyze the performance, operation, and
                  effectiveness of the Winda Platform and Winda advertisements
                </ListItem>
                <ListItem className="!text-base">
                  to enforce legal agreements that govern the use of the Winda
                  Platform
                </ListItem>
                <ListItem className="!text-base">
                  for fraud detection and prevention, trust and safety, and
                  investigations
                </ListItem>
                <ListItem className="!text-base">
                  for purposes of our own customer support, analytics, research,
                  product development, and regulatory compliance.
                </ListItem>
              </div>
            </div>
          </div>

          <ListItem className="!font-bold !text-base mb-1">
            Third parties
          </ListItem>

          <div className="ml-8 flex flex-col gap-2">
            <ListItem className="!text-base">
              Winda permits third parties to collect the information described
              above through our Service and discloses such information to third
              parties for business purposes as described in this Privacy Policy,
              including but not limited to providing advertising on our Service
              and elsewhere based on users’ online activities over time and
              across different sites, services, and devices.
            </ListItem>

            <ListItem className="!text-base">
              Third parties place technologies such as pixels and SDKs on the
              Winda Platform. These technologies (1) help us analyze how you use
              the Winda Platform, such as by noting the third-party services
              from which you arrived, (2) market and advertise Winda services to
              you on the Winda Platform and third-party websites, (3) help us
              detect or prevent fraud or conduct risk assessments, and (4)
              collect information about your activities on the Winda Platform,
              other sites, and/or the ads you have clicked on. For example, to
              help us better understand how people use the Winda Platform, we
              work with a number of analytics partners, including Google
              Analytics.
            </ListItem>

            <ListItem className="!text-base">
              Third parties may also use such tracking technologies to collect
              or receive information from the Winda Platform and elsewhere and
              use that information to serve ads that they believe are most
              likely to be of interest to you and measure the effectiveness of
              their ads both on the Winda Platform and on other websites and
              online services. Targeting and advertising cookies we use may
              include Google, and other advertising networks and services we use
              from time to time. See here for information on how Google manages
              data in its ad products. For more information about targeting and
              advertising cookies and how you can opt-out, you can visit the
              Network Advertising Initiative’s opt-out page, the Digital
              Advertising Alliance’s opt-out page, or
              http://youronlinechoices.eu. To opt out of Google Analytics for
              display advertising or customize Google display network ads, you
              can visit the Google Ads Settings page. To the extent advertising
              technology is integrated into the Winda Platform and you opt-out
              of tailored advertising, you may still receive advertising
              content. In that case, the advertising content will just not be
              tailored to your interests. Also, we do not control any of these
              opt-out links and are not responsible for the availability or
              accuracy of these mechanisms. Users can opt out of the collection
              and use of information for ad targeting by updating their Facebook
              account ad settings and by contacting info@winda.guide with a
              description of your request and validation information.
            </ListItem>

            <ListItem className="!text-base">
              Third-Party Social Plugins: The Winda Platform may use social
              plugins provided and operated by third parties, such as Facebook’s
              Like Button. As a result of this, you may send to the third party
              the information that you are viewing on a certain part of the
              Winda Platform. If you are not logged into your account with the
              third party, then the third party may not know your identity. If
              you are logged in to your account with the third party, then the
              third party may be able to link information or actions about your
              interactions with the Winda Platform to your account with them.
              Please refer to the third party’s privacy policies to learn more
              about its data practices.
            </ListItem>

            <ListItem className="!text-base">
              Your Choices: Most browsers automatically accept cookies, but you
              can modify your browser setting to decline cookies by visiting the
              Help portion of your browser’s toolbar. While you may disable
              cookies through your browser settings, the Winda Platform
              currently does not respond to a “Do Not Track” signal in the HTTP
              header from your browser or mobile application due to a lack of
              standardization regarding how that signal should be interpreted.
            </ListItem>
          </div>

          <ListItem className="!text-base mb-1 mt-3">
            <span className="font-bold">Payment Transaction Information.</span>{" "}
            Such as payment instrument used, date and time, payment amount,
            payment instrument expiration date and billing postcode, PayPal
            email address, IBAN information, your address, and other related
            transaction details.
          </ListItem>

          <div className="!font-bold !text-base mb-1 mt-3">
            2.4 Personal Information We Collect from Third Parties.
          </div>

          <p>We collect personal information from other sources, such as:</p>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              <span className="font-bold">Third-Party Services.</span> If you
              link, connect, or log in to the Winda Platform with a third-party
              service (e.g. Google, Facebook), you direct the service to send us
              information such as your registration, friends list, and profile
              information as controlled by that service or as authorized by you
              via your privacy settings at that service.
            </ListItem>

            <ListItem className="!text-base">
              <span className="font-bold">Background Information.</span> For
              Customers to the extent permitted by applicable laws, we may
              obtain the local version of police, background, or registered sex
              offender checks. We may use your information, including your full
              name and date of birth, to obtain such reports.
            </ListItem>

            <ListItem className="!text-base">
              <span className="font-bold">
                Enterprise Product Invitations and Account Management.
              </span>{" "}
              Organizations that use our Enterprise products may submit personal
              information to facilitate account management and invitations to
              use enterprise products.
            </ListItem>

            <ListItem className="!text-base">
              <span className="font-bold">Referrals and co-travelers.</span> If
              you are invited to the Winda Platform, such as a co-traveler on a
              trip, the person who invited you can submit personal information
              about you such as your email address or other contact information.
            </ListItem>

            <ListItem className="!text-base">
              <span className="font-bold">Other Sources.</span> To the extent
              permitted by applicable law, we may receive additional information
              about you, such as references, demographic data, or information to
              help detect fraud and safety issues from third-party service
              providers and/or partners and combine it with information we have
              about you. For example, we may receive background check results or
              fraud warnings from identity verification service providers for
              use in our fraud prevention and risk assessment efforts. We may
              receive information about you and your activities on and off the
              Winda Platform, or about your activities and interactions from our
              partners. We may receive health information, including but not
              limited to, health information related to contagious diseases.
            </ListItem>
          </div>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            3. HOW WE USE THE INFORMATION WE COLLECT
          </h1>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            3.1 Provide, Improve, and Develop the Winda Platform. Such as to:
          </h1>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              enable you to access the Winda Platform and make and receive
              payments,
            </ListItem>

            <ListItem className="!text-base">
              enable you to communicate with other Customers, Service Providers
            </ListItem>

            <ListItem className="!text-base">process your request,</ListItem>

            <ListItem className="!text-base">
              perform analytics, debug and conduct research,
            </ListItem>

            <ListItem className="!text-base">
              provide customer service, training,
            </ListItem>

            <ListItem className="!text-base">
              send you messages, updates, security alerts, and account
              notifications,
            </ListItem>

            <ListItem className="!text-base">
              if you provide us with your contacts’ information, such as your
              friends or co-travelers, we may process this information: (i) to
              facilitate your referral invitations, (ii) to share your trip
              details and facilitate trip planning, (iii) for fraud detection
              and prevention, and (iv) to facilitate your requests or for any
              other purpose you authorize,
            </ListItem>

            <ListItem className="!text-base">
              personalize and customize your activity based on your interactions
              with the Winda Platform, your search and booking history, your
              profile information and preferences, and other content you submit,
              and
            </ListItem>

            <ListItem className="!text-base">
              enable your use of our enterprise products
            </ListItem>
          </div>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            3.2 Create and Maintain a Trusted and Safer Environment. Including
            to:
          </h1>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              detect and prevent fraud, spam, abuse, security and safety
              incidents, and other harmful activity,
            </ListItem>
            <ListItem className="!text-base">
              study and combat discrimination,
            </ListItem>

            <ListItem className="!text-base">
              conduct security investigations and risk assessments,
            </ListItem>

            <ListItem className="!text-base">
              verify or authenticate information provided by you,
            </ListItem>
            <ListItem className="!text-base">
              conduct checks against databases and other information sources,
              including background or police checks,
            </ListItem>
            <ListItem className="!text-base">
              comply with our legal obligations, protect the health and
              well-being of our Customers, Service Providers, their employees,
              and members of the public,
            </ListItem>
            <ListItem className="!text-base">
              resolve disputes with our Customers and Service Providers,
              including sharing information about disputes related to your role
              as a Customer or Service Provider,
            </ListItem>
            <ListItem className="!text-base">
              enforce our agreements with third parties,
            </ListItem>
            <ListItem className="!text-base">
              comply with the law, respond to legal requests, prevent harm, and
              protect our rights
            </ListItem>
            <ListItem className="!text-base">
              enforce our Terms and other policies (Payments Policy) and,
            </ListItem>
            <ListItem className="!text-base">
              in connection with the activities above, we may conduct profiling
              based on your interactions with the Winda Platform, your profile
              information and other content you submit to Winda, and information
              obtained from third parties. In limited cases, automated
              processes, which analyze your account and activities on the Winda
              platform as well as information in relation to activities on and
              off the Winda platform that can be associated with you, could
              restrict or suspend access to the Winda Platform if such processes
              detect activity that may pose a safety or other risk to Winda, our
              community, or third parties. If you would like to challenge
              decisions based on automated processes, please contact us via the
              Contact Information section below.
            </ListItem>
          </div>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            3.3 Provide, Personalize, Measure, and Improve our Advertising and
            Marketing. For example to:
          </h1>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              send you promotional messages, marketing, advertising, and other
              information based on your preferences and social media advertising
              through social media platforms,
            </ListItem>
            <ListItem className="!text-base">
              personalize, measure, and improve our advertising,
            </ListItem>
            <ListItem className="!text-base">
              administer referral programs, rewards, surveys, contests, or other
              promotional activities or events sponsored or managed by Winda or
              its third-party partners,
            </ListItem>
            <ListItem className="!text-base">
              analyze characteristics and preferences to send you promotional
              messages, marketing, advertising, and other information that we
              think might be of interest to you, and
            </ListItem>
            <ListItem className="!text-base">
              invite you to events and relevant opportunities.
            </ListItem>
          </div>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            3.4 Provide Payment services. Personal information is used to
            enable, or authorize third parties to use, Payment Services such as
            to:
          </h1>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              detect and prevent money laundering, fraud, abuse, and security
              incidents,
            </ListItem>
            <ListItem className="!text-base">
              conduct security investigations and risk assessments,
            </ListItem>
            <ListItem className="!text-base">
              comply with legal obligations (such as anti-money laundering
              regulations),
            </ListItem>
            <ListItem className="!text-base">
              enforce the Payment Terms and other payment policies,
            </ListItem>
            <ListItem className="!text-base">
              with your consent, send you promotional messages, marketing,
              advertising, and other information that may be of interest to you
              based on your preferences, and
            </ListItem>
            <ListItem className="!text-base">
              provide and improve Payment Services.
            </ListItem>
          </div>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            4. SHARING & DISCLOSURE
          </h1>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            4.1 Sharing With Your Consent or at Your Direction.
          </h1>

          <p>
            Where you provide consent, we share your information as described at
            the time of consent, such as when authorizing a third-party
            application or website to access your Winda account or participating
            in promotional activities by Winda partners or third parties. Where
            permissible under applicable law, we may use certain information
            about you such as your email address, de-identify it, and share it
            with social media platforms to generate leads, drive traffic to
            Winda, or otherwise promote our products and services.
          </p>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            4.2 Information You Publish in Profiles, Listings, and other Public
            Information.
          </h1>

          <p>
            You can make certain information publicly visible to others, such
            as:
          </p>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              Your public profile page, which includes your profile photo, first
              name (or initials where applicable), description, and city.
            </ListItem>

            <ListItem className="!text-base">
              Listing pages that include information such as the Accommodation
              or Activities approximate or precise location description,
              transport, calendar availability, profile photo, aggregated demand
              information (like page views over a period of time), and
              additional information you choose to share.
            </ListItem>

            <ListItem className="!text-base">
              Reviews, ratings, and other public feedback.
            </ListItem>

            <ListItem className="!text-base">
              Content in a community or discussion forum, blog, or social media
              post.
            </ListItem>
          </div>

          <p className="">
            We may display parts of your public profile and other Content you
            make available to the public like Listing details on third-party
            sites, platforms, and apps. Information you share publicly on the
            Winda Platform may be indexed through third-party search engines. In
            some cases, you may opt out of this feature in your account
            settings.
          </p>

          <h1 className="!font-bold !text-base mb-1 mt-3">5. YOUR RIGHTS</h1>

          <p>
            You can exercise any of the rights described in this section
            consistent with applicable law. We may ask you to verify your
            identity and request before taking further action on your request.
          </p>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            5.1 Managing Your Information.
          </h1>

          <p>
            You can access and update some of your personal information through
            your Account settings. If you connected your Winda Account to a
            third-party service, like Facebook or Google, you can change your
            settings and unlink from that service in your Account settings. You
            are responsible for keeping your personal information up to date.
          </p>

          <h1 className="!font-bold !text-base mb-1 mt-3">
            5.2 Data Access and Portability.
          </h1>

          <p>
            In some jurisdictions, applicable law may entitle you to request
            certain copies of your personal information or information about how
            we handle your personal information, request copies of personal
            information that you have provided to us in a structured, commonly
            used, and machine-readable format, and/or request that we transmit
            this information to another service provider (where technically
            feasible).
          </p>

          <h1 className="!font-bold !text-base mb-1 mt-3">5.3 Data Erasure.</h1>

          <p>
            In some jurisdictions, you can request that your personal
            information be deleted. Please note that if you request deletion of
            your personal information, or if your account is suspended,
            terminated, or voluntarily closed:
          </p>

          <div className="flex flex-col ml-4 gap-2 mb-3 mt-2">
            <ListItem className="!text-base">
              We may retain your personal information as necessary for our
              legitimate business interests, such as the prevention of money
              laundering, fraud detection and prevention, and enhancing safety.
              For example, if we suspend a Winda Account for fraud or safety
              reasons, we may retain information from that Winda Account to
              prevent that Customer from opening a new Winda Account in the
              future.
            </ListItem>
            <ListItem className="!text-base">
              We may retain and use your personal information to the extent
              necessary to comply with our legal obligations. For example, Winda
              and Winda Payments may keep information for tax, legal reporting,
              and auditing obligations.
            </ListItem>
            <ListItem className="!text-base">
              Information you have shared with others (e.g., Reviews, forum
              postings) will continue to be publicly visible on Winda, even
              after your Winda Account is canceled. However, attribution of such
              information to you will be removed. Some copies of your
              information (e.g., log records) will remain in our database but
              are disassociated from personal identifiers.
            </ListItem>
            <ListItem className="!text-base">
              Because we take measures to protect data from accidental or
              malicious loss and destruction, residual copies of your personal
              information may not be removed from our backup systems for a
              limited period of time.
            </ListItem>
          </div>

          <div className="!font-bold !text-base mb-1 mt-3">6. SECURITY</div>

          <p>
            While no organization can guarantee perfect security, we are
            continuously implementing and updating administrative, technical,
            and physical security measures to help protect your information
            against unauthorized access, loss, destruction, or alteration.
          </p>

          <div className="!font-bold !text-base mb-1 mt-3">
            7. CHANGES TO THIS PRIVACY POLICY
          </div>

          <p>
            We reserve the right to modify this Privacy Policy at any time in
            accordance with applicable law. If we do so, we will post the
            revised Privacy Policy and update the “Last Updated” date at the
            top. In case of material changes, we will also provide you with
            notice of the modification by email at least thirty (30) days before
            the effective date. If you disagree with the revised Privacy Policy,
            you can cancel your Account. If you do not cancel your Account
            before the date the revised Privacy Policy becomes effective, your
            continued access to or use of the Winda Platform will be subject to
            the revised Privacy Policy.
          </p>
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

PrivacyPolicy.propTypes = {};

export default PrivacyPolicy;
