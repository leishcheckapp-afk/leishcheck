import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ChevronDown, MessageSquare, Globe, Wifi, WifiOff, Menu, X, ClipboardList, Camera, BarChart3, Quote } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollAnimationWrapper, StaggerWrapper } from '@/components/ScrollAnimationWrapper';
import { ModelStatus } from '@/components/ModelStatus';
import heroImage from '@/assets/hero-landing.jpg';

/* ─── Counter Hook ─── */
function useCountUp(end: number, duration = 1500, startOnView = true) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started, startOnView]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

/* ─── Enhanced Animation Variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      type: "spring",
      stiffness: 100,
      damping: 15
    } 
  },
};

const fadeInLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
    } 
  },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
    } 
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
    } 
  },
};

const slideInFromBottom = {
  hidden: { opacity: 0, y: 100 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.9, 
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number] 
    } 
  },
};

const stagger = { 
  visible: { 
    transition: { 
      staggerChildren: 0.2,
      delayChildren: 0.1
    } 
  } 
};

const staggerFast = { 
  visible: { 
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.05
    } 
  } 
};

const staggerSlow = { 
  visible: { 
    transition: { 
      staggerChildren: 0.3,
      delayChildren: 0.2
    } 
  } 
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* Parallax */
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  /* Counters */
  const c1 = useCountUp(20000);
  const c2 = useCountUp(70);
  const c3 = useCountUp(3);

  const navLinks = [
    { label: t('landing.navHow'), id: 'como-funciona' },
    { label: t('landing.navWhy'), id: 'por-que-importa' },
    { label: 'FAQ', id: 'faq' },
  ];

  return (
    <div className="landing-page bg-[#F5F2EC] text-[#1C2B1E] overflow-x-hidden">
      
      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#1C2B1E]/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <button onClick={() => scrollTo('hero')} className={`font-playfair text-2xl font-bold tracking-tight transition-colors ${scrolled ? 'text-[#F5F2EC]' : 'text-white'}`}>
            LeishCheck
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            <ModelStatus />
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className={`text-sm font-medium tracking-wide uppercase transition-colors hover:opacity-70 ${scrolled ? 'text-[#F5F2EC]/80' : 'text-white/80'}`}>
                {l.label}
              </button>
            ))}
            <button onClick={() => navigate('/app')} className={`border px-5 py-2 text-sm font-semibold uppercase tracking-widest transition-all hover:bg-white hover:text-[#1C2B1E] ${scrolled ? 'border-[#F5F2EC]/40 text-[#F5F2EC]' : 'border-white/40 text-white'}`}>
              {t('landing.navApp')}
            </button>
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden transition-colors ${scrolled ? 'text-[#F5F2EC]' : 'text-white'}`}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="absolute left-0 right-0 top-full bg-[#1C2B1E]/95 backdrop-blur-lg md:hidden">
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left text-sm font-medium uppercase tracking-wide text-[#F5F2EC]/80 hover:text-white">
                  {l.label}
                </button>
              ))}
              <button onClick={() => { setMenuOpen(false); navigate('/app'); }} className="mt-2 border border-white/30 px-5 py-2.5 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-[#1C2B1E]">
                {t('landing.navApp')}
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* ═══ SECTION 1 — HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 text-center"
        >
          <motion.p variants={fadeUp} className="text-sm font-medium uppercase tracking-[0.3em] text-white/60">
            {t('landing.heroTag')}
          </motion.p>
          <motion.h1 variants={slideInFromBottom} className="font-playfair text-5xl font-bold leading-[1.1] text-white sm:text-6xl lg:text-8xl">
            {t('landing.heroTitle1')}
            <br />
            <span className="italic text-[#A5D6A7]">{t('landing.heroTitle2')}</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            {t('landing.heroSub')}
          </motion.p>
          <motion.button
            variants={scaleIn}
            onClick={() => navigate('/app')}
            className="mt-4 border-2 border-white px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-[#1C2B1E]"
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {t('landing.heroCTA')}
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => scrollTo('missao')}
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
          whileHover={{ y: -2 }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.3em]">{t('landing.heroScroll')}</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.button>
      </section>

      {/* ═══ SECTION 2 — A MISSÃO ═══ */}
      <section id="missao" className="bg-[#F5F2EC] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-150px', amount: 0.3 }} 
          variants={stagger}
          className="mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          <motion.h2 variants={slideInFromBottom} className="font-playfair text-4xl font-bold leading-tight text-[#1C2B1E] sm:text-5xl lg:text-6xl">
            {t('landing.missionTitle1')}
            <br />
            <span className="italic text-[#1C2B1E]/60">{t('landing.missionTitle2')}</span>
          </motion.h2>
          <motion.div variants={scaleIn} className="mx-auto mt-8 h-px w-16 bg-[#1C2B1E]/20" />
          <motion.p variants={fadeUp} className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-[#1C2B1E]/70 sm:text-lg">
            {t('landing.missionText')}
          </motion.p>
        </motion.div>
      </section>

      {/* ═══ SECTION 3 — COMO FUNCIONA ═══ */}
      <section id="como-funciona" className="bg-[#1C2B1E] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-120px', amount: 0.2 }} 
          variants={stagger}
          className="mx-auto max-w-6xl px-6 lg:px-12"
        >
          <motion.h2 variants={fadeInLeft} className="text-center font-playfair text-4xl font-bold text-[#F5F2EC] sm:text-5xl lg:text-6xl">
            {t('landing.howTitle')}
          </motion.h2>
          <motion.div variants={scaleIn} className="mx-auto mt-4 h-px w-16 bg-[#F5F2EC]/20" />

          <motion.div variants={staggerSlow} className="mt-16 grid gap-8 sm:grid-cols-3">
            {[
              { icon: ClipboardList, num: '01', title: t('landing.step1Title'), desc: t('landing.step1Desc'), variant: fadeInLeft },
              { icon: Camera, num: '02', title: t('landing.step2Title'), desc: t('landing.step2Desc'), variant: fadeUp },
              { icon: BarChart3, num: '03', title: t('landing.step3Title'), desc: t('landing.step3Desc'), variant: fadeInRight },
            ].map((step) => (
              <motion.div key={step.num} variants={step.variant} className="group relative border border-[#F5F2EC]/10 p-8 transition-all hover:border-[#A5D6A7]/30 hover:bg-[#F5F2EC]/5 hover:scale-105">
                <motion.span 
                  className="font-playfair text-5xl font-bold text-[#A5D6A7]/20"
                  whileHover={{ scale: 1.1, color: "rgba(165, 214, 167, 0.4)" }}
                  transition={{ duration: 0.3 }}
                >
                  {step.num}
                </motion.span>
                <step.icon className="mt-4 h-8 w-8 text-[#A5D6A7]" />
                <h3 className="mt-4 font-playfair text-xl font-bold text-[#F5F2EC]">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#F5F2EC]/60">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 4 — POR QUE IMPORTA (Stats) ═══ */}
      <section id="por-que-importa" className="bg-[#F5F2EC] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-100px', amount: 0.3 }} 
          variants={stagger}
          className="mx-auto max-w-6xl px-6 lg:px-12"
        >
          <motion.h2 variants={fadeInRight} className="text-center font-playfair text-4xl font-bold text-[#1C2B1E] sm:text-5xl lg:text-6xl">
            {t('landing.statsTitle')}
          </motion.h2>
          <motion.div variants={scaleIn} className="mx-auto mt-4 h-px w-16 bg-[#1C2B1E]/20" />

          <motion.div variants={staggerSlow} className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              { ref: c1.ref, value: `${c1.count.toLocaleString('pt-BR')}+`, label: t('landing.stat1'), variant: fadeInLeft },
              { ref: c2.ref, value: `${c2.count}%`, label: t('landing.stat2'), variant: scaleIn },
              { ref: c3.ref, value: `${c3.count} min`, label: t('landing.stat3'), variant: fadeInRight },
            ].map((stat, i) => (
              <motion.div key={i} variants={stat.variant} ref={stat.ref} className="text-center">
                <motion.span 
                  className="font-playfair text-6xl font-bold text-[#1C2B1E] lg:text-7xl"
                  whileHover={{ scale: 1.05, color: "#16a34a" }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}
                </motion.span>
                <p className="mt-3 text-sm uppercase tracking-widest text-[#1C2B1E]/50">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 5 — ACESSIBILIDADE ═══ */}
      <section className="bg-[#1C2B1E] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-120px', amount: 0.2 }} 
          variants={stagger}
          className="mx-auto max-w-6xl px-6 lg:px-12"
        >
          <motion.h2 variants={slideInFromBottom} className="text-center font-playfair text-4xl font-bold text-[#F5F2EC] sm:text-5xl lg:text-6xl">
            {t('landing.accessTitle')}
          </motion.h2>
          <motion.div variants={scaleIn} className="mx-auto mt-4 h-px w-16 bg-[#F5F2EC]/20" />

          <motion.div variants={staggerFast} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: MessageSquare, title: t('landing.access1Title'), desc: t('landing.access1Desc'), variant: fadeInLeft },
              { Icon: () => <span className="text-2xl font-bold text-[#A5D6A7]">VL</span>, title: t('landing.access2Title'), desc: t('landing.access2Desc'), variant: fadeUp },
              { Icon: Globe, title: t('landing.access3Title'), desc: t('landing.access3Desc'), variant: fadeUp },
              { Icon: WifiOff, title: t('landing.access4Title'), desc: t('landing.access4Desc'), variant: fadeInRight },
            ].map((card, i) => (
              <motion.div 
                key={i} 
                variants={card.variant} 
                className="border border-[#F5F2EC]/10 p-6 transition-all hover:border-[#A5D6A7]/30 hover:bg-[#F5F2EC]/5 hover:scale-105"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="flex h-12 w-12 items-center justify-center"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <card.Icon className="h-6 w-6 text-[#A5D6A7]" />
                </motion.div>
                <h3 className="mt-4 font-playfair text-lg font-bold text-[#F5F2EC]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#F5F2EC]/60">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 6 — DEPOIMENTO ═══ */}
      <section className="bg-[#F5F2EC] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-100px', amount: 0.4 }} 
          variants={stagger}
          className="mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          <motion.div variants={scaleIn}>
            <Quote className="mx-auto h-12 w-12 text-[#1C2B1E]/15 rotate-180" />
          </motion.div>
          <motion.blockquote 
            variants={fadeUp} 
            className="mt-8 font-playfair text-2xl font-medium italic leading-relaxed text-[#1C2B1E] sm:text-3xl lg:text-4xl"
          >
            {t('landing.testimonialQuote')}
          </motion.blockquote>
          <motion.div variants={fadeInRight} className="mt-8">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#1C2B1E]/60">{t('landing.testimonialAuthor')}</p>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 7 — FAQ ═══ */}
      <section id="faq" className="bg-[#1C2B1E] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-100px', amount: 0.2 }} 
          variants={stagger}
          className="mx-auto max-w-3xl px-6 lg:px-12"
        >
          <motion.h2 variants={fadeInLeft} className="text-center font-playfair text-4xl font-bold text-[#F5F2EC] sm:text-5xl">
            {t('landing.faqTitle')}
          </motion.h2>
          <motion.div variants={scaleIn} className="mx-auto mt-4 h-px w-16 bg-[#F5F2EC]/20" />

          <motion.div variants={slideInFromBottom} className="mt-12">
            <Accordion type="single" collapsible className="space-y-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: n * 0.1, duration: 0.5 }}
                >
                  <AccordionItem value={`faq-${n}`} className="border-b border-[#F5F2EC]/10">
                    <AccordionTrigger className="py-5 text-left font-medium text-[#F5F2EC] hover:text-[#A5D6A7] hover:no-underline [&[data-state=open]]:text-[#A5D6A7] transition-colors duration-300">
                      {t(`landing.faq${n}Q`)}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 text-sm leading-relaxed text-[#F5F2EC]/60">
                      {t(`landing.faq${n}A`)}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SECTION 8 — FOOTER CTA + RODAPÉ ═══ */}
      <section className="bg-[#F5F2EC] py-24 sm:py-32 lg:py-40">
        <motion.div
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true, margin: '-100px', amount: 0.3 }} 
          variants={stagger}
          className="mx-auto max-w-4xl px-6 text-center lg:px-12"
        >
          <motion.h2 variants={slideInFromBottom} className="font-playfair text-4xl font-bold leading-tight text-[#1C2B1E] sm:text-5xl lg:text-6xl">
            {t('landing.footerTitle1')}
            <br />
            <span className="italic text-[#1C2B1E]/60">{t('landing.footerTitle2')}</span>
          </motion.h2>
          <motion.button
            variants={scaleIn}
            onClick={() => navigate('/app')}
            className="mt-10 border-2 border-[#1C2B1E] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-[#1C2B1E] transition-all hover:bg-[#1C2B1E] hover:text-[#F5F2EC]"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {t('landing.heroCTA')}
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="border-t border-[#1C2B1E]/10 bg-[#F5F2EC] px-6 py-8"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <motion.span 
            className="font-playfair text-lg font-bold text-[#1C2B1E]"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            LeishCheck
          </motion.span>
          <p className="text-xs text-[#1C2B1E]/40">© {new Date().getFullYear()} LeishCheck — {t('landing.footerDisclaimer')}</p>
        </div>
      </motion.footer>
    </div>
  );
}
