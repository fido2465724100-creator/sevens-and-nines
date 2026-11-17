import React, { useEffect, useState } from 'react';
import {
  purchaseSubscription,
  getSubscriptionInfo,
  getTrialDaysRemaining,
} from '../billing/billing';

interface TrialWallProps {
  isOpen: boolean;
  onUnlocked: () => void;
  language: string;
}

// Localized strings for the paywall (key languages)
const PAYWALL_TEXT: Record<string, {
  title: string;
  subtitle: string;
  trialExpired: string;
  trialRemaining: string;
  subscribeBtn: string;
  restoreBtn: string;
  priceLabel: string;
  freeTrialLabel: string;
  thankYou: string;
  error: string;
  loading: string;
}> = {
  ru: {
    title: '🎴 Sevens & Nines',
    subtitle: 'Пробный период завершён',
    trialExpired: 'Ваш 30-дневный бесплатный период закончился.',
    trialRemaining: 'Осталось дней бесплатного периода:',
    subscribeBtn: 'Подписаться',
    restoreBtn: 'Восстановить покупку',
    priceLabel: 'Цена:',
    freeTrialLabel: '30 дней бесплатно, затем',
    thankYou: 'Спасибо за подписку! 🎉',
    error: 'Ошибка при покупке. Попробуйте ещё раз.',
    loading: 'Загрузка...',
  },
  uk: {
    title: '🎴 Sevens & Nines',
    subtitle: 'Пробний період завершено',
    trialExpired: 'Ваш 30-денний безкоштовний період завершився.',
    trialRemaining: 'Залишилось днів безкоштовного періоду:',
    subscribeBtn: 'Підписатися',
    restoreBtn: 'Відновити покупку',
    priceLabel: 'Ціна:',
    freeTrialLabel: '30 днів безкоштовно, потім',
    thankYou: 'Дякуємо за підписку! 🎉',
    error: 'Помилка при покупці. Спробуйте ще раз.',
    loading: 'Завантаження...',
  },
  en: {
    title: '🎴 Sevens & Nines',
    subtitle: 'Trial period has ended',
    trialExpired: 'Your 30-day free trial has expired.',
    trialRemaining: 'Free trial days remaining:',
    subscribeBtn: 'Subscribe',
    restoreBtn: 'Restore Purchase',
    priceLabel: 'Price:',
    freeTrialLabel: '30 days free, then',
    thankYou: 'Thank you for subscribing! 🎉',
    error: 'Purchase error. Please try again.',
    loading: 'Loading...',
  },
  de: {
    title: '🎴 Sevens & Nines',
    subtitle: 'Testzeitraum abgelaufen',
    trialExpired: 'Ihre 30-tägige Testphase ist abgelaufen.',
    trialRemaining: 'Verbleibende Testtage:',
    subscribeBtn: 'Abonnieren',
    restoreBtn: 'Kauf wiederherstellen',
    priceLabel: 'Preis:',
    freeTrialLabel: '30 Tage kostenlos, dann',
    thankYou: 'Vielen Dank für Ihr Abonnement! 🎉',
    error: 'Kauffehler. Bitte versuchen Sie es erneut.',
    loading: 'Wird geladen...',
  },
  fr: {
    title: '🎴 Sevens & Nines',
    subtitle: 'Période d\'essai terminée',
    trialExpired: 'Votre période d\'essai gratuite de 30 jours est terminée.',
    trialRemaining: 'Jours d\'essai restants :',
    subscribeBtn: 'S\'abonner',
    restoreBtn: 'Restaurer l\'achat',
    priceLabel: 'Prix :',
    freeTrialLabel: '30 jours gratuits, puis',
    thankYou: 'Merci pour votre abonnement ! 🎉',
    error: 'Erreur d\'achat. Veuillez réessayer.',
    loading: 'Chargement...',
  },
  es: {
    title: '🎴 Sevens & Nines',
    subtitle: 'Período de prueba terminado',
    trialExpired: 'Tu período de prueba gratuito de 30 días ha expirado.',
    trialRemaining: 'Días de prueba restantes:',
    subscribeBtn: 'Suscribirse',
    restoreBtn: 'Restaurar compra',
    priceLabel: 'Precio:',
    freeTrialLabel: '30 días gratis, luego',
    thankYou: '¡Gracias por suscribirte! 🎉',
    error: 'Error de compra. Inténtalo de nuevo.',
    loading: 'Cargando...',
  },
};

function getPaywallText(lang: string) {
  return PAYWALL_TEXT[lang] || PAYWALL_TEXT.en;
}

export const TrialWall: React.FC<TrialWallProps> = ({ isOpen, onUnlocked, language }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const text = getPaywallText(language);
  const daysRemaining = getTrialDaysRemaining();

  useEffect(() => {
    if (isOpen) {
      getSubscriptionInfo().then((info) => {
        if (info.available && info.price) {
          setPrice(info.price);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await purchaseSubscription();
      if (result) {
        setSuccess(true);
        setTimeout(() => onUnlocked(), 1500);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-gradient-to-br from-emerald-900 to-emerald-700 rounded-2xl p-8 mx-4 max-w-sm w-full text-center shadow-2xl border border-emerald-500/30">
          <div className="text-5xl mb-4">🎉</div>
          <p className="text-xl font-bold text-white">{text.thankYou}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl border border-amber-500/20">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎴</div>
          <h2 className="text-2xl font-bold text-white mb-1">{text.title}</h2>
          <p className="text-amber-400 font-medium">{text.subtitle}</p>
        </div>

        {/* Trial info */}
        <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
          <p className="text-slate-300 text-sm leading-relaxed">
            {text.trialExpired}
          </p>
        </div>

        {/* Price info */}
        {price && (
          <div className="bg-amber-900/30 border border-amber-500/20 rounded-xl p-4 mb-6 text-center">
            <p className="text-amber-300 text-sm mb-1">{text.freeTrialLabel}</p>
            <p className="text-white text-2xl font-bold">{price}<span className="text-sm text-slate-400">/мес</span></p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/20 rounded-lg p-3 mb-4 text-center">
            <p className="text-red-300 text-sm">{text.error}</p>
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-bold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
          >
            {loading ? text.loading : `${text.subscribeBtn} →`}
          </button>

          <button
            onClick={handlePurchase}
            disabled={loading}
            className="w-full py-2.5 px-6 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 text-sm rounded-xl transition-all duration-200 disabled:opacity-50"
          >
            {text.restoreBtn}
          </button>
        </div>

        {/* Footer */}
        <p className="text-slate-500 text-xs text-center mt-4">
          Google Play Subscription • Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default TrialWall;
