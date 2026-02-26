import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeishCheckStore } from '@/store/useLeishCheckStore';
import { speakText } from '@/components/AudioToggle';
import { User, Calendar, MapPin, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnimatedPage from '@/components/AnimatedPage';
import { PageHeader } from '@/components/PageHeader';
import { useTranslation } from 'react-i18next';

const ESTADOS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

export default function UserDataPage() {
  const navigate = useNavigate();
  const { userData, setUserData, audioEnabled } = useLeishCheckStore();
  const { t } = useTranslation();
  const [age, setAge] = useState(userData.age?.toString() || '');
  const [gender, setGender] = useState(userData.gender || '');
  const [city, setCity] = useState(userData.city || '');
  const [state, setState] = useState(userData.state || '');

  useEffect(() => { if (audioEnabled) speakText(t('audio.userData')); }, [audioEnabled, t]);

  const handleContinue = () => {
    setUserData({ age: age ? parseInt(age) : undefined, gender: gender || undefined, city: city || undefined, state: state || undefined });
    navigate('/questionario');
  };

  return (
    <AnimatedPage className="gradient-bg flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col gap-6">
        <PageHeader title={t('userData.title')} subtitle={t('userData.optional')} icon={User} backTo="/consentimento" />
        <div className="glass-card p-6 flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="age" className="text-base font-medium flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" /> {t('userData.age')}</Label>
            <Input id="age" type="number" placeholder={t('userData.agePlaceholder')} value={age} onChange={(e) => setAge(e.target.value)} className="h-12 rounded-xl text-base" />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> {t('userData.gender')}</Label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="h-12 rounded-xl text-base"><SelectValue placeholder={t('userData.genderPlaceholder')} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">{t('userData.genderMale')}</SelectItem>
                <SelectItem value="feminino">{t('userData.genderFemale')}</SelectItem>
                <SelectItem value="outro">{t('userData.genderOther')}</SelectItem>
                <SelectItem value="prefiro-nao-dizer">{t('userData.genderPreferNot')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="city" className="text-base font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {t('userData.city')}</Label>
            <Input id="city" placeholder={t('userData.cityPlaceholder')} value={city} onChange={(e) => setCity(e.target.value)} className="h-12 rounded-xl text-base" />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-medium flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {t('userData.state')}</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger className="h-12 rounded-xl text-base"><SelectValue placeholder={t('userData.statePlaceholder')} /></SelectTrigger>
              <SelectContent>{ESTADOS.map((uf) => <SelectItem key={uf} value={uf}>{uf}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>
        <button onClick={handleContinue} className="gradient-btn h-14 w-full rounded-2xl text-lg font-semibold">{t('nav.continue')}</button>
      </div>
    </AnimatedPage>
  );
}
