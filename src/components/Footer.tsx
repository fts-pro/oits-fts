import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Sun,
  Moon,
  MapPin,
  Check,
  Building,
  ArrowRight,
  ExternalLink,
  Mail,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  Globe,
  Users,
} from "lucide-react";
import { COMPANY_NAME, NAV_ITEMS, SERVICES, ADDRESS, CONTACT_EMAIL, PHONE } from "../constants";

interface FooterProps {
  theme?: "light" | "dark";
  toggleTheme?: () => void;
}

const SocialLink = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) => (
  <a
    href={href}
    className="group relative p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-500/30 dark:hover:border-blue-500/30 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-slate-850/30 transition-all duration-300 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
    aria-label={`Follow ${COMPANY_NAME} on ${label}`}
    target="_blank"
    rel="noopener noreferrer"
  >
    <Icon
      size={18}
      className="transition-transform duration-300 group-hover:scale-110"
      aria-hidden="true"
    />

    {/* Tooltip */}
    <span
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 text-[10px] font-mono font-black uppercase tracking-widest text-white bg-slate-900 rounded-lg opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl border border-slate-800 transform translate-y-2 group-hover:translate-y-0 duration-300 z-50"
      aria-hidden="true"
    >
      {label}
      <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-slate-800"></span>
    </span>
  </a>
);

export const Footer: React.FC<FooterProps> = ({ theme = "dark", toggleTheme = () => {} }) => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "invalid_format" | "invalid_work" | "submitting" | "success"
  >("idle");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const location = useLocation();

  // Scroll to Top on route navigation
  const handlePageTransition = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value === "") {
      setStatus("idle");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setStatus("invalid_format");
      return;
    }

    const parts = value.toLowerCase().split("@");
    const domain = parts[1] || "";
    const genericDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "icloud.com",
      "mail.com",
      "zoho.com",
      "proton.me",
      "protonmail.com",
      "yandex.com",
      "gmx.com",
      "live.com",
      "msn.com",
      "mailinator.com",
      "tempmail.com",
      "guerrillamail.com",
      "dispostable.com",
      "trashmail.com",
    ];

    if (
      genericDomains.some((gd) => domain === gd || domain.endsWith("." + gd))
    ) {
      setStatus("invalid_work");
    } else {
      setStatus("idle");
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setStatus("invalid_format");
      return;
    }

    const parts = email.toLowerCase().split("@");
    const domain = parts[1] || "";
    const genericDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "aol.com",
      "icloud.com",
      "mail.com",
      "zoho.com",
      "proton.me",
      "protonmail.com",
      "yandex.com",
      "gmx.com",
      "live.com",
      "msn.com",
      "mailinator.com",
      "tempmail.com",
      "guerrillamail.com",
      "dispostable.com",
      "trashmail.com",
    ];

    if (
      genericDomains.some((gd) => domain === gd || domain.endsWith("." + gd))
    ) {
      setStatus("invalid_work");
      return;
    }

    setStatus("submitting");
    setTimeout(() => {
      setStatus("success");
      setSubmittedEmail(email);
      setEmail("");
    }, 850);
  };

  return (
    <footer
      id="footer-root"
      className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 py-8 border-t border-slate-200/80 dark:border-slate-900 transition-colors duration-300 relative overflow-hidden"
      role="contentinfo"
      aria-label="Corporate Footer Information"
    >
      {/* Editorial Decorative Grid Backplane */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-850 to-transparent" />

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Row 1: Brand Identifier & Newsroom Newsletter Subscription Engine (2 Columns) */}
        <div className="relative grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-3 pb-5 border-b border-slate-200/60 dark:border-slate-900">
          {/* Vertical Divider for Row 1 */}
          <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-200/60 dark:via-slate-850 to-transparent" />

          {/* Column 1: Brand Identifier & Physical Coordinate Map Pin (Spans 6/12) */}
          <div className="sm:col-span-6 flex flex-col space-y-3 sm:pr-6 h-full">
            <div className="flex items-center justify-between pb-2">
              <Link
                to="/"
                onClick={handlePageTransition}
                className="inline-flex items-center gap-2.5 group hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-lg"
                aria-label={`${COMPANY_NAME} homepage - Return to Landing Page`}
              >
                <div
                  className="w-16 h-8 sm:w-24 sm:h-12 md:w-28 md:h-14 flex items-center justify-center shrink-0 overflow-hidden"
                  aria-hidden="true"
                >
                  <img 
                    src="/oits_logo_hq.png" 
                    alt="" 
                    className="w-full h-full object-contain" 
                    onError={(e) => {
                      const target = e.target as any;
                      if (target.src.includes('oits_logo_hq')) {
                        target.src = '/oits_logo.png';
                      } else {
                        target.style.display = 'none';
                        target.nextSibling.style.display = 'block';
                      }
                    }}
                  />
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full drop-shadow-sm hidden"
                  >
                    <defs>
                      <linearGradient
                        id="footer-logo-gradient-new"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#1e3a8a" />
                        <stop offset="50%" stopColor="#2563eb" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="url(#footer-logo-gradient-new)"
                      strokeWidth="7"
                    />
                    <path
                      d="M38 32 H48 V68 H38 Z"
                      fill="url(#footer-logo-gradient-new)"
                    />
                    <path
                      d="M54 32 H84 V41 H74 V68 H64 V41 H54 Z"
                      fill="url(#footer-logo-gradient-new)"
                    />
                  </svg>
                </div>
              </Link>

              {/* Accessibility Focused Theme controls */}
              <button
                onClick={toggleTheme}
                className="mr-2 sm:mr-4 lg:mr-8 inline-flex items-center h-8 gap-2 text-[10px] font-mono font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-900 px-3 rounded-lg border-2 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                aria-label={
                  theme === "dark"
                    ? "Convert visual wrapper style to Light Mode"
                    : "Convert visual wrapper style to Dark Mode"
                }
              >
                {theme === "dark" ? (
                  <Sun
                    size={12}
                    className="text-amber-500 animate-[spin_10s_linear_infinite]"
                    aria-hidden="true"
                  />
                ) : (
                  <Moon
                    size={12}
                    className="text-blue-600"
                    aria-hidden="true"
                  />
                )}
                <span>{theme === "dark" ? "LIGHT" : "DARK"}</span>
              </button>
            </div>

            {/* Geotargeted physical address - strict Maps coordinate */}
            <div className="space-y-1">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-lg p-1 -ml-1"
                aria-label={`Open physical HQ office location in Google Maps - address: ${ADDRESS}`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-500/30 dark:hover:border-blue-500/30 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-slate-850/30 transition-all duration-300 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-slate-900/40">
                  <MapPin
                    size={18}
                    className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <span className="font-semibold text-base leading-relaxed max-w-xs block text-left">
                  House # 42, Road # 2/A, Block # Z, Dhaka 1209, Bangladesh
                </span>
              </a>
            </div>

            {/* Contact Email */}
            <div className="space-y-1">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-lg p-1 -ml-1"
                aria-label={`Send an email to ${CONTACT_EMAIL}`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-500/30 dark:hover:border-blue-500/30 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-slate-850/30 transition-all duration-300 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-slate-900/40">
                  <Mail
                    size={18}
                    className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <span className="font-semibold text-base leading-relaxed max-w-xs block text-left">
                  {CONTACT_EMAIL}
                </span>
              </a>
            </div>

            {/* Contact Phone */}
            <div className="space-y-1 pb-4">
              <a
                href={`tel:${PHONE.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded-lg p-1 -ml-1"
                aria-label={`Call ${PHONE}`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 hover:border-blue-500/30 dark:hover:border-blue-500/30 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/20 dark:hover:bg-slate-850/30 transition-all duration-300 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-slate-900/40">
                  <Smartphone
                    size={18}
                    className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </div>
                <span className="font-semibold text-base leading-relaxed max-w-xs block text-left">
                  {PHONE}
                </span>
              </a>
            </div>
          </div>

          {/* Column 2: Newsletter Insight Subscription Engine (Spans 6/12) */}
          <div className="sm:col-span-6 flex flex-col space-y-3 sm:pl-6 h-full">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-[0.2em] font-mono">
                  STAY INFORMED
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  Join our engineering collective for bi-weekly deep dives into
                  modern tech stacks.
                </p>
              </div>
              <button 
                onClick={handleScrollTop}
                className="group relative flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Scroll back to top"
              >
                <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:border-blue-600/30 group-hover:-translate-y-0.5 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                </div>
                <span className="text-[8px] font-mono font-black uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">TOP</span>
              </button>
            </div>

            {/* Newsletter form with strict validation state */}
            {status === "success" ? (
              <div
                className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30 rounded-lg p-2.5 text-center shadow-sm space-y-1"
                role="region"
                aria-label="Successful subscription notification"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                  <Check
                    size={12}
                    strokeWidth={3}
                    className="animate-[scaleIn_0.3s_ease-out]"
                  />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">
                    Workspace seat secured.
                  </p>
                  <p
                    className="text-[9px] text-slate-500 dark:text-emerald-400/80 leading-relaxed font-mono truncate px-1"
                    title={submittedEmail}
                  >
                    {submittedEmail}
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="font-mono text-[8px] font-black text-blue-600 dark:text-blue-400 hover:underline tracking-widest uppercase focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none"
                  aria-label="Add another company address"
                >
                  REGISTER ANOTHER DOMAIN
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubscribeSubmit}
                className="space-y-1.5 w-full text-left mt-1"
                aria-label="Secure newsletter subscription ledger"
              >
                <div className="flex flex-col gap-2 w-full">
                  <div className="relative group/input w-full">
                    <label htmlFor="newsletter-email-v2" className="sr-only">
                      Corporate Work Email Address
                    </label>
                    <input
                      id="newsletter-email-v2"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="Work email address"
                      aria-describedby="email-validation-tip"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-650 font-bold tracking-tight transition-all duration-300"
                      required
                    />

                    {/* Focus scale-in physical frame/border */}
                    <span
                      className={`absolute inset-0 border-2 border-blue-600 dark:border-blue-500 rounded-lg pointer-events-none transition-all duration-300 transform ${isFocused ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
                      aria-hidden="true"
                    />
                  </div>

                  {/* Submitting vs dynamic checks */}
                  <button
                    type="submit"
                    disabled={
                      status === "submitting" ||
                      status === "invalid_format" ||
                      status === "invalid_work"
                    }
                    className={`w-full shrink-0 py-2.5 px-4 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none ${
                      status === "submitting"
                        ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
                        : status === "invalid_work" ||
                            status === "invalid_format"
                          ? "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-700 cursor-not-allowed border border-dashed border-slate-200 dark:border-slate-800/60"
                          : "bg-blue-600 hover:bg-sky-500 hover:shadow-neon-blue text-white shadow-md transition-all duration-300"
                    }`}
                    aria-label="Confirm enterprise newsroom signup"
                  >
                    {status === "submitting" ? (
                      <span className="w-3 h-3 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>SUBSCRIBE TO INSIGHTS</span>
                        <ArrowRight size={10} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>

                {/* Micro Validation Help block */}
              </form>
            )}

            {/* Social handles Cluster - Moved to Column 2 */}
            <div className="space-y-1 mt-auto pb-[18px]">
              <nav
                className="flex flex-wrap items-center gap-1.5 w-full"
                aria-label="Social media networks stream links"
              >
                <SocialLink
                  href="https://github.com/oitsdhaka"
                  icon={Github}
                  label="GitHub"
                />
                <SocialLink
                  href="https://linkedin.com/company/oitsdhaka"
                  icon={Linkedin}
                  label="LinkedIn"
                />
                <SocialLink
                  href="https://twitter.com/oitsdhaka"
                  icon={Twitter}
                  label="Twitter"
                />
                <SocialLink
                  href="https://facebook.com/oitsdhaka"
                  icon={Facebook}
                  label="Facebook"
                />
                <SocialLink
                  href={`https://wa.me/${PHONE.replace(/[^0-9]/g, '')}`}
                  icon={MessageCircle}
                  label="WhatsApp"
                />
                <SocialLink
                  href="mailto:info@oitsdhaka.com"
                  icon={Mail}
                  label="Email"
                />
              </nav>
            </div>
          </div>
        </div>

        {/* Row 2: Navigation Directory Pages & Engineering Capabilities (Links' List) */}
        <div
          id="footer-menu-grid"
          className="relative grid grid-cols-1 sm:grid-cols-10 gap-6 sm:gap-5 py-6 sm:pl-4 md:pl-8 border-b border-slate-200/60 dark:border-slate-900 transition-all duration-300"
        >
          {/* Column 1: Resources Column */}
          <div
            id="footer-resources-col"
            className="sm:col-span-3 space-y-2.5 sm:pr-2 md:pr-4"
          >
            <h4
              id="footer-resources-title"
              className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-[0.2em] font-mono"
            >
              RESOURCES
            </h4>
            <nav
              id="footer-resources-nav"
              aria-label="Footer corporate resources index"
            >
              <ul id="footer-resources-list" className="space-y-1" role="list">
                <li>
                  <Link
                    to="#"
                    onClick={handlePageTransition}
                    aria-label="View career opportunities at OITS Dhaka"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Career</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={handlePageTransition}
                    aria-label="View recent company news, engineering achievements, and updates"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Recent News</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={handlePageTransition}
                    aria-label="Read our system design, engineering, and product development blogs"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Blogs</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={handlePageTransition}
                    aria-label="Browse the OITS Dhaka technical knowledge base of docs, blueprints, and standards"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Knowledge base</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={handlePageTransition}
                    aria-label="Read our terms, conditions, data privacy laws, and compliance policy agreements"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Terms & Policy</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#"
                    onClick={handlePageTransition}
                    aria-label="View frequently asked questions about project delivery, pricing, and capabilities"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>FAQ</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 2 (Middle): Solutions & Support - 40% Width with Left & Right Borders */}
          <div
            id="footer-solutions-col"
            className="sm:col-span-4 space-y-2.5 sm:px-2 md:px-4 sm:border-x sm:border-slate-200/60 sm:dark:border-slate-900 transition-all duration-300"
          >
            <h4
              id="footer-solutions-title"
              className="text-slate-900 dark:text-white text-xs font-black uppercase tracking-[0.2em] font-mono"
            >
              SOLUTIONS & SUPPORT
            </h4>
            <nav
              id="footer-solutions-nav"
              aria-label="Footer system engineering scopes"
            >
              <ul id="footer-solutions-list" className="space-y-1" role="list">
                <li>
                  <Link
                    to="/workflow"
                    onClick={handlePageTransition}
                    aria-label="Navigate to our Agile Workflow pipeline"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Agile Workflow</span>
                  </Link>
                </li>
                {SERVICES.map((service) => (
                  <li key={service.id}>
                    <Link
                      to="/services"
                      onClick={handlePageTransition}
                      aria-label={`Read capabilities documentation on ${service.title}`}
                      className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                    >
                      <span>{service.title}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/services"
                    onClick={handlePageTransition}
                    aria-label="Read capabilities documentation on AR/VR Solutions"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>AR/VR Solutions</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    onClick={handlePageTransition}
                    aria-label="Read capabilities documentation on Cloud Support Services"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Cloud Support</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services"
                    onClick={handlePageTransition}
                    aria-label="Read capabilities documentation on IoT & Edge Computing"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>IoT & Edge Computing</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Column 3: Sitemap */}
          <div
            id="footer-sitemap-col"
            className="sm:col-span-3 space-y-2.5 sm:pl-2 md:pl-4 transition-all duration-300"
          >
            <h4
              id="footer-sitemap-title"
              className="text-slate-900 dark:text-white text-sm font-black uppercase tracking-[0.2em] font-mono"
            >
              Sitemap
            </h4>
            <nav
              id="footer-sitemap-nav"
              aria-label="Footer primary index directories"
            >
              <ul id="footer-sitemap-list" className="space-y-1" role="list">
                <li className="overflow-hidden">
                  <Link
                    to="/"
                    onClick={handlePageTransition}
                    aria-label="Navigate inside the sitemap to the OITS Dhaka Home segment"
                    className={`text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1 ${location.pathname === "/" ? "text-blue-600 font-extrabold" : ""}`}
                  >
                    <span>Home</span>
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    to="/services"
                    onClick={handlePageTransition}
                    aria-label="Navigate inside the sitemap to the OITS Dhaka Services segment"
                    className={`text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1 ${location.pathname === "/services" ? "text-blue-600 font-extrabold" : ""}`}
                  >
                    <span>Services</span>
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    to="/portfolio"
                    onClick={handlePageTransition}
                    aria-label="Navigate inside the sitemap to the OITS Dhaka Portfolio segment"
                    className={`text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1 ${location.pathname === "/portfolio" ? "text-blue-600 font-extrabold" : ""}`}
                  >
                    <span>Portfolio</span>
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    to="/about"
                    onClick={handlePageTransition}
                    aria-label="Navigate inside the sitemap to the OITS Dhaka Our Team segment"
                    className={`text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1 ${location.pathname === "/about" ? "text-blue-600 font-extrabold" : ""}`}
                  >
                    <span>Our Team</span>
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    to="/about"
                    onClick={handlePageTransition}
                    aria-label="Navigate inside the sitemap to the About OITS company description"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>About OITS</span>
                  </Link>
                </li>
                <li className="overflow-hidden">
                  <Link
                    to="/contact"
                    onClick={handlePageTransition}
                    aria-label="Navigate inside the sitemap to Contact OITS support pipelines"
                    className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1.5 transition-all duration-300 flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1 -ml-1"
                  >
                    <span>Contact Us</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Row 3: Editorial License, Trademark & Copyright Disclaimers */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em]">
          <div className="flex items-center gap-3">
            <Building size={14} className="text-slate-700" />
            <p className="font-bold text-slate-400">
              &copy; {new Date().getFullYear()} {COMPANY_NAME}. DIGITAL ENGINEERING EXCELLENCE.
            </p>
          </div>

          <nav className="flex gap-8 font-black text-slate-500" aria-label="Privacy legal policies matrix">
            <Link
              to="/about"
              onClick={handlePageTransition}
              aria-label="View OITS Dhaka legal and corporate compliance frameworks"
              className="hover:text-blue-400 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
            >
              LEGAL COMPLIANCE
            </Link>
            <Link
              to="/contact"
              onClick={handlePageTransition}
              aria-label="Read general data privacy clauses"
              className="hover:text-blue-400 transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none rounded px-1"
            >
              PRIVACY POLICY
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
