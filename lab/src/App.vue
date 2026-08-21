<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Input, MP4, UrlSource, VideoSampleSink } from "mediabunny";

const researchNodes = [
  { id: "ai", label: "AI", angle: -90, color: "vermilion", question: "How can intelligence become a material for everyday experience?" },
  { id: "cognition", label: "Cognition", angle: -30, color: "burgundy", question: "How do tools reshape attention, learning, and capability?" },
  { id: "design", label: "Design", angle: 30, color: "viridian", question: "How can complex systems become visible and humane?" },
  { id: "tools", label: "Tools", angle: 90, color: "vermilion", question: "Which medium makes this problem easier to touch?" },
  { id: "play", label: "Play", angle: 150, color: "burgundy", question: "Can serious technology still create surprise and delight?" },
  { id: "daily-life", label: "Daily life", angle: 210, color: "viridian", question: "What small friction is worth redesigning today?" },
];

const practiceModes = [
  { id: "observe", index: "01", label: "Observe", statement: "Notice the friction before naming the technology.", accent: "#ef7f6d", x: 75, y: 20 },
  { id: "connect", index: "02", label: "Connect", statement: "Let cognition, material, and code inform one another.", accent: "#79a48f", x: 88, y: 40 },
  { id: "prototype", index: "03", label: "Prototype", statement: "Make the question tangible enough to test.", accent: "#e7b35d", x: 76, y: 68 },
  { id: "return", index: "04", label: "Return", statement: "Keep choice visible and hand control back.", accent: "#ce7e87", x: 51, y: 80 },
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
const activePracticeMode = ref(practiceModes[0].id);
const activeFilter = ref("all");
const activeExperiment = ref(experiments[0].id);
const prefersReducedMotion = ref(false);
const viewportWidth = ref(1280);
const scrubTrack = ref(null);
const scrubVideo = ref(null);
const scrubCanvas = ref(null);
const heroSection = ref(null);
const materialStudy = ref(null);
const manifestoSection = ref(null);
const scrubProgress = ref(0);
const compositorReady = ref(false);
const compositorBackend = ref("media");
let motionPreference;
let pointerMotionPreference;
let scrollAnimationFrame = 0;
let trackObserver = null;
let trackInRange = true;
let targetProgress = 0;
let lastScrubTimestamp = 0;
let scrubVelocity = 0;
let decoderGeneration = 0;
let activeSeekToken = 0;
let seekInFlight = false;
let pendingMediaTime = 0;
let frameCallbackId = null;
let seekFallbackFrame = 0;
let compositorContext = null;
let compositorStats = { issued: 0, committed: 0, dropped: 0, coalesced: 0 };
let compositorDuration = 0;
let webCodecInput = null;
let webCodecSink = null;
let webCodecInFlight = false;
let webCodecInitializing = false;
let webCodecSource = null;
let webCodecLastFrame = -1;
let heroPointerFrame = 0;
let materialPointerFrame = 0;
let manifestoPointerFrame = 0;
let pageMotionFrame = 0;
let heroPointerTarget = { x: 0, y: 0 };
let materialPointerTarget = { x: 0, y: 0 };
let manifestoPointerTarget = { x: 0, y: 0 };

const SEEK_THRESHOLD = 1 / 48;
const STALE_FRAME_TOLERANCE = 0.45;
const MAX_WEB_CODEC_FRAME_LEAP = 36;
const SPRING_STIFFNESS = 185;
const SPRING_DAMPING = 2 * Math.sqrt(SPRING_STIFFNESS);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const selectedNode = computed(() => researchNodes.find((node) => node.id === activeNode.value));
const selectedPracticeMode = computed(() => practiceModes.find((mode) => mode.id === activePracticeMode.value) ?? practiceModes[0]);
const heroStyle = computed(() => ({
  "--hero-image": `url(${assetUrl("banner.webp")})`,
  "--hero-accent": selectedPracticeMode.value.accent,
  "--hero-mode-x": `${selectedPracticeMode.value.x}%`,
  "--hero-mode-y": `${selectedPracticeMode.value.y}%`,
}));
const orbitStageStyle = computed(() => {
  const angle = selectedNode.value.angle;
  const radians = angle * Math.PI / 180;
  const accents = { viridian: "#4b8e78", vermilion: "#ee695d", burgundy: "#8b2345" };
  return {
    "--orbit-a": `${-12 + angle * 0.07}deg`,
    "--orbit-b": `${28 - angle * 0.05}deg`,
    "--orbit-core-x": `${Math.cos(radians) * 10}px`,
    "--orbit-core-y": `${Math.sin(radians) * 10}px`,
    "--orbit-accent": accents[selectedNode.value.color],
  };
});
const visibleExperiments = computed(() => experiments.filter((item) => activeFilter.value === "all" || item.category === activeFilter.value));
const featuredExperiment = computed(() => visibleExperiments.value.find((item) => item.id === activeExperiment.value) ?? visibleExperiments.value[0]);
const hasScrubVideo = computed(() => !prefersReducedMotion.value && Boolean(featuredExperiment.value.video));
const activeVideoSource = computed(() => viewportWidth.value >= 900 && featuredExperiment.value.videoFull
  ? featuredExperiment.value.videoFull
  : featuredExperiment.value.video);
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

const updateCompositorMetrics = () => {
  const track = scrubTrack.value;
  if (!track) return;
  track.dataset.compositor = compositorBackend.value;
  track.dataset.mediaTime = Number.isFinite(pendingMediaTime) ? pendingMediaTime.toFixed(3) : "0.000";
  track.dataset.seekIssued = String(compositorStats.issued);
  track.dataset.frameCommitted = String(compositorStats.committed);
  track.dataset.frameDropped = String(compositorStats.dropped);
  track.dataset.seekCoalesced = String(compositorStats.coalesced);
};

const resetFrameCompositor = () => {
  const video = scrubVideo.value;
  decoderGeneration += 1;
  activeSeekToken += 1;
  if (video && frameCallbackId !== null && video.cancelVideoFrameCallback) {
    video.cancelVideoFrameCallback(frameCallbackId);
  }
  if (seekFallbackFrame) window.cancelAnimationFrame(seekFallbackFrame);
  frameCallbackId = null;
  seekFallbackFrame = 0;
  seekInFlight = false;
  pendingMediaTime = 0;
  compositorDuration = 0;
  compositorContext = null;
  webCodecInput?.dispose();
  webCodecInput = null;
  webCodecSink = null;
  webCodecInFlight = false;
  webCodecInitializing = false;
  webCodecSource = null;
  webCodecLastFrame = -1;
  compositorBackend.value = "media";
  compositorReady.value = false;
  compositorStats = { issued: 0, committed: 0, dropped: 0, coalesced: 0 };
  updateCompositorMetrics();
};

const prepareCompositorContext = (width, height) => {
  const canvas = scrubCanvas.value;
  if (!canvas || !width || !height) return null;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    compositorContext = null;
  }
  compositorContext ??= canvas.getContext("2d", { alpha: false, desynchronized: true });
  return compositorContext;
};

const commitCompositorFrame = (mediaTime) => {
  compositorReady.value = true;
  compositorStats.committed += 1;
  const track = scrubTrack.value;
  if (track) track.dataset.committedTime = mediaTime.toFixed(3);
};

const drawDecodedFrame = (video, mediaTime = video.currentTime) => {
  const compositor = prepareCompositorContext(video.videoWidth, video.videoHeight);
  const canvas = scrubCanvas.value;
  if (!compositor || !canvas) return false;
  compositor.drawImage(video, 0, 0, canvas.width, canvas.height);
  commitCompositorFrame(mediaTime);
  return true;
};

const drawWebCodecFrame = (sample) => {
  const compositor = prepareCompositorContext(sample.displayWidth, sample.displayHeight);
  const canvas = scrubCanvas.value;
  if (!compositor || !canvas) return false;
  sample.draw(compositor, 0, 0, canvas.width, canvas.height);
  commitCompositorFrame(sample.timestamp);
  return true;
};

const pumpFrameDecoder = () => {
  const video = scrubVideo.value;
  if (compositorBackend.value === "webcodecs" || !video || !hasScrubVideo.value || video.readyState < 1 || !Number.isFinite(video.duration) || seekInFlight || video.seeking) return;
  const desiredTime = clamp(pendingMediaTime, 0, Math.max(0, video.duration - 0.021));
  if (Math.abs(video.currentTime - desiredTime) <= SEEK_THRESHOLD) {
    if (!compositorReady.value && video.readyState >= 2) drawDecodedFrame(video, video.currentTime);
    updateCompositorMetrics();
    return;
  }

  seekInFlight = true;
  const generation = decoderGeneration;
  const token = ++activeSeekToken;
  compositorStats.issued += 1;
  updateCompositorMetrics();

  const finishDecodedFrame = (mediaTime) => {
    if (generation !== decoderGeneration || token !== activeSeekToken || video !== scrubVideo.value || !seekInFlight) return;
    if (frameCallbackId !== null && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frameCallbackId);
    if (seekFallbackFrame) window.cancelAnimationFrame(seekFallbackFrame);
    frameCallbackId = null;
    seekFallbackFrame = 0;
    const stale = compositorReady.value && Math.abs(pendingMediaTime - mediaTime) > STALE_FRAME_TOLERANCE;
    if (stale) compositorStats.dropped += 1;
    else drawDecodedFrame(video, mediaTime);
    seekInFlight = false;
    updateCompositorMetrics();
    if (Math.abs(pendingMediaTime - mediaTime) > SEEK_THRESHOLD) {
      window.requestAnimationFrame(pumpFrameDecoder);
    }
  };

  if (video.requestVideoFrameCallback) {
    frameCallbackId = video.requestVideoFrameCallback((_now, metadata) => finishDecodedFrame(metadata.mediaTime));
  }
  video.addEventListener("seeked", () => {
    if (generation !== decoderGeneration || token !== activeSeekToken) return;
    if (!seekInFlight) {
      window.requestAnimationFrame(pumpFrameDecoder);
      return;
    }
    seekFallbackFrame = window.requestAnimationFrame(() => finishDecodedFrame(video.currentTime));
  }, { once: true });

  try {
    video.currentTime = desiredTime;
  } catch {
    seekInFlight = false;
    frameCallbackId = null;
  }
};

const useMediaFallback = (generation) => {
  if (generation !== decoderGeneration) return;
  webCodecInput?.dispose();
  webCodecInput = null;
  webCodecSink = null;
  webCodecInFlight = false;
  webCodecInitializing = false;
  webCodecSource = null;
  webCodecLastFrame = -1;
  compositorBackend.value = "media";
  const video = scrubVideo.value;
  if (video && Number.isFinite(video.duration)) compositorDuration = video.duration;
  updateCompositorMetrics();
  pumpFrameDecoder();
};

const pumpWebCodecDecoder = async () => {
  if (compositorBackend.value !== "webcodecs" || !webCodecSink || webCodecInFlight || !hasScrubVideo.value) return;
  const generation = decoderGeneration;
  const frameCount = totalFrames.value;
  const frameDuration = compositorDuration / frameCount;
  const targetFrame = clamp(Math.round(pendingMediaTime / frameDuration), 0, frameCount - 1);
  const targetDelta = targetFrame - webCodecLastFrame;
  const requestFrame = webCodecLastFrame >= 0 && Math.abs(targetDelta) > MAX_WEB_CODEC_FRAME_LEAP
    ? webCodecLastFrame + Math.sign(targetDelta) * MAX_WEB_CODEC_FRAME_LEAP
    : targetFrame;
  if (requestFrame === webCodecLastFrame && compositorReady.value) return;
  const requestTime = Math.min(compositorDuration - 0.001, (requestFrame + 0.5) * frameDuration);
  webCodecInFlight = true;
  compositorStats.issued += 1;
  updateCompositorMetrics();

  let sample = null;
  try {
    sample = await webCodecSink.getSample(requestTime);
    if (generation !== decoderGeneration || compositorBackend.value !== "webcodecs") return;
    if (!sample) throw new Error("No decoded frame returned");
    const latestFrame = clamp(Math.round(pendingMediaTime / frameDuration), 0, frameCount - 1);
    const stale = webCodecLastFrame >= 0
      && Math.abs(latestFrame - requestFrame) >= Math.abs(latestFrame - webCodecLastFrame);
    if (stale) compositorStats.dropped += 1;
    else {
      drawWebCodecFrame(sample);
      webCodecLastFrame = requestFrame;
    }
  } catch (error) {
    if (import.meta.env.DEV) console.warn("WebCodecs frame decode fell back to media", error);
    if (generation === decoderGeneration) useMediaFallback(generation);
    return;
  } finally {
    sample?.close();
    if (generation === decoderGeneration) webCodecInFlight = false;
  }

  updateCompositorMetrics();
  const latestFrame = clamp(Math.round(pendingMediaTime / frameDuration), 0, frameCount - 1);
  if (latestFrame !== requestFrame) {
    window.requestAnimationFrame(pumpWebCodecDecoder);
  }
};

const initializeWebCodecCompositor = async () => {
  const source = activeVideoSource.value;
  const supportsWebCodecs = typeof window.VideoDecoder === "function" && typeof window.VideoFrame === "function";
  if (!supportsWebCodecs || !source || !hasScrubVideo.value || webCodecInitializing || webCodecSource === source) return;

  const generation = decoderGeneration;
  const input = new Input({ formats: [MP4], source: new UrlSource(source) });
  webCodecInitializing = true;
  webCodecSource = source;
  compositorBackend.value = "initializing";
  updateCompositorMetrics();

  try {
    if (!await input.canRead()) throw new Error("Unreadable MP4 input");
    const track = await input.getPrimaryVideoTrack();
    if (!track || !await track.canDecode()) throw new Error("Unsupported video decoder");
    const [width, height, metadataDuration] = await Promise.all([
      track.getDisplayWidth(),
      track.getDisplayHeight(),
      track.getDurationFromMetadata(),
    ]);
    const duration = metadataDuration ?? await track.computeDuration();
    if (generation !== decoderGeneration || source !== activeVideoSource.value) {
      input.dispose();
      return;
    }

    const video = scrubVideo.value;
    activeSeekToken += 1;
    if (video && frameCallbackId !== null && video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(frameCallbackId);
    if (seekFallbackFrame) window.cancelAnimationFrame(seekFallbackFrame);
    frameCallbackId = null;
    seekFallbackFrame = 0;
    seekInFlight = false;

    webCodecInput?.dispose();
    webCodecInput = input;
    webCodecSink = new VideoSampleSink(track, { optimizeForLatency: true });
    compositorDuration = duration;
    compositorBackend.value = "webcodecs";
    prepareCompositorContext(width, height);
    pendingMediaTime = scrubProgress.value * Math.max(0, duration - 0.021);
    updateCompositorMetrics();
    pumpWebCodecDecoder();
  } catch (error) {
    if (import.meta.env.DEV) console.warn("WebCodecs compositor initialization fell back to media", error);
    input.dispose();
    useMediaFallback(generation);
  } finally {
    if (generation === decoderGeneration) webCodecInitializing = false;
  }
};

const requestCompositeFrame = (mediaTime) => {
  const previousTarget = pendingMediaTime;
  pendingMediaTime = mediaTime;
  if (seekInFlight && Math.abs(previousTarget - mediaTime) > SEEK_THRESHOLD) compositorStats.coalesced += 1;
  if (webCodecInFlight && Math.abs(previousTarget - mediaTime) > SEEK_THRESHOLD) compositorStats.coalesced += 1;
  updateCompositorMetrics();
  if (compositorBackend.value === "webcodecs") pumpWebCodecDecoder();
  else pumpFrameDecoder();
};

const updateScrub = (timestamp) => {
  scrollAnimationFrame = 0;
  const track = scrubTrack.value;
  if (!track || !hasScrubVideo.value) {
    lastScrubTimestamp = 0;
    return;
  }
  const distance = Math.max(1, track.offsetHeight - window.innerHeight);
  targetProgress = clamp(-track.getBoundingClientRect().top / distance, 0, 1);
  const elapsed = lastScrubTimestamp ? Math.min(50, timestamp - lastScrubTimestamp) : 16;
  lastScrubTimestamp = timestamp;
  const totalDelta = elapsed / 1000;
  const steps = Math.max(1, Math.ceil(totalDelta / (1 / 120)));
  const stepDelta = totalDelta / steps;
  let progress = scrubProgress.value;
  for (let index = 0; index < steps; index += 1) {
    const acceleration = SPRING_STIFFNESS * (targetProgress - progress) - SPRING_DAMPING * scrubVelocity;
    scrubVelocity += acceleration * stepDelta;
    progress += scrubVelocity * stepDelta;
  }
  progress = clamp(progress, 0, 1);
  const springSettled = Math.abs(targetProgress - progress) < 0.0004 && Math.abs(scrubVelocity) < 0.001;
  if (springSettled) {
    progress = targetProgress;
    scrubVelocity = 0;
  }
  scrubProgress.value = progress;
  if (compositorDuration > 0) {
    requestCompositeFrame(progress * Math.max(0, compositorDuration - 0.021));
  }
  if (trackInRange && !springSettled) {
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

const sectionProgress = (element) => {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height), 0, 1);
};

const updatePageMotion = () => {
  pageMotionFrame = 0;
  const hero = heroSection.value;
  if (hero) {
    const rect = hero.getBoundingClientRect();
    const progress = clamp(-rect.top / Math.max(1, rect.height), 0, 1);
    hero.style.setProperty("--hero-scroll-y", `${progress * 22}px`);
    hero.style.setProperty("--hero-copy-y", `${progress * -20}px`);
    hero.style.setProperty("--hero-practice-y", `${progress * -10}px`);
  }

  const material = materialStudy.value;
  if (material) {
    const progress = sectionProgress(material);
    material.style.setProperty("--material-field-y", `${(0.48 - progress) * 70}px`);
    material.style.setProperty("--material-sample-y", `${(0.52 - progress) * -82}px`);
    material.style.setProperty("--material-copy-y", `${(0.6 - progress) * 46}px`);
    material.style.setProperty("--material-index-x", `${(progress - 0.5) * -44}px`);
  }

  const manifesto = manifestoSection.value;
  if (manifesto) {
    const progress = sectionProgress(manifesto);
    manifesto.style.setProperty("--manifesto-left-y", `${(0.5 - progress) * 44}px`);
    manifesto.style.setProperty("--manifesto-right-y", `${(0.5 - progress) * -44}px`);
  }
};

const schedulePageMotion = () => {
  if (!pageMotionFrame) pageMotionFrame = window.requestAnimationFrame(updatePageMotion);
};

const pointerCoordinates = (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: clamp(((event.clientX - rect.left) / Math.max(1, rect.width)) * 2 - 1, -1, 1),
    y: clamp(((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 - 1, -1, 1),
  };
};

const allowsPointerMotion = (event) => !prefersReducedMotion.value
  && event.pointerType !== "touch"
  && (pointerMotionPreference?.matches ?? false);

const renderHeroPointer = () => {
  heroPointerFrame = 0;
  const hero = heroSection.value;
  if (!hero) return;
  const { x, y } = heroPointerTarget;
  hero.style.setProperty("--hero-bg-x", `${x * -12}px`);
  hero.style.setProperty("--hero-bg-y", `${y * -8}px`);
  hero.style.setProperty("--hero-lens-x", `${x * 34}px`);
  hero.style.setProperty("--hero-lens-y", `${y * 26}px`);
  hero.style.setProperty("--hero-thread-x", `${x * 18}px`);
  hero.style.setProperty("--hero-thread-y", `${y * 12}px`);
  hero.style.setProperty("--hero-point-x", `${x * -9}px`);
  hero.style.setProperty("--hero-point-y", `${y * -7}px`);
};

const updateHeroPointer = (event) => {
  if (!allowsPointerMotion(event)) return;
  heroPointerTarget = pointerCoordinates(event);
  if (!heroPointerFrame) heroPointerFrame = window.requestAnimationFrame(renderHeroPointer);
};

const resetHeroPointer = () => {
  heroPointerTarget = { x: 0, y: 0 };
  if (!heroPointerFrame) heroPointerFrame = window.requestAnimationFrame(renderHeroPointer);
};

const renderMaterialPointer = () => {
  materialPointerFrame = 0;
  const material = materialStudy.value;
  if (!material) return;
  const { x, y } = materialPointerTarget;
  material.style.setProperty("--material-field-x", `${x * -8}px`);
  material.style.setProperty("--material-field-pointer-y", `${y * -7}px`);
  material.style.setProperty("--material-sample-x", `${x * 15}px`);
  material.style.setProperty("--material-sample-pointer-y", `${y * 12}px`);
};

const updateMaterialPointer = (event) => {
  if (!allowsPointerMotion(event)) return;
  materialPointerTarget = pointerCoordinates(event);
  if (!materialPointerFrame) materialPointerFrame = window.requestAnimationFrame(renderMaterialPointer);
};

const resetMaterialPointer = () => {
  materialPointerTarget = { x: 0, y: 0 };
  if (!materialPointerFrame) materialPointerFrame = window.requestAnimationFrame(renderMaterialPointer);
};

const renderManifestoPointer = () => {
  manifestoPointerFrame = 0;
  const manifesto = manifestoSection.value;
  if (!manifesto) return;
  const { x, y } = manifestoPointerTarget;
  manifesto.style.setProperty("--manifesto-seam-x", `${50 + x * 7}%`);
  manifesto.style.setProperty("--manifesto-glow-x", `${50 + x * 32}%`);
  manifesto.style.setProperty("--manifesto-left-x", `${x * -9}px`);
  manifesto.style.setProperty("--manifesto-right-x", `${x * 9}px`);
  manifesto.style.setProperty("--manifesto-glow-y", `${50 + y * 24}%`);
};

const updateManifestoPointer = (event) => {
  if (!allowsPointerMotion(event)) return;
  manifestoPointerTarget = pointerCoordinates(event);
  if (!manifestoPointerFrame) manifestoPointerFrame = window.requestAnimationFrame(renderManifestoPointer);
};

const resetManifestoPointer = () => {
  manifestoPointerTarget = { x: 0, y: 0 };
  if (!manifestoPointerFrame) manifestoPointerFrame = window.requestAnimationFrame(renderManifestoPointer);
};

const activateResearchNode = (node, event) => {
  if (event.type === "focus" || event.type === "click" || event.pointerType !== "touch") activeNode.value = node.id;
};

const syncMotionPreference = (event) => {
  resetFrameCompositor();
  prefersReducedMotion.value = event?.matches ?? motionPreference?.matches ?? false;
  nextTick(() => {
    scheduleScrub();
    schedulePageMotion();
  });
};

const syncViewport = () => {
  viewportWidth.value = window.innerWidth;
  scheduleScrub();
  schedulePageMotion();
};

const onVideoMetadata = () => {
  const video = scrubVideo.value;
  if (!video) return;
  video.pause();
  compositorDuration = video.duration;
  initializeWebCodecCompositor();
  scheduleScrub();
};

const onVideoData = () => {
  const video = scrubVideo.value;
  if (!video) return;
  if (compositorBackend.value !== "webcodecs") drawDecodedFrame(video, video.currentTime);
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

watch(() => [featuredExperiment.value.id, activeVideoSource.value], async () => {
  resetFrameCompositor();
  targetProgress = 0;
  scrubProgress.value = 0;
  scrubVelocity = 0;
  lastScrubTimestamp = 0;
  await nextTick();
  initializeWebCodecCompositor();
  scheduleScrub();
});

onMounted(() => {
  motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
  pointerMotionPreference = window.matchMedia("(hover: hover) and (pointer: fine)");
  syncMotionPreference(motionPreference);
  if (motionPreference.addEventListener) motionPreference.addEventListener("change", syncMotionPreference);
  else motionPreference.addListener(syncMotionPreference);
  viewportWidth.value = window.innerWidth;
  window.addEventListener("scroll", scheduleScrub, { passive: true });
  window.addEventListener("scroll", schedulePageMotion, { passive: true });
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
  schedulePageMotion();
});

onBeforeUnmount(() => {
  resetFrameCompositor();
  if (scrollAnimationFrame) window.cancelAnimationFrame(scrollAnimationFrame);
  if (heroPointerFrame) window.cancelAnimationFrame(heroPointerFrame);
  if (materialPointerFrame) window.cancelAnimationFrame(materialPointerFrame);
  if (manifestoPointerFrame) window.cancelAnimationFrame(manifestoPointerFrame);
  if (pageMotionFrame) window.cancelAnimationFrame(pageMotionFrame);
  window.removeEventListener("scroll", scheduleScrub);
  window.removeEventListener("scroll", schedulePageMotion);
  window.removeEventListener("resize", syncViewport);
  trackObserver?.disconnect();
  if (!motionPreference) return;
  if (motionPreference.removeEventListener) motionPreference.removeEventListener("change", syncMotionPreference);
  else motionPreference.removeListener(syncMotionPreference);
});
</script>

<template>
  <main>
    <header ref="heroSection" class="hero" :style="heroStyle" @pointermove="updateHeroPointer" @pointerleave="resetHeroPointer">
      <div class="hero-response-field" aria-hidden="true">
        <span class="hero-lens" />
        <span class="hero-thread hero-thread-a" />
        <span class="hero-thread hero-thread-b" />
        <span v-for="mode in practiceModes" :key="`${mode.id}-point`" class="hero-field-point" :class="{ active: activePracticeMode === mode.id }" :style="{ '--point-x': `${mode.x}%`, '--point-y': `${mode.y}%`, '--point-accent': mode.accent }" />
      </div>
      <nav><a href="https://github.com/Bum-Boo">Bum-Boo on GitHub</a></nav>
      <div class="hero-copy">
        <p class="eyebrow">Independent AI design practice</p>
        <h1>AI tools should feel useful before they feel futuristic.</h1>
        <p class="lede">I explore cognition, design, technology, and playful tools to make everyday work lighter without hiding human choice.</p>
        <div class="hero-actions"><a class="primary" href="#experiments">Browse experiments</a><a href="#research">How I think</a></div>
      </div>
      <div class="hero-practice">
        <div class="hero-practice-copy">
          <span class="hero-practice-index">{{ selectedPracticeMode.index }}</span>
          <div>
            <p class="hero-practice-label">Current move · {{ selectedPracticeMode.label }}</p>
            <div id="hero-practice-response" class="hero-practice-response" aria-live="polite">
              <Transition name="hero-mode" mode="out-in">
                <p :key="selectedPracticeMode.id" class="hero-practice-statement">{{ selectedPracticeMode.statement }}</p>
              </Transition>
            </div>
          </div>
        </div>
        <div class="hero-mode-list" role="group" aria-label="Explore the design practice">
          <button v-for="mode in practiceModes" :key="mode.id" class="hero-mode-button" :class="{ active: activePracticeMode === mode.id }" :style="{ '--mode-accent': mode.accent }" :aria-pressed="activePracticeMode === mode.id" aria-describedby="hero-practice-response" @pointerenter="activePracticeMode = mode.id" @focus="activePracticeMode = mode.id" @click="activePracticeMode = mode.id">
            <span>{{ mode.index }}</span><strong>{{ mode.label }}</strong>
          </button>
        </div>
      </div>
    </header>

    <section id="research" class="research-section">
      <div class="section-intro">
        <h2>A question can cross more than one field.</h2>
        <p>Select a subject to see the question I am currently asking around it.</p>
      </div>
      <div class="research-grid">
        <div class="orbit-stage" :style="orbitStageStyle" aria-label="Interactive research orbit">
          <div class="orbit-line orbit-line-a" /><div class="orbit-line orbit-line-b" />
          <div class="core"><span>AI experience design</span></div>
          <button v-for="node in researchNodes" :key="node.id" class="orbit-node" :class="[node.color, { active: activeNode === node.id }]" :style="nodePosition(node)" :aria-pressed="activeNode === node.id" @pointerenter="activateResearchNode(node, $event)" @focus="activateResearchNode(node, $event)" @click="activateResearchNode(node, $event)">{{ node.label }}</button>
        </div>
        <article class="question-panel" aria-live="polite">
          <Transition name="question-shift" mode="out-in">
            <div :key="selectedNode.id" class="question-content">
              <p class="eyebrow">Current question · {{ selectedNode.label }}</p>
              <blockquote>{{ selectedNode.question }}</blockquote>
            </div>
          </Transition>
          <dl><div><dt>Method</dt><dd>Explore, design, build</dd></div><div><dt>Medium</dt><dd>Chosen by the question</dd></div><div><dt>Boundary</dt><dd>Human choice stays visible</dd></div></dl>
        </article>
      </div>
    </section>

    <section ref="materialStudy" class="material-study" @pointermove="updateMaterialPointer" @pointerleave="resetMaterialPointer">
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
            <div class="experiment-media-layer">
              <template v-if="hasScrubVideo">
                <img :key="`${featuredExperiment.id}-fallback`" class="experiment-video-poster experiment-frame-fallback" :src="featuredExperiment.poster" alt="" draggable="false">
                <canvas ref="scrubCanvas" :key="`${featuredExperiment.id}-canvas`" class="experiment-frame-canvas" :class="{ ready: compositorReady }" />
                <video ref="scrubVideo" :key="`${featuredExperiment.id}-${activeVideoSource}`" class="experiment-video-source" :src="activeVideoSource" muted playsinline preload="metadata" :poster="featuredExperiment.poster" tabindex="-1" @loadedmetadata="onVideoMetadata" @loadeddata="onVideoData" />
              </template>
              <img v-else :key="featuredExperiment.poster" class="experiment-video-poster" :src="featuredExperiment.poster" alt="" draggable="false">
            </div>
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

    <section id="after-experiments" ref="manifestoSection" class="manifesto" @pointermove="updateManifestoPointer" @pointerleave="resetManifestoPointer">
      <article class="manifesto-statement manifesto-statement-left"><span>01 · Release the category</span><p>I do not begin by asking which field a problem belongs to.</p></article>
      <span class="manifesto-seam" aria-hidden="true"><span /></span>
      <article class="manifesto-statement manifesto-statement-right"><span>02 · Name the experience</span><p>I begin by asking what experience should exist.</p></article>
    </section>

    <footer class="footer"><span>AI design experiments by Bum-Boo</span><a href="https://bumboo.fun">bumboo.fun ↗</a></footer>
  </main>
</template>
