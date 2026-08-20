<script setup>
import { computed, ref } from "vue";

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
const protocols = ["OBSERVE THE FRICTION", "CROSS THE BOUNDARY", "BUILD THE SMALLEST REAL THING", "RETURN CONTROL TO THE HUMAN"];
const activeNode = ref("daily-life");
const activeFilter = ref("all");
const protocol = ref(0);
const selectedNode = computed(() => researchNodes.find((node) => node.id === activeNode.value));
const visibleExperiments = computed(() => experiments.filter((item) => activeFilter.value === "all" || item.category === activeFilter.value));
const nodePosition = (node) => {
  const radius = 41;
  const radians = node.angle * Math.PI / 180;
  return { left: `${50 + Math.cos(radians) * radius}%`, top: `${50 + Math.sin(radians) * radius}%` };
};
const shiftProtocol = () => { protocol.value = (protocol.value + 1) % protocols.length; };
</script>

<template>
  <main>
    <header class="hero">
      <nav><a href="https://github.com/Bum-Boo">← GitHub Profile</a><span>LAB / 01</span><span class="live"><i /> LIVE</span></nav>
      <div class="hero-grid">
        <div>
          <p class="eyebrow">BUM-BOO · EXPERIMENTAL AI DESIGN WORKSHOP</p>
          <h1>Designing AI<br><em>for ordinary life.</em></h1>
          <p class="lede">A boundaryless studio for exploring cognition, design, technology, and playful tools—built for people, not only developers.</p>
          <div class="hero-actions"><a class="primary" href="#experiments">Enter experiments</a><button @click="shiftProtocol">Shift protocol ↻</button></div>
        </div>
        <div class="protocol-card">
          <span>ACTIVE PROTOCOL</span><strong>{{ String(protocol + 1).padStart(2, "0") }}</strong><p>{{ protocols[protocol] }}</p>
          <div class="signal"><b /><b /><b /><b /></div>
        </div>
      </div>
    </header>

    <section class="research-section">
      <div class="section-head"><span>RESEARCH ORBIT / INTERACTIVE</span><span>SELECT A NODE</span></div>
      <div class="research-grid">
        <div class="orbit-stage" aria-label="Interactive research orbit">
          <div class="orbit-line orbit-line-a" /><div class="orbit-line orbit-line-b" />
          <div class="core"><span>AI</span><strong>EXPERIENCE</strong><strong>DESIGN</strong></div>
          <button v-for="node in researchNodes" :key="node.id" class="orbit-node" :class="[node.color, { active: activeNode === node.id }]" :style="nodePosition(node)" @click="activeNode = node.id">{{ node.label }}</button>
        </div>
        <article class="question-panel">
          <span>CURRENT QUESTION</span><h2>{{ selectedNode.label }}</h2><p>{{ selectedNode.question }}</p>
          <dl><div><dt>METHOD</dt><dd>Explore → Design → Build</dd></div><div><dt>LIMIT</dt><dd>No fixed medium</dd></div><div><dt>RULE</dt><dd>Human choice remains visible</dd></div></dl>
        </article>
      </div>
    </section>

    <section id="experiments" class="experiment-section">
      <div class="section-head"><span>PROTOTYPE ARCHIVE</span><span>{{ visibleExperiments.length }} SIGNALS</span></div>
      <div class="filter-bar"><button v-for="item in filters" :key="item" :class="{ selected: activeFilter === item }" @click="activeFilter = item">{{ item }}</button></div>
      <div class="experiment-grid">
        <a v-for="(item, index) in visibleExperiments" :key="item.title" class="experiment-card" :href="item.url" target="_blank" rel="noreferrer">
          <div class="card-top"><span>{{ String(index + 1).padStart(2, "0") }}</span><span class="status">● {{ item.status }}</span></div>
          <h3>{{ item.title }}</h3><p>{{ item.description }}</p><footer><span>{{ item.signal }}</span><strong>OPEN ↗</strong></footer>
        </a>
      </div>
    </section>

    <section class="manifesto">
      <p>THE LAB DOES NOT ASK<br><span>“WHICH FIELD IS THIS?”</span></p>
      <p>IT ASKS<br><em>“WHAT EXPERIENCE SHOULD EXIST?”</em></p>
    </section>

    <footer class="footer"><span>BURGUNDY / VIRIDIAN / VERMILION</span><a href="https://bumboo.fun">bumboo.fun ↗</a><span>STILL EXPLORING</span></footer>
  </main>
</template>
