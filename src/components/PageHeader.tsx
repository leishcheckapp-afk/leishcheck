import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  onBack?: () => void;
  backTo?: string | number;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon: Icon, onBack, backTo, children }: PageHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    if (onBack) onBack();
    else if (typeof backTo === 'number') navigate(backTo as any);
    else if (typeof backTo === 'string') navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="glass-card flex h-11 w-11 shrink-0 items-center justify-center rounded-xl hover-lift"
          aria-label={t('nav.back')}
        >
          <ArrowLeft className="h-5 w-5 text-primary" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-primary shrink-0" />}
            <h1 className="text-2xl font-bold text-gradient truncate">{title}</h1>
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      <div className="h-0.5 w-16 rounded-full bg-gradient-to-r from-primary to-primary-light" />
      {children}
    </div>
  );
}
