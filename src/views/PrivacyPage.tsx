import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen ai-gradient-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/register" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Registration
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-3xl p-8 mb-8"
        >
          <div className="flex items-center gap-4 mb-8">
            <Shield className="w-12 h-12 text-white" />
            <h1 className="text-3xl font-bold text-white">
              Personality Breakthrough Profile Privacy Policy and GDPR
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-white/80 text-lg">
              By ticking the box on The One Step Registration Page on <a href="http://www.personalitybreakthroughprofile.com" className="text-blue-400 hover:text-blue-300">www.personalitybreakthroughprofile.com</a> website with the following text "I accept The Personality Breakthrough Profile Privacy Policy, GDPR, and Terms of Service" as per the links in the footer section of this page, I consent to the following:
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">
              Personality Breakthrough Profile GDPR and Privacy Policy
            </h2>

            <p className="text-white/80">
              In accordance with the General Data Protection Regulation (GDPR), outlined below is information regarding the collection and use of your personal data and your rights concerning this activity. Any information we hold on you will be used for the sole purpose for which you have provided it.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">What data is collected?</h3>
            <p className="text-white/80">
              Your personal data (name, any personal data made available to us via The One-Step Registration Page, and special categories of personal data such as the assessment/profile test results) will be collected by Personality Breakthrough Profile for the provision of this service to the Client.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">What will happen to my personal data post-completion?</h3>
            <p className="text-white/80">
              Raw data collected from the Personality Breakthrough Profile carried out online is collected by our online questionnaire and software. The software will convert raw data into standardized scores and graphs. This data is stored on servers in Ireland, United Kingdom, United States, and in the Cloud, United States (US), where all reasonable security measures are in place.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Where will my data be sent post-completion?</h3>
            <p className="text-white/80">
              On completion of the profile assessment, a report will be generated and sent to the Client with the following information visible for the purposes of providing you with the personality breakthrough profile:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2">
              <li>Name</li>
              <li>Other data you provided us with on The One-Step Registration Page</li>
              <li>The graph and scores of your test</li>
              <li>Written narrative of the profile</li>
              <li>Your profile answers</li>
            </ul>
            <p className="text-white/80 mt-4">
              Should you not consent to any or all of this data being exchanged with the Client on your behalf, said data shall not be sent.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">How long will my data be held for?</h3>
            <p className="text-white/80">
              We will store profile results for the duration of their validity (two years), after which all traces of test results will be destroyed. If you wish to remove these test results prior to the two-year retention period, you can do so by submitting a written request via post or email. We may require you to confirm your identity prior to deleting these files, after which all files in question will be deleted within 48 hours.
            </p>
            <p className="text-white/80">
              You may also request a copy of your profile test results at any time once the testing process has been completed.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12 mb-6">Privacy Policy</h2>
            <p className="text-white/80">
              Your privacy is important to us. It is Personality Breakthrough Profile's policy to respect your privacy regarding any information we may collect from you across our website, <a href="http://www.personalitybreakthroughprofile.com" className="text-blue-400 hover:text-blue-300">www.personalitybreakthroughprofile.com</a>, and other sites we own and operate.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Information we collect</h3>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Log data</h4>
                <p className="text-white/80">
                  When you visit our website, our servers may automatically log the standard data provided by your web browser. This may include your computer's Internet Protocol (IP) address, browser type and version, pages visited, time and date of visit, time spent on each page, and other details.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Device data</h4>
                <p className="text-white/80">
                  We may also collect data about the device you're using to access our website. This may include the device type, operating system, unique device identifiers, device settings, and geo-location data. What we collect can depend on the individual settings of your device and software. We recommend checking the policies of your device manufacturer or software provider to learn what information they make available to us.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Personal information</h4>
                <p className="text-white/80">We may ask for personal information, such as your:</p>
                <ul className="list-disc pl-6 text-white/80 space-y-2 mt-2">
                  <li>Name</li>
                  <li>Email</li>
                  <li>Social media profiles</li>
                  <li>Date of birth</li>
                  <li>Phone/mobile number</li>
                  <li>Home/Mailing address</li>
                  <li>Work address</li>
                  <li>Payment information</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-8 mb-4">Legal bases for processing</h3>
            <p className="text-white/80">
              We will process your personal information lawfully, fairly, and in a transparent manner. We collect and process information about you only where we have legal bases for doing so. These legal bases depend on the services you use and how you use them, meaning we collect and use your information only where:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2 mt-4">
              <li>It's necessary for the performance of a contract to which you are a party or to take steps at your request before entering into such a contract;</li>
              <li>It satisfies a legitimate interest (which is not overridden by your data protection interests);</li>
              <li>You give us consent to do so for a specific purpose;</li>
              <li>We need to process your data to comply with a legal obligation.</li>
            </ul>

            {/* Continue with the rest of the sections following the same pattern */}
            {/* Each section should use appropriate heading levels and spacing */}
            {/* Use lists, paragraphs, and emphasis where appropriate */}

            <div className="mt-12 pt-8 border-t border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Contact Information</h3>
              <p className="text-white/80">
                <strong>Personality Breakthrough Profile Data Controller:</strong><br />
                <a href="mailto:support@personalitybreakthroughprofile.com" className="text-blue-400 hover:text-blue-300">
                  support@personalitybreakthroughprofile.com
                </a>
              </p>
              <p className="text-white/80 mt-4">
                <strong>Personality Breakthrough Profile Data Protection Officer:</strong><br />
                <a href="mailto:support@personalitybreakthroughprofile.com" className="text-blue-400 hover:text-blue-300">
                  support@personalitybreakthroughprofile.com
                </a>
              </p>
              <p className="text-white/60 mt-8">
                This policy is effective as of 1st of January 2025.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}