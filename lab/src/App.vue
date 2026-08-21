<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const researchNodes = [
  { id: "ai", label: "AI", angle: -90, color: "vermilion", question: "How can intelligence become a material for everyday experience?" },
  { id: "cognition", label: "Cognition", angle: -30, color: "burgundy", question: "How do tools reshape attention, learning, and capability?" },
  { id: "design", label: "Design", angle: 30, color: "viridian", question: "How can complex systems become visible and humane?" },
  { id: "tools", label: "Tools", angle: 90, color: "vermilion", question: "Which medium makes this problem easier to touch?" },
  { id: "play", label: "Play", angle: 150, color: "burgundy", question: "Can serious technology still create surprise and delight?" },
  { id: "daily-life", label: "Daily life", angle: 210, color: "viridian", question: "What small friction is worth redesigning today?" },
];

const assetUrl = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

const experiments = [
  { id: "skill-library", title: "Hermes Skill Library", category: "agents", status: "Growing library", description: "Reusable behaviors that turn an agent into a practical collaborator.", url: "https://github.com/Bum-Boo/hermes-skill-library", signal: "Workflow intelligence", video: assetUrl("experiment-material-loop.mp4"), poster: assetUrl("experiment-material-loop-poster.webp"), visualPosition: "center" },
  { id: "bigloader", title: "BIGLOADER with AI Agent", category: "everyday", status: "Field test", description: "A non-developer-friendly Windows workspace for collecting and organizing media.", url: "https://github.com/Bum-Boo/BIGLOADER-with-Ai-agent", signal: "Less workflow friction", video: assetUrl("experiment-bigloader-relay-loop.mp4"), poster: assetUrl("experiment-bigloader-relay-poster.webp"), visualPosition: "46% center" },
  { id: "change-gate", title: "Agent Change Gate", category: "agents", status: "Prototype", description: "A review-before-write layer that keeps durable AI changes inspectable.", url: "https://github.com/Bum-Boo/agent-change-gate", signal: "Human choice stays visible", video: assetUrl("experiment-change-gate-loop.mp4"), poster: assetUrl("experiment-change-gate-poster.webp"), visualPosition: "center" },
  { id: "desktop-korean", title: "Hermes Desktop Korean", category: "access", status: "Verified", description: "Localization as access design, backed by coverage and type checks.", url: "https://github.com/Bum-Boo/hermes-desktop-korean", signal: "Language as interface", video: null, poster: assetUrl("experiment-language-hanji-poster.webp"), visualPosition: "56% center" },
  { id: "bbcc", title: "BBCC", category: "everyday", status: "Working tool", description: "Controller shortcuts that turn repeated creative actions into muscle memory.", url: "https://github.com/Bum-Boo/BBCC", signal: "Physical interaction", video: assetUrl("experiment-bbcc-sukajan-loop.mp4"), poster: assetUrl("experiment-bbcc-sukajan-poster.webp"), visualPosition: "center" },
  { id: "bts-sec", title: "BTS Sec", category: "safety", status: "Toolkit", description: "Defensive review tools for authorized projects and visible risk boundaries.", url: "https://github.com/Bum-Boo/BTS_sec", signal: "Trust by inspection", video: assetUrl("experiment-bts-tiger-v2-loop.mp4"), poster: assetUrl("experiment-bts-tiger-v2-poster.webp"), visualPosition: "58% center" },
];

const filters = ["all", "agents", "everyday", "access", "safety"];
const activeNode = ref("daily-life");
const activeFilter = ref("all");
const activeExperiment = ref(experiments[0].id);
const prefersReducedMotion = ref(false);
let motionPreference;
const syncMotionPreference = (event) => {
  prefersReducedMotion.value = event?.matches ?? motionPreference?.matches ?? false;
};
onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  syncMotionPreference(motionPreference);
  if (motionPreference.addEventListener) motionPreference.addEventListener("change", syncMotionPreference);
  else motionPreference.addListener(syncMotionPreference);
});
onBeforeUnmount(() => {
  if (!motionPreference) return;
  if (motionPreference.removeEventListener) motionPreference.removeEventListener("change", syncMotionPreference);
  else motionPreference.removeListener(syncMotionPreference);
});
const selectedNode = computed(() => researchNodes.find((node) => node.id === activeNode.value));
const visibleExperiments = computed(() => experiments.filter((item) => activeFilter.value === "all" || item.category === activeFilter.value));
const featuredExperiment = computed(() => visibleExperiments.value.find((item) => item.id === activeExperiment.value) ?? visibleExperiments.value[0]);
const experimentNumber = (item) => String(experiments.findIndex((experiment) => experiment.id === item.id) + 1).padStart(2, "0");
const setExperimentFilter = (filter) => {
  activeFilter.value = filter;
  activeExperiment.value = experiments.find((item) => filter === "all" || item.category === filter)?.id;
};
const nodePosition = (node) => {
  const radius = 41;
  const radians = node.angle * Math.PI / 180;
  return { left: `${50 + Math.cos(radians) * radius}%`, top: `${50 + Math.sin(radians) * radius}%` };
};
</script>

<template>
  <main>
    <header class="hero">
      <nav><a href="https://github.com/Bum-Boo">Bum-Boo on GitHub</a></nav>
      <div class="hero-copy">
        <p class="eyebrow">Independent AI design practice</p>
        <h1>AI tools should feel useful before they feel futuristic.</h1>
        <p class="lede">I explore cognition, design, technology, and playful tools to make everyday work lighter without hiding human choice.</p>
        <div class="hero-actions"><a class="primary" href="#experiments">Browse experiments</a><a href="#research">How I think</a></div>
      </div>
    </header>

    <section id="research" class="research-section">
      <div class="section-intro">
        <h2>A question can cross more than one field.</h2>
        <p>Select a subject to see the question I am currently asking around it.</p>
      </div>
      <div class="research-grid">
        <div class="orbit-stage" aria-label="Interactive research orbit">
          <div class="orbit-line orbit-line-a" /><div class="orbit-line orbit-line-b" />
          <div class="core"><span>AI experience design</span></div>
          <button v-for="node in researchNodes" :key="node.id" class="orbit-node" :class="[node.color, { active: activeNode === node.id }]" :style="nodePosition(node)" @click="activeNode = node.id">{{ node.label }}</button>
        </div>
        <article class="question-panel">
          <p class="eyebrow">Current question · {{ selectedNode.label }}</p>
          <blockquote>{{ selectedNode.question }}</blockquote>
          <dl><div><dt>Method</dt><dd>Explore, design, build</dd></div><div><dt>Medium</dt><dd>Chosen by the question</dd></div><div><dt>Boundary</dt><dd>Human choice stays visible</dd></div></dl>
        </article>
      </div>
    </section>

    <section class="material-study">
      <figure class="material-field">
        <img src="/assets/material-field.webp" alt="Tactile collage of paper, copper wire, circuit traces, and colored material samples">
        <figcaption>Material study 01 · Signals, surfaces, and imperfect connections</figcaption>
      </figure>
      <figure class="material-sample">
        <img src="/assets/material-study.webp" alt="Tabletop study of vellum, graphite, thread, circuit fragments, and hand-cut paper">
      </figure>
      <div class="material-copy">
        <p class="eyebrow">Working with more than screens</p>
        <h2>An interface can begin as paper, resistance, rhythm, or a misplaced object.</h2>
        <p>These material studies keep the lab from treating every question as another software dashboard. Digital behavior is one possible outcome, not the starting assumption.</p>
      </div>
      <p class="material-index" aria-hidden="true">01—02</p>
    </section>

    <section id="experiments" class="experiment-section">
      <div class="section-intro projects-intro">
        <h2>Selected experiments</h2>
        <p>Small, working attempts to remove friction or make a complex system easier to understand.</p>
      </div>
      <div class="filter-bar" aria-label="Filter experiments">
        <button v-for="item in filters" :key="item" :class="{ selected: activeFilter === item }" :aria-pressed="activeFilter === item" @click="setExperimentFilter(item)">{{ item }}</button>
      </div>
      <div class="experiment-lab">
        <div class="experiment-index" aria-label="Choose an experiment">
          <button v-for="item in visibleExperiments" :key="item.id" class="experiment-select" :class="{ selected: featuredExperiment.id === item.id }" :aria-pressed="featuredExperiment.id === item.id" @click="activeExperiment = item.id">
            <span class="experiment-number">{{ experimentNumber(item) }}</span>
            <span class="experiment-label"><strong>{{ item.title }}</strong><small>{{ item.signal }}</small></span>
            <span class="experiment-arrow" aria-hidden="true">→</span>
          </button>
        </div>
        <article class="experiment-focus">
          <div class="experiment-visual" :style="{ '--visual-position': featuredExperiment.visualPosition }" aria-hidden="true">
            <video v-if="!prefersReducedMotion && featuredExperiment.video" :key="featuredExperiment.video" class="experiment-video" autoplay muted loop playsinline preload="metadata" :poster="featuredExperiment.poster" tabindex="-1">
              <source :src="featuredExperiment.video" type="video/mp4">
            </video>
            <img v-else :key="featuredExperiment.poster" class="experiment-video-poster" :src="featuredExperiment.poster" alt="" draggable="false">
          </div>
          <Transition name="project-shift" mode="out-in">
            <div :key="featuredExperiment.id" class="experiment-story">
              <div class="experiment-story-main">
                <p class="eyebrow">Project {{ experimentNumber(featuredExperiment) }} of {{ String(experiments.length).padStart(2, "0") }}</p>
                <h3>{{ featuredExperiment.title }}</h3>
                <p>{{ featuredExperiment.description }}</p>
                <a :href="featuredExperiment.url" target="_blank" rel="noreferrer">Open repository <span aria-hidden="true">→</span></a>
              </div>
              <dl class="experiment-facts">
                <div><dt>State</dt><dd>{{ featuredExperiment.status }}</dd></div>
                <div><dt>Focus</dt><dd>{{ featuredExperiment.signal }}</dd></div>
                <div><dt>Field</dt><dd>{{ featuredExperiment.category }}</dd></div>
              </dl>
            </div>
          </Transition>
        </article>
      </div>
    </section>

    <section class="manifesto">
      <p>I do not begin by asking which field a problem belongs to.</p>
      <p>I begin by asking what experience should exist.</p>
    </section>

    <footer class="footer"><span>AI design experiments by Bum-Boo</span><a href="https://bumboo.fun">bumboo.fun ↗</a></footer>
  </main>
</template>
