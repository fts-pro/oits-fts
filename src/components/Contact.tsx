import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  RefreshCcw,
  MapPin,
  Navigation,
  Loader2,
  Mail,
  Smartphone,
  MessageCircle,
} from "lucide-react";
import { CONTACT_EMAIL, PHONE, ADDRESS } from "../constants";
import { SectionId } from "../types";

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [isCopied, setIsCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Identification is required";
    if (!formData.email.trim()) {
      newErrors.email = "A business email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email =
        "Please provide a valid email format (e.g. name@company.com)";
    }
    if (!formData.message.trim())
      newErrors.message = "Please provide a project mission overview";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setTimeout(() => {
      if (Math.random() < 0.02) {
        setStatus("error");
      } else {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setErrors({});
        setTimeout(() => setStatus("idle"), 8000);
      }
    }, 1000);
  };

  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.123456789012!2d90.3644321!3d23.7431234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ0JzM1LjIiTiA5MMKwMjEnNTEuOSJF!5e0!3m2!1sen!2sbd!4v1234567890123`;

  return (
    <section
      ref={sectionRef}
      id={SectionId.CONTACT}
      className="py-8 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-[45%] h-full bg-blue-100/40 dark:bg-blue-900/5 -skew-x-12 transform translate-x-1/4 pointer-events-none" />
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start mb-8">
          {/* Vertical Divider for Contact Grid Accordance with Section 6 */}
          <div className="hidden lg:block absolute top-0 bottom-0 left-[60%] -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-slate-200/60 dark:via-slate-850 to-transparent" />

          <div className="space-y-4 lg:col-span-3 lg:pr-4">
            <div
              className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-600/10 dark:bg-blue-400/10 text-blue-900 dark:text-blue-300 text-[11px] font-black uppercase tracking-[0.25em] mb-8 ring-1 ring-blue-500/30 shadow-sm">
                <Sparkles size={16} className="text-blue-600" /> Start Your
                Evolution
              </div>
              <h3 className="text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter text-slate-950 dark:text-white drop-shadow-sm">
                Let's build <br />{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 animate-pulse">
                  industrial software.
                </span>
              </h3>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xl font-medium max-w-lg leading-relaxed">
              Connect with our senior engineering team to discuss your
              infrastructure needs.
            </p>
          </div>

          <div className="relative transition-all duration-1000 delay-300 ease-out transform-gpu lg:col-span-2 lg:pl-4">
            <div
              className={`relative bg-white dark:bg-slate-950/40 p-3 sm:p-4 md:p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xl dark:glass-card-glow transition-all duration-700 overflow-hidden ${status === "sending" ? "scale-[0.98]" : "scale-100"}`}
            >
              {status === "sending" && (
                <div className="absolute inset-0 z-50 bg-white/70 dark:bg-slate-950/85 backdrop-blur-[6px] flex flex-col items-center justify-center animate-in fade-in duration-500">
                  <div className="relative mb-10">
                    <Loader2
                      size={100}
                      className="text-blue-600 animate-spin stroke-[1.5px]"
                    />
                    <div className="absolute inset-0 bg-blue-600/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter">
                      Establishing Link...
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.3em] animate-pulse">
                      Encrypting Payload
                    </p>
                  </div>
                </div>
              )}
 
              {status === "success" ? (
                <div className="text-center py-6 animate-in zoom-in-95 duration-700">
                  <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-3.5 shadow-md shadow-green-500/10 ring-2 ring-green-500/10">
                    <CheckCircle2 size={24} className="stroke-[2.5px]" />
                  </div>
                  <h4 className="text-xl font-black mb-1 to text-slate-950 dark:text-white tracking-tighter text-glow">
                    Packet Delivered
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-3.5 max-w-xs mx-auto">
                    Our engineering leads will respond shortly.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center justify-center rounded-xl font-black tracking-tight transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96] overflow-hidden relative transform-gpu will-change-transform bg-slate-950 text-white hover:bg-slate-900 border border-transparent dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl px-4 h-10 border font-black text-xs shadow-md"
                  >
                    SEND NEW INQUIRY
                  </button>
                </div>
              ) : status === "error" ? (
                <div className="text-center py-6 animate-in zoom-in-95 duration-700">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mx-auto mb-3.5 shadow-md shadow-red-500/10">
                    <AlertCircle size={24} className="stroke-[2.5px]" />
                  </div>
                  <h4 className="text-xl font-black mb-1 text-slate-950 dark:text-white tracking-tighter">
                    Transmission Failed
                  </h4>
                  <p className="text-slate-650 dark:text-slate-400 text-sm mb-4 max-w-sm mx-auto font-medium">
                    Network timeout. Please retry the connection.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="inline-flex items-center justify-center rounded-xl font-black tracking-tight transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.96] overflow-hidden relative transform-gpu will-change-transform bg-slate-950 text-white hover:bg-slate-900 border border-transparent dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl px-4 h-10 border font-black text-xs flex items-center gap-2"
                  >
                    <RefreshCcw size={14} /> RE-INNITIATE
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3.5"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-3.5">
                    <div className="space-y-1 group">
                      <label
                        htmlFor="name-input"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 ml-1 group-focus-within:text-blue-600 transition-colors cursor-pointer"
                      >
                        Your Name <span className="text-blue-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name-input"
                        name="name"
                        autoComplete="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                          errors.name ? "name-error" : undefined
                        }
                        className={`w-full bg-slate-50 dark:bg-slate-900/50 border ${errors.name ? "border-red-500 focus:border-red-500" : "border-slate-400 dark:border-slate-800 focus:border-blue-500"} rounded-xl px-4 py-2.5 text-slate-950 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all font-bold shadow-sm placeholder:text-slate-405 dark:placeholder:text-slate-600 text-xs`}
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                      {errors.name && (
                        <p
                          id="name-error"
                          className="text-red-600 dark:text-red-400 text-[10px] mt-1 flex items-center gap-1.5 font-black animate-in fade-in slide-in-from-top-1 duration-300"
                        >
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 group">
                      <label
                        htmlFor="email-input"
                        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 ml-1 group-focus-within:text-blue-600 transition-colors cursor-pointer"
                      >
                        Email Address <span className="text-blue-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email-input"
                        name="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        className={`w-full bg-slate-50 dark:bg-slate-900/50 border ${errors.email ? "border-red-500 focus:border-red-500" : "border-slate-400 dark:border-slate-800 focus:border-blue-500"} rounded-xl px-4 py-2.5 text-slate-950 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all font-bold shadow-sm placeholder:text-slate-405 dark:placeholder:text-slate-600 text-xs`}
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          className="text-red-600 dark:text-red-400 text-[10px] mt-1 flex items-center gap-1.5 font-black animate-in fade-in slide-in-from-top-1 duration-300"
                        >
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 group">
                    <label
                      htmlFor="message-input"
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200 ml-1 group-focus-within:text-blue-600 transition-colors cursor-pointer"
                    >
                      Summary (Optional)
                    </label>
                    <textarea
                      id="message-input"
                      name="message"
                      aria-invalid={!!errors.message}
                      aria-describedby={
                        errors.message ? "message-error" : undefined
                      }
                      rows={4}
                      className={`w-full bg-slate-50 dark:bg-slate-900/50 border ${errors.message ? "border-red-500 focus:border-red-500" : "border-slate-400 dark:border-slate-800 focus:border-blue-500"} rounded-xl px-4 py-3 text-slate-950 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-600/20 transition-all resize-none font-bold shadow-sm placeholder:text-slate-405 dark:placeholder:text-slate-600 text-xs`}
                      placeholder="What are we building?"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                    {errors.message && (
                      <p
                        id="message-error"
                        className="text-red-600 dark:text-red-400 text-[10px] mt-1 flex items-center gap-1.5 font-black animate-in fade-in slide-in-from-top-1 duration-300"
                      >
                        <AlertCircle size={12} /> {errors.message}
                      </p>
                    )}
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className={`inline-flex items-center justify-center rounded-xl transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:pointer-events-none overflow-hidden relative transform-gpu will-change-transform w-full font-black text-sm h-10 active:scale-95 shadow-[0_5px_15px_-3px_rgba(0,0,0,0.4)] dark:shadow-[0_5px_15px_-3px_rgba(37,99,235,0.3)] bg-slate-950 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl py-1 md:py-1.5`}
                    >
                      {status === "sending" ? (
                        <div className="flex items-center gap-4 animate-pulse">
                          <Loader2 className="animate-spin" size={24} />
                          ESTABLISHING LINK...
                        </div>
                      ) : (
                        <span className="flex items-center gap-4 group text-sm font-black">
                          INNITIATE
                          <Send
                            size={24}
                            className="transform rotate-12 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2"
                          />
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

            <div className="pt-2 mb-6 lg:mb-10 w-full">
              <div className="grid grid-cols-1 sm:grid-cols-[60%_40%] gap-3 lg:gap-6">
                <div className="flex items-stretch gap-3 p-2 lg:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all group">
                  <div className="w-10 lg:w-14 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 lg:w-7 lg:h-7" />
                  </div>
                  <div className="flex items-center">
                    <p className="font-bold text-slate-900 dark:text-slate-100 leading-relaxed text-sm lg:text-base">
                      House # 42, Road # 2/A, Block # Z,
                      <br />
                      Dhaka 1209, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-stretch gap-3 p-2 lg:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 lg:w-14 rounded-lg bg-green-50 dark:bg-green-900/30 flex justify-center items-center text-green-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="flex flex-col justify-center text-sm lg:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed py-0.5">
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="hover:text-blue-600 transition-colors lowercase tracking-tight flex items-center h-full"
                      >
                        {CONTACT_EMAIL}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-stretch gap-3 p-2 lg:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all group">
                    <div className="w-10 lg:w-14 rounded-lg bg-green-50 dark:bg-green-900/30 flex justify-center items-center text-green-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Smartphone className="w-4 h-4 lg:w-5 lg:h-5" />
                    </div>
                    <div className="flex flex-col justify-center text-sm lg:text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed py-0.5">
                      <a
                        href={`tel:${PHONE.replace(/\s/g, '')}`}
                        className="hover:text-green-600 transition-colors lowercase tracking-tight flex items-center h-full"
                      >
                        {PHONE}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Embedded Map Full Width */}
        <div className="w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl mt-6 lg:mt-10">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="OITS Dhaka Location"
            className="grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
      </div>
    </section>
  );
};
