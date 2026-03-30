"use client";
import { useState, useEffect, useCallback } from "react";

const C = {
  bg: "#f8f9ff", surface: "#ffffff", surfaceLow: "#eff4ff",
  surfaceContainer: "#e5eeff", surfaceHigh: "#dce9ff", surfaceHighest: "#d3e4fe",
  primary: "#002045", primaryContainer: "#1a365d", primaryFixed: "#d6e3ff", primaryFixedDim: "#adc7f7",
  secondary: "#b62037", onPrimary: "#ffffff", onSurface: "#0b1c30",
  onSurfaceVariant: "#43474e", outline: "#74777f", outlineVariant: "#c4c6cf",
  error: "#ba1a1a", errorContainer: "#ffdad6",
};

const WORD_POOL = [
  { term: "기준금리", level: "기초", category: "통화정책" },
  { term: "인플레이션", level: "기초", category: "거시경제" },
  { term: "양적완화", level: "중급", category: "통화정책" },
  { term: "스태그플레이션", level: "고급", category: "거시경제" },
  { term: "PER", level: "중급", category: "주식" },
  { term: "FOMC", level: "중급", category: "통화정책" },
  { term: "공매도", level: "중급", category: "주식" },
  { term: "ETF", level: "기초", category: "투자" },
  { term: "CPI", level: "중급", category: "거시경제" },
  { term: "GDP", level: "기초", category: "거시경제" },
];

const POPULAR = ["금리", "인플레이션", "ETF", "PER", "환율", "양적완화", "FOMC", "배당", "공매도", "GDP"];
const todayWord = () => WORD_POOL[Math.floor(Date.now() / 86400000) % WORD_POOL.length];
const fmtChange = (v) => v ? `${v > 0 ? "+" : ""}${v.toFixed(2)}%` : "—";
const changeColor = (v) => !v ? C.outline : v > 0 ? "#00C471" : C.secondary;

const LevelBadge = ({ level }) => {
  const map = { 기초: ["#dcfce7","#166534"], 중급: ["#fef3c7","#92400e"], 고급: ["#fee2e2","#991b1b"] };
  const [bg, color] = map[level] || map["기초"];
  return <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:bg, color }}>{level}</span>;
};

const Chip = ({ label, onClick, active }) => (
  <button onClick={onClick} style={{
    padding:"7px 14px", borderRadius:20, cursor:"pointer", fontSize:12, fontWeight:600,
    border:`1.5px solid ${active ? C.primary : C.outlineVariant}`,
    background: active ? C.primaryFixed : "transparent",
    color: active ? C.primary : C.onSurfaceVariant, transition:"all 0.15s"
  }}>{label}</button>
);

// ─── 홈 탭 ────────────────────────────────────────────────────
const HomeTab = ({ onSearch, history, market }) => {
  const wotd = todayWord();
  const days = ["MON","TUE","WED","THU","FRI","SAT","SUN"];
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <div>
      {/* 히어로 */}
      <section style={{ marginBottom:28 }}>
        <div style={{ display:"flex", alignItems:"flex-end", gap:24, flexWrap:"wrap" }}>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:10, fontWeight:700, color:C.secondary, textTransform:"uppercase", letterSpacing:"0.2em", marginBottom:8 }}>
              오늘의 학습
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:6 }}>
              <span style={{ fontSize:80, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", lineHeight:1, letterSpacing:"-0.04em" }}>
                {history.length}
              </span>
              <span style={{ fontSize:20, fontWeight:700, color:C.onSurfaceVariant }}>/ 5 단어</span>
            </div>
            <p style={{ fontSize:14, color:C.onSurfaceVariant, marginTop:8, maxWidth:320 }}>
              {history.length >= 5 ? "🎉 오늘 목표 달성!" : `${5-history.length}개만 더 배우면 목표 달성이에요`}
            </p>
          </div>
          <div style={{ width:280, background:C.surfaceLow, padding:20, borderRadius:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
              <span style={{ fontSize:10, fontWeight:700, color:C.primary }}>DAILY GOAL</span>
              <span style={{ fontSize:10, fontWeight:700, color:C.primary }}>{Math.min(100,Math.round(history.length/5*100))}%</span>
            </div>
            <div style={{ height:10, background:C.surfaceContainer, borderRadius:20, overflow:"hidden" }}>
              <div style={{ height:"100%", borderRadius:20, background:C.secondary,
                width:`${Math.min(100,history.length/5*100)}%`, transition:"width 0.5s",
                boxShadow:"0 0 12px rgba(182,32,55,0.3)" }} />
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:10,
              fontSize:10, fontWeight:700, color:C.outline, textTransform:"uppercase", letterSpacing:"0.08em" }}>
              <span>{history.length} / 5 WORDS</span><span>오늘 목표</span>
            </div>
          </div>
        </div>
      </section>

      {/* 추천 단어 벤토 그리드 */}
      <section style={{ marginBottom:28 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
          <h2 style={{ fontSize:20, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif" }}>오늘의 추천 단어</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:14 }}>
          {/* 오늘의 단어 (2칸) */}
          <div onClick={() => onSearch(wotd.term)} style={{
            gridColumn:"span 2", background:C.surface, borderRadius:16, padding:28,
            boxShadow:"0 12px 32px rgba(11,28,48,0.06)", cursor:"pointer", position:"relative",
            overflow:"hidden", minHeight:180, border:`1px solid ${C.outlineVariant}`, transition:"transform 0.2s"
          }} onMouseEnter={e=>e.currentTarget.style.transform="scale(0.99)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
            <div style={{ position:"absolute", top:0, right:0, width:150, height:150,
              background:C.surfaceLow, borderRadius:"0 0 0 100%", marginTop:-50, marginRight:-50 }} />
            <div style={{ position:"relative" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                <span style={{ fontSize:10, fontWeight:700, background:"#fee2e2", color:C.secondary, padding:"3px 10px", borderRadius:20 }}>오늘의 단어</span>
                <LevelBadge level={wotd.level} />
              </div>
              <div style={{ fontSize:40, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", letterSpacing:"-0.03em", lineHeight:1.1 }}>{wotd.term}</div>
              <div style={{ fontSize:13, color:C.onSurfaceVariant, marginTop:8 }}>{wotd.category}</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:20 }}>
              <button style={{ background:C.primary, color:"#fff", padding:"10px 20px", borderRadius:12, border:"none",
                fontWeight:700, fontSize:13, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
                지금 배우기 <span className="material-symbols-outlined" style={{ fontSize:16 }}>arrow_forward</span>
              </button>
              <span style={{ fontSize:12, color:C.outline }}>약 3분</span>
            </div>
          </div>
          {/* 사이드 카드 */}
          <div onClick={() => onSearch(POPULAR[2])} style={{
            background:C.surfaceLow, borderRadius:16, padding:22, cursor:"pointer",
            border:`1px solid ${C.outlineVariant}`, transition:"transform 0.2s"
          }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            <span className="material-symbols-outlined" style={{ color:C.primary, marginBottom:10, display:"block" }}>account_balance</span>
            <div style={{ fontSize:18, fontWeight:700, color:C.primary, fontFamily:"Manrope,sans-serif" }}>{POPULAR[2]}</div>
            <div style={{ fontSize:12, color:C.onSurfaceVariant, marginTop:4 }}>AI 설명 보기 →</div>
          </div>
          {/* 챌린지 배너 (3칸) */}
          <div style={{ gridColumn:"span 3", background:C.primary, borderRadius:16, padding:22,
            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:14 }}>
            <div>
              <div style={{ fontSize:10, fontWeight:700, color:C.primaryFixedDim, textTransform:"uppercase", letterSpacing:"0.15em" }}>인기 단어 탐색</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif", marginTop:4 }}>바로 검색해보세요</div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {POPULAR.slice(3,7).map(w => (
                <button key={w} onClick={e=>{e.stopPropagation();onSearch(w);}}
                  style={{ padding:"8px 14px", borderRadius:20, border:"1.5px solid rgba(255,255,255,0.3)",
                    background:"transparent", color:"#fff", fontSize:12, fontWeight:600, cursor:"pointer" }}>{w}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 히트맵 */}
      <section style={{ marginBottom:28 }}>
        <h2 style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginBottom:14 }}>이번 주 학습</h2>
        <div style={{ background:C.surface, borderRadius:16, padding:18, overflowX:"auto",
          boxShadow:"0 4px 16px rgba(11,28,48,0.04)", border:`1px solid ${C.outlineVariant}` }}>
          <div style={{ display:"flex", gap:10, minWidth:"max-content" }}>
            {days.map((d,i) => (
              <div key={d} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:
                  i===todayIdx ? C.secondary : i<todayIdx ? C.primaryFixed : C.surfaceHigh }} />
                <span style={{ fontSize:10, fontWeight:700, color:i===todayIdx ? C.secondary : C.outline }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 시장 미니 */}
      {market && (
        <section>
          <h2 style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginBottom:14 }}>지금 시장</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:10 }}>
            {[
              { label:"달러/원", value:market.fx?.krw ? `${market.fx.krw.toLocaleString()}원` : "—", change:null },
              { label:"S&P500 (SPY)", value:market.market?.spy?.price ? `$${market.market.spy.price.toFixed(2)}` : "—", change:market.market?.spy?.change },
              { label:"금 (GLD)", value:market.market?.gold?.price ? `$${market.market.gold.price.toFixed(2)}` : "—", change:market.market?.gold?.change },
            ].map(({label,value,change}) => (
              <div key={label} style={{ background:C.surface, borderRadius:14, padding:"16px 18px",
                border:`1px solid ${C.outlineVariant}`, boxShadow:"0 4px 12px rgba(11,28,48,0.04)" }}>
                <div style={{ fontSize:11, color:C.outline, fontWeight:600 }}>{label}</div>
                <div style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginTop:4 }}>{value}</div>
                {change != null && <div style={{ fontSize:12, fontWeight:700, color:changeColor(change), marginTop:2 }}>{fmtChange(change)}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// ─── 단어 탭 ─────────────────────────────────────────────────
const VocabTab = ({ onSearch, result, loading, error, query, setQuery, history }) => (
  <div>
    <div style={{ marginBottom:24 }}>
      <h2 style={{ fontSize:40, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", letterSpacing:"-0.03em", lineHeight:1 }}>Lexicon</h2>
      <p style={{ fontSize:14, color:C.onSurfaceVariant, marginTop:6 }}>모르는 경제 단어를 AI가 쉽게 설명해드려요</p>
    </div>
    <div style={{ display:"flex", gap:10, marginBottom:18 }}>
      <div style={{ flex:1, position:"relative" }}>
        <span className="material-symbols-outlined" style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.outline, fontSize:20 }}>search</span>
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&onSearch(query)}
          placeholder="경제 단어를 입력하세요 (예: 금리, ETF, FOMC)"
          style={{ width:"100%", paddingLeft:44, paddingRight:16, paddingTop:14, paddingBottom:14,
            background:C.surfaceLow, border:`1.5px solid ${C.outlineVariant}`, borderRadius:14,
            fontSize:14, color:C.onSurface, outline:"none", boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor=C.primary}
          onBlur={e=>e.target.style.borderColor=C.outlineVariant}
        />
      </div>
      <button onClick={()=>onSearch(query)} disabled={loading}
        style={{ padding:"14px 22px", borderRadius:14, border:"none", cursor:loading?"default":"pointer",
          background:loading?C.outline:C.primary, color:"#fff", fontWeight:700, fontSize:14, whiteSpace:"nowrap" }}>
        {loading ? "분석 중..." : "검색"}
      </button>
    </div>
    <div style={{ marginBottom:24 }}>
      <div style={{ fontSize:11, fontWeight:700, color:C.outline, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.1em" }}>🔥 많이 찾는 단어</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {POPULAR.map(w => <Chip key={w} label={w} onClick={()=>onSearch(w)} />)}
      </div>
    </div>

    {loading && (
      <div style={{ background:C.surface, borderRadius:16, padding:"48px 24px", textAlign:"center",
        boxShadow:"0 4px 16px rgba(11,28,48,0.06)", border:`1px solid ${C.outlineVariant}` }}>
        <div style={{ fontSize:36, animation:"spin 1s linear infinite", display:"inline-block", marginBottom:14 }}>⚙️</div>
        <div style={{ fontSize:16, fontWeight:700, color:C.primary, marginBottom:6 }}>"{query}" 분석 중이에요</div>
        <div style={{ fontSize:13, color:C.onSurfaceVariant }}>AI가 쉬운 언어로 정리하고 있어요...</div>
      </div>
    )}
    {error && !loading && (
      <div style={{ background:C.errorContainer, borderRadius:14, padding:20, textAlign:"center" }}>
        <div style={{ color:C.error, fontWeight:700, fontSize:14 }}>⚠️ {error}</div>
      </div>
    )}
    {result && !loading && (
      <div style={{ animation:"fadeIn 0.4s ease" }}>
        <div style={{ background:C.surface, borderRadius:16, padding:28, marginBottom:16,
          boxShadow:"0 12px 32px rgba(11,28,48,0.08)", border:`1px solid ${C.outlineVariant}` }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
            <div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                <span style={{ fontSize:10, fontWeight:700, color:C.secondary, textTransform:"uppercase", letterSpacing:"0.15em" }}>AI 분석</span>
                {result.level && <LevelBadge level={result.level} />}
              </div>
              <div style={{ fontSize:40, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", lineHeight:1.1, letterSpacing:"-0.02em" }}>{result.term}</div>
              <div style={{ fontSize:14, color:C.onSurfaceVariant, marginTop:6 }}>{result.oneline}</div>
            </div>
            <div style={{ fontSize:36, flexShrink:0, marginLeft:16 }}>{result.emoji}</div>
          </div>
          <div style={{ height:1, background:C.outlineVariant, margin:"20px 0" }} />
          {/* AI 튜터 */}
          <div style={{ marginBottom:18 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
              <div style={{ width:28, height:28, borderRadius:"50%", background:C.primaryContainer,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span className="material-symbols-outlined" style={{ fontSize:16, color:"#fff" }}>psychology</span>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>AI 튜터 설명</span>
              <span style={{ fontSize:10, fontWeight:700, background:C.primaryFixed, color:C.primary, padding:"2px 8px", borderRadius:20 }}>AI TUTOR</span>
            </div>
            <div style={{ background:C.surfaceLow, borderRadius:12, padding:"16px 18px",
              borderLeft:`3px solid ${C.primary}`, fontSize:14, color:C.onSurface, lineHeight:1.8 }}>
              {result.simple}
            </div>
          </div>
          {result.example && (
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:C.onSurfaceVariant, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:8 }}>💬 실생활 예시</div>
              <div style={{ background:C.surfaceContainer, borderRadius:12, padding:"14px 16px", fontSize:13, color:C.onSurfaceVariant, lineHeight:1.7 }}>{result.example}</div>
            </div>
          )}
          {result.tip && (
            <div style={{ background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, padding:"12px 16px", display:"flex", gap:10 }}>
              <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
              <div style={{ fontSize:13, color:"#92400e", lineHeight:1.6 }}>{result.tip}</div>
            </div>
          )}
        </div>
        {result.related?.length > 0 && (
          <div>
            <div style={{ fontSize:12, fontWeight:700, color:C.onSurfaceVariant, marginBottom:10 }}>🔗 관련 단어</div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
              {result.related.map(w => (
                <button key={w} onClick={()=>onSearch(w)}
                  style={{ padding:"8px 14px", borderRadius:20, border:`1.5px solid ${C.primary}`,
                    background:"transparent", color:C.primary, fontSize:12, fontWeight:700, cursor:"pointer" }}
                  onMouseEnter={e=>{e.target.style.background=C.primary;e.target.style.color="#fff";}}
                  onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=C.primary;}}>
                  {w}
                </button>
              ))}
            </div>
            <div style={{ marginTop:14, fontSize:10, color:C.outline, textAlign:"center" }}>ℹ️ 교육 목적이며 투자 권유가 아니에요</div>
          </div>
        )}
      </div>
    )}
    {!result && !loading && !error && history.length > 0 && (
      <div>
        <div style={{ fontSize:11, fontWeight:700, color:C.outline, marginBottom:10, textTransform:"uppercase", letterSpacing:"0.1em" }}>🕐 최근 검색</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
          {history.map(h => (
            <button key={h} onClick={()=>onSearch(h)}
              style={{ padding:"7px 14px", borderRadius:20, background:C.surfaceContainer,
                border:`1px solid ${C.outlineVariant}`, color:C.onSurfaceVariant, fontSize:12, fontWeight:600, cursor:"pointer" }}>
              {h}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ─── 분석 탭 ─────────────────────────────────────────────────
const AnalysisTab = ({ history, market }) => (
  <div>
    <section style={{ background:C.primary, borderRadius:20, padding:28, marginBottom:24, position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:0, right:0, width:200, height:200,
        background:"rgba(182,32,55,0.2)", borderRadius:"50%", filter:"blur(60px)", marginRight:-80, marginTop:-80 }} />
      <div style={{ position:"relative" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
          <div>
            <span style={{ background:C.secondary, color:"#fff", padding:"3px 12px", borderRadius:20, fontSize:10, fontWeight:700 }}>내 학습 리포트</span>
            <div style={{ fontSize:64, fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif", lineHeight:1, letterSpacing:"-0.04em", marginTop:12 }}>
              {history.length * 20}
            </div>
            <div style={{ color:C.primaryFixedDim, fontSize:15, fontWeight:600, marginTop:4 }}>총 학습 점수</div>
          </div>
          <div>
            <div style={{ fontSize:10, color:C.primaryFixedDim, textTransform:"uppercase", letterSpacing:"0.1em" }}>검색한 단어</div>
            <div style={{ fontSize:40, fontWeight:800, color:"#fff", fontFamily:"Manrope,sans-serif" }}>{history.length}</div>
          </div>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:20 }}>
          {[
            { label:"이번 세션", value:`${history.length}개` },
            { label:"학습 레벨", value:history.length>=5?"고급":history.length>=2?"중급":"기초" },
          ].map(({label,value}) => (
            <div key={label} style={{ background:"rgba(255,255,255,0.1)", borderRadius:14, padding:16, border:"1px solid rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize:10, color:C.primaryFixedDim, textTransform:"uppercase", letterSpacing:"0.1em" }}>{label}</div>
              <div style={{ fontSize:20, fontWeight:700, color:"#fff", marginTop:4 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section style={{ marginBottom:24 }}>
      <h3 style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginBottom:16 }}>분야별 학습 현황</h3>
      <div style={{ background:C.surface, borderRadius:16, padding:20, boxShadow:"0 4px 16px rgba(11,28,48,0.04)", border:`1px solid ${C.outlineVariant}` }}>
        {["거시경제","통화정책","주식","투자","환율"].map((cat,i) => {
          const w = [75,60,48,85,35][i];
          return (
            <div key={cat} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:C.onSurface }}>{cat}</span>
                <span style={{ fontSize:12, fontWeight:700, color:C.primary }}>{w}%</span>
              </div>
              <div style={{ height:8, background:C.surfaceContainer, borderRadius:20, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${w}%`, borderRadius:20, background:i%2===0?C.primary:C.secondary }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>

    {history.length > 0 && (
      <section>
        <h3 style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginBottom:14 }}>학습한 단어</h3>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {history.map((term,i) => (
            <div key={term} style={{ background:C.surface, borderRadius:14, padding:"16px 20px",
              display:"flex", justifyContent:"space-between", alignItems:"center",
              border:`1px solid ${C.outlineVariant}`, boxShadow:"0 2px 8px rgba(11,28,48,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:C.primaryFixed,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:C.primary }}>
                  {i+1}
                </div>
                <div style={{ fontSize:15, fontWeight:700, color:C.primary, fontFamily:"Manrope,sans-serif" }}>{term}</div>
              </div>
              <span className="material-symbols-outlined" style={{ color:"#00C471", fontSize:20 }}>check_circle</span>
            </div>
          ))}
        </div>
      </section>
    )}

    {market && (
      <section style={{ marginTop:24 }}>
        <h3 style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginBottom:14 }}>시장 현황</h3>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:12 }}>
          {[
            { label:"달러/원", value:market.fx?.krw ? `${market.fx.krw.toLocaleString()}원` : "—", change:null },
            { label:"유로/원", value:market.fx?.eur ? `${market.fx.eur.toLocaleString()}원` : "—", change:null },
            { label:"S&P500", value:market.market?.spy?.price ? `$${market.market.spy.price.toFixed(2)}` : "—", change:market.market?.spy?.change },
            { label:"금 (GLD)", value:market.market?.gold?.price ? `$${market.market.gold.price.toFixed(2)}` : "—", change:market.market?.gold?.change },
          ].map(({label,value,change}) => (
            <div key={label} style={{ background:C.surface, borderRadius:14, padding:"16px 18px",
              border:`1px solid ${C.outlineVariant}`, boxShadow:"0 4px 12px rgba(11,28,48,0.04)" }}>
              <div style={{ fontSize:11, color:C.outline, fontWeight:600 }}>{label}</div>
              <div style={{ fontSize:18, fontWeight:800, color:C.primary, fontFamily:"Manrope,sans-serif", marginTop:4 }}>{value}</div>
              {change != null && <div style={{ fontSize:12, fontWeight:700, color:changeColor(change), marginTop:2 }}>{fmtChange(change)}</div>}
            </div>
          ))}
        </div>
      </section>
    )}
  </div>
);

// ─── 메인 ─────────────────────────────────────────────────────
export default function Home() {
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [market, setMarket] = useState(null);

  useEffect(() => {
    fetch("/api/market").then(r=>r.json()).then(setMarket).catch(()=>{});
  }, []);

  const search = useCallback(async (term) => {
    const t = term.trim();
    if (!t) return;
    setLoading(true); setError(""); setResult(null); setQuery(t); setTab("vocab");
    try {
      const res = await fetch("/api/dictionary", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({term:t})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setHistory(h => [t, ...h.filter(x=>x!==t)].slice(0,10));
    } catch { setError("AI 설명을 불러오지 못했어요. 다시 시도해주세요."); }
    finally { setLoading(false); }
  }, []);

  const nav = [
    { id:"home", icon:"home", label:"Home" },
    { id:"vocab", icon:"menu_book", label:"Vocab" },
    { id:"analysis", icon:"insights", label:"Analysis" },
  ];

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"Inter,-apple-system,sans-serif", color:C.onSurface }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';}
        *{box-sizing:border-box;margin:0;padding:0;}input{outline:none;font-family:inherit;}button{font-family:inherit;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
      `}</style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;700;800&family=Inter:wght@400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        .material-symbols-outlined{font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24;font-family:'Material Symbols Outlined';}
        *{box-sizing:border-box;margin:0;padding:0;}input{outline:none;font-family:inherit;}button{font-family:inherit;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
      `}</style>

      {/* 헤더 */}
      <header style={{ position:"fixed", top:0, width:"100%", zIndex:50,
        background:"rgba(248,249,255,0.88)", backdropFilter:"blur(20px)",
        boxShadow:"0 1px 0 rgba(11,28,48,0.07)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"16px 24px", maxWidth:1100, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span className="material-symbols-outlined" style={{ color:C.primary }}>analytics</span>
            <h1 style={{ fontFamily:"Manrope,sans-serif", fontWeight:800, fontSize:20, color:C.primary, letterSpacing:"-0.02em" }}>
              ECON INTEL
            </h1>
          </div>
          <div style={{ background:C.primary, color:"#fff", padding:"4px 14px", borderRadius:20, fontSize:12, fontWeight:700 }}>
            {history.length * 20} pts
          </div>
        </div>
        <div style={{ height:1, background:C.surfaceLow }} />
      </header>

      {/* 콘텐츠 */}
      <main style={{ paddingTop:80, paddingBottom:100, padding:"80px 24px 100px", maxWidth:1100, margin:"0 auto" }}>
        {tab==="home" && <HomeTab onSearch={search} history={history} market={market} />}
        {tab==="vocab" && <VocabTab onSearch={search} result={result} loading={loading} error={error} query={query} setQuery={setQuery} history={history} />}
        {tab==="analysis" && <AnalysisTab history={history} market={market} />}
      </main>

      {/* 바텀 네비 */}
      <nav style={{ position:"fixed", bottom:0, width:"100%", zIndex:50,
        background:"rgba(248,249,255,0.93)", backdropFilter:"blur(24px)",
        boxShadow:"0 -8px 24px rgba(11,28,48,0.06)", borderRadius:"24px 24px 0 0" }}>
        <div style={{ display:"flex", justifyContent:"space-around", alignItems:"center",
          maxWidth:480, margin:"0 auto", height:72, padding:"0 16px" }}>
          {nav.map(({id,icon,label}) => {
            const active = tab===id;
            return (
              <button key={id} onClick={()=>setTab(id)} style={{
                display:"flex", flexDirection:"column", alignItems:"center", gap:3,
                padding:"8px 20px", borderRadius:14, border:"none", cursor:"pointer",
                background:active?C.primary:"transparent", color:active?"#fff":C.onSurface,
                opacity:active?1:0.4, transition:"all 0.15s"
              }}>
                <span className="material-symbols-outlined" style={{ fontSize:22,
                  fontVariationSettings:active?"'FILL' 1":"'FILL' 0" }}>{icon}</span>
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}