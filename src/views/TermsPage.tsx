import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

export function TermsPage() {
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
            <Scale className="w-12 h-12 text-white" />
            <h1 className="text-3xl font-bold text-white">
              Personality Breakthrough Profile Terms of Service
            </h1>
          </div>

          <div className="prose prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-bold text-white">Terms</h2>
            <p className="text-white/80">
              By accessing the website at <a href="http://www.personalitybreakthroughprofile.com" className="text-blue-400 hover:text-blue-300">www.personalitybreakthroughprofile.com</a>, you agree to be bound by these terms of service, all applicable laws and regulations, and accept responsibility for compliance with any applicable local laws. If you do not agree with these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Use License</h2>
            <p className="text-white/80">
              Permission is granted to temporarily download one copy of the materials (information or software) on the Personality Breakthrough Profile's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:
            </p>
            <ul className="list-disc pl-6 text-white/80 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose or public display (commercial or non-commercial);</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Personality Breakthrough Profile's website;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
            <p className="text-white/80">
              This license shall automatically terminate if you violate any of these restrictions and may be terminated by the Personality Breakthrough Profile at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession, whether in electronic or printed format.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Disclaimer</h2>
            <p className="text-white/80">
              The materials on the Personality Breakthrough Profile's website are provided on an 'as is' basis. The Personality Breakthrough Profile makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties, including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
            <p className="text-white/80">
              Further, the Personality Breakthrough Profile does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Limitations</h2>
            <p className="text-white/80">
              In no event shall the Personality Breakthrough Profile or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit or due to business interruption) arising out of the use or inability to use the materials on the Personality Breakthrough Profile's website, even if the Personality Breakthrough Profile or an authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties or limitations of liability for consequential or incidental damages, these limitations may not apply to you.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Accuracy of Materials</h2>
            <p className="text-white/80">
              The materials appearing on the Personality Breakthrough Profile's website could include technical, typographical, or photographic errors. The Personality Breakthrough Profile does not warrant that any of the materials on its website are accurate, complete, or current. The Personality Breakthrough Profile may make changes to the materials contained on its website at any time without notice. However, the Personality Breakthrough Profile does not commit to updating the materials.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Links</h2>
            <p className="text-white/80">
              The Personality Breakthrough Profile has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by the Personality Breakthrough Profile of the site. Use of any such linked website is at the user's own risk.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Modifications</h2>
            <p className="text-white/80">
              The Personality Breakthrough Profile may revise these terms of service for its website at any time without notice. By using this website, you agree to be bound by the then-current version of these terms of service.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Governing Law</h2>
            <p className="text-white/80">
              These terms and conditions are governed by and construed in accordance with the laws of London, United Kingdom, and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>

            <h2 className="text-2xl font-bold text-white mt-12">Cookie Policy</h2>
            <p className="text-white/80">
              We use cookies to help improve your experience on www.personalitybreakthroughprofile.com. This cookie policy is part of the Personality Breakthrough Profile's privacy policy and covers the use of cookies between your device and our site.
            </p>

            <h3 className="text-xl font-bold text-white mt-8">What is a cookie?</h3>
            <p className="text-white/80">
              A cookie is a small piece of data that a website stores on your device when you visit, typically containing information about the website itself, a unique identifier that allows the site to recognize your web browser when you return, additional data that serves the purpose of the cookie, and the lifespan of the cookie itself.
            </p>

            <h3 className="text-xl font-bold text-white mt-8">Types of cookies and how we use them</h3>
            <div className="space-y-6 mt-4">
              <div>
                <h4 className="text-lg font-semibold text-white">Essential Cookies</h4>
                <p className="text-white/80">
                  Essential cookies are crucial to your experience of a website, enabling core features like user logins, account management, shopping carts, and payment processing. We use essential cookies to enable certain functions on our website.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white">Performance Cookies</h4>
                <p className="text-white/80">
                  Performance cookies track how you use a website during your visit without collecting personal information about you. Typically, this information is anonymous and aggregated across site users to help us understand visitor usage patterns, diagnose issues, and improve the site experience.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white">Functionality Cookies</h4>
                <p className="text-white/80">
                  Functionality cookies collect information about your device and settings (e.g., language and timezone preferences) to provide customized and enhanced content.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white">Targeting/Advertising Cookies</h4>
                <p className="text-white/80">
                  Targeting/advertising cookies determine which promotional content is most relevant to you. They may also limit how often you see an advertisement and track campaign effectiveness.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-8">Cookie Control</h3>
            <p className="text-white/80">
              If you do not wish to accept cookies from us, you can instruct your browser to refuse cookies from our website. While some cookies can be blocked without significant impact on your experience, blocking all cookies may prevent access to certain features and content.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}