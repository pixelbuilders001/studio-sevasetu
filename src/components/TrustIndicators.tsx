import { Card, CardContent } from '@/components/ui/card';
import type { TranslationFunc } from '@/lib/get-translation';
import { Gem, Award, ReceiptText, ShieldAlert } from 'lucide-react';

export default function TrustIndicators({ t }: { t: TranslationFunc }) {

  const indicators = [
    {
      icon: Gem,
      title: 'ASLI PARTS',
      description: 'Only 100% genuine spare parts used.',
      bgColor: 'bg-purple-100/60 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Award,
      title: 'EXPERT PROS',
      description: 'Certified & background verified.',
      bgColor: 'bg-blue-100/60 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: ReceiptText,
      title: 'PAKKA BILL',
      description: 'Transparent pricing with no surprises.',
      bgColor: 'bg-green-100/60 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    {
      icon: ShieldAlert,
      title: 'WARRANTY',
      description: '30-day post-service guarantee.',
      bgColor: 'bg-orange-100/60 dark:bg-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-16 rounded-[3rem] mx-2 shadow-2xl overflow-hidden relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-headline mb-3">{t('whyChooseUs')}</h2>
          <div className="h-1.5 w-20 bg-blue-500 mx-auto rounded-full mb-4"></div>
          <p className="text-slate-300 font-medium tracking-wide text-sm">RELIABLE SERVICE, GUARANTEED.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indicators.map((indicator, index) => (
            <div key={index} className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl ${indicator.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                  <indicator.icon className={`w-6 h-6 ${indicator.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{indicator.title}</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">{indicator.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full bg-slate-700 border-2 border-slate-800"></div>
              ))}
            </div>
            <span className="text-xs font-medium text-slate-300 ml-1">Trusted by 50,000+ neighbors</span>
          </div>
        </div>
      </div>
    </section>
  );
}
