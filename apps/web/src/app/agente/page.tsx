'use client';

import { useState } from 'react';

const CV_PROFILE = {
  name: 'Aparecido Gomes da Silva Júnior',
  title: 'QA Pleno | Analista de Sistemas',
  location: 'Curitiba – PR',
  email: 'aparecidogomes1003@gmail.com',
  linkedin: 'linkedin.com/in/aparecidojunior',
  summary: 'QA Pleno com mais de 6 anos de experiência em ambientes de produção e times ágeis. Atuação ponta a ponta em qualidade de software, com foco em análise de requisitos, testes orientados a risco, regressão e validação end-to-end.',
  skills: ['Testes Funcionais', 'Regressão', 'End-to-End', 'SQL Server', 'Linux', 'Azure', 'Git', 'JavaScript', 'C#', 'Python', 'Scrum'],
  experience: [
    { role: 'Analista de QA', period: '2025 / Atual', highlights: 'Testes funcionais, regressivos e end-to-end em e-commerce.' },
    { role: 'Analista de Sistemas', period: '2023 / 2025', highlights: 'QA de sistemas críticos, SQL Server, Linux, Azure, Scrum.' },
    { role: 'Trainee em Sistemas', period: '2021 / 2023', highlights: 'Incidentes, SQL Server, automações em Python.' },
  ],
  certifications: ['Software Testing / QA – LinkedIn Learning', 'Software Testing – Pluralsight', 'Agile Fundamentals – Pluralsight', 'GitHub Advanced Security – LinkedIn Learning'],
  pcd: true,
};

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  url: string;
  match: number;
  tags: string[];
  posted: string;
}

type TabType = 'buscar' | 'carta' | 'perfil';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function AgentePage() {
  const [tab, setTab] = useState<TabType>('buscar');
  const [keyword, setKeyword] = useState('QA');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [carta, setCarta] = useState('');
  const [cartaLoading, setCartaLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchDone, setSearchDone] = useState(false);

  const searchJobs = async () => {
    setLoading(true);
    setSearchDone(false);
    setJobs([]);
    try {
      const response = await fetch(`${API_URL}/jobs/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      });
      const data = await response.json();
      setJobs(data);
    } catch {
      setJobs([]);
    }
    setLoading(false);
    setSearchDone(true);
  };

  const generateCarta = async (job: Job) => {
    setSelectedJob(job);
    setCartaLoading(true);
    setTab('carta');
    setCarta('');
    try {
      const response = await fetch(`${API_URL}/jobs/cover-letter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle: job.title, company: job.company }),
      });
      const data = await response.json();
      setCarta(data.letter);
    } catch {
      setCarta('Erro ao gerar carta. Tente novamente.');
    }
    setCartaLoading(false);
  };

  const copyCarta = () => {
    navigator.clipboard.writeText(carta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matchColor = (match: number) => {
    if (match >= 90) return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
    if (match >= 80) return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
    return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
  };

  return (
    <div className="fixed inset-0 bg-[#020617] text-white flex flex-col font-mono overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(rgba(0,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.2)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute left-1/2 top-1/3 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/8 blur-[150px]" />
      </div>

      <div className="relative z-10 flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-cyan-400/15 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-400/30 bg-cyan-400/10">
            <svg className="w-4 h-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xs font-black tracking-[0.2em] text-cyan-200 leading-none">AGENTE DE VAGAS</h1>
            <p className="text-[8px] tracking-[0.2em] text-cyan-200/40 mt-0.5">JARBAS JOB HUNTER</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(0,255,120,1)]" />
          <span className="text-[8px] tracking-[0.2em] text-emerald-300">ATIVO</span>
        </div>
      </div>

      <div className="relative z-10 flex-shrink-0 flex border-b border-cyan-400/10 bg-black/20">
        {([
          { id: 'buscar', label: 'BUSCAR VAGAS', icon: '🔍' },
          { id: 'carta', label: 'CARTA', icon: '✉️' },
          { id: 'perfil', label: 'MEU PERFIL', icon: '👤' },
        ] as { id: TabType; label: string; icon: string }[]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[9px] tracking-[0.15em] transition-all ${
              tab === t.id ? 'text-cyan-300 border-b-2 border-cyan-400 bg-cyan-400/5' : 'text-white/30 hover:text-white/50'
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto">

        {tab === 'buscar' && (
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchJobs()}
                placeholder="Ex: QA, Analista de Testes..."
                className="flex-1 bg-white/5 border border-cyan-400/20 rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400/50"
              />
              <button onClick={searchJobs} disabled={loading} className="px-4 py-2.5 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[10px] tracking-[0.15em] hover:bg-cyan-400/25 disabled:opacity-50 transition-all">
                {loading ? '...' : 'BUSCAR'}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {['QA Pleno', 'Analista de Testes', 'SDET', 'Quality Engineer', 'QA Automation'].map((f) => (
                <button key={f} onClick={() => setKeyword(f)} className="text-[9px] px-2.5 py-1 rounded-full border border-cyan-400/15 text-cyan-200/50 hover:border-cyan-400/40 hover:text-cyan-200 transition-all">{f}</button>
              ))}
            </div>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12 gap-3">
                <div className="flex gap-1">{[0,150,300].map((d) => <span key={d} className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{animationDelay:`${d}ms`}} />)}</div>
                <p className="text-[10px] text-cyan-200/40 tracking-widest">ANALISANDO VAGAS...</p>
              </div>
            )}

            {!loading && jobs.length > 0 && (
              <div className="space-y-3">
                <p className="text-[9px] text-cyan-200/40 tracking-widest">{jobs.length} VAGAS ENCONTRADAS</p>
                {jobs.map((job) => (
                  <div key={job.id} className="rounded-xl border border-cyan-400/10 bg-white/[0.02] p-4 space-y-3 hover:border-cyan-400/25 transition-all">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-bold text-white tracking-wide leading-tight">{job.title}</h3>
                        <p className="text-[10px] text-cyan-200/60 mt-0.5">{job.company}</p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${matchColor(job.match)}`}>{job.match}%</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">📍 {job.location}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">💼 {job.type}</span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40">🕐 {job.posted}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {job.tags.map((tag) => <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-cyan-400/8 border border-cyan-400/15 text-cyan-300/70">{tag}</span>)}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => generateCarta(job)} className="flex-1 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 text-[9px] tracking-[0.15em] hover:bg-cyan-400/20 transition-all">✉️ GERAR CARTA</button>
                      <a href={job.url} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[9px] tracking-[0.15em] hover:bg-white/10 transition-all text-center">🔗 VER VAGA</a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && searchDone && jobs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/20 text-xs tracking-widest">NENHUMA VAGA ENCONTRADA</p>
                <p className="text-white/10 text-[10px] mt-2">Tente outros termos de busca</p>
              </div>
            )}

            {!loading && !searchDone && (
              <div className="text-center py-10 space-y-2">
                <div className="text-4xl">🎯</div>
                <p className="text-white/20 text-xs tracking-widest">PRONTO PARA CAÇAR VAGAS</p>
                <p className="text-white/10 text-[10px]">Clique em BUSCAR para começar</p>
              </div>
            )}
          </div>
        )}

        {tab === 'carta' && (
          <div className="p-4 space-y-4">
            {selectedJob ? (
              <>
                <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-3">
                  <p className="text-[9px] text-cyan-200/50 tracking-widest mb-1">VAGA SELECIONADA</p>
                  <p className="text-xs font-bold text-cyan-200">{selectedJob.title}</p>
                  <p className="text-[10px] text-cyan-200/60">{selectedJob.company}</p>
                </div>
                {cartaLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="flex gap-1">{[0,150,300].map((d) => <span key={d} className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{animationDelay:`${d}ms`}} />)}</div>
                    <p className="text-[10px] text-cyan-200/40 tracking-widest">GERANDO CARTA PERSONALIZADA...</p>
                  </div>
                ) : carta ? (
                  <>
                    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <pre className="text-[11px] text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{carta}</pre>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={copyCarta} className="flex-1 py-2.5 rounded-lg bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 text-[9px] tracking-[0.15em] hover:bg-cyan-400/25 transition-all">
                        {copied ? '✅ COPIADO!' : '📋 COPIAR CARTA'}
                      </button>
                      <button onClick={() => generateCarta(selectedJob)} className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-[9px] tracking-[0.15em] hover:bg-white/10 transition-all">🔄</button>
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <div className="text-center py-12 space-y-2">
                <div className="text-4xl">✉️</div>
                <p className="text-white/20 text-xs tracking-widest">NENHUMA VAGA SELECIONADA</p>
                <p className="text-white/10 text-[10px]">Busque vagas e clique em "Gerar Carta"</p>
                <button onClick={() => setTab('buscar')} className="mt-4 px-4 py-2 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-[9px] tracking-widest">IR PARA BUSCA</button>
              </div>
            )}
          </div>
        )}

        {tab === 'perfil' && (
          <div className="p-4 space-y-4">
            <div className="rounded-xl border border-cyan-400/15 bg-cyan-400/5 p-4 space-y-1">
              <h2 className="text-sm font-black text-cyan-200 tracking-wide">{CV_PROFILE.name}</h2>
              <p className="text-[10px] text-cyan-300/70">{CV_PROFILE.title}</p>
              <p className="text-[9px] text-white/40">📍 {CV_PROFILE.location}</p>
              <p className="text-[9px] text-white/40">✉️ {CV_PROFILE.email}</p>
              {CV_PROFILE.pcd && <span className="inline-block text-[8px] px-2 py-0.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-300 mt-1">PCD ♿</span>}
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-cyan-200/40 tracking-widest">RESUMO</p>
              <p className="text-[11px] text-white/60 leading-relaxed">{CV_PROFILE.summary}</p>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-cyan-200/40 tracking-widest">HABILIDADES</p>
              <div className="flex flex-wrap gap-1.5">
                {CV_PROFILE.skills.map((s) => <span key={s} className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-400/8 border border-cyan-400/15 text-cyan-300/80">{s}</span>)}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-cyan-200/40 tracking-widest">EXPERIÊNCIA</p>
              <div className="space-y-3">
                {CV_PROFILE.experience.map((e) => (
                  <div key={e.role} className="border-l-2 border-cyan-400/20 pl-3 space-y-0.5">
                    <p className="text-[11px] font-bold text-white/80">{e.role}</p>
                    <p className="text-[9px] text-cyan-300/50">{e.period}</p>
                    <p className="text-[10px] text-white/40">{e.highlights}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] text-cyan-200/40 tracking-widest">CERTIFICAÇÕES</p>
              <div className="space-y-1">
                {CV_PROFILE.certifications.map((c) => <p key={c} className="text-[10px] text-white/40">• {c}</p>)}
              </div>
            </div>
            <div className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}