import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share, PlusSquare, MonitorSmartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true;
}

export function useInstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  
  // We ALWAYS show the button if it's not already installed.
  const [isInstallable, setIsInstallable] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [os, setOs] = useState<'ios' | 'android' | 'desktop'>('desktop');

  useEffect(() => {
    // Hide if already installed
    if (isStandalone()) return;
    setIsInstallable(true);

    // Detect OS
    const userAgent = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs('ios');
    } else if (/android/.test(userAgent)) {
      setOs('android');
    } else {
      setOs('desktop');
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // MOCK FOR DEMONSTRATION/TESTING: 
    // In localhost development, we force the UI so the developer can see the exact layout.
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
       setTimeout(() => {
         setIsInstallable(true);
         // Create a dummy prompt object just to show the green "Instalar Agora" button on localhost
         if (!deferredPrompt && os !== 'ios') {
           setDeferredPrompt({
             prompt: async () => { console.log("Mock prompt triggered"); },
             userChoice: Promise.resolve({ outcome: 'accepted' })
           } as BeforeInstallPromptEvent);
         }
       }, 1500);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [os, deferredPrompt]);

  const handleInstallClick = async () => {
    // If we have a prompt AND we are not on iOS, try native first
    if (deferredPrompt && os !== 'ios') {
      await triggerNativeInstall();
    } else {
      setShowModal(true);
    }
  };

  const triggerNativeInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setShowModal(false);
        setDeferredPrompt(null);
      }
    } catch (e) {
      console.error("Install prompt error", e);
      setShowModal(true);
    }
  };

  return { isInstallable, showModal, setShowModal, os, handleInstallClick, triggerNativeInstall, deferredPrompt };
}

export function InstallAppModal({
  isOpen,
  onClose,
  os,
  onNativeInstall,
  hasNativePrompt
}: {
  isOpen: boolean;
  onClose: () => void;
  os: 'ios' | 'android' | 'desktop';
  onNativeInstall: () => void;
  hasNativePrompt: boolean;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-3xl border border-border/50 bg-[#F5F2EC] p-6 shadow-2xl dark:bg-[#1C2B1E]"
            >
              <button
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <MonitorSmartphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-playfair text-xl font-bold text-foreground">Instalar LeishCheck</h3>
                <p className="text-sm text-muted-foreground">Acesso rápido e offline.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Native Install Fallback Message */}
              {hasNativePrompt && os !== 'ios' && (
                <div className="rounded-2xl border border-primary/20 bg-[#A5D6A7]/20 p-4 text-center">
                  <p className="mb-4 text-sm font-medium text-foreground">
                    Clique no botão abaixo para instalar o aplicativo no seu dispositivo:
                  </p>
                  <Button onClick={onNativeInstall} className="w-full gap-2 bg-[#A5D6A7] text-[#1C2B1E] hover:bg-[#A5D6A7]/80">
                    <Download className="h-4 w-4" /> Instalar Agora
                  </Button>
                </div>
              )}

              {/* iOS Manual Instructions */}
              {(!hasNativePrompt && os === 'ios') && (
                <div className="rounded-2xl bg-muted/50 p-4">
                  <h4 className="mb-3 font-semibold text-foreground">Como instalar no iPhone/iPad:</h4>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">1</span>
                      <span>Toque no botão <Share className="inline h-4 w-4 text-foreground mx-1" /> (Compartilhar) na barra do Safari.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">2</span>
                      <span>Role para baixo e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="inline h-4 w-4 text-foreground mx-1" />.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">3</span>
                      <span>Toque em <strong>"Adicionar"</strong> no canto superior direito.</span>
                    </li>
                  </ol>
                </div>
              )}

               {/* Android Manual Instructions (if native failed/blocked) */}
               {(!hasNativePrompt && os === 'android') && (
                <div className="rounded-2xl bg-muted/50 p-4">
                  <h4 className="mb-3 font-semibold text-foreground">Como instalar no Android:</h4>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">1</span>
                      <span>Toque no botão de <strong>Menu (três pontinhos)</strong> do navegador.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">2</span>
                      <span>Selecione <strong>"Adicionar à tela inicial"</strong> ou <strong>"Instalar aplicativo"</strong>.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">3</span>
                      <span>Confirme em <strong>"Adicionar"</strong>.</span>
                    </li>
                  </ol>
                </div>
              )}

               {/* Desktop Manual Instructions (if native failed/blocked) */}
               {(!hasNativePrompt && os === 'desktop') && (
                <div className="rounded-2xl bg-muted/50 p-4">
                  <h4 className="mb-3 font-semibold text-foreground">Como instalar no Computador:</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Você pode instalar o LeishCheck direto no seu computador para usá-lo como um programa nativo.
                  </p>
                  <ol className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">1</span>
                      <span>Procure pelo ícone de instalação <Download className="inline h-4 w-4 text-foreground mx-1" /> no final da barra de endereços do seu navegador.</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-background font-bold text-foreground shadow-sm">2</span>
                      <span>Clique no ícone e depois em <strong>"Instalar"</strong>.</span>
                    </li>
                  </ol>
                </div>
              )}
            </div>
            
            <div className="mt-6">
                <Button variant="outline" className="w-full" onClick={onClose}>
                    Entendi
                </Button>
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
