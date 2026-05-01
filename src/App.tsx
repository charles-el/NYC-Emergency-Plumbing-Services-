import { motion } from 'motion/react';
import AIChatWidget from './components/AIChatWidget';
import LiveVoiceWidget from './components/LiveVoiceWidget';
import ReviewReplierWidget from './components/ReviewReplierWidget';
import { 
  PhoneCall, 
  Clock, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Wrench, 
  Droplets, 
  CheckCircle2, 
  AlertTriangle,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  StarHalf,
  Send,
  Hammer,
  Settings,
  PenTool
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-red selection:text-white">
      {/* Top Bar - Emergency Notice */}
      <div className="bg-brand-red text-white py-2.5 px-4 text-xs tracking-widest uppercase font-bold flex justify-center items-center gap-2 relative z-50">
        <AlertTriangle size={14} className="animate-pulse" />
        <span>24/7 Emergency Service Available for all NYC Boroughs</span>
      </div>

      {/* Navigation */}
      <nav 
        className={`fixed w-full z-40 transition-all duration-500 border-b border-transparent ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
        style={{ top: isScrolled ? 0 : '38px' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${isScrolled ? 'bg-brand-blue text-white shadow-sm' : 'bg-white/10 backdrop-blur-md text-white border border-white/20'}`}>
              <Wrench size={22} className={isScrolled ? '' : 'drop-shadow-lg'} />
            </div>
            <div>
              <h1 className={`font-display font-semibold text-[22px] tracking-tight leading-none ${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'}`}>
                NYC
              </h1>
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mt-1 ${isScrolled ? 'text-slate-500' : 'text-white/80'}`}>
                Emergency Plumber's
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-10">
            <a href="#services" className={`text-sm font-medium hover:text-brand-red transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90 drop-shadow-sm hover:text-white'}`}>Services</a>
            <a href="#reviews" className={`text-sm font-medium hover:text-brand-red transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90 drop-shadow-sm hover:text-white'}`}>Reviews</a>
            <a href="#contact" className={`text-sm font-medium hover:text-brand-red transition-colors ${isScrolled ? 'text-slate-600' : 'text-white/90 drop-shadow-sm hover:text-white'}`}>Contact</a>
            
            <a 
              href="tel:+13329003335" 
              className="flex items-center gap-2.5 bg-white text-slate-900 hover:bg-slate-50 border border-slate-200/50 px-6 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm hover:shadow-md"
            >
              <PhoneCall size={16} className="text-brand-red animate-wiggle" />
              <span>(332) 900-3335</span>
            </a>
          </div>

          <button 
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} className={isScrolled ? 'text-slate-800' : 'text-white'} /> : <Menu size={28} className={isScrolled ? 'text-slate-800' : 'text-white'} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-white pt-32 px-6 flex flex-col gap-6 md:hidden">
          <a href="#services" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Services</a>
          <a href="#reviews" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Reviews</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-xl font-semibold text-slate-800 border-b border-slate-100 pb-4">Contact</a>
          <a 
            href="tel:+13329003335" 
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-4 rounded-xl font-bold text-lg"
          >
            <PhoneCall size={20} />
            Call (332) 900-3335 Now
          </a>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden bg-brand-blue border-b border-white/10">
        {/* Abstract Background - Highly Premium Sleek Lights */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-5">
           {/* Sophisticated Glows */}
           <div className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-slate-800/80 rounded-full blur-[120px] pointer-events-none" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-brand-blue-light/90 rounded-full blur-[100px] pointer-events-none" />
           
           {/* Subtle Grid overlay for texture */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full py-12 md:py-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 text-white/90 px-4 py-2 rounded-full text-[13px] font-medium tracking-wide mb-8 shadow-2xl">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red"></span>
                  </span>
                  NYC Technicians Available Now
                </div>
                
                <h2 className="font-display text-6xl lg:text-[5.5rem] font-bold text-white leading-[1.05] mb-8 tracking-tighter">
                  Water Stopped? <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-brand-red">Don't Panic.</span>
                </h2>
                
                <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Premium NYC Emergency Plumber & Sewer service. We are the most reliable, rapid-response plumbing dispatch in New York City. Speak with Mack, our Receptionist, or call directly.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
                  <a 
                    href="tel:+13329003335" 
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-[15px] transition-all hover:bg-slate-100 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <PhoneCall size={18} className="text-brand-red" />
                    Call (332) 900-3335
                  </a>
                  <a 
                    href="#services" 
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white backdrop-blur-md px-8 py-4 rounded-full font-medium text-[15px] transition-all border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                  >
                    Explore Services
                  </a>
                </div>

                <div className="mt-10 flex items-center justify-center md:justify-start gap-6 text-white/80 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-brand-red" />
                    Open 24 Hours
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} className="text-brand-red" />
                    Manhattan & NYC
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Premium Trust Card */}
            <motion.div 
              className="w-full max-w-md hidden lg:block"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/10 rounded-bl-full -z-0 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="font-display font-bold text-2xl text-white tracking-tight">Top Rated</h3>
                      <div className="flex items-center gap-1.5 text-brand-red mt-2">
                        <Star fill="currentColor" size={18} />
                        <Star fill="currentColor" size={18} />
                        <Star fill="currentColor" size={18} />
                        <Star fill="currentColor" size={18} />
                        <Star fill="currentColor" size={18} />
                        <span className="text-white font-bold ml-2 text-lg">4.9</span>
                      </div>
                      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mt-2">Verified Google Reviews</p>
                    </div>
                    <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                      <ShieldCheck size={28} className="text-white" />
                    </div>
                  </div>

                  <div className="space-y-5 pt-4 border-t border-white/10">
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white/90 text-sm">Licensed & Insured</h4>
                        <p className="text-slate-400 text-xs mt-1">Full protection for your premium property</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white/90 text-sm">Rapid Response Times</h4>
                        <p className="text-slate-400 text-xs mt-1">Typically dispatched within 60 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <CheckCircle2 size={20} className="text-brand-red shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-white/90 text-sm">Transparent Pricing</h4>
                        <p className="text-slate-400 text-xs mt-1">No hidden corporate emergency fees</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Brands / Trusted by Logobar */}
      <div className="bg-slate-900 border-b border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-8">Trusted by businesses and residents across</p>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 text-slate-400 font-display font-medium text-lg md:text-xl">
            <span className="hover:text-white transition-colors cursor-default">SOHO</span>
            <span className="hover:text-white transition-colors cursor-default">TRIBECA</span>
            <span className="hover:text-white transition-colors cursor-default">NOHO</span>
            <span className="hover:text-white transition-colors cursor-default">GREENWICH</span>
            <span className="hover:text-white transition-colors cursor-default">BOWERY</span>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-32 bg-slate-50 relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-display font-bold text-4xl lg:text-5xl tracking-tight text-slate-900 mb-6">Comprehensive Diagnostics & Repair</h2>
            <p className="text-lg text-slate-500 font-light leading-relaxed">From midnight emergencies to routine maintenance, our expert technicians handle everything with precision and architectural care.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 border border-slate-200/60 bg-white rounded-[2rem] p-4 shadow-sm">
            <motion.div 
              className="bg-white p-10 rounded-3xl transition-all"
            >
              <div className="w-14 h-14 bg-red-50 text-brand-red rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-red-100">
                <AlertTriangle size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 mb-4 tracking-tight">Mission Critical</h3>
              <p className="text-slate-500 mb-8 font-light leading-relaxed line-clamp-3">Burst pipes, severe leaks, or overflowing toilets? We offer rapid response 24/7 to stop the damage and secure your property immediately.</p>
              <a href="tel:+13329003335" className="inline-flex items-center gap-2 text-brand-red font-medium hover:gap-3 transition-all text-sm uppercase tracking-wider">
                Call for Emergency <ArrowRight size={16} />
              </a>
            </motion.div>

            <motion.div 
              className="bg-slate-50/50 p-10 rounded-3xl transition-all relative border border-slate-100/50"
            >
              <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                <Droplets size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 mb-4 tracking-tight">Sewer & Drain</h3>
              <p className="text-slate-500 mb-8 font-light leading-relaxed line-clamp-3">Stubborn clogs and backed-up sewers cleared fast. We use advanced snaking and hydro-jetting to restore flow completely and cleanly.</p>
              <a href="tel:+13329003335" className="inline-flex items-center gap-2 text-slate-900 font-medium hover:gap-3 transition-all text-sm uppercase tracking-wider">
                Schedule Service <ArrowRight size={16} />
              </a>
            </motion.div>

            <motion.div 
              className="bg-white p-10 rounded-3xl transition-all"
            >
              <div className="w-14 h-14 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center mb-8 border border-slate-200">
                <Wrench size={24} />
              </div>
              <h3 className="font-display font-bold text-2xl text-slate-900 mb-4 tracking-tight">Infrastructure</h3>
              <p className="text-slate-500 mb-8 font-light leading-relaxed line-clamp-3">No hot water in a NYC winter? We repair and replace all brands of traditional radiators, boilers, and tankless water heaters quickly.</p>
              <a href="#contact" className="inline-flex items-center gap-2 text-slate-500 font-medium hover:gap-3 hover:text-slate-900 transition-all text-sm uppercase tracking-wider">
                Get a Quote <ArrowRight size={16} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Split Section - About / Why Us */}
      <section className="bg-white py-32 border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center text-slate-800">
          <div className="flex flex-col justify-center">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 mb-8 tracking-tight">Rapid Response. Genuine Expertise.</h2>
            <p className="text-lg text-slate-500 mb-16 leading-relaxed max-w-3xl mx-auto font-light">
              When water stops working in NYC or a pipe bursts, you don't have time to wait. 
              Located right at 17 Cleveland Place, our dispatch is uniquely positioned to offer swift 
              emergency plumbing and infrastructure services strictly across Manhattan.
            </p>
            
            <div className="grid md:grid-cols-2 gap-12 text-left max-w-4xl mx-auto bg-slate-50/50 p-10 rounded-[2rem] border border-slate-100">
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 shrink-0 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm tracking-tighter">01</div>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl text-slate-900 mb-3">Immediate AI Dispatch</h4>
                  <p className="text-slate-500 leading-relaxed font-light">Our advanced dispatchers answer 24/7. No waiting on hold—just real, intelligent allocation of technicians when you need it most.</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <div className="w-14 h-14 shrink-0 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-bold text-sm tracking-tighter">02</div>
                </div>
                <div>
                  <h4 className="font-display font-bold text-xl text-slate-900 mb-3">Architectural Diagnosis</h4>
                  <p className="text-slate-500 leading-relaxed font-light">We arrive fully stocked to assess and fix the majority of plumbing issues on the first visit, respecting your property's integrity.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-32 bg-slate-50 border-t border-slate-200/60 relative">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center mb-20 text-center">
            <h2 className="font-display font-bold text-4xl lg:text-5xl text-slate-900 mb-6 tracking-tight">Highly Rated by New Yorkers</h2>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center text-brand-red">
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
                 <Star fill="currentColor" size={24} />
              </div>
              <span className="text-2xl font-bold text-slate-900 tracking-tight">4.9<span className="text-slate-400 text-lg font-normal">/5</span></span>
            </div>
            <p className="text-slate-500 font-medium tracking-wide uppercase text-xs">Based on 44 Google Reviews</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Sarah M.", area: "SoHo", text: "Pipe burst at 2 AM on a Sunday. They answered immediately, arrived in 40 minutes, and stopped the flooding. Absolute lifesavers. Professional and left the place clean." },
              { name: "David L.", area: "Tribeca", text: "Best plumbing experience I've had in the city. The technician was transparent about pricing for our sewer backup problem and got it fixed the same afternoon." },
              { name: "Elena R.", area: "Lower Manhattan", text: "We lost all water pressure just before opening our restaurant. Called them based on their location near Cleveland Pl. They were fast, diagnosed a faulty main valve, and got us running quickly." }
            ].map((review, i) => (
              <div key={i} className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex items-center text-brand-red mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={16} />)}
                </div>
                <p className="text-slate-600 mb-8 font-light leading-relaxed">"{review.text}"</p>
                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-400">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display font-bold text-slate-900 text-sm tracking-wide">{review.name}</p>
                    <p className="text-slate-400 text-[11px] uppercase tracking-wider font-semibold mt-0.5">{review.area}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10 opacity-20"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute left-[-10%] bottom-[-20%] w-80 h-80 bg-brand-blue-light rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs font-bold uppercase tracking-widest mb-8 border border-white/10">
            <div className="w-1.5 h-1.5 bg-brand-red rounded-full animate-pulse"></div> Active 24/7
          </div>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-6 tracking-tight">Need a Plumber Right Now?</h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">Don't let a plumbing emergency damage your property. Our elite technicians are standing by to dispatch instantly.</p>
          <a 
            href="tel:+13329003335" 
            className="inline-flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 px-10 py-5 rounded-full font-bold text-[15px] transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <PhoneCall size={20} className="text-brand-red" />
            (332) 900-3335
          </a>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16">
            <div className="lg:w-5/12 flex flex-col justify-center">
              <h2 className="font-display font-bold text-4xl text-slate-900 mb-6">Request Service Now</h2>
              <p className="text-lg text-slate-600 mb-8">
                Fill out the form to request non-emergency services, get a quote, or schedule an appointment. For immediate assistance with ongoing damage, please call us directly.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 text-brand-red rounded-xl flex items-center justify-center shrink-0">
                    <PhoneCall size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Emergency Line (24/7)</p>
                    <a href="tel:+13329003335" className="text-xl font-bold text-slate-900 hover:text-brand-red transition-colors">(332) 900-3335</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-brand-blue rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Headquarters</p>
                    <p className="text-lg font-bold text-slate-900">17 Cleveland Pl, <br className="hidden md:block" />New York, NY 10012</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-7/12">
              <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
                <form className="space-y-6" action="https://formsubmit.co/charlesrealistic1@gmail.com" method="POST">
                  {/* Hidden field for redirect after submit, optional but good. For now just let it use default. */}
                  <input type="hidden" name="_subject" value="New Contact Form Submission - NYC Emergency Plumber" />
                  <input type="hidden" name="_template" value="table" />
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        id="name"
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        id="phone"
                        required
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        id="email"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-semibold text-slate-700 mb-2">Service Needed</label>
                      <select 
                        id="service"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all appearance-none"
                      >
                        <option value="">Select a service...</option>
                        <option value="Emergency Repair">Emergency Repair</option>
                        <option value="Sewer & Drain">Sewer & Drain Cleaning</option>
                        <option value="Water Heater">Water Heater Issue</option>
                        <option value="Other">Other / General Inquiry</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message Details <span className="text-red-500">*</span></label>
                    <textarea 
                      id="message"
                      required
                      rows={4}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 focus:border-brand-blue transition-all resize-none"
                      placeholder="Please describe your plumbing issue or request..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Send Request <Send size={18} />
                  </button>
                  <p className="text-xs text-center text-slate-500 mt-4">
                    By submitting this form, you agree to be contacted at the phone number provided. <br className="hidden md:block" />
                    For emergencies, please call instead of using this form.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
            
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-brand-red rounded-lg text-white">
                  <Wrench size={24} />
                </div>
                <div>
                  <h1 className="font-display font-bold text-xl leading-tight text-white">
                    NYC Emergency
                  </h1>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Plumber & Sewer
                  </p>
                </div>
              </div>
              <p className="text-sm mb-6">Your trusted local plumber in Manhattan, specialized in rapid-response emergency services, sewer cleaning, and repairs.</p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Contact Info</h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-brand-red shrink-0 mt-0.5" />
                  <span>
                    17 Cleveland Pl,<br/>
                    New York, NY 10012,<br/>
                    United States
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneCall size={18} className="text-brand-red shrink-0" />
                  <a href="tel:+13329003335" className="hover:text-white transition-colors">+1 332-900-3335</a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock size={18} className="text-brand-red shrink-0" />
                  <span>Open 24 hours</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Services</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-brand-red transition-colors">Emergency Plumbing</a></li>
                <li><a href="#" className="hover:text-brand-red transition-colors">Sewer & Drain Cleaning</a></li>
                <li><a href="#" className="hover:text-brand-red transition-colors">Water Heater Repair</a></li>
                <li><a href="#" className="hover:text-brand-red transition-colors">Pipe Burst Response</a></li>
                <li><a href="#" className="hover:text-brand-red transition-colors">Commercial Plumbing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Location</h3>
              <div className="bg-slate-800 rounded-xl overflow-hidden h-48 relative border border-slate-700 hover:border-slate-500 transition-colors">
                <iframe 
                  src="https://maps.google.com/maps?q=17%20Cleveland%20Pl,%20New%20York,%20NY%2010012&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="17 Cleveland Pl Location"
                  className="absolute inset-0 w-full h-full opacity-80 hover:opacity-100 transition-opacity"
                ></iframe>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} NYC Emergency Plumber & Sewer. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      <AIChatWidget />
      <LiveVoiceWidget />
      <ReviewReplierWidget />
    </div>
  );
}
