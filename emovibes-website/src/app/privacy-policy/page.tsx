import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicy() {
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
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-heading">Privacy Policy</h1>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
          <p><strong>Last Updated: July 2, 2026</strong></p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Information We Don't Collect</h2>
          <p>EMOVibes is built on a foundation of absolute privacy. We do not collect, store, or transmit your personal data, listening habits, search history, or any other telemetry data to our servers. The app operates locally on your device.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Third-Party APIs</h2>
          <p>To provide lyrics and rich metadata, EMOVibes connects directly from your device to third-party services (such as YouTube and Spotify APIs). These requests are made anonymously where possible, but your IP address will be exposed to these third-party providers in accordance with their respective privacy policies.</p>
          
          <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. Local Storage</h2>
          <p>All application data, including downloaded songs, cached album artwork, saved playlists, and application settings, are stored locally on your Android device using secure SQLite databases (Room). You have full control over this data and can delete it at any time by clearing the app data in your Android settings.</p>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Permissions Required</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Storage/Media:</strong> Required to scan and play your local music files, and to save downloaded tracks.</li>
            <li><strong>Internet:</strong> Required to fetch lyrics, album art, and artist biographies from third-party APIs.</li>
          </ul>

          <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Open Source Transparency</h2>
          <p>Our entire codebase is open-source and available for review on GitHub. You can verify exactly how the application works and confirm that no malicious data collection is occurring in the background.</p>
        </div>
      </div>
    </main>
  );
}
