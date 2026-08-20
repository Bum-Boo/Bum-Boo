import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const researchNodes = [
  { id: "ai", label: "AI", angle: -90, color: "vermilion", question: "How can intelligence become a material for everyday experience?" },
  { id: "cognition", label: "COGNITION", angle: -30, color: "burgundy", question: "How do tools reshape attention, learning, and capability?" },
  { id: "design", label: "DESIGN", angle: 30, color: "viridian", question: "How can complex systems become visible and humane?" },
  { id: "tools", label: "TOOLS", angle: 90, color: "vermilion", question: "Which medium makes this problem easier to touch?" },
  { id: "play", label: "PLAY", angle: 150, color: "burgundy", question: "Can serious technology still create surprise and delight?" },
  { id: "daily-life", label: "DAILY LIFE", angle: 210, color: "viridian", question: "What small friction is worth redesigning today?" },
];

const experiments = [
  { title: "Hermes Skill Library", category: "agents", status: "growing", description: "Reusable behaviors that turn an agent into a practical collaborator.", url: "https://github.com/Bum-Boo/hermes-skill-library", signal: "workflow intelligence" },
  { title: "BIGLOADER with AI Agent", category: "everyday", status: "field test", description: "A non-developer-friendly Windows workspace for collecting and organizing media.", url: "https://github.com/Bum-Boo/BIGLOADER-with-Ai-agent", signal: "less workflow friction" },
  { title: "Agent Change Gate", category: "agents", status: "prototype", description: "A review-before-write layer that keeps durable AI changes inspectable.", url: "https://github.com/Bum-Boo/agent-change-gate", signal: "human choice stays visible" },
  { title: "Hermes Desktop Korean", category: "access", status: "verified", description: "Localization as access design, backed by coverage and type checks.", url: "https://github.com/Bum-Boo/hermes-desktop-korean", signal: "language as interface" },
  { title: "BBCC", category: "everyday", status: "tool", description: "Controller shortcuts that turn repeated creative actions into muscle memory.", url: "https://github.com/Bum-Boo/BBCC", signal: "physical interaction" },
  { title: "BTS Sec", category: "safety", status: "toolkit", description: "Defensive review tools for authorized projects and visible risk boundaries.", url: "https://github.com/Bum-Boo/BTS_sec", signal: "trust by inspection" },
];

const filters = ["all", "agents", "everyday", "access", "safety"];

function Orbit({ active, onSelect }) {
  return <div className="orbit-stage" aria-label="Interactive research orbit">
    <div className="orbit-line orbit-line-a" />
    <div className="orbit-line orbit-line-b" />
    <div className="core"><span>AI</span><strong>EXPERIENCE</strong><strong>DESIGN</strong></div>
    {researchNodes.map((node) => {
      const radius = 41;
      const radians = node.angle * Math.PI / 180;
      const x = 50 + Math.cos(radians) * radius;
      const y = 50 + Math.sin(radians) * radius;
      return <button key={node.id} className={`orbit-node ${node.color} ${active === node.id ? "active" : ""}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={() => onSelect(node.id)}>{node.label}</button>;
    })}
  </div>;
}

function App() {
  const [activeNode, setActiveNode] = useState("daily-life");
  const [filter, setFilter] = useState("all");
  const [protocol, setProtocol] = useState(0);
  const selectedNode = researchNodes.find((node) => node.id === activeNode);
  const visible = useMemo(() => experiments.filter((item) => filter === "all" || item.category === filter), [filter]);
  const protocols = ["OBSERVE THE FRICTION", "CROSS THE BOUNDARY", "BUILD THE SMALLEST REAL THING", "RETURN CONTROL TO THE HUMAN"];

  return <main>
    <header className="hero">
      <nav><a href="https://github.com/Bum-Boo">← GitHub Profile</a><span>LAB / 01</span><span className="live"><i /> LIVE</span></nav>
      <div className="hero-grid">
        <div>
          <p className="eyebrow">BUM-BOO · EXPERIMENTAL AI DESIGN WORKSHOP</p>
          <h1>Designing AI<br /><em>for ordinary life.</em></h1>
          <p className="lede">A boundaryless studio for exploring cognition, design, technology, and playful tools—built for people, not only developers.</p>
          <div className="hero-actions"><a className="primary" href="#experiments">Enter experiments</a><button onClick={() => setProtocol((value) => (value + 1) % protocols.length)}>Shift protocol ↻</button></div>
        </div>
        <div className="protocol-card">
          <span>ACTIVE PROTOCOL</span><strong>{String(protocol + 1).padStart(2, "0")}</strong><p>{protocols[protocol]}</p>
          <div className="signal"><b /><b /><b /><b /></div>
        </div>
      </div>
    </header>

    <section className="research-section">
      <div className="section-head"><span>RESEARCH ORBIT / INTERACTIVE</span><span>SELECT A NODE</span></div>
      <div className="research-grid">
        <Orbit active={activeNode} onSelect={setActiveNode} />
        <article className="question-panel">
          <span>CURRENT QUESTION</span><h2>{selectedNode.label}</h2><p>{selectedNode.question}</p>
          <dl><div><dt>METHOD</dt><dd>Explore → Design → Build</dd></div><div><dt>LIMIT</dt><dd>No fixed medium</dd></div><div><dt>RULE</dt><dd>Human choice remains visible</dd></div></dl>
        </article>
      </div>
    </section>

    <section id="experiments" className="experiment-section">
      <div className="section-head"><span>PROTOTYPE ARCHIVE</span><span>{visible.length} SIGNALS</span></div>
      <div className="filter-bar">{filters.map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
      <div className="experiment-grid">{visible.map((item, index) => <a className="experiment-card" href={item.url} key={item.title} target="_blank" rel="noreferrer">
        <div className="card-top"><span>{String(index + 1).padStart(2, "0")}</span><span className="status">● {item.status}</span></div>
        <h3>{item.title}</h3><p>{item.description}</p><footer><span>{item.signal}</span><strong>OPEN ↗</strong></footer>
      </a>)}</div>
    </section>

    <section className="manifesto">
      <p>THE LAB DOES NOT ASK<br /><span>“WHICH FIELD IS THIS?”</span></p>
      <p>IT ASKS<br /><em>“WHAT EXPERIENCE SHOULD EXIST?”</em></p>
    </section>

    <footer className="footer"><span>BURGUNDY / VIRIDIAN / VERMILION</span><a href="https://bumboo.fun">bumboo.fun ↗</a><span>STILL EXPLORING</span></footer>
  </main>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);
