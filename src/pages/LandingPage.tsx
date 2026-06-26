import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowRight,
  ShieldAlert,
  Binary,
  Layers,
  LineChart,
  Star,
  Quote,
  ChevronDown,
  Lock,
  Compass,
  ArrowUpRight,
} from "lucide-react";

export const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCaseAction = () => {
    navigate(
      user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/register",
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020c1b] text-[#8892b0] font-sans antialiased selection:bg-[#c5a059] selection:text-[#0a192f]">
      {/* 🧭 Top Navigation Layer */}
      <nav className="w-full bg-[#020c1b]/95 border-b border-[#112240] sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 h-24 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#c5a059] text-[#0a192f] p-2 rounded">
              <ShieldAlert size={20} />
            </div>
            <h1 className="text-xl font-bold text-[#e6f1ff] tracking-[3px] uppercase">
              APEX<span className="text-[#c5a059]">FORENSICS</span>
            </h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex gap-8 text-xs font-bold tracking-[2px] uppercase">
              <a
                href="#about"
                className="text-[#e6f1ff] hover:text-[#c5a059] transition-colors"
              >
                About CEO
              </a>
              <a
                href="#services"
                className="text-[#e6f1ff] hover:text-[#c5a059] transition-colors"
              >
                Services
              </a>
              <a
                href="#process"
                className="text-[#e6f1ff] hover:text-[#c5a059] transition-colors"
              >
                Methodology
              </a>
              <a
                href="#testimonials"
                className="text-[#e6f1ff] hover:text-[#c5a059] transition-colors"
              >
                Metrics
              </a>
            </div>
            <div className="h-5 w-[1px] bg-[#112240] hidden lg:block" />
            <div className="flex gap-4">
              {user ? (
                <button
                  onClick={() =>
                    navigate(user.role === "admin" ? "/admin" : "/dashboard")
                  }
                  className="bg-transparent border border-[#c5a059] text-[#c5a059] px-6 py-2.5 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#c5a059]/10 transition-all"
                >
                  Console Dashboard
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[#e6f1ff] hover:text-[#c5a059] text-xs font-bold tracking-widest uppercase transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-transparent border border-[#c5a059] text-[#c5a059] px-6 py-2.5 rounded text-xs font-bold tracking-widest uppercase hover:bg-[#c5a059] hover:text-[#0a192f] transition-all"
                  >
                    Create Account
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🚀 Tactical Hero Frame */}
      <section className="relative overflow-hidden border-b border-[#112240] bg-gradient-to-b from-[#020c1b] via-[#051329] to-[#020c1b] py-32 sm:py-40 px-6 text-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000')] bg-cover bg-center opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative z-10">
          <span className="border border-[#c5a059] text-[#c5a059] text-[10px] font-bold tracking-[0.3em] uppercase px-4 py-1.5 rounded mb-8 bg-[#c5a059]/5">
            Asset Discovery Framework
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif text-[#e6f1ff] tracking-tight leading-[1.15] max-w-4xl font-bold">
            Restoring Financial{" "}
            <span className="text-[#c5a059] italic font-normal">Integrity</span>
          </h2>
          <p className="mt-6 text-base sm:text-lg text-[#8892b0] max-w-2xl leading-relaxed">
            Institutional-grade investigation and recovery services for victims
            of complex financial fraud. Verify locked dispute assets, submit
            recovery claims entries, and maintain secure connection data.
          </p>
          <button
            onClick={handleCaseAction}
            className="mt-10 border border-[#c5a059] text-[#c5a059] bg-transparent hover:bg-[#c5a059] hover:text-[#0a192f] px-10 py-4 rounded text-xs font-bold tracking-[2px] uppercase flex items-center gap-2 shadow-lg transition-all group"
          >
            Start Case Evaluation
            <ArrowRight
              size={14}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </section>

      {/* 👥 Corporate Leadership Section */}
      <section
        id="about"
        className="bg-[#0a192f] border-b border-[#112240] py-28 px-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs text-[#c5a059] font-bold tracking-widest uppercase mb-2">
              Executive Guidance
            </span>
            <h3 className="text-3xl font-serif text-[#e6f1ff] font-bold tracking-tight">
              Investigative Command
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Executive 1: CEO */}
            <div className="bg-[#112240] border-l-4 border-[#c5a059] rounded-r p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all hover:translate-y-[-2px]">
              <div className="w-28 h-28 rounded overflow-hidden border border-[#c5a059] shrink-0 bg-[#020c1b]">
                <img
                  src="/ceo.jpeg"
                  alt="Jonathan V. Sterling"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="text-center sm:text-left space-y-3">
                <div>
                  <h4 className="text-lg font-bold text-[#e6f1ff]">
                    Jonathan V. Sterling
                  </h4>
                  <p className="text-xs text-[#c5a059] font-mono tracking-wider mt-0.5">
                    Founder & Chief Executive Officer
                  </p>
                </div>
                <p className="text-xs text-[#8892b0] leading-relaxed italic">
                  "In a digital era where boundaries are blurred, financial
                  security requires proactive defense and reactive precision. At
                  Apex Forensics, our mission is to ensure that victims of
                  systemic financial malpractice are heard, investigated, and
                  ultimately, made whole."
                </p>
              </div>
            </div>

            {/* Executive 2: Chief Forensics Officer */}
            <div className="bg-[#112240] border-l-4 border-[#c5a059] rounded-r p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 transition-all hover:translate-y-[-2px]">
              <div className="w-28 h-28 rounded overflow-hidden border border-[#c5a059] shrink-0 bg-[#020c1b]">
                <img
                  src="/ceo2.png"
                  alt="Elena Rostova"
                  className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="text-center sm:text-left space-y-3">
                <div>
                  <h4 className="text-lg font-bold text-[#e6f1ff]">
                    Elena Rostova
                  </h4>
                  <p className="text-xs text-[#c5a059] font-mono tracking-wider mt-0.5">
                    Chief of Investigative Intelligence
                  </p>
                </div>
                <p className="text-xs text-[#8892b0] leading-relaxed italic">
                  "Tracing networks across layered decentralized protocols
                  demands flawless operational mapping logic. We build
                  bulletproof evidentiary dossiers designed to withstand
                  cross-jurisdictional scrutiny and trigger rapid recovery
                  tracks."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💼 Specialized Recovery Domains */}
      <section id="services" className="py-28 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-20">
          <span className="text-xs text-[#c5a059] font-bold tracking-widest uppercase mb-2">
            Capabilities Matrix
          </span>
          <h3 className="text-3xl font-serif text-[#e6f1ff] font-bold">
            Specialized Recovery Domains
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#112240] p-8 rounded border-l-4 border-[#c5a059] space-y-4">
            <div className="text-[#c5a059]">
              <Binary size={26} />
            </div>
            <h4 className="text-lg font-bold text-[#e6f1ff]">
              Blockchain Forensics
            </h4>
            <p className="text-xs text-[#8892b0] leading-relaxed">
              Our team utilizes industry-leading chain-analysis tools to trace
              assets across public and private ledgers. We track movement across
              decentralized protocols, exchanges, and custodial wallets to
              identify illicit endpoints.
            </p>
          </div>
          <div className="bg-[#112240] p-8 rounded border-l-4 border-[#c5a059] space-y-4">
            <div className="text-[#c5a059]">
              <Layers size={26} />
            </div>
            <h4 className="text-lg font-bold text-[#e6f1ff]">
              Wire Fraud Dispute
            </h4>
            <p className="text-xs text-[#8892b0] leading-relaxed">
              We work within the legal frameworks of SWIFT, SEPA, and regional
              banking oversight to execute formal challenge documentation,
              significantly increasing the probability of bank-level reversal.
            </p>
          </div>
          <div className="bg-[#112240] p-8 rounded border-l-4 border-[#c5a059] space-y-4">
            <div className="text-[#c5a059]">
              <LineChart size={26} />
            </div>
            <h4 className="text-lg font-bold text-[#e6f1ff]">
              Investment Fraud Mitigation
            </h4>
            <p className="text-xs text-[#8892b0] leading-relaxed">
              We perform deep-web reconnaissance on fraudulent investment
              portals and "pump-and-dump" operations, effectively creating a
              dossier used to alert regulators and block future operations.
            </p>
          </div>
        </div>
      </section>

      {/* 🗺️ Forensic Roadmap */}
      <section
        id="process"
        className="py-28 px-6 bg-[#112240] border-y border-[#0a192f]"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <span className="text-xs text-[#c5a059] font-bold tracking-widest uppercase mb-2">
              Tactical Execution
            </span>
            <h3 className="text-3xl font-serif text-[#e6f1ff] font-bold">
              The Forensic Roadmap
            </h3>
            <p className="text-xs text-[#8892b0] mt-2">
              A transparent, data-backed approach to asset recovery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#020c1b] p-6 rounded border border-[#112240] space-y-2">
              <span className="text-[10px] font-mono text-[#c5a059] font-bold block">
                PHASE I
              </span>
              <h5 className="text-sm font-bold text-[#e6f1ff]">
                Intelligence Gathering
              </h5>
              <p className="text-xs text-[#8892b0] leading-relaxed">
                Collection of primary evidence, communication logs, and
                transaction hashes (TXIDs).
              </p>
            </div>
            <div className="bg-[#020c1b] p-6 rounded border border-[#112240] space-y-2">
              <span className="text-[10px] font-mono text-[#c5a059] font-bold block">
                PHASE II
              </span>
              <h5 className="text-sm font-bold text-[#e6f1ff]">
                Network Mapping
              </h5>
              <p className="text-xs text-[#8892b0] leading-relaxed">
                Mapping the flow of funds to identify recipient addresses and
                custodial intermediaries.
              </p>
            </div>
            <div className="bg-[#020c1b] p-6 rounded border border-[#112240] space-y-2">
              <span className="text-[10px] font-mono text-[#c5a059] font-bold block">
                PHASE III
              </span>
              <h5 className="text-sm font-bold text-[#e6f1ff]">
                Regulatory Escalation
              </h5>
              <p className="text-xs text-[#8892b0] leading-relaxed">
                Filing formal complaints and structured evidence packages with
                Financial Conduct Authorities.
              </p>
            </div>
            <div className="bg-[#020c1b] p-6 rounded border border-[#112240] space-y-2">
              <span className="text-[10px] font-mono text-[#c5a059] font-bold block">
                PHASE IV
              </span>
              <h5 className="text-sm font-bold text-[#e6f1ff]">
                Final Restitution
              </h5>
              <p className="text-xs text-[#8892b0] leading-relaxed">
                Coordination with secure legal channels to secure the return of
                assets to the client's ledger account.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🏆 Testimonials Section */}
      <section id="testimonials" className="py-28 px-6 bg-[#020c1b]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="text-xs text-[#c5a059] font-bold tracking-widest uppercase mb-2">
              Performance Ledger
            </span>
            <h3 className="text-3xl font-serif text-[#e6f1ff] font-bold">
              Validated Success Matrices
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#112240] p-6 rounded flex flex-col justify-between relative hover:border-[#c5a059]/30 border border-transparent transition-all">
              <Quote className="absolute top-6 right-6 text-[#020c1b]/40 h-10 w-10 pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="flex text-[#c5a059] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-[#e6f1ff] leading-relaxed font-medium italic">
                  "The automation framework discovered $42,000 in escrow
                  allocations tied to historical operations that we had written
                  off as completely unrecoverable."
                </p>
              </div>
              <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#e6f1ff]">
                  Ardent Ventures Inc.
                </span>
                <span className="font-mono text-[#c5a059]">Recovered $42K</span>
              </div>
            </div>

            <div className="bg-[#112240] p-6 rounded flex flex-col justify-between relative hover:border-[#c5a059]/30 border border-transparent transition-all">
              <Quote className="absolute top-6 right-6 text-[#020c1b]/40 h-10 w-10 pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="flex text-[#c5a059] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-[#e6f1ff] leading-relaxed font-medium italic">
                  "Tracking claims entries through their messaging workspace
                  context keeps audit requirements clean. Highly responsive
                  forensic system architecture."
                </p>
              </div>
              <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#e6f1ff]">Devon K.</span>
                <span className="font-mono text-[#c5a059]">
                  Corporate Counsel
                </span>
              </div>
            </div>

            <div className="bg-[#112240] p-6 rounded flex flex-col justify-between relative hover:border-[#c5a059]/30 border border-transparent transition-all">
              <Quote className="absolute top-6 right-6 text-[#020c1b]/40 h-10 w-10 pointer-events-none" />
              <div className="space-y-4 relative z-10">
                <div className="flex text-[#c5a059] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-[#e6f1ff] leading-relaxed font-medium italic">
                  "The connection logging guarantees that data pathways are
                  absolute. ApexForensics recovered our disputed funds in under
                  two weeks."
                </p>
              </div>
              <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#e6f1ff]">
                  Helix Digital Group
                </span>
                <span className="font-mono text-[#c5a059]">Recovered $91K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Testimonial 4 */}
        <div className="bg-[#112240] p-6 rounded flex flex-col justify-between relative hover:border-[#c5a059]/30 border border-transparent transition-all">
          <Quote className="absolute top-6 right-6 text-[#020c1b]/40 h-10 w-10 pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex text-[#c5a059] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#e6f1ff] leading-relaxed font-medium italic">
              "Their forensic audit revealed inconsistencies in our ledger that
              bypassed standard reconciliation tools. An essential asset for
              complex financial integrity."
            </p>
          </div>
          <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#e6f1ff]">
              Vector Capital Partners
            </span>
            <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
              <span className="font-bold text-[#e6f1ff]">
                Nexus Global Trade
              </span>
              <span className="font-mono text-[#c5a059]">Recovered $700k</span>
            </div>
          </div>
        </div>

        {/* Additional Testimonial 5 */}
        <div className="bg-[#112240] p-6 rounded flex flex-col justify-between relative hover:border-[#c5a059]/30 border border-transparent transition-all">
          <Quote className="absolute top-6 right-6 text-[#020c1b]/40 h-10 w-10 pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex text-[#c5a059] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#e6f1ff] leading-relaxed font-medium italic">
              "The precision in their forensic report allowed us to settle a
              three-year dispute in months. The depth of their digital
              investigation is unmatched."
            </p>
          </div>
          <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#e6f1ff]">Sarah J.</span>
            <span className="font-mono text-[#c5a059]">
              Private Equity Lead
            </span>
          </div>
        </div>

        {/* Additional Testimonial 6 */}
        <div className="bg-[#112240] p-6 rounded flex flex-col justify-between relative hover:border-[#c5a059]/30 border border-transparent transition-all">
          <Quote className="absolute top-6 right-6 text-[#020c1b]/40 h-10 w-10 pointer-events-none" />
          <div className="space-y-4 relative z-10">
            <div className="flex text-[#c5a059] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} fill="currentColor" />
              ))}
            </div>
            <p className="text-xs text-[#e6f1ff] leading-relaxed font-medium italic">
              "Seamless integration with our workflow. ApexForensics turned raw,
              fragmented transaction logs into a clear, admissible evidence
              trail."
            </p>
          </div>
          <div className="border-t border-[#020c1b]/30 pt-4 mt-6 flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#e6f1ff]">Nexus Global Trade</span>
            <span className="font-mono text-[#c5a059]">Recovered $1.23m</span>
          </div>
        </div>
      </section>

      {/* 📄 Institutional FAQ Block */}
      <section id="faq" className="py-28 px-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="text-xs text-[#c5a059] font-bold tracking-widest uppercase mb-2">
            Institutional FAQ
          </span>
          <h3 className="text-3xl font-serif text-[#e6f1ff] font-bold">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-4">
          <details className="group bg-[#112240] rounded p-5 cursor-pointer transition-colors open:bg-[#112240]/80">
            <summary className="font-bold text-xs sm:text-sm tracking-wide text-[#e6f1ff] uppercase flex justify-between items-center list-none">
              What is your legal standing in asset recovery?
              <ChevronDown
                size={14}
                className="text-[#c5a059] group-open:rotate-180 transition-transform"
              />
            </summary>
            <p className="text-xs text-[#8892b0] mt-4 leading-relaxed pt-2 border-t border-[#020c1b]/40">
              Apex Forensics operates as an investigative consultancy. We
              provide the comprehensive research findings, mapping records, and
              raw data profiles required for your legal team or local law
              enforcement networks to execute recovery actions. We do not
              provide direct legal representation.
            </p>
          </details>

          <details className="group bg-[#112240] rounded p-5 cursor-pointer transition-colors open:bg-[#112240]/80">
            <summary className="font-bold text-xs sm:text-sm tracking-wide text-[#e6f1ff] uppercase flex justify-between items-center list-none">
              Can you guarantee the recovery of my funds?
              <ChevronDown
                size={14}
                className="text-[#c5a059] group-open:rotate-180 transition-transform"
              />
            </summary>
            <p className="text-xs text-[#8892b0] mt-4 leading-relaxed pt-2 border-t border-[#020c1b]/40">
              Integrity is our primary metric. We conduct an intensive initial
              trace audit; if the systemic transaction ledger history suggests
              that data trails are permanently compromised or frozen, we provide
              a transparent, candid assessment rather than pursuing false
              parameters.
            </p>
          </details>

          <details className="group bg-[#112240] rounded p-5 cursor-pointer transition-colors open:bg-[#112240]/80">
            <summary className="font-bold text-xs sm:text-sm tracking-wide text-[#e6f1ff] uppercase flex justify-between items-center list-none">
              Is my connection data kept confidential?
              <ChevronDown
                size={14}
                className="text-[#c5a059] group-open:rotate-180 transition-transform"
              />
            </summary>
            <p className="text-xs text-[#8892b0] mt-4 leading-relaxed pt-2 border-t border-[#020c1b]/40">
              Absolutely. All incoming case logs, documentation tracking, and
              conversation parameters are held on completely isolated,
              hardware-encrypted nodes following rigorous international GDPR and
              security compliance mandates.
            </p>
          </details>
        </div>
      </section>

      {/* 📥 Action Call Footframe */}
      <section className="bg-[#112240] border-t border-[#0a192f] py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <Compass
            className="text-[#c5a059] mx-auto animate-spin-slow"
            size={32}
          />
          <h4 className="text-2xl font-serif text-[#e6f1ff] font-bold">
            Initialize Forensic Dossier Logging
          </h4>
          <p className="text-xs text-[#8892b0] leading-relaxed max-w-md mx-auto">
            Access our encrypted management network to register case records and
            track ledger operations in real time.
          </p>
          <button
            onClick={handleCaseAction}
            className="inline-flex items-center gap-2 text-xs font-bold bg-[#c5a059] text-[#0a192f] hover:bg-[#b08d4b] px-8 py-3.5 rounded tracking-widest uppercase transition-colors"
          >
            Launch Core Console
            <ArrowUpRight size={14} />
          </button>
        </div>
      </section>

      {/* 📄 Closed Regulatory Footer */}
      <footer className="mt-auto bg-[#000000] py-12 px-6 text-[11px] font-mono tracking-wide text-center border-t border-[#112240]">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-[#8892b0]">
            &copy; 2026 Apex Financial Forensics. All rights reserved.
          </p>
          <p className="max-w-3xl mx-auto text-[#444] leading-relaxed uppercase text-[9px]">
            <Lock className="inline mr-1 text-[#c5a059]/40" size={10} />{" "}
            DISCLAIMER: We provide analytical mapping and evidence assembly
            infrastructures. We are not a licensed financial advisor or a law
            firm. Please seek appropriate counsel.
          </p>
        </div>
      </footer>
    </div>
  );
};
