import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="relative min-h-screen pt-32 pb-20 px-6 font-sans">
      <div className="aurora-bg" />
      <div className="max-w-4xl mx-auto relative z-10 glass-card p-8 md:p-16 rounded-[2rem]">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-heading">Terms of Service</h1>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p><strong>Last Updated: July 2, 2026</strong></p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Acceptance of Terms</h2>
          <p>By downloading, installing, or using the EMOVibes Android application ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the App.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Usage and Limitations</h2>
          <p>EMOVibes is provided as a local music player and metadata aggregator. You agree to use the App only for lawful purposes. You are solely responsible for the media files you play or download using this application. We do not host, distribute, or condone the piracy of copyrighted audio materials.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Third-Party Services</h2>
          <p>The App integrates with third-party APIs (such as YouTube, Spotify, and LRCLIB) to fetch metadata, lyrics, and artwork. Your use of the App is also subject to the terms of service of these respective third parties. We do not guarantee the continuous availability of these third-party integrations, as they may be modified or revoked by their providers at any time.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Disclaimer of Warranty</h2>
          <p>THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE APP.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Modifications to Terms</h2>
          <p>We reserve the right to modify these Terms of Service at any time. Continued use of the App following any changes constitutes your acceptance of the new terms.</p>
        </div>
      </div>
    </main>
  );
}
