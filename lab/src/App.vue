<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

const researchNodes = [
  { id: "ai", label: "AI", angle: -90, color: "vermilion", question: "How can intelligence become a material for everyday experience?" },
  { id: "cognition", label: "Cognition", angle: -30, color: "burgundy", question: "How do tools reshape attention, learning, and capability?" },
  { id: "design", label: "Design", angle: 30, color: "viridian", question: "How can complex systems become visible and humane?" },
  { id: "tools", label: "Tools", angle: 90, color: "vermilion", question: "Which medium makes this problem easier to touch?" },
  { id: "play", label: "Play", angle: 150, color: "burgundy", question: "Can serious technology still create surprise and delight?" },
  { id: "daily-life", label: "Daily life", angle: 210, color: "viridian", question: "What small friction is worth redesigning today?" },
];

const assetUrl = (file) => new URL(`${import.meta.env.BASE_URL}assets/${file}`, document.baseURI).href;
const experiments = [
  { id: "skill-library", title: "Hermes Skill Library", category: "agents", status: "Growing library", description: "Reusable behaviors that turn an agent into a practical collaborator.", url: "https://github.com/Bum-Boo/hermes-skill-library", signal: "Workflow intelligence", motionWord: "COMPOSE", accent: "#ef7f6d", video: assetUrl("experiment-material-loop.mp4"), videoFull: assetUrl("experiment-material-scroll-1080.mp4"), poster: assetUrl("experiment-material-loop-poster.webp"), visualPosition: "center", frames: 240 },
  { id: "bigloader", title: "BIGLOADER with AI Agent", category: "everyday", status: "Field test", description: "A non-developer-friendly Windows workspace for collecting and organizing media.", url: "https://github.com/Bum-Boo/BIGLOADER-with-Ai-agent", signal: "Less workflow friction", motionWord: "RELAY", accent: "#e7b35d", video: assetUrl("experiment-bigloader-relay-loop.mp4"), videoFull: assetUrl("experiment-bigloader-relay-scroll-1080.mp4"), poster: assetUrl("experiment-bigloader-relay-poster.webp"), visualPosition: "46% center", frames: 240 },
  { id: "change-gate", title: "Agent Change Gate", category: "agents", status: "Prototype", description: "A review-before-write layer that keeps durable AI changes inspectable.", url: "https://github.com/Bum-Boo/agent-change-gate", signal: "Human choice stays visible", motionWord: "REVIEW", accent: "#79a48f", video: assetUrl("experiment-change-gate-loop.mp4"), videoFull: assetUrl("experiment-change-gate-scroll-1080.mp4"), poster: assetUrl("experiment-change-gate-poster.webp"), visualPosition: "center", frames: 214 },
  { id: "desktop-korean", title: "Hermes Desktop Korean", category: "access", status: "Verified", description: "Localization as access design, backed by coverage and type checks.", url: "https://github.com/Bum-Boo/hermes-desktop-korean", signal: "Language as interface", motionWord: "LOCALIZE", accent: "#ce7e87", video: null, videoFull: null, poster: assetUrl("experiment-language-hanji-poster.webp"), visualPosition: "56% center", frames: 0 },
  { id: "bbcc", title: "BBCC", category: "everyday", status: "Working tool", description: "Controller shortcuts that turn repeated creative actions into muscle memory.", url: "https://github.com/Bum-Boo/BBCC", signal: "Physical interaction", motionWord: "TOUCH", accent: "#e08b53", video: assetUrl("experiment-bbcc-sukajan-loop.mp4"), videoFull: assetUrl("experiment-bbcc-sukajan-scroll-1080.mp4"), poster: assetUrl("experiment-bbcc-sukajan-poster.webp"), visualPosition: "center", frames: 234 },
  { id: "bts-sec", title: "BTS Sec", category: "safety", status: "Toolkit", description: "Defensive review tools for authorized projects and visible risk boundaries.", url: "https://github.com/Bum-Boo/BTS_sec", signal: "Trust by inspection", motionWord: "INSPECT", accent: "#d65f66", video: assetUrl("experiment-bts-tiger-v2-loop.mp4"), videoFull: assetUrl("experiment-bts-tiger-v2-scroll-1080.mp4"), poster: assetUrl("experiment-bts-tiger-v2-poster.webp"), visualPosition: "58% center", frames: 240 },
];

const filters = ["all", "agents", "everyday", "access", "safety"];
const activeNode = ref("daily-life");
const activeFilter = ref("all");
const activeExperiment = ref(experiments[0].id);
const prefersReducedMotion = ref(false);
const viewportWidth = ref(1280);
const scrubTrack = ref(null);
const scrubVideo = ref(null);
const scrubProgress = ref(0);
let motionPreference;
let scrollAnimationFrame = 0;
let trackObserver = null;
let trackInRange = true;
let targetProgress = 0;
let lastScrubTimestamp = 0;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const selectedNode = computed(() => researchNodes.find((node) => node.id === activeNode.value));
const visibleExperiments = computed(() => experiments.filter((item) => activeFilter.value === "all" || item.category === activeFilter.value));
const featuredExperiment = computed(() => visibleExperiments.value.find((item) => item.id === activeExperiment.value) ?? visibleExperiments.value[0]);
const hasScrubVideo = computed(() => !prefersReducedMotion.value && Boolean(featuredExperiment.value.video));
const totalFrames = computed(() => Math.max(1, featuredExperiment.value.frames || 1));
const scrubPercent = computed(() => Math.round(scrubProgress.value * 100));
const scrubDistance = computed(() => {
  if (!hasScrubVideo.value) return 0;
  const mobile = viewportWidth.value < 700;
  return Math.round(clamp(totalFrames.value * (mobile ? 5 : 6.5), mobile ? 980 : 1200, mobile ? 1400 : 1800));
});
const scrubTrackStyle = computed(() => ({ "--scrub-distance": `${scrubDistance.value}px` }));
const titleWords = computed(() => featuredExperiment.value.title.split(" "));
const stageMotionStyle = computed(() => {
  const progress = scrubProgress.value;
  const factsReveal = clamp((progress - 0.12) / 0.3, 0, 1);
  const linkReveal = clamp((progress - 0.42) / 0.35, 0, 1);
  const motionArc = Math.sin(progress * Math.PI);
  return {
    "--project-accent": featuredExperiment.value.accent,
    "--film-progress": progress.toFixed(4),
    "--video-scale": (1.075 - progress * 0.045).toFixed(4),
    "--video-x": `${1.5 - progress * 3}%`,
    "--video-y": `${-0.5 + progress}%`,
    "--kinetic-x": `${62 - progress * 124}%`,
    "--kinetic-rotate": `${-5 + progress * 9}deg`,
    "--kinetic-opacity": (0.06 + motionArc * 0.14).toFixed(3),
    "--wash-x": `${18 + progress * 64}%`,
    "--wash-opacity": (0.14 + motionArc * 0.2).toFixed(3),
    "--story-y": `${-progress * 38}px`,
    "--copy-opacity": (1 - clamp((progress - 0.58) / 0.32, 0, 1) * 0.7).toFixed(3),
    "--facts-y": `${(1 - factsReveal) * 44}px`,
    "--facts-opacity": factsReveal.toFixed(3),
    "--link-x": `${(1 - linkReveal) * -26}px`,
    "--link-opacity": (0.45 + linkReveal * 0.55).toFixed(3),
    "--skip-opacity": (0.52 + clamp((progress - 0.62) / 0.25, 0, 1) * 0.48).toFixed(3),
  };
});
const experimentNumber = (item) => String(experiments.findIndex((experiment) => experiment.id === item.id) + 1).padStart(2, "0");

const updateScrub = (timestamp) => {
  scrollAnimationFrame = 0;
  const track = scrubTrack.value;
  const video = scrubVideo.value;
  if (!track || !video || !hasScrubVideo.value) {
    lastScrubTimestamp = 0;
    return;
  }
  const distance = Math.max(1, track.offsetHeight - window.innerHeight);
  targetProgress = clamp(-track.getBoundingClientRect().top / distance, 0, 1);
  const elapsed = lastScrubTimestamp ? Math.min(64, timestamp - lastScrubTimestamp) : 16;
  lastScrubTimestamp = timestamp;
  const easing = 1 - Math.exp(-elapsed / 110);
  const progressDelta = targetProgress - scrubProgress.value;
  const easedDelta = progressDelta * easing;
  const maxProgressStep = elapsed / 720;
  const appliedDelta = clamp(easedDelta, -maxProgressStep, maxProgressStep);
  scrubProgress.value = Math.abs(progressDelta) < 0.0004 ? targetProgress : scrubProgress.value + appliedDelta;
  let videoPending = false;
  if (video.readyState >= 1 && Number.isFinite(video.duration)) {
    const desiredTime = scrubProgress.value * Math.max(0, video.duration - 0.021);
    const videoDelta = desiredTime - video.currentTime;
    videoPending = Math.abs(videoDelta) > 0.012;
    if (!video.seeking && videoPending) {
      video.currentTime += clamp(videoDelta, -0.32, 0.32);
    }
  }
  if (trackInRange && (Math.abs(targetProgress - scrubProgress.value) > 0.0005 || videoPending)) {
    scrollAnimationFrame = window.requestAnimationFrame(updateScrub);
  } else {
    lastScrubTimestamp = 0;
  }
};

const scheduleScrub = () => {
  if (trackInRange && !scrollAnimationFrame) {
    lastScrubTimestamp = 0;
    scrollAnimationFrame = window.requestAnimationFrame(updateScrub);
  }
};

const syncMotionPreference = (event) => {
  prefersReducedMotion.value = event?.matches ?? motionPreference?.matches ?? false;
  nextTick(scheduleScrub);
};

const syncViewport = () => {
  viewportWidth.value = window.innerWidth;
  scheduleScrub();
};

const onVideoMetadata = () => {
  const video = scrubVideo.value;
  if (!video) return;
  video.pause();
  scheduleScrub();
};

const setExperimentFilter = (filter) => {
  activeFilter.value = filter;
  activeExperiment.value = experiments.find((item) => filter === "all" || item.category === filter)?.id;
};

const nodePosition = (node) => {
  const radius = 41;
  const radians = node.angle * Math.PI / 180;
  return { left: `${50 + Math.cos(radians) * radius}%`, top: `${50 + Math.sin(radians) * radius}%` };
};

watch(() => featuredExperiment.value.id, async () => {
  targetProgress = 0;
  scrubProgress.value = 0;
  lastScrubTimestamp = 0;
  await nextTick();
  scheduleScrub();
});

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  syncMotionPreference(motionPreference);
  if (motionPreference.addEventListener) motionPreference.addEventListener("change", syncMotionPreference);
  else motionPreference.addListener(syncMotionPreference);
  viewportWidth.value = window.innerWidth;
  window.addEventListener("scroll", scheduleScrub, { passive: true });
  window.addEventListener("resize", syncViewport, { passive: true });
  trackObserver = new IntersectionObserver(([entry]) => {
    trackInRange = entry.isIntersecting;
    if (trackInRange) scheduleScrub();
    else if (scrollAnimationFrame) {
      window.cancelAnimationFrame(scrollAnimationFrame);
      scrollAnimationFrame = 0;
      lastScrubTimestamp = 0;
    }
  }, { rootMargin: "100% 0px" });
  if (scrubTrack.value) trackObserver.observe(scrubTrack.value);
  scheduleScrub();
});

onBeforeUnmount(() => {
  if (scrollAnimationFrame) window.cancelAnimationFrame(scrollAnimationFrame);
  window.removeEventListener("scroll", scheduleScrub);
  window.removeEventListener("resize", syncViewport);
  trackObserver?.disconnect();
  if (!motionPreference) return;
  if (motionPreference.removeEventListener) motionPreference.removeEventListener("change", syncMotionPreference);
  else motionPreference.removeListener(syncMotionPreference);
});
</script>

<template>
  <main>
    <header class="hero" :style="{ '--hero-image': `url(${assetUrl('banner.webp')})` }">
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
        <img :src="assetUrl('material-field.webp')" alt="Tactile collage of paper, copper wire, circuit traces, and colored material samples">
        <figcaption>Material study 01 · Signals, surfaces, and imperfect connections</figcaption>
      </figure>
      <figure class="material-sample">
        <img :src="assetUrl('material-study.webp')" alt="Tabletop study of vellum, graphite, thread, circuit fragments, and hand-cut paper">
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
        <p>Choose a project, then scroll to let image, type, and story move together. Continue whenever you want.</p>
      </div>
      <div class="filter-bar" aria-label="Filter experiments">
        <button v-for="item in filters" :key="item" :class="{ selected: activeFilter === item }" :aria-pressed="activeFilter === item" @click="setExperimentFilter(item)">{{ item }}</button>
      </div>
      <div class="experiment-index" aria-label="Choose an experiment">
        <button v-for="item in visibleExperiments" :key="item.id" class="experiment-select" :class="{ selected: featuredExperiment.id === item.id }" :style="{ '--item-accent': item.accent }" :aria-pressed="featuredExperiment.id === item.id" @click="activeExperiment = item.id">
          <span class="experiment-number">{{ experimentNumber(item) }}</span>
          <span class="experiment-label"><strong>{{ item.title }}</strong><small>{{ item.signal }}</small></span>
          <span class="experiment-arrow" aria-hidden="true">→</span>
        </button>
      </div>
      <article ref="scrubTrack" class="experiment-scroll-track" :class="{ 'is-static': !hasScrubVideo }" :style="scrubTrackStyle" :data-progress="scrubProgress.toFixed(3)">
        <div class="experiment-focus" :style="stageMotionStyle">
          <div class="experiment-visual" :style="{ '--visual-position': featuredExperiment.visualPosition }" aria-hidden="true">
            <video v-if="hasScrubVideo" ref="scrubVideo" :key="featuredExperiment.id" class="experiment-video" muted playsinline preload="auto" :poster="featuredExperiment.poster" tabindex="-1" @loadedmetadata="onVideoMetadata" @loadeddata="scheduleScrub">
              <source v-if="featuredExperiment.videoFull" :src="featuredExperiment.videoFull" media="(min-width: 900px)" type="video/mp4">
              <source :src="featuredExperiment.video" type="video/mp4">
            </video>
            <img v-else :key="featuredExperiment.poster" class="experiment-video-poster" :src="featuredExperiment.poster" alt="" draggable="false">
            <div class="experiment-wash" />
            <div class="experiment-visual-shade" />
            <p class="kinetic-word">{{ featuredExperiment.motionWord }}</p>
          </div>
          <Transition name="project-shift" mode="out-in">
            <div :key="featuredExperiment.id" class="experiment-story">
              <div class="experiment-story-main">
                <p class="eyebrow"><span>Project {{ experimentNumber(featuredExperiment) }}</span><span>{{ featuredExperiment.signal }}</span></p>
                <h3 :aria-label="featuredExperiment.title"><span v-for="(word, index) in titleWords" :key="`${word}-${index}`" class="experiment-title-word" :style="{ '--word-index': index }">{{ word }}</span></h3>
                <p class="experiment-description">{{ featuredExperiment.description }}</p>
                <a class="experiment-link" :href="featuredExperiment.url" target="_blank" rel="noreferrer">Open repository <span aria-hidden="true">↗</span></a>
              </div>
              <dl class="experiment-facts">
                <div><dt>State</dt><dd>{{ featuredExperiment.status }}</dd></div>
                <div><dt>Focus</dt><dd>{{ featuredExperiment.signal }}</dd></div>
                <div><dt>Field</dt><dd>{{ featuredExperiment.category }}</dd></div>
              </dl>
            </div>
          </Transition>
          <div v-if="hasScrubVideo" class="stage-guide">
            <span>Scroll</span>
            <div class="stage-progress" role="progressbar" aria-label="Story progress" :aria-valuemin="0" :aria-valuemax="100" :aria-valuenow="scrubPercent" :aria-valuetext="`${scrubPercent}% through ${featuredExperiment.title}`">
              <span :style="{ transform: `scaleX(${scrubProgress})` }" />
            </div>
          </div>
          <a class="stage-skip" href="#after-experiments">Continue <span aria-hidden="true">↓</span></a>
          <p v-if="prefersReducedMotion && featuredExperiment.video" class="motion-note">Motion is reduced. A still frame is shown instead.</p>
        </div>
      </article>
    </section>

    <section id="after-experiments" class="manifesto">
      <p>I do not begin by asking which field a problem belongs to.</p>
      <p>I begin by asking what experience should exist.</p>
    </section>

    <footer class="footer"><span>AI design experiments by Bum-Boo</span><a href="https://bumboo.fun">bumboo.fun ↗</a></footer>
  </main>
</template>
