document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollSpy();
  initSmoothScroll();
  initProjectFilter();
  initConsoleFeed();
});

function initNav() {
  const toggle = document.querySelector('.nav__toggle');
  const links = document.querySelector('.nav__links');
  const overlay = document.querySelector('.nav__overlay');

  if (!toggle || !links) return;

  function openMenu() {
    links.classList.add('open');
    overlay?.classList.add('visible');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    links.querySelector('.nav__link')?.focus();
  }

  function closeMenu() {
    links.classList.remove('open');
    overlay?.classList.remove('visible');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus();
  }

  toggle.addEventListener('click', () => {
    toggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });

  overlay?.addEventListener('click', closeMenu);

  links.querySelectorAll('.nav__link').forEach(link =>
    link.addEventListener('click', closeMenu)
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeMenu();
  });
}

function initScrollSpy() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link =>
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`)
        );
      }
    });
  }, { rootMargin: '-20% 0px -75% 0px' });

  sections.forEach(s => observer.observe(s));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) + 16;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });
}

function initProjectFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card[data-category]');
  if (!buttons.length || !cards.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}

function initConsoleFeed() {
  const feed = document.querySelector('#console-feed');
  const radar = document.querySelector('.radar');
  const radarLabel = radar?.querySelector('.radar__label');
  if (!feed) return;

  const commands = [
    'sudo ./orbwatch --scope perimeter',
    'python3 triage.py --full-stack',
    'bash containment.sh --network',
    './detector evaluate --dataset sentinel',
    'sudo ./riskmap --region apac',
    'python3 ./scripts/patcher.py --dry-run',
    './threatfeed --live --zone infra',
    'scanner --mode deep --target gateway',
    'sudo ./routescan --syn --limit',
    'python3 ./packet.py --replay',
    './recon --asset cloud-db',
    'bash resilience.sh --stress',
    'python3 /ops/logscraper.py --since 00:00',
    'sudo ./siem-query --tactics lateral',
    'bash /helpers/blueprint.sh --history',
    './session-harvester --analyze tokens',
    'python3 ./scripts/alertify.py --mute',
    'sudo ./sigchain --trust archived',
    './pareto --focus code',
    'bash ./analysis/runbook.sh --revision',
    'python3 ./fuzzer/capture.py --rate-limit',
    './fence --target remote-kube',
    'bash ./middleware/guardian.sh --check',
    'python3 /utils/traceback.py --depth 5',
    './nanoflow monitor --pipeline data',
    'sudo ./posture --scan identity',
    'python3 ./ctf/locker.py --unlock',
    'bash ./response/ignite.sh --dry',
    './lynis --audits nightly',
    'python3 ./delta/compare.py --baseline',
    'bash ./backup/verify.sh --hash',
    './bastion manage --session idle',
    'python3 ./zero-trust/enforcer.py --ruleset 27',
    'sudo ./api-guard --paths all',
    './honeyed --deploy fake-lb',
    'bash ./vault-sync.sh --nonce',
    'python3 ./orchestrator.py --blue-team',
    './mock-ctf --simulate breach',
    'bash ./icewall.sh --flux',
    'python3 ./qradar/ping.py --load',
    './kube-watch --namespaces prod',
    'bash ./safeguard.sh --credentials',
    'python3 ./scripts/scrub.py --retain 90',
    './cobalt-run --phase three',
    'bash ./torrent.sh --secure',
    'python3 ./pecan/harvest.py --intake',
    './flare --inspect vault',
    'bash ./lockit.sh --refresh'
  ];

  const safeOutputs = [
    'safe - perimeter telemetry matches hardened baselines',
    'safe - drift within acceptable variance and sectors stabilized',
    'safe - telemetry normalized after routing filters engaged',
    'safe - redundant checks passed, watchers quiet',
    'safe - patch orchestration confirmed, no regressions',
    'safe - endpoints revalidated with signatures refreshed',
    'safe - credentials rotated successfully with proof',
    'safe - third-party connectors locked and reverified',
    'safe - stale session tokens scrubbed and access denied',
    'safe - artifact quarantined with forensics bundle',
    'safe - anomaly resolved, watchers reset to green',
    'safe - misconfig edge corrected, controls solid',
    'safe - zero-trust policy has full coverage across clusters',
    'safe - encryption keys rotated during hardened window',
    'safe - telemetry mosaic shows green across regions',
    'safe - threat intel digest flagged nothing new'
  ];

  const safeAnalysis = [
    'analysis — reviewing output digest, risk cleared for now',
    'analysis — validating telemetry after mitigation and documenting',
    'analysis — ensuring no residual alerts are bubbling up',
    'analysis — confirming response playbook executed cleanly',
    'analysis — syncing artifacts with ticket and auto-playbook',
    'analysis — verifying logs for drift before closing hook',
    'analysis — automating follow-up hunts while team rests',
    'analysis — cross-checking vendor telemetry before handoff',
    'analysis — closing the response narrative with timestamp',
    'analysis — documenting safe state for future audits',
    'analysis — retaining sanitized snapshot for reference',
    'analysis — re-baselining around stable nodes for clarity',
    'analysis — capturing artifact for compliance review',
    'analysis — tagging results to SOC dashboard as safe',
    'analysis — fingerprinting cleanup signals for newsletters',
    'analysis — handing over to observers with a safe badge'
  ];

  const warningOutputs = [
    'warning - heuristics flagged odd I/O spike on gateway',
    'warning - unexpected certificate negotiation from service mesh',
    'warning - lateral scan attempt answered by unusual host',
    'warning - IOC matches low-confidence but trending upward',
    'warning - environment variable tampering detected in build',
    'warning - stealth beacon pinged from storage zone',
    'warning - new user creation detected via CLI automation',
    'warning - instrumentation reports suspicious exec chain',
    'warning - remote API exhibited retry storm outside policy',
    'warning - feature flag toggled outside approved cadence',
    'warning - encrypted payload failing policy checks repeatedly',
    'warning - access token reused after expiry window',
    'warning - odd DNS volley from dev cluster to unknown hosts',
    'warning - container drifted into 3rd-party network boundary',
    'warning - repeated auth failures from service mesh proxy',
    'warning - multi-factor fallback triggered unexpectedly'
  ];

  const warningAnalysis = [
    'analysis — analyzing output, triaging risk to avoid escalation',
    'analysis — replicating scenario to understand potential blast radius',
    'analysis — mitigating risk while keeping service availability',
    'analysis — cross-correlating with asset inventory and events',
    'analysis — disabling suspicious connection, documenting root cause',
    'analysis — shifting detection to blocklist candidate for now',
    'analysis — prepping rollback while preserving evidence',
    'analysis — handing to forensics for deeper capture post-mitigation',
    'analysis — tracing attack chain before containment steps',
    'analysis — strengthening rules that triggered this output',
    'analysis — alerting response squad to posture shift',
    'analysis — rerouting traffic to safe path and watching',
    'analysis — recalibrating heuristics for this signature variant',
    'analysis — sealing misconfigured ingress and journaling',
    'analysis — revalidating claims with telemetry before blocking',
    'analysis — delaying drift until hunts confirm severity'
  ];

  const errorOutputs = [
    'error - lateral movement succeeded past the first hop',
    'error - credential dumping detected inside bastion shell',
    'error - payload executed remote persistence script',
    'error - unauthorized API call exfiltrated metadata',
    'error - container breakout attempt triggered shutdown',
    'error - data exfil flagged by parity watchlist',
    'error - privilege escalation blocked by kernel safeguards',
    'error - rogue process established TLS channel to C2',
    'error - beacon rebinding to command infrastructure',
    'error - attacker swapped hashed proof for secret',
    'error - unstoppable recon hit internal data lake',
    'error - backup copies pushed to public bucket unexpectedly',
    'error - firmware update signed by unknown key',
    'error - real-time detection mutated to stealth mode',
    'error - supply-chain artifact touched ephemeral nodes',
    'error - misaligned policies left window on core edge'
  ];

  const errorAnalysis = [
    'analysis — pivoting to emergency patch, mitigating risk now',
    'analysis — orchestrating containment while capturing proof',
    'analysis — engaging red team to validate eradication',
    'analysis — scrambling immediate response scripts to block further spread',
    'analysis — sweeping for IOCs while quarantining host nodes',
    'analysis — rebuilding affected stack with safe configuration',
    'analysis — locking down secrets, forbidding replay attempts',
    'analysis — documenting impact for auditors and execs',
    'analysis — forcing rotate on compromised keys stat',
    'analysis — alerting execs while neutralizing threat vector',
    'analysis — running automated rollback to safe snapshot',
    'analysis — isolating storage plane, rewiring watchers',
    'analysis — verifying firmware authentic after mitigation',
    'analysis — reiterating hunts to confirm attack eliminated',
    'analysis — hardening supply chain, verifying integrity',
    'analysis — timing out malicious session and rewriting policy'
  ];

  const events = [];
  commands.slice(0, 16).forEach((command, idx) => {
    events.push({
      command,
      analysis: safeAnalysis[idx],
      output: safeOutputs[idx],
      severity: 'safe'
    });
  });

  commands.slice(16, 32).forEach((command, idx) => {
    events.push({
      command,
      analysis: warningAnalysis[idx],
      output: warningOutputs[idx],
      severity: 'warning'
    });
  });

  commands.slice(32, 48).forEach((command, idx) => {
    events.push({
      command,
      analysis: errorAnalysis[idx],
      output: errorOutputs[idx],
      severity: 'error'
    });
  });

  const intervalMs = 5000;
  const maxLines = 12;
  let currentIndex = 0;
  let shuffledEvents = [];

  const refreshEvents = () =>
    events
      .map(event => ({ event, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ event }) => event);

  shuffledEvents = refreshEvents();

  function trimFeed() {
    while (feed.children.length > maxLines) {
      feed.removeChild(feed.firstElementChild);
    }
  }

  function pushLine(text, extraClass = '', severityClass = '') {
    const paragraph = document.createElement('p');
    paragraph.className = ['console-line', extraClass, severityClass].filter(Boolean).join(' ');
    paragraph.textContent = text;
    feed.appendChild(paragraph);
    trimFeed();
  }

  function applyRadar(severity) {
    if (!radar) return;
    radar.classList.remove('radar--safe', 'radar--warning', 'radar--error');
    const labelText = {
      safe: 'Threat radar — stabilized',
      warning: 'Threat radar — elevated signal',
      error: 'Threat radar — alert'
    }[severity] || 'Threat radar — monitoring';
    radar.classList.add(`radar--${severity}`);
    if (radarLabel) radarLabel.textContent = labelText;
  }

  function runEvent(event) {
    pushLine(`root@silica:$ ${event.command}`, 'command');
    pushLine(event.analysis, 'analysis');
    pushLine(event.output, 'output', event.severity);
    applyRadar(event.severity);
  }

  function tick() {
    runEvent(shuffledEvents[currentIndex]);
    currentIndex += 1;
    if (currentIndex >= shuffledEvents.length) {
      shuffledEvents = refreshEvents();
      currentIndex = 0;
    }
  }

  tick();
  setInterval(tick, intervalMs);
}
