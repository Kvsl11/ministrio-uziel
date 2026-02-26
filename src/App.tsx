import React, { useEffect, useRef, useState, createContext, useContext } from 'react';

// --- UTILITÁRIO PARA CARREGAR SCRIPTS (GSAP) ---
const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

// --- LOGO SVG DO MINISTÉRIO ---
const UzielLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="50" y1="5" x2="50" y2="95" stroke="#29aae2" strokeWidth="8" strokeLinecap="round" />
    <line x1="25" y1="28" x2="75" y2="28" stroke="#29aae2" strokeWidth="8" strokeLinecap="round" />
    <line x1="35" y1="45" x2="35" y2="85" stroke="#29aae2" strokeWidth="8" strokeLinecap="round" />
    <line x1="20" y1="55" x2="20" y2="75" stroke="#29aae2" strokeWidth="8" strokeLinecap="round" />
    <line x1="65" y1="45" x2="65" y2="85" stroke="#29aae2" strokeWidth="8" strokeLinecap="round" />
    <line x1="80" y1="55" x2="80" y2="75" stroke="#29aae2" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

// --- CONTEXTO DE MOVIMENTO ---
const MotionContext = createContext<{
  motionEnabled: boolean;
  setMotionEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  gsapLoaded: boolean;
}>({
  motionEnabled: true,
  setMotionEnabled: () => {},
  gsapLoaded: false,
});

const useMotion = () => useContext(MotionContext);

const MotionProvider = ({ children, gsapLoaded }: { children: React.ReactNode, gsapLoaded: boolean }) => {
  const [motionEnabled, setMotionEnabled] = useState(true);
  return (
    <MotionContext.Provider value={{ motionEnabled, setMotionEnabled, gsapLoaded }}>
      {children}
    </MotionContext.Provider>
  );
};

// --- COMPONENTES AUXILIARES ---
const ToggleSwitch = ({ label, isOn, onToggle }: { label: string; isOn: boolean; onToggle: () => void }) => (
  <div className="flex items-center justify-between group cursor-pointer select-none" onClick={onToggle}>
    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors mr-4">
      {label}
    </span>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isOn ? 'bg-white' : 'bg-zinc-800 border border-zinc-600'}`}>
      <div className={`w-4 h-4 rounded-full bg-black shadow-md transform transition-transform duration-300 ${isOn ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

// --- NAVBAR ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { motionEnabled, setMotionEnabled } = useMotion();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current || !window.gsap) return;
    
    if (isOpen) {
      window.gsap.to(menuRef.current, { x: '0%', duration: 0.6, ease: 'power4.out' });
      window.gsap.fromTo('.menu-item', 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2, overwrite: true }
      );
      document.body.style.overflow = 'hidden';
    } else {
      window.gsap.to(menuRef.current, { x: '100%', duration: 0.6, ease: 'power4.in' });
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-5 flex justify-between items-center mix-blend-difference text-white">
        <div className="flex items-center gap-2 z-50">
           <h1 className="text-3xl font-black tracking-widest uppercase drop-shadow-[0_0_10px_rgba(41,170,226,0.8)]" style={{ fontFamily: 'Anton, sans-serif' }}>
             UZIEL
           </h1>
        </div>

        <div className="flex items-center gap-8">
          <button onClick={() => setIsOpen(true)} className="focus:outline-none hover:rotate-90 transition-transform duration-300 text-white hover:text-[#29aae2]">
            <i className="fas fa-bars fa-2x"></i>
          </button>
        </div>
      </nav>

      <div ref={menuRef} className="fixed inset-0 bg-gradient-to-b from-[#0a192f] to-[#0f172a] backdrop-blur-xl z-[60] translate-x-full flex flex-col w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#0a192f] to-[#0a192f]/90 backdrop-blur-md flex justify-between items-center p-6 md:p-10 border-b border-white/10">
          <div className="text-3xl font-black tracking-widest text-[#29aae2]" style={{ fontFamily: 'Anton' }}>UZIEL</div>
          <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform duration-300 text-white hover:text-[#29aae2]">
            <i className="fas fa-times fa-2x"></i>
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          <div className="flex-1 p-6 sm:p-8 md:p-16 flex flex-col justify-start md:justify-center space-y-4 sm:space-y-6 md:space-y-8 overflow-y-auto pb-12 md:pb-16 pt-10 md:pt-16">
            {['Início', 'Nossa História', 'Integrantes', 'Discografia', 'Imersão', 'Agenda', 'Contato'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().split(' ')[0]}`} onClick={() => setIsOpen(false)} className="menu-item text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:from-[#29aae2] hover:to-white transition-all duration-500 hover:pl-4 md:hover:pl-8 opacity-0 cursor-pointer block w-max">
                {item}
              </a>
            ))}
          </div>
          
          <div className="w-full md:w-96 bg-zinc-900/50 p-8 md:p-12 flex flex-col justify-between border-t md:border-t-0 md:border-l border-white/10 shrink-0">
              <div className="menu-item opacity-0">
                <h4 className="text-[#29aae2] text-xs font-bold uppercase tracking-widest mb-6">Configurações</h4>
                <ToggleSwitch 
                     label={`Motion: ${motionEnabled ? 'On' : 'Off'}`} 
                     isOn={motionEnabled} 
                     onToggle={() => setMotionEnabled(!motionEnabled)} 
                 />
                <p className="text-gray-500 text-[10px] mt-4 leading-relaxed border-t border-gray-800 pt-4">
                  Controle os efeitos visuais e animações de scroll.
                </p>
              </div>
              <div className="menu-item opacity-0 mt-8">
                 <h4 className="text-[#29aae2] text-xs font-bold uppercase tracking-widest mb-4">Redes Sociais</h4>
                 <div className="flex gap-6">
                    <a href="https://www.instagram.com/oministeriouziel" target="_blank" className="text-white hover:text-[#29aae2] hover:scale-125 transition-all"><i className="fab fa-instagram fa-lg"></i></a>
                    <a href="https://youtube.com/@ministeriouziel" target="_blank" className="text-white hover:text-[#29aae2] hover:scale-125 transition-all"><i className="fab fa-youtube fa-lg"></i></a>
                    <a href="https://open.spotify.com/user/31g7w3m744kda4o4ql5cyzvq3zba" target="_blank" className="text-white hover:text-[#29aae2] hover:scale-125 transition-all"><i className="fab fa-spotify fa-lg"></i></a>
                 </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- HERO SECTION (CORRIGIDA) ---
const HeroSection = () => {
  const { motionEnabled, gsapLoaded } = useMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const blueTextRef = useRef<SVGTextElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [svgFontSize, setSvgFontSize] = useState("350"); // Estado para tamanho da fonte SVG
  const [viewBox, setViewBox] = useState("0 0 1920 1080"); // Estado para viewBox

  // Lógica de Redimensionamento Responsivo para o SVG
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setSvgFontSize("150"); // Ajustado para mobile (Portrait) - Reduzido para evitar cortes em telas estreitas
            setViewBox("0 0 1080 1920"); // ViewBox Portrait
        } else {
            setSvgFontSize("350"); // Tamanho grande para desktop
            setViewBox("0 0 1920 1080"); // ViewBox Landscape
        }
    };
    
    // Executa no mount
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Reset visual se Motion for desativado
    if (!motionEnabled) {
        if (maskRef.current) maskRef.current.style.display = 'none';
        if (textRef.current) textRef.current.style.opacity = '1';
        if (videoRef.current) {
            videoRef.current.style.transform = 'scale(1)';
            videoRef.current.style.opacity = '0.6';
        }
        return;
    }
    
    if (maskRef.current) maskRef.current.style.display = 'flex';

    if (!wrapperRef.current || !window.gsap || !window.ScrollTrigger || !gsapLoaded) return;

    let ctx = window.gsap.context(() => {
      // ESTADO INICIAL (REVERSO: Vídeo visível, texto "UZIEL" escondido/aberto)
      // Começamos com a máscara gigante (buraco grande = vídeo visível)
      window.gsap.set(maskRef.current, { scale: 500, x: 0, y: 0, transformOrigin: "center center" });
      
      // Texto descritivo começa invisível (aparece no final)
      window.gsap.set(textRef.current, { opacity: 0 });
      
      // Texto azul começa invisível
      window.gsap.set(blueTextRef.current, { opacity: 0 });

      window.gsap.set(videoRef.current, { scale: 1, opacity: 1 });

      let mm = window.gsap.matchMedia();
      mm.add("(min-width: 800px)", () => {
            const tl = window.gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "+=5000",
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                }
            });
            
            // 1. Zoom IN na máscara (scale 500 -> 1)
            // Isso faz o texto "fechar" sobre o vídeo
            tl.to(maskRef.current, { scale: 1, ease: "power2.inOut", duration: 1 }, 0);
            
            // 2. Texto azul aparece suavemente para preencher o buraco (opcional, ou manter transparente para ver vídeo dentro)
            // Se quiser que fique sólido:
            tl.to(blueTextRef.current, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, 0.5);

            // 3. Texto descritivo aparece no final
            tl.to(textRef.current, { opacity: 1, duration: 0.5, ease: "none" }, 0.5);
            
            // 4. Vídeo escala e escurece para dar destaque ao texto
            tl.to(videoRef.current, { scale: 1.25, opacity: 0.4, ease: "power1.inOut" }, 0);

            // 5. Pausa no final para dar mais espaço de scroll antes de descer
            tl.to({}, { duration: 0.3 });
      });
      mm.add("(max-width: 799px)", () => {
            // Ajuste inicial para mobile
            window.gsap.set(maskRef.current, { scale: 500, transformOrigin: "center center" }); // Aumentado drasticamente para garantir que o vídeo apareça limpo

            const tl = window.gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top top",
                    end: "+=4500", // Mais scroll para suavizar no mobile
                    scrub: 0.5,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });
            
            tl.to(maskRef.current, { scale: 1, ease: "power2.inOut", duration: 1 }, 0);
            tl.to(blueTextRef.current, { opacity: 1, duration: 0.5, ease: "power1.inOut" }, 0.5);
            tl.to(textRef.current, { opacity: 1, duration: 0.5, ease: "power1.in" }, 0.5);
            tl.to(videoRef.current, { scale: 1.25, opacity: 0.4, ease: "power1.inOut" }, 0);
            tl.to({}, { duration: 0.3 });
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, [motionEnabled, svgFontSize, gsapLoaded]); // Recria animação se fonte mudar ou GSAP carregar

  return (
    <div id="início" ref={wrapperRef} className={`relative w-full h-[100dvh] overflow-hidden bg-gradient-to-b from-[#0a192f] to-[#0f172a]`}>
      <div className="absolute inset-0 w-full h-full z-0 bg-transparent">
        <video 
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          autoPlay muted loop playsInline onLoadedData={() => setVideoLoaded(true)}
        >
          <source src="/img/video1.mp4" type="video/mp4" />
        </video>
        {!motionEnabled && <div className="absolute inset-0 bg-gradient-to-b from-[#0a192f]/40 to-[#0f172a]/40"></div>}
      </div>

      <div ref={maskRef} className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none w-full h-full">
        <div className="w-full h-full flex items-center justify-center origin-center">
          <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" shapeRendering="geometricPrecision" textRendering="geometricPrecision" className="w-full h-full absolute inset-0">
            <defs>
              <mask id="uziel-mask">
                <rect x="-50%" y="-50%" width="200%" height="200%" fill="white" />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={svgFontSize} fontFamily="Arial Black, sans-serif" fontWeight="900" letterSpacing={viewBox.startsWith("0 0 1080") ? "-5" : "-10"} fill="black">
                  UZIEL
                </text>
              </mask>
            </defs>
            
            <rect x="-50%" y="-50%" width="200%" height="200%" fill="black" mask="url(#uziel-mask)" />
            
            {/* TEXTO AZUL SÓLIDO QUE DISSOLVE */}
            {/* fill="#29aae2" garante a cor sólida. Opacidade controlada pelo GSAP. */}
            <text ref={blueTextRef} x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fontSize={svgFontSize} fontFamily="Arial Black, sans-serif" fontWeight="900" letterSpacing={viewBox.startsWith("0 0 1080") ? "-5" : "-10"} fill="#29aae2">
              UZIEL
            </text>
          </svg>
        </div>
      </div>

      <div ref={textRef} className={`absolute inset-0 z-20 flex flex-col justify-end items-center pb-20 md:pb-10 pointer-events-none ${!motionEnabled ? 'opacity-100 justify-center' : ''}`}>
        {!motionEnabled && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                <h1 className="text-6xl md:text-[10rem] font-black text-[#29aae2] tracking-widest mb-2 drop-shadow-[0_0_30px_rgba(41,170,226,0.6)] text-center leading-none" style={{ fontFamily: 'Anton' }}>UZIEL</h1>
                <p className="text-white font-bold text-sm md:text-xl tracking-[0.8em] uppercase mb-8 drop-shadow-md">Música & Adoração</p>
                <a href="#nossa" className="pointer-events-auto border border-[#29aae2] bg-[#29aae2]/10 backdrop-blur-md text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#29aae2] hover:text-black hover:shadow-[0_0_20px_#29aae2] transition-all duration-300">
                    Conheça Nossa História
                </a>
            </div>
        )}
        <div className="flex flex-col items-center gap-4">
            {motionEnabled && (
                <div className="animate-bounce text-[#29aae2] opacity-80 mb-4">
                    <i className="fas fa-chevron-down text-3xl"></i>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- HISTÓRIA (Cinematic Timeline) ---
const HistorySection = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const { motionEnabled, gsapLoaded } = useMotion();

    const historyData = [
        { year: "2019", title: "O Chamado", desc: "Tudo começou no Acampamento Ágape. Uma chama se acendeu em nossos corações.", img: "/img/5.jpg" },
        { year: "2020", title: "Fundação", desc: "A técnica encontra a fé. O grupo se profissionaliza e expande seus membros.", img: "/img/4.jpg" },
        { year: "2022", title: "Identidade", desc: "Assumimos o nome 'Força de Deus'. Não somos apenas músicos, somos instrumentos.", img: "/img/9.jpg" },
        { year: "2023", title: "Single", desc: "Lançamento de 'O Céu é o Meu Lugar'. Nossa voz chega às plataformas digitais.", img: "/img/7.jpg" },
        { year: "2026", title: "Futuro", desc: "Um novo álbum em produção. Uma nova era de adoração e entrega total.", img: "/img/2.jpg" }
    ];

    useEffect(() => {
        if (!motionEnabled || !gsapLoaded || !sectionRef.current || !triggerRef.current || !window.gsap || !window.ScrollTrigger) {
            if (sectionRef.current && window.gsap) window.gsap.set(sectionRef.current, { clearProps: "all" });
            return;
        }

        let ctx = window.gsap.context(() => {
            const isMobile = window.innerWidth < 768;
            
            if (!isMobile) {
                // Horizontal Scroll para Desktop
                const getScrollAmount = () => {
                    const scrollWidth = sectionRef.current ? sectionRef.current.scrollWidth : 0;
                    const windowWidth = window.innerWidth;
                    return Math.max(0, scrollWidth - windowWidth);
                };

                const tl = window.gsap.timeline({
                    scrollTrigger: {
                        trigger: triggerRef.current,
                        start: "top top",
                        end: () => `+=${getScrollAmount() + 2500}`, 
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                    }
                });
                
                tl.to(sectionRef.current, {
                    x: () => -getScrollAmount(),
                    ease: "none",
                });

                // Adiciona um pequeno espaço de scroll (pausa) antes de descer para a próxima seção
                tl.to({}, { duration: 0.1 });

                // Parallax effect for images
                const cards = sectionRef.current!.querySelectorAll('.history-card-img');
                cards.forEach((card, i) => {
                    window.gsap.to(card, {
                        backgroundPosition: "100% center",
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            containerAnimation: tl,
                            start: "left right",
                            end: "right left",
                            scrub: true,
                        }
                    });
                });
            } else {
                // Vertical Animations for Mobile
                const cards = sectionRef.current!.querySelectorAll('.mobile-history-card');
                cards.forEach((card, i) => {
                    window.gsap.fromTo(card, 
                        { y: 50, opacity: 0 },
                        {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                            }
                        }
                    );
                });
            }
        }, triggerRef);

        return () => ctx.revert();
    }, [motionEnabled, gsapLoaded]);

    return (
        <section id="nossa" ref={triggerRef} className={`bg-gradient-to-b from-[#0f172a] via-[#0a192f] to-[#1e1b4b] text-white relative ${motionEnabled ? 'md:h-screen md:overflow-hidden py-20 md:py-0' : 'py-20'} h-auto overflow-visible`}>
            
            <div className="md:absolute md:top-12 md:left-12 z-20 md:block p-6 md:p-0 mb-8 md:mb-0">
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-md leading-none">
                    Nossa <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29aae2] to-white">Jornada</span>
                </h2>
            </div>

            <div ref={sectionRef} className={`flex ${motionEnabled ? 'md:h-full md:items-center md:pl-20 md:flex-row md:w-max flex-col w-full px-3 sm:px-4 gap-4 md:gap-0 pb-20 md:pb-0' : 'flex-col w-full px-6 md:px-0 pb-20 gap-32 max-w-7xl mx-auto'}`}>
                {historyData.map((item, index) => (
                    <div key={index} className={`relative group ${motionEnabled ? 'mobile-history-card w-full md:w-[85vw] h-[85vh] md:h-[80vh] md:mr-20 flex-shrink-0' : 'w-full flex flex-col md:flex-row items-center gap-10 md:gap-24 ' + (index % 2 === 1 ? 'md:flex-row-reverse' : '')}`}>
                        
                        {/* Motion Mode Layout */}
                        {motionEnabled ? (
                            <div className="w-full h-full relative overflow-hidden rounded-3xl border border-white/10 bg-[#0a192f]/40 backdrop-blur-md shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col">
                                {/* Background Image with Parallax Scale */}
                                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                                     <div className="history-card-img w-full h-full bg-cover bg-center transition-all duration-1000 group-hover:scale-110 grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100" style={{ backgroundImage: `url(${item.img})` }}></div>
                                     <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/80 to-transparent opacity-90"></div>
                                </div>

                                {/* Content Overlay */}
                                <div className="relative z-10 p-8 sm:p-10 md:p-24 flex flex-col justify-end flex-grow">
                                     <span className="absolute top-6 right-6 md:top-10 md:right-10 text-[5rem] sm:text-[7rem] md:text-[15rem] font-black text-transparent leading-none select-none font-anton z-0 pointer-events-none transition-all duration-500 opacity-30 md:group-hover:opacity-80" style={{ WebkitTextStroke: '2px rgba(255,255,255,0.5)' }}>
                                        {item.year}
                                    </span>
                                    
                                    <div className="relative z-10 max-w-5xl transform translate-y-0 md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-700 mt-auto">
                                        <div className="flex items-center gap-3 md:gap-6 mb-4 md:mb-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-700 delay-100">
                                            <span className="h-px w-10 md:w-20 bg-[#29aae2]"></span>
                                            <span className="text-[#29aae2] font-bold text-sm md:text-xl tracking-[0.5em] uppercase">Capítulo 0{index + 1}</span>
                                        </div>
                                        <h3 className="text-4xl sm:text-6xl md:text-9xl font-black uppercase tracking-tighter mb-4 md:mb-10 text-white leading-[0.9] drop-shadow-2xl">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-200 text-base sm:text-lg md:text-3xl font-medium leading-relaxed max-w-3xl border-l-2 md:border-l-4 border-[#29aae2] pl-5 md:pl-10 opacity-100 md:opacity-80 md:group-hover:opacity-100 transition-opacity duration-500">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Static Mode Layout (Alternating) */
                            <>
                                <div className="w-full md:w-1/2 aspect-[4/5] md:aspect-square relative overflow-hidden rounded-2xl group-hover:shadow-[0_0_50px_rgba(41,170,226,0.15)] transition-all duration-500 border border-white/10 bg-[#0a192f]/40 backdrop-blur-sm">
                                     <img src={item.img} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110" />
                                     <div className="absolute inset-0 bg-[#29aae2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                                     <div className="absolute bottom-6 right-6 bg-[#0a192f]/80 backdrop-blur px-4 py-2 rounded text-[#29aae2] font-bold text-xl font-anton tracking-widest border border-[#29aae2]/30">
                                         {item.year}
                                     </div>
                                </div>
                                <div className="w-full md:w-1/2 flex flex-col justify-center relative">
                                    <div className="absolute -top-10 -left-10 md:-top-20 md:-left-20 text-[10rem] md:text-[15rem] font-black text-white/[0.05] group-hover:text-white/[0.1] transition-colors duration-500 font-anton select-none pointer-events-none">
                                        0{index + 1}
                                    </div>
                                    <h3 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-6 md:mb-8 text-white group-hover:text-[#29aae2] transition-colors leading-[0.9] relative z-10">
                                        {item.title}
                                    </h3>
                                    <div className="w-16 md:w-24 h-2 bg-[#29aae2] mb-6 md:mb-10 relative z-10"></div>
                                    <p className="text-gray-400 text-base md:text-2xl leading-relaxed font-light relative z-10">
                                        {item.desc}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

// --- IMERSÃO ---
const ImmersionSection = () => {
    const { motionEnabled, gsapLoaded } = useMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!motionEnabled) {
            if (videoRef.current) {
                videoRef.current.style.transform = 'scale(1)';
                videoRef.current.style.borderRadius = '0';
                videoRef.current.style.opacity = '1';
            }
            return;
        }

        if (!containerRef.current || !window.gsap || !window.ScrollTrigger || !gsapLoaded) return;

        let ctx = window.gsap.context(() => {
            let mm = window.gsap.matchMedia();
            mm.add("(min-width: 800px)", () => {
                    const tl = window.gsap.timeline({
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top bottom", 
                            end: "center center", 
                            scrub: 1, 
                        }
                    });
                    tl.fromTo(videoRef.current, 
                        { scale: 0.4, borderRadius: "2rem", opacity: 0.6 },
                        { scale: 1, borderRadius: "0rem", opacity: 1, ease: "power2.out" }
                    );
            });
            mm.add("(max-width: 799px)", () => {
                    const tl = window.gsap.timeline({
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: "top 80%",
                            end: "center center",
                            scrub: 1,
                        }
                    });
                    tl.fromTo(videoRef.current, 
                        { scale: 0.8, borderRadius: "1rem", opacity: 0.8 },
                        { scale: 1, borderRadius: "0rem", opacity: 1, ease: "power2.out" }
                    );
            });
        }, containerRef);

        return () => ctx.revert();
    }, [motionEnabled, gsapLoaded]);

    return (
        <section id="imersão" ref={containerRef} className={`bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#0a192f] relative flex items-center justify-center overflow-hidden h-screen`}>
            <div className="absolute inset-0 z-[15] pointer-events-none bg-gradient-to-b from-[#1e1b4b] via-transparent to-[#0a192f]"></div>
            
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none mix-blend-difference px-4 text-center">
                <h2 className="text-5xl md:text-9xl font-black text-white tracking-tighter uppercase mb-6 drop-shadow-2xl">
                    Imersão
                </h2>
                <p className="text-[#29aae2] font-bold tracking-[0.3em] uppercase text-xs md:text-xl bg-[#0a192f]/50 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
                    Sinta a presença em cada acorde
                </p>
            </div>

            <div ref={videoRef} className="w-full h-full relative z-10 overflow-hidden">
                <video className="w-full h-full object-cover opacity-80" autoPlay muted loop playsInline>
                    <source src="/img/video2.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-[#0a192f]/40"></div>
            </div>
        </section>
    );
};

// --- MEMBERS GRID ---
const MembersGrid = () => {
    const members = [
        { name: "Junior Cavalcante", role: "Vocal / Baixo", img: "/img/1.jpg" },
        { name: "Kaio Vinicius", role: "Vocal / Guitarra", img: "/img/2.jpg" },
        { name: "Alexandre Mandelli", role: "Audiovisual", img: "/img/3.png" },
        { name: "Willian Falavina", role: "Vocal / Violão", img: "/img/4.jpg" },
        { name: "Karla Vanessa", role: "Vocal", img: "/img/5.jpg" },
        { name: "Ana Carolina", role: "Vocal", img: "/img/6.jpg" },
        { name: "Camila Falavina", role: "Vocal", img: "/img/7.jpg" },
        { name: "Mel Buzzo", role: "Brand Marketing", img: "/img/8.png" },
        { name: "Júlio Falavina", role: "Percussão", img: "/img/9.jpg" },
        { name: "Ênio Henrique", role: "Vocal / Percussão", img: "/img/10.jpg" }
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const { motionEnabled, gsapLoaded } = useMotion();

    useEffect(() => {
        if (!motionEnabled || !containerRef.current || !window.gsap || !window.ScrollTrigger || !gsapLoaded) return;

        let ctx = window.gsap.context(() => {
            window.gsap.fromTo(".member-card", 
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 85%", // Trigger slightly earlier
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [motionEnabled, gsapLoaded]);

    return (
        <section id="integrantes" ref={containerRef} className="py-20 md:py-32 bg-gradient-to-b from-[#1e1b4b] via-[#0f172a] to-[#082f49]">
            <div className="container mx-auto px-6"> 
                <div className="text-center mb-16 md:mb-20">
                     <p className="text-[#29aae2] font-bold tracking-[0.3em] text-sm uppercase mb-4">Família Uziel</p>
                     <h2 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter">Integrantes</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {members.map((member, i) => (
                        <div key={i} className="member-card group relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer border border-white/10 bg-[#0a192f]/40 backdrop-blur-sm hover:border-[#29aae2]/50 transition-all duration-500 shadow-xl hover:shadow-[0_0_30px_rgba(41,170,226,0.3)]">
                            <img src={member.img} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="w-8 h-1 bg-[#29aae2] mb-3 w-0 group-hover:w-12 transition-all duration-500"></div>
                                <h3 className="text-lg md:text-xl font-bold text-white uppercase leading-none mb-1">{member.name}</h3>
                                <p className="text-[#29aae2] text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">{member.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
};

// --- DISCOGRAFIA HÍBRIDA ---
const DiscographyCarousel = () => {
  const { motionEnabled, gsapLoaded } = useMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!motionEnabled || !containerRef.current || !scrollRef.current || !window.gsap || !window.ScrollTrigger || !gsapLoaded) {
        if (scrollRef.current && window.gsap) window.gsap.set(scrollRef.current, { clearProps: "all" });
        return;
    }

    let ctx = window.gsap.context(() => {
        const isMobile = window.innerWidth < 768;

        if (!isMobile) {
            // Configuração para Desktop (Horizontal Scroll Pinned)
            const getScrollAmount = () => {
                const scrollWidth = scrollRef.current ? scrollRef.current.scrollWidth : 0;
                const windowWidth = window.innerWidth;
                return Math.max(0, scrollWidth - windowWidth);
            };

            const tl = window.gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+=${getScrollAmount() + 2500}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                }
            });
            
            tl.to(scrollRef.current, {
                x: () => -getScrollAmount(),
                ease: "none",
            });

            // Adiciona um pequeno espaço de scroll (pausa) antes de descer para a próxima seção
            tl.to({}, { duration: 0.1 });

            window.gsap.to(".disco-title", {
                x: 50,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: () => `+=${getScrollAmount() + 2500}`,
                    scrub: true
                }
            });
        } else {
            // Animação vertical para mobile
            const cards = scrollRef.current!.querySelectorAll('.mobile-disco-card');
            cards.forEach((card, i) => {
                window.gsap.fromTo(card, 
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 85%",
                        }
                    }
                );
            });
        }
    }, containerRef);

    return () => ctx.revert();
  }, [motionEnabled, gsapLoaded]);

  const music = [
    { type: "Single", title: "O Céu é o Meu Lugar", year: "2023", cover: "/img/7.jpg", link: "https://open.spotify.com/user/31g7w3m744kda4o4ql5cyzvq3zba", status: "available" },
    { type: "Álbum", title: "Em Produção", year: "2026", cover: "/img/8.png", link: "#", status: "upcoming" },
    { type: "Single", title: "Graça Infinita", year: "Breve", cover: "/img/4.jpg", link: "#", status: "upcoming" },
  ];

  return (
    <section 
      id="discografia"
      ref={containerRef} 
      className={`bg-gradient-to-b from-[#082f49] via-[#0f172a] to-[#1e1b4b] text-white relative flex flex-col justify-center ${motionEnabled ? 'md:h-screen md:overflow-hidden py-20 md:py-0' : 'py-20 h-auto overflow-hidden'}`}
    >
      <div className="md:absolute md:top-10 md:left-10 z-10 md:block p-6 md:p-0">
         <h3 className="text-xs font-bold uppercase tracking-[0.3em] flex items-center gap-3 text-[#29aae2]">
            <span className="w-8 h-[2px] bg-[#29aae2] shadow-[0_0_10px_#29aae2]"></span>
            Discografia Oficial
         </h3>
      </div>
      
      <div 
         ref={scrollRef}
         className={`${motionEnabled ? 'flex flex-col md:flex-row md:items-center gap-12 md:gap-6 md:w-max md:h-full w-full h-auto py-10 md:py-0' : 'container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'}`}
      >
        <div className={`${motionEnabled ? 'w-full md:min-w-[35vw] md:pl-20 md:pr-4 flex flex-col justify-center shrink-0 mb-8 md:mb-0 px-6' : 'col-span-1 md:col-span-2 lg:col-span-3 text-center mb-8'}`}>
            <h2 className={`disco-title text-4xl md:text-5xl lg:text-8xl font-black uppercase leading-[0.85] mb-4 md:mb-8 ${motionEnabled ? 'text-center md:text-left' : ''}`}>
              Música & <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29aae2] to-white">Adoração</span>
            </h2>
            <p className={`text-gray-400 text-sm md:text-lg font-medium leading-relaxed max-w-md ${motionEnabled ? 'border-l-0 md:border-l-2 border-[#29aae2] pl-0 md:pl-6 text-center md:text-left mx-auto md:mx-0' : 'mx-auto'}`}>
              Nossa música é o reflexo da nossa alma. Cada nota, uma oração; cada canção, um testemunho.
            </p>

            <a href="https://open.spotify.com/user/31g7w3m744kda4o4ql5cyzvq3zba" target="_blank" className={`mt-8 inline-flex items-center gap-3 bg-[#29aae2] text-black font-bold uppercase tracking-widest px-6 py-3 md:px-8 md:py-4 hover:bg-white transition-all w-max shadow-[0_0_20px_rgba(41,170,226,0.3)] ${motionEnabled ? 'mx-auto md:mx-0' : 'mx-auto'}`}>
                <i className="fab fa-spotify"></i> Ouvir Agora
            </a>
        </div>

        {music.map((item, i) => (
          <div key={i} className={`mobile-disco-card relative group overflow-hidden bg-[#0a192f]/40 backdrop-blur-md shadow-2xl shrink-0 border border-white/10 hover:border-[#29aae2]/50 transition-all duration-500 rounded-2xl hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(41,170,226,0.3)] transform-gpu ${motionEnabled ? 'w-[calc(100%-3rem)] mx-auto md:mx-0 md:w-[35vw] h-[60vh] md:h-[65vh] mb-0' : 'w-full aspect-square'}`}>
            {/* Image Container */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
                <img 
                   src={item.cover} 
                   alt={item.title} 
                   className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1 opacity-80 group-hover:opacity-100 transform-gpu will-change-transform`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90 rounded-2xl"></div>
            </div>

            {/* Type Badge */}
            <div className="absolute top-6 right-6 z-20">
                <span className="bg-[#0a192f]/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest rounded-full group-hover:border-[#29aae2] group-hover:text-[#29aae2] transition-colors">
                    {item.type}
                </span>
            </div>

            {/* Action Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0a192f]/40 backdrop-blur-sm">
                {item.status === 'available' ? (
                    <a href={item.link} target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-[#29aae2] text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(41,170,226,0.6)] transform translate-y-4 group-hover:translate-y-0">
                        <i className="fas fa-play"></i> Ouvir Agora
                    </a>
                ) : (
                    <div className="flex items-center gap-3 border border-white/30 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest bg-[#0a192f]/50 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <i className="fas fa-clock"></i> Em Breve
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
               <h4 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-3 text-white drop-shadow-lg group-hover:text-[#29aae2] transition-colors">
                 {item.title}
               </h4>
               <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                   <span className="flex items-center gap-2"><i className="far fa-calendar text-[#29aae2]"></i> {item.year}</span>
                   {item.status === 'available' && <span className="flex items-center gap-2"><i className="fab fa-spotify text-[#29aae2]"></i> Disponível</span>}
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const Agenda = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { motionEnabled, gsapLoaded } = useMotion();

    useEffect(() => {
        if (!motionEnabled || !containerRef.current || !window.gsap || !window.ScrollTrigger || !gsapLoaded) return;

        let ctx = window.gsap.context(() => {
            const items = document.querySelectorAll(".agenda-row");
            window.gsap.fromTo(items, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                    }
                }
            );
        }, containerRef);

        return () => ctx.revert();
    }, [motionEnabled]);

    const events = [
        { d: "07", m: "DEZ", title: "Missa 2º Domingo do Advento", loc: "Paróquia São Pedro Apóstolo", time: "19h00" },
        { d: "20", m: "DEZ", title: "Ordenação Presbiteral", loc: "Catedral Diocesana", time: "18h00" },
        { d: "2026", m: "ABERTA", title: "Leve o Uziel para sua cidade", loc: "Disponível para eventos", time: "Contato", isHighlight: true },
    ];

    return (
        <section id="agenda" ref={containerRef} className="py-20 md:py-32 bg-gradient-to-b from-[#0a192f] via-[#1e1b4b] to-[#0f172a] relative overflow-hidden">
             {/* Background Elements */}
             <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#29aae2]/50 to-transparent"></div>
             <div className="absolute -left-40 top-1/4 w-96 h-96 bg-[#29aae2]/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                    <div>
                        <span className="text-[#29aae2] font-bold tracking-[0.3em] text-xs uppercase mb-2 block">Tour 2024/2025</span>
                        <h2 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                            Agenda <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800">Oficial</span>
                        </h2>
                    </div>
                    <a href="#contato" className="group flex items-center gap-3 text-white hover:text-[#29aae2] transition-colors">
                        <span className="uppercase tracking-widest text-xs font-bold">Solicitar Orçamento</span>
                        <i className="fas fa-arrow-right transform group-hover:translate-x-2 transition-transform"></i>
                    </a>
                </div>

                <div className="flex flex-col">
                    {events.map((evt, i) => (
                        <div key={i} className={`agenda-row group relative border-t border-white/10 py-10 md:py-12 flex flex-col md:flex-row md:items-center gap-8 md:gap-0 transition-all duration-500 hover:bg-white/[0.02] ${i === events.length - 1 ? 'border-b' : ''}`}>
                            
                            {/* Date */}
                            <div className="md:w-1/4 flex items-start gap-4">
                                <span className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 font-anton leading-none group-hover:text-[#29aae2] transition-colors duration-300">
                                    {evt.d}
                                </span>
                                <span className="text-sm font-bold text-[#29aae2] uppercase tracking-widest mt-2 border border-[#29aae2]/30 px-2 py-1 rounded">
                                    {evt.m}
                                </span>
                            </div>

                            {/* Info */}
                            <div className="md:w-1/2 flex flex-col gap-2">
                                <h3 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight group-hover:translate-x-2 transition-transform duration-300">
                                    {evt.title}
                                </h3>
                                <div className="flex items-center gap-6 text-zinc-500 text-sm font-medium group-hover:text-zinc-400 transition-colors">
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-map-marker-alt text-[#29aae2]"></i> {evt.loc}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <i className="fas fa-clock"></i> {evt.time}
                                    </span>
                                </div>
                            </div>

                            {/* Action */}
                            <div className="md:w-1/4 flex md:justify-end items-center">
                                <button className="relative overflow-hidden border border-white/20 bg-transparent text-white px-8 py-3 uppercase tracking-widest text-xs font-bold group-hover:border-[#29aae2] group-hover:text-[#29aae2] transition-all duration-300 rounded-sm">
                                    <span className="relative z-10">Detalhes</span>
                                    <div className="absolute inset-0 bg-[#29aae2] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 opacity-10"></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

const Footer = () => (
  <footer id="contato" className="bg-gradient-to-b from-[#0f172a] to-[#020617] text-white -mt-1 pt-32 pb-12 px-6 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-[#29aae2]/10 blur-[120px] pointer-events-none"></div>
    <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
      
       <div className="mb-16 hover:scale-105 transition-transform cursor-pointer group flex flex-col items-center">
          <h2 className="text-6xl md:text-8xl font-black tracking-widest text-white group-hover:text-[#29aae2] transition-colors drop-shadow-[0_0_25px_rgba(41,170,226,0.3)]" style={{fontFamily: 'Anton'}}>MINISTÉRIO UZIEL</h2>
          <div className="h-1 w-24 bg-[#29aae2] mt-6 opacity-50 group-hover:w-full group-hover:opacity-100 transition-all duration-500"></div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 md:gap-6 mb-16 md:mb-24 w-full max-w-3xl px-4 md:px-0">
          <a href="https://wa.me/556796884226" className="flex-1 bg-[#29aae2] text-black px-6 py-4 md:px-8 md:py-5 rounded-lg font-black uppercase tracking-widest hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(41,170,226,0.3)] text-center flex items-center justify-center gap-3 group text-sm md:text-base">
              <i className="fab fa-whatsapp text-xl md:text-2xl group-hover:rotate-12 transition-transform"></i> 
              <span>WhatsApp</span>
          </a>
          <a href="mailto:ministeriouzielfc@gmail.com" className="flex-1 border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm text-white px-6 py-4 md:px-8 md:py-5 rounded-lg font-black uppercase tracking-widest hover:border-[#29aae2] hover:text-[#29aae2] hover:bg-zinc-900 hover:scale-105 transition-all text-center flex items-center justify-center gap-3 group text-sm md:text-base">
              <i className="fas fa-envelope text-xl md:text-2xl group-hover:-rotate-12 transition-transform"></i> 
              <span>Email</span>
          </a>
      </div>

       <div className="flex gap-8 md:gap-12 mb-16 text-gray-600 flex-wrap justify-center">
           {[
               { href: "https://www.instagram.com/oministeriouziel", icon: "instagram" },
               { href: "https://youtube.com/@ministeriouziel", icon: "youtube" },
               { href: "https://www.facebook.com/share/1AWxqDPciq/", icon: "facebook" },
               { href: "https://open.spotify.com/user/31g7w3m744kda4o4ql5cyzvq3zba", icon: "spotify" }
           ].map((social, i) => (
               <a key={i} href={social.href} target="_blank" className="hover:text-[#29aae2] transition-all hover:-translate-y-2 hover:drop-shadow-[0_0_15px_#29aae2] p-2">
                   <i className={`fab fa-${social.icon} fa-2x`}></i>
               </a>
           ))}
      </div>

       <div className="text-center text-zinc-600 text-xs leading-relaxed max-w-4xl border-t border-zinc-900 pt-10 w-full flex flex-col-reverse md:flex-row justify-between items-center gap-6 px-4 md:px-0">
          <p>&copy; 2026 Ministério Uziel. Todos os direitos reservados.</p>
          <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacidade</a>
              <span className="text-zinc-800">|</span>
              <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
      </div>
    </div>
  </footer>
);

// --- MAIN APP ---
const MainContent = () => {
  return (
    <div className="font-sans antialiased selection:bg-[#29aae2] selection:text-white bg-[#0a192f] min-h-screen text-slate-200">
      <Navbar />
      <main className="w-full">
        <HeroSection />
        <HistorySection />
        <MembersGrid />
        <DiscographyCarousel />
        {/* Seção Imersão só aparece se motion estiver ON, pois depende do efeito visual */}
        <ImmersionSection />
        <Agenda />
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js");
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js");

        const linkIcons = document.createElement('link');
        linkIcons.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
        linkIcons.rel = "stylesheet";
        document.head.appendChild(linkIcons);

        const style = document.createElement('style');
        style.textContent = `
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #29aae2; border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #2397cf; }
            html { scrollbar-width: thin; scrollbar-color: #29aae2 transparent; }
        `;
        document.head.appendChild(style);

        if (window.gsap && window.ScrollTrigger) {
          window.gsap.registerPlugin(window.ScrollTrigger);
          window.ScrollTrigger.config({ ignoreMobileResize: true });
        }
        
        // Ensure the loading screen shows for at least 5 seconds
        setTimeout(() => {
            setLoading(false);
            setTimeout(() => setShowLoading(false), 1000); // Wait for fade out transition
        }, 5000);
      } catch (e) {
        console.error("Falha ao carregar dependências", e);
        setTimeout(() => {
            setLoading(false);
            setTimeout(() => setShowLoading(false), 1000);
        }, 5000);
      }
    };
    init();
  }, []);

  return (
    <MotionProvider gsapLoaded={!loading}>
      {showLoading && (
        <div className={`fixed inset-0 bg-gradient-to-br from-[#0a192f] via-[#1e1b4b] to-[#0f172a] z-[100] flex items-center justify-center transition-opacity duration-1000 ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
           <div className="animate-pulse flex flex-col items-center justify-center">
               <div className="w-32 h-32 md:w-48 md:h-48 drop-shadow-[0_0_20px_rgba(41,170,226,0.5)]">
                  <UzielLogo className="w-full h-full" />
               </div>
           </div>
        </div>
      )}
      <MainContent />
    </MotionProvider>
  );
};

export default App;
