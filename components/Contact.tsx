"use client";

import { motion } from "framer-motion";
import portfolioData from "@/data/portfolio.json";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef } from "react";
import emailjs from "emailjs-com";
import SplitTextReveal from "@/components/SplitTextReveal";
import ScrambleText from "@/components/ScrambleText";
import ScrollReveal from "@/components/ScrollReveal";

const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

export default function Contact() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setFormStatus("submitting");

    try {
      if (
        EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
        EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" &&
        EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY"
      ) {
        await emailjs.sendForm(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          formRef.current,
          EMAILJS_PUBLIC_KEY
        );
      } else {
        await new Promise((r) => setTimeout(r, 1500));
      }
      setFormStatus("success");
      formRef.current?.reset();
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    }
  };

  return (
    <section id="contact" className="relative min-h-screen py-20 md:py-32 flex items-center border-t border-white/5">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
          
          <ScrollReveal direction="left" duration={0.8} className="text-center lg:text-left">
            <div className="text-xs font-mono tracking-[0.3em] text-white/30 uppercase mb-6">
              <ScrambleText text="GET IN TOUCH" trigger="inView" />
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black mb-6 md:mb-8 leading-tight">
              <SplitTextReveal text="Let's create" mode="words" /> <br />
              <SplitTextReveal text="something extraordinary." mode="words" gradient />
            </h2>
            
            <div className="space-y-4 md:space-y-6 mt-8 md:mt-12 text-white/70 flex flex-col items-center lg:items-start">
              <a
                href={`mailto:${portfolioData.socials.email}`}
                className="flex items-center gap-3 md:gap-4 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors shrink-0 shadow-lg">
                  <Mail className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-lg break-all font-mono">{portfolioData.socials.email}</span>
              </a>
              <div className="flex items-center gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <Phone className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-lg font-mono">{portfolioData.socials.phone}</span>
              </div>
              <div className="flex items-center gap-3 md:gap-4 group">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 shadow-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <span className="text-sm md:text-lg font-mono">{portfolioData.socials.location}</span>
              </div>
            </div>

            {/* Availability badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-sm font-mono"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Available for new projects
            </motion.div>
          </ScrollReveal>
          
          <ScrollReveal direction="right" duration={0.8} delay={0.2} className="glass rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl border border-white/10">
            {formStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-heading font-bold">Message Sent!</h3>
                <p className="text-white/50 text-sm max-w-xs">
                  Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="mt-4 px-6 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                  Send Another
                </button>
              </motion.div>
            ) : formStatus === "error" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-heading font-bold">Something went wrong</h3>
                <p className="text-white/50 text-sm">Please try again or email me directly.</p>
                <button
                  onClick={() => setFormStatus("idle")}
                  className="mt-4 px-6 py-2 rounded-xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors text-sm"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="from_name"
                    type="text"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder-white/20"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="reply_to"
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder-white/20"
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="subject">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder-white/20"
                    placeholder="Project collaboration"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70" htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none placeholder-white/20"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <button
                  type="submit"
                  id="contact-submit"
                  disabled={formStatus !== "idle"}
                  className="w-full py-3 md:py-4 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50 text-sm md:text-base hover:scale-[1.01] active:scale-[0.99] shadow-lg"
                >
                  {formStatus === "idle" && (
                    <>Send Message <Send className="w-4 h-4" /></>
                  )}
                  {formStatus === "submitting" && (
                    <>
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      Sending...
                    </>
                  )}
                </button>

                <p className="text-[10px] text-white/20 text-center font-mono">
                  Powered by EmailJS · Your data is never shared
                </p>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
