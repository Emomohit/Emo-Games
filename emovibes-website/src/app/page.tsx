"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Download, Play, Shield, WifiOff, Sparkles, ChevronDown, Layers, 
  Music, Heart, CheckCircle2, Activity, Zap, Headphones, Database, Palette,
  Send, User, ExternalLink
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

const Github = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>;
const Linkedin = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>;
const Instagram = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;

const fadeIn: any = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden font-sans">
      {/* Mouse Follow Glow */}
      <div 
        className="fixed inset-0 pointer-events-none z-50 opacity-30 transition-opacity"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.1), transparent 40%)`
        }}
      />

      <div className="aurora-bg" />

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(124,58,237,0.5)]">
              <Music className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">EMOVibes</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-white hover:text-shadow transition-all">Features</a>
            <a href="#gallery" className="hover:text-white hover:text-shadow transition-all">Gallery</a>
            <a href="#developer" className="hover:text-white hover:text-shadow transition-all">Developer</a>
          </div>
          <a 
            href="#download"
            className="px-6 py-2.5 rounded-full bg-white text-background font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
          >
            Get App
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 min-h-screen">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="lg:w-1/2 z-10"
        >
          <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 mb-8 hover:bg-white/5 transition-colors cursor-default">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium text-gray-200">The Ultimate Music Experience</span>
          </motion.div>
          <motion.h1 variants={fadeIn} className="font-heading text-5xl md:text-7xl font-bold leading-tight mb-6">
            Feel the Music, <br/>
            <span className="text-gradient drop-shadow-2xl">Live the Vibe.</span>
          </motion.h1>
          <motion.p variants={fadeIn} className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
            An ultra-premium, tracker-free music player designed to match your emotional state. Zero ads, zero subscriptions, 100% yours.
          </motion.p>
          <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
            <a href="#download" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white font-semibold transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(124,58,237,0.6)]">
              <Download className="w-5 h-5" />
              Download APK
            </a>
            <a href="https://github.com/Emomohit/EmoVibe" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass border border-white/10 hover:bg-white/10 text-white font-semibold transition-all">
              <Github className="w-5 h-5" />
              View on GitHub
            </a>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.2, type: "spring" }}
          className="lg:w-1/2 relative z-10 perspective-1000"
        >
          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-20 -z-10">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: ["20%", "80%", "20%"] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                className="w-4 bg-gradient-to-t from-primary to-accent rounded-full"
              />
            ))}
          </div>
          
          <div className="relative w-[320px] h-[650px] mx-auto rounded-[3rem] p-3 border-4 border-white/10 shadow-[0_0_50px_rgba(124,58,237,0.3)] glass bg-black/40 backdrop-blur-2xl overflow-hidden group">
            <Image 
              src="/images/hero-mockup.png" 
              alt="EMOVibes Interface" 
              fill 
              className="object-cover rounded-[2.5rem] group-hover:scale-105 transition-transform duration-700" 
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50 rounded-[2.5rem] pointer-events-none" />
          </div>
        </motion.div>
      </section>

      {/* Gallery/Screenshots Section */}
      <section id="gallery" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Stunning <span className="text-gradient">Interface</span></h2>
          <p className="text-gray-400">A visual masterpiece that adapts to every song.</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative aspect-[9/16] rounded-[2rem] overflow-hidden glass border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
             <Image src="/images/mockup1.png" alt="Dynamic Player UI" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="font-heading font-bold text-lg">Dynamic Player UI</span>
             </div>
           </motion.div>
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="relative aspect-[9/16] rounded-[2rem] overflow-hidden glass border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] group">
             <Image src="/images/mockup2.png" alt="Synced Lyrics" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="font-heading font-bold text-lg">Real-Time Synced Lyrics</span>
             </div>
           </motion.div>
        </div>
      </section>

      {/* Advanced Details Section */}
      <section id="features" className="py-32 px-6 max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Engineered for <span className="text-gradient">Audiophiles</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">We went beyond the surface to build a powerhouse music engine right inside your phone.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <Activity />, title: "Pro Audio Equalizer (DSP)", desc: "Fine-tune your frequencies. EMOVibes includes a professional Digital Signal Processing equalizer, allowing you to boost bass, adjust mids, or apply custom spatial audio effects." },
            { icon: <Database />, title: "Multi-API Aggregation", desc: "Why settle for one source? We seamlessly aggregate metadata, artist biographies, and rich album artwork simultaneously from Spotify and YouTube APIs directly on your device." },
            { icon: <Palette />, title: "Dynamic Aurora Theming", desc: "The UI literally feels the music. Our engine extracts primary and secondary accent colors from the currently playing album art and dynamically paints the entire app interface." },
            { icon: <Headphones />, title: "High-Res Audio Playback", desc: "No compression bottlenecks. Support for FLAC, ALAC, and high-bitrate streaming ensures that what you hear is exactly what the artist intended." },
            { icon: <Layers />, title: "Real-Time Synced Lyrics", desc: "Sing along without missing a beat. EMOVibes fetches LRC data in real-time, displaying beautifully animated, synced lyrics that scroll with the music." },
            { icon: <Zap />, title: "Optimized Compose Engine", desc: "Built entirely with Jetpack Compose Release optimizations. Experience zero lag, 120Hz buttery-smooth scrolling, and minimal battery drain on modern Android devices." }
          ].map((feature, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-card p-8 rounded-3xl group hover:border-primary/50 hover:-translate-y-2 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gradient-to-tr from-primary to-accent group-hover:text-white transition-all text-gray-300 group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm group-hover:text-gray-300 transition-colors">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Developer Section */}
      <section id="developer" className="py-32 px-6 max-w-5xl mx-auto relative z-10 border-t border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-card rounded-[3rem] p-10 md:p-16 relative overflow-hidden bg-gradient-to-b from-black/40 to-black/80 backdrop-blur-3xl">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
             <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-white/10 shadow-[0_0_40px_rgba(236,72,153,0.3)] shrink-0">
                <Image src="https://github.com/Emomohit.png" alt="Mohit - Lead Developer" width={256} height={256} className="w-full h-full object-cover" />
             </div>
             <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-accent/30 mb-4 text-xs font-semibold text-accent">
                   <User className="w-3 h-3" /> Lead Developer & Creator
                </div>
                <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Mohit</h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                   I built EMOVibes because I was tired of music players packed with ads, trackers, and paywalls. My goal was to create the ultimate, beautiful, and completely free music experience for Android. 
                </p>
                <div className="flex flex-wrap gap-4">
                   <a href="https://github.com/Emomohit/EmoVibe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-white/10 transition-colors">
                     <Github className="w-5 h-5 text-gray-300" />
                     <span className="font-medium text-sm">GitHub</span>
                   </a>
                   <a href="https://t.me/Emomohit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-white/10 transition-colors">
                     <Send className="w-5 h-5 text-blue-400" />
                     <span className="font-medium text-sm">Telegram</span>
                   </a>
                   <a href="https://www.linkedin.com/in/mohit-ahirwar-12bb58386/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-white/10 transition-colors">
                     <Linkedin className="w-5 h-5 text-blue-600" />
                     <span className="font-medium text-sm">LinkedIn</span>
                   </a>
                   <a href="https://www.instagram.com/_emomohit" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-xl glass hover:bg-white/10 transition-colors">
                     <Instagram className="w-5 h-5 text-pink-500" />
                     <span className="font-medium text-sm">Instagram</span>
                   </a>
                </div>
             </div>
           </div>
        </motion.div>
      </section>

      {/* Security FAQ Section */}
      <section className="py-32 px-6 max-w-4xl mx-auto relative z-10 border-t border-white/5">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn} className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Security & Privacy</h2>
          <p className="text-gray-400">We believe your listening habits are yours alone. Here is how we protect them.</p>
        </motion.div>
        
        <div className="space-y-6">
          {[
            { q: "Does EMOVibes track my listening history?", a: "Absolutely not. EMOVibes is completely telemetry-free. There are no tracking scripts, no analytics, and no data collection servers. Everything stays on your device." },
            { q: "Is it safe to download the APK?", a: "Yes. The APK is compiled directly from the open-source codebase. It requires zero dangerous permissions like contacts or location. You can even review the source code on our GitHub." },
            { q: "How do third-party integrations (like Spotify/YouTube) work securely?", a: "EMOVibes uses proxy clients and anonymous API endpoints to fetch metadata. You do not need to log into any third-party services to fetch lyrics or artwork, keeping your identity secure." }
          ].map((faq, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-card p-6 rounded-2xl hover:border-primary/30 transition-colors">
              <h4 className="font-bold text-lg mb-2 text-white flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                   <Shield className="w-5 h-5 text-primary" />
                </div>
                {faq.q}
              </h4>
              <p className="text-gray-400 text-sm leading-relaxed pl-10">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="py-32 px-6 max-w-5xl mx-auto relative z-10">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="glass-card rounded-[3rem] p-10 md:p-16 relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="font-heading text-4xl font-bold mb-4">Get EMOVibes Today</h2>
              <p className="text-gray-400 mb-8 max-w-md">Experience the future of local music playback. Optimized for 120Hz, safe, secure, and ready for your Android device.</p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Version: 1.0.1 (Stable Release)
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Android 8.0+ Required
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary" /> Lag-Free Compose Engine
                </div>
              </div>

              <a 
                href="/apk/EMOVibes.apk" 
                download
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-background hover:bg-gray-200 font-semibold transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.4)]"
              >
                <Download className="w-5 h-5" />
                Download EMOVibes.apk
              </a>
            </div>
            
            <div className="w-full md:w-1/3 aspect-square relative rounded-3xl overflow-hidden glass border border-white/20 p-4 flex flex-col items-center justify-center text-center bg-black/20 shadow-2xl">
               <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(124,58,237,0.6)] animate-pulse">
                 <Music className="w-12 h-12 text-white" />
               </div>
               <h4 className="font-heading font-bold text-2xl mb-2 tracking-tight">EMOVibes</h4>
               <p className="text-sm text-primary mb-4 font-semibold uppercase tracking-widest">Direct APK</p>
               <p className="text-xs text-gray-500 font-mono break-all leading-relaxed px-4">
                 Compiled with R8 optimizations and extreme performance presets.
               </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-background relative z-10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
           <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                  <Music className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading font-bold text-xl">EMOVibes</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm mb-6">
                An emotional music journey crafted for Android. Free, secure, and beautiful. Hosted dynamically.
              </p>
              <a href="https://emovibes.vercel.app" className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors font-medium">
                 <ExternalLink className="w-4 h-4" /> emovibes.vercel.app
              </a>
           </div>

           <div>
              <h4 className="font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                 <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                 <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
           </div>

           <div>
              <h4 className="font-bold mb-6">Connect</h4>
              <ul className="space-y-4 text-sm text-gray-400">
                 <li><a href="https://github.com/Emomohit/EmoVibe" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Github className="w-4 h-4"/> GitHub</a></li>
                 <li><a href="https://t.me/Emomohit" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Send className="w-4 h-4"/> Telegram</a></li>
                 <li><a href="https://www.linkedin.com/in/mohit-ahirwar-12bb58386/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Linkedin className="w-4 h-4"/> LinkedIn</a></li>
                 <li><a href="https://www.instagram.com/_emomohit" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2"><Instagram className="w-4 h-4"/> Instagram</a></li>
              </ul>
           </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} EMOVibes. All rights reserved.
          </div>
          <div className="text-gray-600 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent/50" /> by Mohit
          </div>
        </div>
      </footer>
    </main>
  );
}
