
import React, { useState, useEffect, useRef } from 'react';
import { Language, AppState, UserProfile, Disease, DietType, Recipe, Region } from './types';
import { TRANSLATIONS, Icons } from './constants';
import { analyzeImageOrText, getSubstitutes } from './geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('visionchef_final_v1');
    return saved ? JSON.parse(saved) : {
      language: Language.AR,
      userProfile: {
        diseases: [], diet: DietType.NONE, mode: 'free',
        region: Region.INTERNATIONAL, age: 30, weight: 70, height: 170
      },
      history: []
    };
  });

  const [view, setView] = useState<'home' | 'profile' | 'history' | 'recipe' | 'choices'>('home');
  const [loading, setLoading] = useState(false);
  const [choices, setChoices] = useState<Recipe[]>([]);
  const [current, setCurrent] = useState<Recipe | null>(null);
  const [inputText, setInputText] = useState('');
  const [subs, setSubs] = useState<Record<string, string[]>>({});
  
  const camRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isRtl = state.language === Language.AR;
  const t = TRANSLATIONS[state.language];

  useEffect(() => {
    localStorage.setItem('visionchef_final_v1', JSON.stringify(state));
  }, [state]);

  const handleProcess = async (input: { base64?: string; text?: string }, mode: 'ingredients' | 'meal') => {
    setLoading(true);
    try {
      const results = await analyzeImageOrText(input, state.userProfile, state.language, mode === 'meal');
      if (results.length > 1) {
        setChoices(results);
        setView('choices');
      } else {
        viewRecipe(results[0]);
      }
    } catch (e) {
      alert(isRtl ? 'حدث خطأ في الاتصال' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const viewRecipe = (r: Recipe) => {
    setCurrent(r);
    setState(prev => ({ ...prev, history: [r, ...prev.history].slice(0, 20) }));
    setView('recipe');
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>, mode: 'ingredients' | 'meal') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => handleProcess({ base64: (reader.result as string).split(',')[1] }, mode);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`min-h-screen pb-24 ${isRtl ? 'rtl' : 'ltr'} font-cairo`}>
      {/* Top Nav */}
      <header className="bg-white/80 backdrop-blur-md border-b p-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👨‍🍳</span>
          <h1 className="text-xl font-black text-orange-600">{t.appName}</h1>
        </div>
        <button 
          onClick={() => setState(p => ({ ...p, language: p.language === Language.AR ? Language.EN : Language.AR }))}
          className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold"
        >
          {state.language === Language.AR ? 'English' : 'عربي'}
        </button>
      </header>

      <main className="p-4 max-w-2xl mx-auto w-full">
        {loading && (
          <div className="fixed inset-0 bg-white/80 z-[100] flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold">{t.detecting}</p>
          </div>
        )}

        {view === 'home' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-center mb-6">{t.tagline}</h2>
              
              <div className="space-y-4">
                <textarea 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={isRtl ? "اكتب المكونات التي لديك هنا..." : "Type your ingredients..."}
                  className="w-full h-32 p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-orange-500 outline-none resize-none font-bold"
                />
                {inputText.trim() && (
                  <button 
                    onClick={() => handleProcess({ text: inputText }, 'ingredients')}
                    className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black shadow-lg"
                  >
                    {isRtl ? 'ابتكار وصفات' : 'Create Recipes'}
                  </button>
                )}
              </div>

              <div className="my-8 flex items-center gap-4 text-slate-300">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-xs font-bold">{isRtl ? 'أو عبر الكاميرا' : 'OR via Camera'}</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => camRef.current?.click()}
                  className="bg-orange-50 text-orange-700 p-4 rounded-2xl flex flex-col items-center gap-2 font-black border border-orange-100"
                >
                  <Icons.Camera /> {isRtl ? 'مسح مكونات' : 'Scan Items'}
                </button>
                <button 
                  onClick={() => { fileRef.current?.setAttribute('data-mode', 'meal'); fileRef.current?.click(); }}
                  className="bg-blue-50 text-blue-700 p-4 rounded-2xl flex flex-col items-center gap-2 font-black border border-blue-100"
                >
                  <Icons.Upload /> {isRtl ? 'تحليل وجبة' : 'Analyze Meal'}
                </button>
              </div>
            </div>

            <input type="file" ref={camRef} className="hidden" accept="image/*" capture="environment" onChange={e => onFileChange(e, 'ingredients')} />
            <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={e => onFileChange(e, (e.target as any).dataset.mode || 'ingredients')} />
          </div>
        )}

        {view === 'choices' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-black">{isRtl ? 'اختر وجبتك المفضلة:' : 'Pick your meal:'}</h2>
            {choices.map((c, i) => (
              <button key={i} onClick={() => viewRecipe(c)} className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-right group">
                <h3 className="font-black text-lg group-hover:text-orange-600 transition">{c.title}</h3>
                <p className="text-sm text-slate-400">⏱️ {c.prepTime} • 🔥 {c.calories} kcal</p>
              </button>
            ))}
            <button onClick={() => setView('home')} className="w-full text-slate-400 font-bold p-4">{isRtl ? 'رجوع' : 'Back'}</button>
          </div>
        )}

        {view === 'profile' && (
          <div className="bg-white p-8 rounded-3xl shadow-sm space-y-8 animate-fadeIn">
            <h2 className="text-2xl font-black">{t.profile}</h2>
            
            <section className="space-y-3">
              <label className="font-black text-slate-500 text-sm">{isRtl ? 'المطبخ المفضل' : 'Preferred Kitchen'}</label>
              <div className="grid grid-cols-2 gap-2">
                {[Region.EGYPTIAN, Region.GULF, Region.LEVANT, Region.MAGHREB, Region.INTERNATIONAL].map(r => (
                  <button 
                    key={r}
                    onClick={() => setState(p => ({ ...p, userProfile: { ...p.userProfile, region: r } }))}
                    className={`p-3 rounded-xl border-2 font-bold text-sm ${state.userProfile.region === r ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 border-slate-50 text-slate-400'}`}
                  >
                    {isRtl ? { egyptian: 'مصري', gulf: 'خليجي', levant: 'شامي', maghreb: 'مغربي', international: 'عالمي' }[r] : r}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <label className="font-black text-slate-500 text-sm">{t.diseases}</label>
              <div className="flex flex-wrap gap-2">
                {[Disease.DIABETES, Disease.HYPERTENSION, Disease.CELIAC].map(d => (
                  <button 
                    key={d}
                    onClick={() => {
                      const has = state.userProfile.diseases.includes(d);
                      const next = has ? state.userProfile.diseases.filter(x => x !== d) : [...state.userProfile.diseases, d];
                      setState(p => ({ ...p, userProfile: { ...p.userProfile, diseases: next } }));
                    }}
                    className={`px-4 py-2 rounded-xl font-bold border-2 ${state.userProfile.diseases.includes(d) ? 'bg-red-500 text-white border-red-500' : 'bg-slate-50 border-slate-50 text-slate-400'}`}
                  >
                    {t[d as keyof typeof t]}
                  </button>
                ))}
              </div>
            </section>

            <button onClick={() => setView('home')} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black">{t.save}</button>
          </div>
        )}

        {view === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-xl font-black">{t.history}</h2>
            {state.history.map((h, i) => (
              <button key={i} onClick={() => { setCurrent(h); setView('recipe'); }} className="w-full bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm">
                <span className="font-bold">{h.title}</span>
                <span className="text-xs text-slate-300">{new Date(h.timestamp).toLocaleDateString()}</span>
              </button>
            ))}
          </div>
        )}

        {view === 'recipe' && current && (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden animate-fadeIn mb-8">
            <div className={`p-8 text-white ${current.isMealAnalysis ? 'bg-blue-600' : 'bg-orange-600'}`}>
              <h2 className="text-2xl font-black mb-2">{current.title}</h2>
              <p className="font-bold opacity-80">⏱️ {current.prepTime} • 🔥 {current.calories} kcal</p>
            </div>
            <div className="p-6 space-y-8">
              <section>
                <h3 className="font-black text-lg mb-4 text-orange-600 border-b pb-2">{isRtl ? 'المكونات' : 'Ingredients'}</h3>
                <ul className="space-y-2">
                  {current.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                      <span className="font-bold">{ing}</span>
                      {!current.isMealAnalysis && (
                        <button 
                          onClick={async () => {
                            if (!subs[ing]) {
                              const res = await getSubstitutes(ing, state.language);
                              setSubs(p => ({ ...p, [ing]: res }));
                            }
                          }}
                          className="text-[10px] bg-white px-2 py-1 rounded shadow-sm font-black text-blue-600"
                        >
                          {t.substitutes}
                        </button>
                      )}
                      {subs[ing] && <div className="absolute bg-white p-2 border rounded shadow-lg text-[10px] font-bold z-10">{subs[ing].join(', ')}</div>}
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h3 className="font-black text-lg mb-4 text-emerald-600 border-b pb-2">{current.isMealAnalysis ? (isRtl ? 'التقرير الصحي' : 'Health Report') : (isRtl ? 'التحضير' : 'Preparation')}</h3>
                <div className="space-y-4">
                  {current.steps.map((s, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{i+1}</span>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Nav Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-4 flex justify-around shadow-2xl z-50">
        <button onClick={() => setView('home')} className={`p-2 ${view === 'home' ? 'text-orange-600' : 'text-slate-300'}`}><Icons.Camera /></button>
        <button onClick={() => setView('history')} className={`p-2 ${view === 'history' ? 'text-orange-600' : 'text-slate-300'}`}><Icons.History /></button>
        <button onClick={() => setView('profile')} className={`p-2 ${view === 'profile' ? 'text-orange-600' : 'text-slate-300'}`}><Icons.User /></button>
      </nav>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
