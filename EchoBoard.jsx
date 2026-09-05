import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutGrid,
  CalendarDays,
  Sparkles,
  ListChecks,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Share2,
  Download,
  MoreHorizontal,
  X,
  Check,
  Plus,
  Upload,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  SlidersHorizontal,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


// ---------- Mock data for EchoBoard ----------

const PEOPLE = {
  Alex: { name: "Alex Chen", initials: "AC", color: "#FF6548" },
  Sarah: { name: "Sarah Osei", initials: "SO", color: "#3D8B67" },
  Mike: { name: "Mike Ferrante", initials: "MF", color: "#77746E" },
  Priya: { name: "Priya Nair", initials: "PN", color: "#D69A38" },
  Jordan: { name: "Jordan Kim", initials: "JK", color: "#5B7CFA" },
  Leah: { name: "Leah Whitfield", initials: "LW", color: "#B85C9E" },
  Dev: { name: "Dev Patel", initials: "DP", color: "#3D8B67" },
  Aisha: { name: "Aisha Mbeki", initials: "AM", color: "#FF6548" },
};

const MEETINGS = [
  {
    id: "m1",
    title: "Q3 Product Strategy",
    date: "2026-09-02",
    time: "10:30 AM",
    duration: 48,
    participants: ["Alex", "Sarah", "Mike", "Priya", "Jordan"],
    sentiment: 78,
    summary: [
      "The team aligned on reducing onboarding friction before the next product release. The primary disagreement centered on whether the redesign should ship incrementally or as a single release, with Alex arguing for a phased rollout to limit support load.",
      "Sarah presented churn data showing new users abandon setup at the permissions screen, which shifted the room toward prioritizing that flow first. Mike raised concerns about engineering bandwidth given the sprint already carries two carryover items.",
      "The group settled on a two-phase plan: ship the permissions redesign in the next release, then revisit the broader onboarding flow once churn data from phase one comes in.",
    ],
    decisions: [
      { text: "Ship the permissions-screen redesign as a standalone release before the full onboarding overhaul.", owner: "Alex", time: "10:41 AM" },
      { text: "Delay the pricing-page refresh to Q4 to protect engineering capacity for onboarding work.", owner: "Mike", time: "10:53 AM" },
      { text: "Sarah to own weekly churn reporting through the phased rollout.", owner: "Sarah", time: "11:02 AM" },
    ],
    actionItems: [
      { id: "a1", text: "Finalize onboarding prototype", owner: "Sarah", due: "2026-09-08", status: "In progress" },
      { id: "a2", text: "Scope permissions-screen redesign with design", owner: "Priya", due: "2026-09-10", status: "Open" },
      { id: "a3", text: "Draft churn reporting template", owner: "Sarah", due: "2026-09-06", status: "Open" },
      { id: "a4", text: "Confirm engineering capacity with platform team", owner: "Mike", due: "2026-09-05", status: "Completed" },
    ],
    topics: [
      { label: "Onboarding", weight: 5 },
      { label: "Product Strategy", weight: 4 },
      { label: "Churn", weight: 3 },
      { label: "Pricing", weight: 2 },
    ],
    health: { score: 82, participation: 84, clarity: 88, focus: 74, sentiment: 78 },
    speakers: [
      { name: "Alex", pct: 32 },
      { name: "Sarah", pct: 27 },
      { name: "Mike", pct: 21 },
      { name: "Priya", pct: 12 },
      { name: "Jordan", pct: 8 },
    ],
    moments: [
      { time: "10:34", label: "Churn data on permissions screen shared", type: "insight" },
      { time: "10:41", label: "Decision: phased onboarding rollout", type: "decision" },
      { time: "10:53", label: "Pricing refresh pushed to Q4", type: "decision" },
      { time: "11:14", label: "Alignment reached on ownership", type: "resolution" },
    ],
  },
  {
    id: "m2",
    title: "Customer Research Review",
    date: "2026-09-03",
    time: "2:00 PM",
    duration: 35,
    participants: ["Sarah", "Priya", "Leah"],
    sentiment: 71,
    summary: [
      "Leah walked through six recent customer interviews focused on the reporting dashboard. Every participant described the export flow as confusing, and three specifically mentioned abandoning it after trying twice.",
      "Priya connected the feedback to support-ticket volume, which has stayed flat despite the new feature launch, suggesting frustrated users are quietly churning rather than filing complaints. Sarah proposed a lightweight in-app survey to catch this earlier.",
    ],
    decisions: [
      { text: "Redesign the export flow as a top priority for the next design sprint.", owner: "Priya", time: "2:12 PM" },
      { text: "Add an in-app satisfaction prompt after export attempts.", owner: "Sarah", time: "2:24 PM" },
      { text: "Leah to recruit five additional users for a follow-up usability round.", owner: "Leah", time: "2:29 PM" },
    ],
    actionItems: [
      { id: "a5", text: "Recruit users for export usability round", owner: "Leah", due: "2026-09-12", status: "Open" },
      { id: "a6", text: "Draft in-app satisfaction prompt copy", owner: "Sarah", due: "2026-09-09", status: "Open" },
      { id: "a7", text: "Share interview recordings with design", owner: "Leah", due: "2026-09-04", status: "Completed" },
    ],
    topics: [
      { label: "Customer Feedback", weight: 5 },
      { label: "Reporting", weight: 4 },
      { label: "Churn", weight: 3 },
    ],
    health: { score: 76, participation: 90, clarity: 70, focus: 80, sentiment: 66 },
    speakers: [
      { name: "Leah", pct: 46 },
      { name: "Priya", pct: 31 },
      { name: "Sarah", pct: 23 },
    ],
    moments: [
      { time: "2:06", label: "Export flow named top pain point", type: "insight" },
      { time: "2:12", label: "Decision: prioritize export redesign", type: "decision" },
      { time: "2:24", label: "In-app survey proposed", type: "idea" },
    ],
  },
  {
    id: "m3",
    title: "Engineering Sprint Planning",
    date: "2026-09-03",
    time: "9:00 AM",
    duration: 52,
    participants: ["Mike", "Jordan", "Dev", "Aisha"],
    sentiment: 64,
    summary: [
      "The team scoped the next two-week sprint against the onboarding commitments made in the strategy meeting. Jordan flagged that the permissions redesign touches the auth service, which is already mid-migration, adding risk to the timeline.",
      "Dev proposed isolating the migration behind a feature flag so onboarding work can proceed in parallel. After some debate about testing overhead, the team agreed to the flag approach with an extra day reserved for regression testing.",
    ],
    decisions: [
      { text: "Gate the auth migration behind a feature flag to unblock onboarding work.", owner: "Dev", time: "9:22 AM" },
      { text: "Reserve one full day for regression testing before the sprint closes.", owner: "Jordan", time: "9:35 AM" },
      { text: "Carry over the reporting-export bug fix to the following sprint.", owner: "Mike", time: "9:44 AM" },
    ],
    actionItems: [
      { id: "a8", text: "Implement feature flag for auth migration", owner: "Dev", due: "2026-09-07", status: "In progress" },
      { id: "a9", text: "Write regression test plan", owner: "Jordan", due: "2026-09-11", status: "Open" },
      { id: "a10", text: "Update sprint board with carryover items", owner: "Mike", due: "2026-09-03", status: "Completed" },
    ],
    topics: [
      { label: "Engineering", weight: 5 },
      { label: "Onboarding", weight: 3 },
      { label: "Auth Migration", weight: 4 },
    ],
    health: { score: 69, participation: 72, clarity: 81, focus: 65, sentiment: 58 },
    speakers: [
      { name: "Jordan", pct: 34 },
      { name: "Dev", pct: 29 },
      { name: "Mike", pct: 22 },
      { name: "Aisha", pct: 15 },
    ],
    moments: [
      { time: "9:15", label: "Auth migration risk raised", type: "concern" },
      { time: "9:22", label: "Decision: feature-flag approach", type: "decision" },
      { time: "9:44", label: "Export bug fix deferred", type: "decision" },
    ],
  },
  {
    id: "m4",
    title: "Design Critique",
    date: "2026-09-04",
    time: "1:00 PM",
    duration: 40,
    participants: ["Priya", "Alex", "Leah"],
    sentiment: 85,
    summary: [
      "Priya presented three directions for the permissions-screen redesign. The room converged quickly on a variant that surfaces permission reasons inline rather than in a separate help panel, which testing suggests reduces confusion.",
      "Alex pushed for tighter copy throughout, noting the current draft explains too much and trusts the user too little. Leah agreed to run the revised copy past two users before the build handoff.",
    ],
    decisions: [
      { text: "Move forward with the inline-reasoning permissions variant.", owner: "Priya", time: "1:19 PM" },
      { text: "Cut onboarding copy length by roughly a third before handoff.", owner: "Alex", time: "1:27 PM" },
      { text: "Validate revised copy with two users before build handoff.", owner: "Leah", time: "1:33 PM" },
    ],
    actionItems: [
      { id: "a11", text: "Finalize inline-reasoning permissions mockups", owner: "Priya", due: "2026-09-08", status: "In progress" },
      { id: "a12", text: "Rewrite onboarding copy for brevity", owner: "Alex", due: "2026-09-09", status: "Open" },
    ],
    topics: [
      { label: "Design", weight: 5 },
      { label: "Onboarding", weight: 4 },
      { label: "Copywriting", weight: 2 },
    ],
    health: { score: 88, participation: 91, clarity: 92, focus: 86, sentiment: 90 },
    speakers: [
      { name: "Priya", pct: 41 },
      { name: "Alex", pct: 34 },
      { name: "Leah", pct: 25 },
    ],
    moments: [
      { time: "1:19", label: "Decision: inline-reasoning variant", type: "decision" },
      { time: "1:27", label: "Copy length flagged as too dense", type: "concern" },
      { time: "1:33", label: "Validation plan agreed", type: "resolution" },
    ],
  },
  {
    id: "m5",
    title: "Growth Weekly",
    date: "2026-09-04",
    time: "4:00 PM",
    duration: 30,
    participants: ["Sarah", "Jordan", "Mike"],
    sentiment: 69,
    summary: [
      "Weekly metrics review showed signup volume holding steady while activation dipped slightly week over week. Sarah tied the dip to the permissions-screen confusion already surfaced in customer research, rather than a new issue.",
      "Jordan shared that the referral experiment is trending positive but needs another week before it's statistically meaningful. The team agreed to hold off on any changes until the onboarding fixes ship.",
    ],
    decisions: [
      { text: "Hold the referral experiment steady for one more week before evaluating.", owner: "Jordan", time: "4:11 PM" },
      { text: "Attribute the activation dip to onboarding friction rather than a new regression.", owner: "Sarah", time: "4:18 PM" },
    ],
    actionItems: [
      { id: "a13", text: "Re-check activation numbers after onboarding ships", owner: "Sarah", due: "2026-09-15", status: "Open" },
      { id: "a14", text: "Prepare referral experiment readout", owner: "Jordan", due: "2026-09-11", status: "Open" },
    ],
    topics: [
      { label: "Growth", weight: 5 },
      { label: "Onboarding", weight: 3 },
      { label: "Experiments", weight: 3 },
    ],
    health: { score: 74, participation: 78, clarity: 75, focus: 82, sentiment: 68 },
    speakers: [
      { name: "Sarah", pct: 39 },
      { name: "Jordan", pct: 36 },
      { name: "Mike", pct: 25 },
    ],
    moments: [
      { time: "4:11", label: "Referral experiment holding pattern", type: "decision" },
      { time: "4:18", label: "Activation dip explained", type: "insight" },
    ],
  },
  {
    id: "m6",
    title: "Leadership Sync",
    date: "2026-09-05",
    time: "11:00 AM",
    duration: 55,
    participants: ["Alex", "Sarah", "Mike", "Priya"],
    sentiment: 73,
    summary: [
      "Monthly leadership check-in covered the onboarding initiative, hiring plans, and the Q4 roadmap draft. Alex framed the permissions work as the clearest near-term lever on activation and asked for a firm ship date.",
      "Mike committed to a September 19 release pending regression testing, with Priya flagging that the copy validation step could push it a few days if user feedback surfaces new issues. The group also approved opening one additional engineering requisition for Q4.",
    ],
    decisions: [
      { text: "Target September 19 for the permissions-redesign release.", owner: "Mike", time: "11:22 AM" },
      { text: "Approve one additional engineering hire for Q4.", owner: "Alex", time: "11:41 AM" },
      { text: "Revisit the full onboarding roadmap once phase one ships.", owner: "Priya", time: "11:49 AM" },
    ],
    actionItems: [
      { id: "a15", text: "Post engineering requisition", owner: "Mike", due: "2026-09-10", status: "Open" },
      { id: "a16", text: "Draft Q4 onboarding roadmap outline", owner: "Priya", due: "2026-09-18", status: "Open" },
    ],
    topics: [
      { label: "Leadership", weight: 4 },
      { label: "Hiring", weight: 3 },
      { label: "Onboarding", weight: 4 },
      { label: "Roadmap", weight: 3 },
    ],
    health: { score: 79, participation: 80, clarity: 84, focus: 77, sentiment: 74 },
    speakers: [
      { name: "Alex", pct: 35 },
      { name: "Mike", pct: 28 },
      { name: "Priya", pct: 22 },
      { name: "Sarah", pct: 15 },
    ],
    moments: [
      { time: "11:22", label: "Release date set: Sep 19", type: "decision" },
      { time: "11:41", label: "New engineering hire approved", type: "decision" },
    ],
  },
  {
    id: "m7",
    title: "Pricing Workshop",
    date: "2026-09-01",
    time: "3:00 PM",
    duration: 62,
    participants: ["Alex", "Sarah", "Leah", "Dev"],
    sentiment: 52,
    summary: [
      "A longer working session on the deferred pricing-page refresh surfaced real disagreement. Alex favored consolidating to two tiers to simplify the decision for new users, while Sarah argued the current three-tier structure protects mid-market revenue and shouldn't change without more data.",
      "Leah presented competitor pricing pages showing a mix of both approaches, which didn't fully resolve the debate. The team agreed to shelve the structural question until Q4, as previously decided, but to run a smaller experiment on pricing-page copy in the meantime.",
    ],
    decisions: [
      { text: "Postpone the tier-structure decision to Q4 pending more revenue data.", owner: "Sarah", time: "3:31 PM" },
      { text: "Run a copy-only experiment on the current pricing page this month.", owner: "Alex", time: "3:48 PM" },
    ],
    actionItems: [
      { id: "a17", text: "Draft pricing-page copy variants for testing", owner: "Leah", due: "2026-09-09", status: "Open" },
      { id: "a18", text: "Pull mid-market revenue breakdown by tier", owner: "Sarah", due: "2026-09-13", status: "Open" },
      { id: "a19", text: "Share competitor pricing audit doc", owner: "Leah", due: "2026-09-01", status: "Completed" },
    ],
    topics: [
      { label: "Pricing", weight: 5 },
      { label: "Revenue", weight: 3 },
      { label: "Competitive Research", weight: 2 },
    ],
    health: { score: 58, participation: 70, clarity: 52, focus: 61, sentiment: 45 },
    speakers: [
      { name: "Alex", pct: 30 },
      { name: "Sarah", pct: 29 },
      { name: "Leah", pct: 27 },
      { name: "Dev", pct: 14 },
    ],
    moments: [
      { time: "3:14", label: "Disagreement on tier structure", type: "concern" },
      { time: "3:31", label: "Structural decision deferred to Q4", type: "decision" },
      { time: "3:48", label: "Copy experiment agreed as compromise", type: "resolution" },
    ],
  },
  {
    id: "m8",
    title: "Launch Readiness",
    date: "2026-08-29",
    time: "10:00 AM",
    duration: 45,
    participants: ["Alex", "Mike", "Jordan", "Priya", "Aisha"],
    sentiment: 81,
    summary: [
      "Final readiness check for the previous release covering the reporting-export fixes. All engineering checklist items were marked complete, and Aisha confirmed monitoring dashboards were in place for the first 48 hours post-launch.",
      "Priya raised one late concern about mobile layout on the export confirmation screen, which the team agreed was minor enough to ship with a fast-follow fix rather than delay. Jordan volunteered to own that fix immediately after launch.",
    ],
    decisions: [
      { text: "Proceed with launch as scheduled, with mobile layout fix as fast-follow.", owner: "Alex", time: "10:24 AM" },
      { text: "Aisha to monitor error rates for 48 hours post-launch.", owner: "Aisha", time: "10:31 AM" },
    ],
    actionItems: [
      { id: "a20", text: "Fix mobile layout on export confirmation", owner: "Jordan", due: "2026-08-31", status: "Completed" },
      { id: "a21", text: "Monitor post-launch error rates", owner: "Aisha", due: "2026-08-31", status: "Completed" },
    ],
    topics: [
      { label: "Launch", weight: 5 },
      { label: "Reporting", weight: 3 },
      { label: "Mobile", weight: 2 },
    ],
    health: { score: 85, participation: 86, clarity: 89, focus: 83, sentiment: 84 },
    speakers: [
      { name: "Alex", pct: 26 },
      { name: "Mike", pct: 22 },
      { name: "Jordan", pct: 20 },
      { name: "Priya", pct: 18 },
      { name: "Aisha", pct: 14 },
    ],
    moments: [
      { time: "10:18", label: "Mobile layout concern raised", type: "concern" },
      { time: "10:24", label: "Decision: ship with fast-follow", type: "decision" },
    ],
  },
];

// Flattened action items across all meetings, with meeting source attached
const ALL_ACTION_ITEMS = MEETINGS.flatMap((m) =>
  m.actionItems.map((item) => ({ ...item, meetingId: m.id, meetingTitle: m.title }))
);

// 90 days of meeting-pulse activity (deterministic, weekday-weighted)
const PULSE_DATA = (() => {
  const points = [];
  for (let i = 89; i >= 0; i--) {
    const dow = i % 7; // 0..6, treat 5/6 as weekend
    const isWeekend = dow === 5 || dow === 6;
    const wave = Math.sin(i / 6) * 1.4;
    const drift = (89 - i) / 90; // slow upward drift toward "today"
    let count = isWeekend ? 0 : Math.max(0, Math.round(1.8 + wave + drift * 1.6));
    if (dow === 1) count += 1; // Tuesdays run hot
    const minutes = count === 0 ? 0 : Math.max(20, Math.round(count * 42 + wave * 12 + drift * 20));
    points.push({ index: 89 - i, meetings: count, minutes });
  }
  return points;
})();

const SIGNALS = [
  { text: "Product meetings are running 18% longer this month than last.", trend: "up" },
  { text: "Sarah is attached to 42% of currently open action items.", trend: "flat" },
  { text: "Decision density peaks on Tuesdays, nearly double any other day.", trend: "up" },
];

const INSIGHTS = [
  {
    id: "i1",
    title: "Meetings are getting longer",
    explanation:
      "Average duration has climbed for three consecutive weeks, driven mostly by product and pricing discussions that used to close in under 30 minutes.",
    metric: "+18%",
    trend: "up",
    related: ["m1", "m7"],
  },
  {
    id: "i2",
    title: "Decisions concentrate around three people",
    explanation:
      "Alex, Sarah, and Mike are named as the responsible party on 71% of decisions logged this month, which may be creating a bottleneck as scope grows.",
    metric: "71%",
    trend: "flat",
    related: ["m1", "m6", "m7"],
  },
  {
    id: "i3",
    title: "Customer feedback keeps surfacing",
    explanation:
      "References to customer research or interview findings now appear in 64% of product-related meetings, up from about a third earlier this quarter.",
    metric: "64%",
    trend: "up",
    related: ["m2", "m4", "m1"],
  },
  {
    id: "i4",
    title: "Pricing discussions run hottest",
    explanation:
      "The pricing workshop scored the lowest meeting-health rating this month, driven by lower decision clarity and a split in participant sentiment.",
    metric: "58 / 100",
    trend: "down",
    related: ["m7"],
  },
  {
    id: "i5",
    title: "Tuesday is the highest-output day",
    explanation:
      "Meetings held on Tuesdays produce nearly twice as many logged decisions per hour as the weekly average, likely due to the standing leadership sync.",
    metric: "1.8x",
    trend: "up",
    related: ["m6"],
  },
];

/* ---------------------------------------------------------------------- */
/* Tokens & helpers                                                        */
/* ---------------------------------------------------------------------- */

const COLORS = {
  bg: "#F7F6F2",
  panel: "#FCFBF8",
  ink: "#181818",
  sub: "#77746E",
  accent: "#FF6548",
  success: "#3D8B67",
  warning: "#D69A38",
  border: "#E4E1DA",
};

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseDate(d) {
  const [y, m, day] = d.split("-").map(Number);
  return new Date(y, m - 1, day);
}

function formatDate(d, opts = {}) {
  const dt = parseDate(d);
  const weekday = opts.weekday !== false ? WEEKDAYS[dt.getDay()] + ", " : "";
  return `${weekday}${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
}

function formatShortDate(d) {
  const dt = parseDate(d);
  return `${MONTHS[dt.getMonth()]} ${dt.getDate()}`;
}

function formatDueLabel(d) {
  const today = parseDate("2026-09-05");
  const dt = parseDate(d);
  const diffDays = Math.round((dt - today) / 86400000);
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays === -1) return "1 day overdue";
  if (diffDays < 0) return `${Math.abs(diffDays)} days overdue`;
  if (diffDays <= 6) return `Due in ${diffDays} days`;
  return `Due ${formatShortDate(d)}`;
}

function durationLabel(mins) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

function sentimentWord(score) {
  if (score >= 80) return "Positive";
  if (score >= 60) return "Steady";
  if (score >= 45) return "Mixed";
  return "Tense";
}

function sentimentColor(score) {
  if (score >= 75) return COLORS.success;
  if (score >= 50) return COLORS.warning;
  return COLORS.accent;
}

function healthWord(score) {
  if (score >= 80) return "Healthy";
  if (score >= 65) return "Fair";
  if (score >= 50) return "Strained";
  return "At risk";
}

/* ---------------------------------------------------------------------- */
/* Shared primitives                                                       */
/* ---------------------------------------------------------------------- */

function Avatar({ person, size = 28 }) {
  const p = PEOPLE[person] || { initials: person.slice(0, 2).toUpperCase(), color: COLORS.sub, name: person };
  return (
    <div
      className="eb-avatar"
      title={p.name}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `${p.color}1A`,
        color: p.color,
        border: `1px solid ${p.color}33`,
      }}
    >
      {p.initials}
    </div>
  );
}

function SentimentDot({ score }) {
  return (
    <span className="eb-sentiment">
      <span className="eb-sentiment-dot" style={{ background: sentimentColor(score) }} />
      <span className="eb-label-xs" style={{ color: COLORS.sub }}>
        {sentimentWord(score)}
      </span>
    </span>
  );
}

function TopicTag({ label, weight }) {
  return (
    <span className="eb-topic" style={{ opacity: 0.55 + weight * 0.09 }}>
      {label}
    </span>
  );
}

function TrendIndicator({ trend }) {
  if (trend === "up")
    return (
      <span className="eb-trend eb-trend-up">
        <ArrowUp size={12} strokeWidth={2.5} />
      </span>
    );
  if (trend === "down")
    return (
      <span className="eb-trend eb-trend-down">
        <ArrowDown size={12} strokeWidth={2.5} />
      </span>
    );
  return (
    <span className="eb-trend eb-trend-flat">
      <Minus size={12} strokeWidth={2.5} />
    </span>
  );
}

function HealthRing({ score, size = 116 }) {
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const color = sentimentColor(pct);
  return (
    <div className="eb-ring-wrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={COLORS.border} strokeWidth={7} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className="eb-ring-arc"
        />
      </svg>
      <div className="eb-ring-center">
        <div className="eb-ring-score">{score}</div>
        <div className="eb-ring-max">/ 100</div>
      </div>
    </div>
  );
}

function SpeakerBalance({ speakers }) {
  return (
    <div className="eb-speaker-list">
      {speakers.map((s) => {
        const p = PEOPLE[s.name];
        return (
          <div className="eb-speaker-row" key={s.name}>
            <div className="eb-speaker-name">{p ? p.name.split(" ")[0] : s.name}</div>
            <div className="eb-speaker-track">
              <div
                className="eb-speaker-fill"
                style={{ width: `${s.pct}%`, background: p ? p.color : COLORS.sub }}
              />
            </div>
            <div className="eb-speaker-pct">{s.pct}%</div>
          </div>
        );
      })}
    </div>
  );
}

function Skeleton({ w = "100%", h = 14, style }) {
  return <div className="eb-skeleton" style={{ width: w, height: h, ...style }} />;
}

function EmptyState({ icon: Icon, title, body, action }) {
  return (
    <div className="eb-empty">
      <div className="eb-empty-icon">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      <div className="eb-empty-title">{title}</div>
      <div className="eb-empty-body">{body}</div>
      {action}
    </div>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="eb-toast">
      <Check size={15} strokeWidth={2.5} />
      <span>{message}</span>
    </div>
  );
}

function Modal({ title, onClose, children, width = 480 }) {
  return (
    <div className="eb-modal-backdrop" onMouseDown={onClose}>
      <div
        className="eb-modal"
        style={{ maxWidth: width }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="eb-modal-head">
          <div className="eb-modal-title">{title}</div>
          <button className="eb-icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className="eb-modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Navigation                                                               */
/* ---------------------------------------------------------------------- */

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutGrid },
  { id: "meetings", label: "Meetings", icon: CalendarDays },
  { id: "insights", label: "Signals", icon: Sparkles },
  { id: "actions", label: "Actions", icon: ListChecks },
];

function NavRail({ page, setPage, onAdd }) {
  return (
    <nav className="eb-rail">
      <div className="eb-rail-mark" onClick={() => setPage("overview")} title="EchoBoard">
        <span>E</span>
      </div>
      <div className="eb-rail-items">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = page === item.id;
          return (
            <button
              key={item.id}
              className={cx("eb-rail-item", active && "eb-rail-item-active")}
              onClick={() => setPage(item.id)}
              title={item.label}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span className="eb-rail-label">{item.label}</span>
            </button>
          );
        })}
      </div>
      <button className="eb-rail-add" onClick={onAdd} title="Add meeting">
        <Plus size={18} strokeWidth={1.75} />
      </button>
    </nav>
  );
}

function BottomNav({ page, setPage }) {
  return (
    <nav className="eb-bottom-nav">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = page === item.id;
        return (
          <button
            key={item.id}
            className={cx("eb-bottom-item", active && "eb-bottom-item-active")}
            onClick={() => setPage(item.id)}
          >
            <Icon size={19} strokeWidth={active ? 2 : 1.6} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ---------------------------------------------------------------------- */
/* Overview page                                                           */
/* ---------------------------------------------------------------------- */

function MetricStrip({ meetings, actionItems }) {
  const totalMinutes = meetings.reduce((s, m) => s + m.duration, 0);
  const avg = Math.round(totalMinutes / meetings.length);
  const metrics = [
    { label: "Meetings this month", value: meetings.length },
    { label: "Total meeting time", value: durationLabel(totalMinutes) },
    { label: "Average duration", value: durationLabel(avg) },
    { label: "Action items created", value: actionItems.length },
  ];
  return (
    <div className="eb-metric-strip">
      {metrics.map((m, i) => (
        <React.Fragment key={m.label}>
          {i > 0 && <div className="eb-metric-divider" />}
          <div className="eb-metric">
            <div className="eb-metric-value">{m.value}</div>
            <div className="eb-label-xs">{m.label}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function PulseChart({ data }) {
  return (
    <div className="eb-pulse-chart">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="pulseFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={COLORS.accent} stopOpacity={0.22} />
              <stop offset="100%" stopColor={COLORS.accent} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke={COLORS.border} strokeDasharray="0" />
          <XAxis dataKey="index" hide />
          <YAxis hide />
          <Tooltip
            cursor={{ stroke: COLORS.ink, strokeOpacity: 0.15 }}
            contentStyle={{
              background: COLORS.ink,
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              fontFamily: "Manrope, sans-serif",
              padding: "8px 12px",
            }}
            labelFormatter={() => ""}
            formatter={(value, name) => [
              name === "meetings" ? `${value} meetings` : `${value} min`,
              null,
            ]}
          />
          <Area
            type="monotone"
            dataKey="meetings"
            stroke={COLORS.accent}
            strokeWidth={2}
            fill="url(#pulseFill)"
            isAnimationActive
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function OverviewPage({ meetings, actionItems, onOpenMeeting, onAdd }) {
  const recent = [...meetings]
    .sort((a, b) => parseDate(b.date) - parseDate(a.date) || b.time.localeCompare(a.time))
    .slice(0, 5);
  const last30 = PULSE_DATA.slice(-30);

  return (
    <div className="eb-page">
      <div className="eb-hero">
        <div className="eb-hero-copy">
          <div className="eb-label-xs eb-accent-label">Meeting intelligence</div>
          <h1 className="eb-h1">
            Your meetings,
            <br />
            decoded.
          </h1>
          <p className="eb-hero-sub">Turn conversations into decisions, actions, and patterns.</p>
        </div>
        <div className="eb-hero-controls">
          <button className="eb-filter-chip">
            <Clock size={14} />
            Last 30 days
            <ChevronDown size={14} />
          </button>
          <button className="eb-btn eb-btn-primary" onClick={onAdd}>
            <Plus size={15} />
            Add meeting
          </button>
        </div>
      </div>

      <MetricStrip meetings={meetings} actionItems={actionItems} />

      <section className="eb-section">
        <div className="eb-section-head">
          <h2 className="eb-h2">Meeting pulse</h2>
          <span className="eb-label-xs">Meetings &amp; duration, last 30 days</span>
        </div>
        <PulseChart data={last30} />
      </section>

      <div className="eb-split">
        <section className="eb-split-main">
          <div className="eb-section-head">
            <h2 className="eb-h2">Recent meetings</h2>
          </div>
          <div className="eb-recent-list">
            {recent.map((m) => (
              <button className="eb-recent-row" key={m.id} onClick={() => onOpenMeeting(m.id)}>
                <div className="eb-recent-main">
                  <div className="eb-recent-title">{m.title}</div>
                  <div className="eb-label-xs">
                    {formatShortDate(m.date)} &middot; {durationLabel(m.duration)} &middot;{" "}
                    {m.participants.length} people &middot; {m.decisions.length} decisions,{" "}
                    {m.actionItems.length} actions
                  </div>
                </div>
                <SentimentDot score={m.sentiment} />
              </button>
            ))}
          </div>
        </section>

        <section className="eb-split-side">
          <div className="eb-section-head">
            <h2 className="eb-h2">Signals</h2>
          </div>
          <div className="eb-signal-list">
            {SIGNALS.map((s, i) => (
              <div className="eb-signal" key={i}>
                <TrendIndicator trend={s.trend} />
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Meetings page                                                           */
/* ---------------------------------------------------------------------- */

const ALL_PEOPLE_NAMES = Object.keys(PEOPLE);

function MeetingsPage({ meetings, onOpenMeeting }) {
  const [query, setQuery] = useState("");
  const [personFilter, setPersonFilter] = useState("all");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    let list = meetings.filter((m) => {
      const matchesQuery = m.title.toLowerCase().includes(query.toLowerCase());
      const matchesPerson = personFilter === "all" || m.participants.includes(personFilter);
      return matchesQuery && matchesPerson;
    });
    list.sort((a, b) => {
      if (sort === "recent") return parseDate(b.date) - parseDate(a.date);
      if (sort === "oldest") return parseDate(a.date) - parseDate(b.date);
      if (sort === "longest") return b.duration - a.duration;
      if (sort === "shortest") return a.duration - b.duration;
      return 0;
    });
    return list;
  }, [meetings, query, personFilter, sort]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((m) => {
      if (!map.has(m.date)) map.set(m.date, []);
      map.get(m.date).push(m);
    });
    return Array.from(map.entries()).sort((a, b) => parseDate(b[0]) - parseDate(a[0]));
  }, [filtered]);

  return (
    <div className="eb-page">
      <div className="eb-page-head">
        <div>
          <h1 className="eb-h1 eb-h1-sm">Meetings</h1>
          <p className="eb-hero-sub eb-hero-sub-sm">Every conversation, organized.</p>
        </div>
      </div>

      <div className="eb-filter-bar">
        <div className="eb-search">
          <Search size={15} />
          <input
            placeholder="Search meetings"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="eb-select"
          value={personFilter}
          onChange={(e) => setPersonFilter(e.target.value)}
        >
          <option value="all">Everyone</option>
          {ALL_PEOPLE_NAMES.map((n) => (
            <option key={n} value={n}>
              {PEOPLE[n].name}
            </option>
          ))}
        </select>
        <select className="eb-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest first</option>
          <option value="longest">Longest first</option>
          <option value="shortest">Shortest first</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No meetings match that search"
          body="Try a different keyword or clear your filters."
        />
      ) : (
        <div className="eb-meeting-groups">
          {grouped.map(([date, list]) => (
            <div key={date} className="eb-meeting-group">
              <div className="eb-label-xs eb-meeting-group-date">{formatDate(date)}</div>
              <div className="eb-meeting-list">
                {list.map((m) => (
                  <button className="eb-meeting-row" key={m.id} onClick={() => onOpenMeeting(m.id)}>
                    <div className="eb-meeting-time">{m.time}</div>
                    <div className="eb-meeting-title-col">
                      <div className="eb-meeting-title">{m.title}</div>
                      <div className="eb-label-xs">
                        {m.participants
                          .slice(0, 3)
                          .map((p) => PEOPLE[p].name.split(" ")[0])
                          .join(", ")}
                        {m.participants.length > 3 ? ` +${m.participants.length - 3}` : ""}
                      </div>
                    </div>
                    <div className="eb-meeting-duration">{durationLabel(m.duration)}</div>
                    <div className="eb-meeting-summary-col">
                      <div className="eb-label-xs">
                        {m.decisions.length} decisions &middot; {m.actionItems.length} actions
                      </div>
                    </div>
                    <SentimentDot score={m.sentiment} />
                    <ChevronRight size={16} className="eb-meeting-chevron" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Meeting detail page                                                     */
/* ---------------------------------------------------------------------- */

const MOMENT_DOT = {
  decision: COLORS.accent,
  insight: "#5B7CFA",
  concern: COLORS.warning,
  resolution: COLORS.success,
  idea: "#B85C9E",
};

function ActionCheckbox({ checked, onToggle }) {
  return (
    <button
      className={cx("eb-checkbox", checked && "eb-checkbox-checked")}
      onClick={onToggle}
      aria-label={checked ? "Mark incomplete" : "Mark complete"}
    >
      {checked && <Check size={11} strokeWidth={3} />}
    </button>
  );
}

function MeetingDetailPage({ meeting, actionStatus, onToggleAction, onBack, onShare, onExport }) {
  const [showAllTopics, setShowAllTopics] = useState(true);
  if (!meeting) return null;

  return (
    <div className="eb-page eb-detail-page">
      <button className="eb-back" onClick={onBack}>
        <ChevronLeft size={15} />
        Back to meetings
      </button>

      <div className="eb-detail-head">
        <div>
          <h1 className="eb-h1 eb-h1-sm">{meeting.title}</h1>
          <div className="eb-label-xs eb-detail-meta">
            {formatDate(meeting.date)} &middot; {meeting.time} &middot;{" "}
            {durationLabel(meeting.duration)} &middot; {meeting.participants.length} participants
          </div>
        </div>
        <div className="eb-detail-actions">
          <button className="eb-btn eb-btn-ghost" onClick={onShare}>
            <Share2 size={14} />
            Share
          </button>
          <button className="eb-btn eb-btn-ghost" onClick={onExport}>
            <Download size={14} />
            Export
          </button>
          <button className="eb-icon-btn eb-icon-btn-border">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>

      <div className="eb-detail-grid">
        <div className="eb-detail-main">
          <section className="eb-card-section">
            <div className="eb-section-head">
              <h2 className="eb-h2">Summary</h2>
              <span className="eb-label-xs eb-accent-label">AI-generated</span>
            </div>
            <div className="eb-summary">
              {meeting.summary.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          <section className="eb-card-section">
            <div className="eb-section-head">
              <h2 className="eb-h2">Key decisions</h2>
            </div>
            <div className="eb-decision-list">
              {meeting.decisions.map((d, i) => (
                <div className="eb-decision" key={i}>
                  <div className="eb-decision-num">{String(i + 1).padStart(2, "0")}</div>
                  <div className="eb-decision-body">
                    <p>{d.text}</p>
                    <div className="eb-label-xs">
                      {PEOPLE[d.owner]?.name || d.owner} &middot; {d.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="eb-card-section">
            <div className="eb-section-head">
              <h2 className="eb-h2">Action items</h2>
            </div>
            <div className="eb-action-list">
              {meeting.actionItems.map((item) => {
                const status = actionStatus[item.id] || item.status;
                const done = status === "Completed";
                return (
                  <div className="eb-action-row" key={item.id}>
                    <ActionCheckbox checked={done} onToggle={() => onToggleAction(item.id)} />
                    <div className="eb-action-text-col">
                      <div className={cx("eb-action-text", done && "eb-action-text-done")}>
                        {item.text}
                      </div>
                      <div className="eb-label-xs">{formatDueLabel(item.due)}</div>
                    </div>
                    <Avatar person={item.owner} size={24} />
                    <span
                      className={cx(
                        "eb-status-pill",
                        done && "eb-status-done",
                        status === "In progress" && "eb-status-progress"
                      )}
                    >
                      {done ? "Completed" : status}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="eb-card-section">
            <div className="eb-section-head">
              <h2 className="eb-h2">Topics</h2>
              <button className="eb-text-btn" onClick={() => setShowAllTopics((v) => !v)}>
                {showAllTopics ? "Collapse" : "Expand"}
              </button>
            </div>
            {showAllTopics && (
              <div className="eb-topic-list">
                {meeting.topics.map((t) => (
                  <TopicTag key={t.label} label={t.label} weight={t.weight} />
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="eb-detail-side">
          <section className="eb-side-block">
            <div className="eb-label-xs eb-accent-label">Participants</div>
            <div className="eb-participant-list">
              {meeting.participants.map((p) => (
                <div className="eb-participant-row" key={p}>
                  <Avatar person={p} size={26} />
                  <span>{PEOPLE[p]?.name || p}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="eb-side-block eb-health-block">
            <div className="eb-label-xs eb-accent-label">Meeting health</div>
            <div className="eb-health-top">
              <HealthRing score={meeting.health.score} />
              <div className="eb-health-word">{healthWord(meeting.health.score)}</div>
            </div>
            <div className="eb-health-bars">
              {[
                ["Participation", meeting.health.participation],
                ["Decision clarity", meeting.health.clarity],
                ["Focus", meeting.health.focus],
                ["Sentiment", meeting.health.sentiment],
              ].map(([label, val]) => (
                <div className="eb-health-bar-row" key={label}>
                  <div className="eb-health-bar-label">{label}</div>
                  <div className="eb-health-bar-track">
                    <div className="eb-health-bar-fill" style={{ width: `${val}%` }} />
                  </div>
                  <div className="eb-health-bar-val">{val}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="eb-side-block">
            <div className="eb-label-xs eb-accent-label">Speaker balance</div>
            <SpeakerBalance speakers={meeting.speakers} />
          </section>

          <section className="eb-side-block">
            <div className="eb-label-xs eb-accent-label">Key moments</div>
            <div className="eb-moment-list">
              {meeting.moments.map((m, i) => (
                <div className="eb-moment" key={i}>
                  <div className="eb-moment-time">{m.time}</div>
                  <div className="eb-moment-dot" style={{ background: MOMENT_DOT[m.type] || COLORS.sub }} />
                  <div className="eb-moment-label">{m.label}</div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Insights page                                                           */
/* ---------------------------------------------------------------------- */

const RANGE_DAYS = { "7d": 7, "30d": 30, "90d": 90 };

function InsightsPage({ meetings, onOpenMeeting }) {
  const [range, setRange] = useState("30d");
  const data = PULSE_DATA.slice(-RANGE_DAYS[range]);
  const meetingById = useMemo(() => new Map(meetings.map((m) => [m.id, m])), [meetings]);

  return (
    <div className="eb-page">
      <div className="eb-page-head">
        <div>
          <h1 className="eb-h1 eb-h1-sm">Signals</h1>
          <p className="eb-hero-sub eb-hero-sub-sm">Patterns hiding inside your conversations.</p>
        </div>
        <div className="eb-range-toggle">
          {Object.keys(RANGE_DAYS).map((key) => (
            <button
              key={key}
              className={cx("eb-range-btn", range === key && "eb-range-btn-active")}
              onClick={() => setRange(key)}
            >
              {key === "7d" ? "7 days" : key === "30d" ? "30 days" : "90 days"}
            </button>
          ))}
        </div>
      </div>

      <section className="eb-section">
        <div className="eb-section-head">
          <h2 className="eb-h2">Meeting volume &amp; duration</h2>
        </div>
        <PulseChart data={data} />
      </section>

      <section className="eb-section">
        <div className="eb-section-head">
          <h2 className="eb-h2">Observations</h2>
        </div>
        {INSIGHTS.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Not enough data yet"
            body="Signals will appear here once you have a few more meetings logged."
          />
        ) : (
          <div className="eb-insight-list">
            {INSIGHTS.map((ins) => (
              <div className="eb-insight" key={ins.id}>
                <div className="eb-insight-top">
                  <h3 className="eb-insight-title">{ins.title}</h3>
                  <div className="eb-insight-metric">
                    <TrendIndicator trend={ins.trend} />
                    {ins.metric}
                  </div>
                </div>
                <p className="eb-insight-body">{ins.explanation}</p>
                <div className="eb-insight-related">
                  <span className="eb-label-xs">Related:</span>
                  {ins.related.map((id) => (
                    <button
                      key={id}
                      className="eb-related-chip"
                      onClick={() => onOpenMeeting(id)}
                    >
                      {meetingById.get(id)?.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Action items page                                                       */
/* ---------------------------------------------------------------------- */

function ActionItemsPage({ items, actionStatus, onToggleAction, onOpenMeeting }) {
  const [tab, setTab] = useState("open");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [meetingFilter, setMeetingFilter] = useState("all");
  const [sortByDue, setSortByDue] = useState(true);

  const withStatus = items.map((it) => ({ ...it, status: actionStatus[it.id] || it.status }));

  const counts = {
    open: withStatus.filter((i) => i.status !== "Completed").length,
    dueSoon: withStatus.filter(
      (i) => i.status !== "Completed" && parseDate(i.due) - parseDate("2026-09-05") <= 3 * 86400000
    ).length,
    completed: withStatus.filter((i) => i.status === "Completed").length,
  };

  let filtered = withStatus.filter((i) => {
    if (tab === "open") return i.status !== "Completed";
    if (tab === "dueSoon")
      return i.status !== "Completed" && parseDate(i.due) - parseDate("2026-09-05") <= 3 * 86400000;
    return i.status === "Completed";
  });
  if (ownerFilter !== "all") filtered = filtered.filter((i) => i.owner === ownerFilter);
  if (meetingFilter !== "all") filtered = filtered.filter((i) => i.meetingId === meetingFilter);
  if (sortByDue) filtered = [...filtered].sort((a, b) => parseDate(a.due) - parseDate(b.due));

  const meetingOptions = Array.from(new Map(items.map((i) => [i.meetingId, i.meetingTitle])));

  return (
    <div className="eb-page">
      <div className="eb-page-head">
        <div>
          <h1 className="eb-h1 eb-h1-sm">Action items</h1>
          <p className="eb-hero-sub eb-hero-sub-sm">Everything your meetings asked for, in one place.</p>
        </div>
      </div>

      <div className="eb-tab-row">
        {[
          ["open", "Open", counts.open],
          ["dueSoon", "Due soon", counts.dueSoon],
          ["completed", "Completed", counts.completed],
        ].map(([key, label, count]) => (
          <button
            key={key}
            className={cx("eb-tab", tab === key && "eb-tab-active")}
            onClick={() => setTab(key)}
          >
            {label}
            <span className="eb-tab-count">{count}</span>
          </button>
        ))}
      </div>

      <div className="eb-filter-bar">
        <select className="eb-select" value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
          <option value="all">All owners</option>
          {ALL_PEOPLE_NAMES.map((n) => (
            <option key={n} value={n}>
              {PEOPLE[n].name}
            </option>
          ))}
        </select>
        <select
          className="eb-select"
          value={meetingFilter}
          onChange={(e) => setMeetingFilter(e.target.value)}
        >
          <option value="all">All meetings</option>
          {meetingOptions.map(([id, title]) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </select>
        <button
          className={cx("eb-filter-chip", sortByDue && "eb-filter-chip-active")}
          onClick={() => setSortByDue((v) => !v)}
        >
          <SlidersHorizontal size={13} />
          Sort by due date
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title={tab === "completed" ? "Nothing completed yet" : "You're all caught up"}
          body={
            tab === "completed"
              ? "Completed action items will show up here."
              : "No action items match these filters right now."
          }
        />
      ) : (
        <div className="eb-action-list eb-action-list-page">
          {filtered.map((item) => {
            const done = item.status === "Completed";
            return (
              <div className="eb-action-row eb-action-row-page" key={item.id}>
                <ActionCheckbox checked={done} onToggle={() => onToggleAction(item.id)} />
                <div className="eb-action-text-col">
                  <div className={cx("eb-action-text", done && "eb-action-text-done")}>{item.text}</div>
                  <button className="eb-action-source" onClick={() => onOpenMeeting(item.meetingId)}>
                    {item.meetingTitle}
                  </button>
                </div>
                <Avatar person={item.owner} size={24} />
                <div className="eb-label-xs eb-action-due">{formatDueLabel(item.due)}</div>
                <span
                  className={cx(
                    "eb-status-pill",
                    done && "eb-status-done",
                    item.status === "In progress" && "eb-status-progress"
                  )}
                >
                  {item.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* App shell                                                                */
/* ---------------------------------------------------------------------- */

function LoadingScreen() {
  return (
    <div className="eb-page">
      <div className="eb-hero">
        <div className="eb-hero-copy" style={{ width: "100%" }}>
          <Skeleton w={140} h={11} />
          <div style={{ height: 14 }} />
          <Skeleton w="70%" h={38} />
          <div style={{ height: 8 }} />
          <Skeleton w="45%" h={38} />
          <div style={{ height: 14 }} />
          <Skeleton w="55%" h={14} />
        </div>
      </div>
      <div className="eb-metric-strip">
        {[0, 1, 2, 3].map((i) => (
          <div className="eb-metric" key={i}>
            <Skeleton w={60} h={30} />
            <div style={{ height: 8 }} />
            <Skeleton w={90} h={10} />
          </div>
        ))}
      </div>
      <Skeleton w="100%" h={220} style={{ marginTop: 32, borderRadius: 8 }} />
    </div>
  );
}

function AddMeetingModal({ onClose, onUploaded }) {
  const [stage, setStage] = useState("empty"); // empty | uploading | done
  const fileRef = useRef(null);

  function simulateUpload() {
    setStage("uploading");
    setTimeout(() => setStage("done"), 1400);
  }

  return (
    <Modal title="Add a meeting" onClose={onClose}>
      {stage === "empty" && (
        <div
          className="eb-upload-zone"
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" style={{ display: "none" }} onChange={simulateUpload} />
          <Upload size={20} strokeWidth={1.5} />
          <div className="eb-upload-title">Drop a transcript or recording</div>
          <div className="eb-label-xs">MP3, MP4, WAV, or TXT &middot; or click to browse</div>
          <button className="eb-btn eb-btn-primary" style={{ marginTop: 16 }} onClick={simulateUpload}>
            Choose file
          </button>
        </div>
      )}
      {stage === "uploading" && (
        <div className="eb-upload-zone">
          <div className="eb-spinner" />
          <div className="eb-upload-title">Processing transcript&hellip;</div>
          <div className="eb-label-xs">Identifying speakers, decisions, and action items</div>
        </div>
      )}
      {stage === "done" && (
        <div className="eb-upload-zone">
          <div className="eb-upload-check">
            <Check size={20} strokeWidth={2.5} />
          </div>
          <div className="eb-upload-title">Meeting added</div>
          <div className="eb-label-xs">This is a demo &mdash; new meetings use sample data.</div>
          <button className="eb-btn eb-btn-primary" style={{ marginTop: 16 }} onClick={onUploaded}>
            Done
          </button>
        </div>
      )}
    </Modal>
  );
}

function ExportModal({ meetingTitle, onClose }) {
  const [format, setFormat] = useState("pdf");
  return (
    <Modal title="Export meeting" onClose={onClose} width={420}>
      <p className="eb-label-xs" style={{ marginBottom: 16 }}>
        Exporting <strong style={{ color: COLORS.ink }}>{meetingTitle}</strong>
      </p>
      <div className="eb-format-options">
        {["pdf", "markdown", "csv"].map((f) => (
          <button
            key={f}
            className={cx("eb-format-option", format === f && "eb-format-option-active")}
            onClick={() => setFormat(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <button className="eb-btn eb-btn-primary" style={{ width: "100%", marginTop: 20 }} onClick={onClose}>
        <Download size={14} />
        Export as {format.toUpperCase()}
      </button>
    </Modal>
  );
}

export default function EchoBoard() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("overview");
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [actionStatus, setActionStatus] = useState({});
  const [toast, setToast] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth < 860);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function openMeeting(id) {
    setSelectedMeetingId(id);
    setPage("meetingDetail");
  }

  function toggleAction(id) {
    setActionStatus((prev) => {
      const current = prev[id] || ALL_ACTION_ITEMS.find((a) => a.id === id)?.status;
      return { ...prev, [id]: current === "Completed" ? "Open" : "Completed" };
    });
  }

  function handleShare() {
    setToast("Link copied to clipboard");
  }

  const selectedMeeting = MEETINGS.find((m) => m.id === selectedMeetingId) || null;

  let content;
  if (loading) {
    content = <LoadingScreen />;
  } else if (page === "overview") {
    content = (
      <OverviewPage
        meetings={MEETINGS}
        actionItems={ALL_ACTION_ITEMS}
        onOpenMeeting={openMeeting}
        onAdd={() => setShowAddModal(true)}
      />
    );
  } else if (page === "meetings") {
    content = <MeetingsPage meetings={MEETINGS} onOpenMeeting={openMeeting} />;
  } else if (page === "meetingDetail") {
    content = (
      <MeetingDetailPage
        meeting={selectedMeeting}
        actionStatus={actionStatus}
        onToggleAction={toggleAction}
        onBack={() => setPage("meetings")}
        onShare={handleShare}
        onExport={() => setShowExportModal(true)}
      />
    );
  } else if (page === "insights") {
    content = <InsightsPage meetings={MEETINGS} onOpenMeeting={openMeeting} />;
  } else if (page === "actions") {
    content = (
      <ActionItemsPage
        items={ALL_ACTION_ITEMS}
        actionStatus={actionStatus}
        onToggleAction={toggleAction}
        onOpenMeeting={openMeeting}
      />
    );
  }

  return (
    <div className="eb-app">
      <style>{EB_STYLES}</style>
      {!isMobile && (
        <NavRail
          page={page === "meetingDetail" ? "meetings" : page}
          setPage={(p) => {
            setPage(p);
          }}
          onAdd={() => setShowAddModal(true)}
        />
      )}
      <main className={cx("eb-main", isMobile && "eb-main-mobile")}>{content}</main>
      {isMobile && (
        <BottomNav
          page={page === "meetingDetail" ? "meetings" : page}
          setPage={(p) => setPage(p)}
        />
      )}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      {showAddModal && (
        <AddMeetingModal onClose={() => setShowAddModal(false)} onUploaded={() => setShowAddModal(false)} />
      )}
      {showExportModal && (
        <ExportModal meetingTitle={selectedMeeting?.title || "meeting"} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Styles                                                                   */
/* ---------------------------------------------------------------------- */

const EB_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

.eb-app {
  --ink: #181818;
  --sub: #77746E;
  --bg: #F7F6F2;
  --panel: #FCFBF8;
  --accent: #FF6548;
  --success: #3D8B67;
  --warning: #D69A38;
  --border: #E4E1DA;
  display: flex;
  width: 100%;
  min-height: 640px;
  background: var(--bg);
  color: var(--ink);
  font-family: 'Manrope', system-ui, -apple-system, 'Segoe UI', sans-serif;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.eb-app * { box-sizing: border-box; }
.eb-app button { font-family: inherit; cursor: pointer; background: none; border: none; color: inherit; }
.eb-app input, .eb-app select { font-family: inherit; }
.eb-app ::selection { background: rgba(255,101,72,0.2); }

.eb-serif { font-family: 'Instrument Serif', Georgia, serif; }

/* ---- Nav rail ---- */
.eb-rail {
  width: 84px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 16px;
  background: var(--panel);
}
.eb-rail-mark {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--bg);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 18px;
  cursor: pointer;
  margin-bottom: 32px;
}
.eb-rail-items { display: flex; flex-direction: column; gap: 6px; flex: 1; width: 100%; align-items: center; }
.eb-rail-item {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  width: 62px; padding: 9px 0;
  border-radius: 10px;
  color: var(--sub);
  transition: background .15s ease, color .15s ease;
}
.eb-rail-item:hover { background: rgba(24,24,24,0.04); color: var(--ink); }
.eb-rail-item-active { color: var(--ink); background: rgba(255,101,72,0.09); }
.eb-rail-label { font-size: 10px; letter-spacing: 0.02em; }
.eb-rail-add {
  width: 34px; height: 34px; border-radius: 50%;
  border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  color: var(--ink);
  transition: border-color .15s ease, color .15s ease;
}
.eb-rail-add:hover { border-color: var(--accent); color: var(--accent); }

/* ---- Bottom nav ---- */
.eb-bottom-nav {
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex; justify-content: space-around;
  background: var(--panel);
  border-top: 1px solid var(--border);
  padding: 8px 4px 10px;
  z-index: 20;
}
.eb-bottom-item { display: flex; flex-direction: column; align-items: center; gap: 3px; color: var(--sub); font-size: 10px; padding: 4px 10px; }
.eb-bottom-item-active { color: var(--accent); }

/* ---- Main / page ---- */
.eb-main { flex: 1; overflow-y: auto; padding: 40px 48px 64px; max-height: 900px; }
.eb-main-mobile { padding: 24px 18px 84px; max-height: 900px; }
.eb-page { max-width: 1180px; margin: 0 auto; animation: eb-fade .35s ease; }
@keyframes eb-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.eb-label-xs {
  font-size: 11.5px;
  color: var(--sub);
  letter-spacing: 0.02em;
}
.eb-accent-label {
  text-transform: uppercase;
  letter-spacing: 0.09em;
  font-size: 10.5px;
  font-weight: 700;
  color: var(--accent);
}

.eb-h1 {
  font-family: 'Instrument Serif', Georgia, serif;
  font-weight: 400;
  font-size: 46px;
  line-height: 1.06;
  margin: 10px 0 0;
  letter-spacing: -0.01em;
}
.eb-h1-sm { font-size: 32px; margin-top: 4px; }
.eb-h2 { font-size: 17px; font-weight: 700; margin: 0; letter-spacing: -0.01em; }
.eb-hero-sub { color: var(--sub); font-size: 15px; margin: 14px 0 0; max-width: 40ch; }
.eb-hero-sub-sm { margin-top: 6px; font-size: 14px; }

.eb-hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 36px; }
.eb-hero-controls { display: flex; align-items: center; gap: 10px; }
.eb-page-head { display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px; }

.eb-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 9px 16px;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 600;
  transition: transform .12s ease, background .15s ease, border-color .15s ease;
  white-space: nowrap;
}
.eb-btn:active { transform: scale(0.97); }
.eb-btn-primary { background: var(--ink); color: var(--bg); }
.eb-btn-primary:hover { background: var(--accent); }
.eb-btn-ghost { border: 1px solid var(--border); color: var(--ink); background: var(--panel); }
.eb-btn-ghost:hover { border-color: var(--ink); }

.eb-filter-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 13px;
  border-radius: 20px;
  border: 1px solid var(--border);
  font-size: 12.5px;
  color: var(--ink);
  background: var(--panel);
}
.eb-filter-chip-active { border-color: var(--accent); color: var(--accent); }

.eb-icon-btn { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 7px; color: var(--sub); }
.eb-icon-btn:hover { background: rgba(24,24,24,0.06); color: var(--ink); }
.eb-icon-btn-border { border: 1px solid var(--border); }

/* ---- Metric strip ---- */
.eb-metric-strip {
  display: flex;
  align-items: stretch;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 22px 0;
  margin-bottom: 40px;
  gap: 0;
}
.eb-metric { flex: 1; padding: 0 28px; }
.eb-metric:first-child { padding-left: 0; }
.eb-metric-divider { width: 1px; background: var(--border); }
.eb-metric-value {
  font-family: 'Instrument Serif', Georgia, serif;
  font-size: 34px;
  line-height: 1;
  margin-bottom: 8px;
}

/* ---- Sections ---- */
.eb-section { margin-bottom: 44px; }
.eb-section-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; gap: 12px; }
.eb-pulse-chart { border: 1px solid var(--border); border-radius: 10px; padding: 16px 8px 4px; background: var(--panel); }

.eb-split { display: grid; grid-template-columns: 1.5fr 1fr; gap: 48px; }
@media (max-width: 900px) { .eb-split { grid-template-columns: 1fr; } }

.eb-recent-list { display: flex; flex-direction: column; }
.eb-recent-row {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 15px 4px;
  border-bottom: 1px solid var(--border);
  text-align: left;
  width: 100%;
  transition: padding-left .15s ease;
}
.eb-recent-row:hover { padding-left: 10px; }
.eb-recent-title { font-weight: 600; font-size: 14.5px; margin-bottom: 4px; }

.eb-sentiment { display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; }
.eb-sentiment-dot { width: 7px; height: 7px; border-radius: 50%; }

.eb-signal-list { display: flex; flex-direction: column; gap: 18px; }
.eb-signal { display: flex; gap: 10px; align-items: flex-start; }
.eb-signal p { margin: 0; font-size: 14px; line-height: 1.5; }

.eb-trend { display: inline-flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 5px; flex-shrink: 0; margin-top: 1px; }
.eb-trend-up { background: rgba(61,139,103,0.13); color: var(--success); }
.eb-trend-down { background: rgba(255,101,72,0.13); color: var(--accent); }
.eb-trend-flat { background: rgba(119,116,110,0.13); color: var(--sub); }

/* ---- Filter bar / search / select ---- */
.eb-filter-bar { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 22px; }
.eb-search {
  display: flex; align-items: center; gap: 8px;
  border: 1px solid var(--border); border-radius: 7px;
  padding: 8px 12px; background: var(--panel);
  color: var(--sub);
  flex: 1; min-width: 180px;
}
.eb-search input { border: none; outline: none; background: none; color: var(--ink); font-size: 13.5px; width: 100%; }
.eb-select {
  border: 1px solid var(--border); border-radius: 7px;
  padding: 8px 10px; background: var(--panel);
  font-size: 13px; color: var(--ink);
}

/* ---- Meetings list ---- */
.eb-meeting-group { margin-bottom: 26px; }
.eb-meeting-group-date { text-transform: uppercase; margin-bottom: 8px; display: block; }
.eb-meeting-list { display: flex; flex-direction: column; }
.eb-meeting-row {
  display: grid;
  grid-template-columns: 64px 1.6fr 70px 1.1fr auto 16px;
  align-items: center;
  gap: 14px;
  padding: 15px 10px;
  border-bottom: 1px solid var(--border);
  border-left: 2px solid transparent;
  width: 100%;
  text-align: left;
  transition: border-left-color .15s ease, background .15s ease;
}
.eb-meeting-row:hover { border-left-color: var(--accent); background: rgba(255,101,72,0.03); }
.eb-meeting-time { font-size: 12.5px; color: var(--sub); }
.eb-meeting-title { font-weight: 600; font-size: 14.5px; margin-bottom: 3px; }
.eb-meeting-duration { font-size: 12.5px; color: var(--sub); }
.eb-meeting-chevron { color: var(--sub); }
@media (max-width: 720px) {
  .eb-meeting-row { grid-template-columns: 1fr auto; grid-template-areas: "title chev" "time time" "sum sum" "sent sent"; row-gap: 6px; }
  .eb-meeting-time { display: none; }
  .eb-meeting-summary-col { display: none; }
}

/* ---- Empty state ---- */
.eb-empty { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 64px 20px; color: var(--sub); }
.eb-empty-icon { width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.eb-empty-title { font-weight: 700; color: var(--ink); font-size: 15px; margin-bottom: 6px; }
.eb-empty-body { font-size: 13.5px; max-width: 32ch; }

/* ---- Meeting detail ---- */
.eb-back { display: inline-flex; align-items: center; gap: 4px; color: var(--sub); font-size: 13px; margin-bottom: 18px; }
.eb-back:hover { color: var(--ink); }
.eb-detail-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; flex-wrap: wrap; margin-bottom: 36px; }
.eb-detail-meta { margin-top: 8px; }
.eb-detail-actions { display: flex; gap: 8px; flex-shrink: 0; }
.eb-detail-grid { display: grid; grid-template-columns: 1.7fr 1fr; gap: 56px; }
@media (max-width: 900px) { .eb-detail-grid { grid-template-columns: 1fr; gap: 36px; } }

.eb-card-section { margin-bottom: 40px; }
.eb-summary p { font-size: 15.5px; line-height: 1.75; margin: 0 0 14px; max-width: 62ch; }
.eb-summary p:last-child { margin-bottom: 0; }

.eb-decision-list { display: flex; flex-direction: column; gap: 18px; }
.eb-decision { display: flex; gap: 14px; }
.eb-decision-num { font-family: 'Instrument Serif', Georgia, serif; font-size: 20px; color: var(--accent); flex-shrink: 0; width: 28px; }
.eb-decision-body p { margin: 0 0 5px; font-size: 14.5px; line-height: 1.5; max-width: 58ch; }

.eb-action-list { display: flex; flex-direction: column; }
.eb-action-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 4px;
  border-bottom: 1px solid var(--border);
}
.eb-action-list-page .eb-action-row { padding: 13px 8px; }
.eb-checkbox {
  width: 19px; height: 19px; border-radius: 5px; border: 1.5px solid var(--border);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  color: #fff; transition: background .15s ease, border-color .15s ease, transform .12s ease;
}
.eb-checkbox:active { transform: scale(0.88); }
.eb-checkbox-checked { background: var(--success); border-color: var(--success); }
.eb-action-text-col { flex: 1; min-width: 0; }
.eb-action-text { font-size: 14px; font-weight: 500; }
.eb-action-text-done { color: var(--sub); text-decoration: line-through; }
.eb-action-source { font-size: 11.5px; color: var(--sub); margin-top: 2px; text-decoration: underline; text-underline-offset: 2px; }
.eb-action-due { flex-shrink: 0; white-space: nowrap; }
.eb-status-pill {
  font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 20px;
  background: rgba(214,154,56,0.14); color: var(--warning); flex-shrink: 0; white-space: nowrap;
}
.eb-status-done { background: rgba(61,139,103,0.14); color: var(--success); }
.eb-status-progress { background: rgba(91,124,250,0.14); color: #5B7CFA; }

.eb-topic-list { display: flex; flex-wrap: wrap; gap: 8px; }
.eb-topic {
  font-size: 12px; padding: 6px 12px; border-radius: 20px;
  border: 1px solid var(--border); color: var(--ink);
}
.eb-text-btn { font-size: 12px; color: var(--sub); text-decoration: underline; text-underline-offset: 2px; }
.eb-text-btn:hover { color: var(--ink); }

.eb-detail-side { display: flex; flex-direction: column; gap: 32px; }
.eb-side-block { border-top: 1px solid var(--border); padding-top: 16px; }
.eb-participant-list { display: flex; flex-direction: column; gap: 11px; margin-top: 12px; }
.eb-participant-row { display: flex; align-items: center; gap: 10px; font-size: 13.5px; }

.eb-health-top { display: flex; align-items: center; gap: 18px; margin: 14px 0 18px; }
.eb-ring-wrap { position: relative; flex-shrink: 0; }
.eb-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.eb-ring-score { font-family: 'Instrument Serif', Georgia, serif; font-size: 26px; line-height: 1; }
.eb-ring-max { font-size: 10px; color: var(--sub); }
.eb-ring-arc { transition: stroke-dashoffset 1s cubic-bezier(.4,0,.2,1); }
.eb-health-word { font-weight: 700; font-size: 15px; }
.eb-health-bars { display: flex; flex-direction: column; gap: 10px; }
.eb-health-bar-row { display: grid; grid-template-columns: 92px 1fr 22px; align-items: center; gap: 10px; }
.eb-health-bar-label { font-size: 11.5px; color: var(--sub); }
.eb-health-bar-track { height: 5px; background: var(--border); border-radius: 4px; overflow: hidden; }
.eb-health-bar-fill { height: 100%; background: var(--ink); border-radius: 4px; transition: width .8s ease; }
.eb-health-bar-val { font-size: 11.5px; text-align: right; }

.eb-speaker-list { display: flex; flex-direction: column; gap: 10px; margin-top: 12px; }
.eb-speaker-row { display: grid; grid-template-columns: 60px 1fr 32px; align-items: center; gap: 10px; }
.eb-speaker-name { font-size: 12.5px; }
.eb-speaker-track { height: 7px; background: var(--border); border-radius: 4px; overflow: hidden; }
.eb-speaker-fill { height: 100%; border-radius: 4px; transition: width .8s ease; }
.eb-speaker-pct { font-size: 11.5px; color: var(--sub); text-align: right; }

.eb-moment-list { display: flex; flex-direction: column; gap: 14px; margin-top: 12px; }
.eb-moment { display: grid; grid-template-columns: 40px 10px 1fr; align-items: center; gap: 10px; }
.eb-moment-time { font-size: 11.5px; color: var(--sub); }
.eb-moment-dot { width: 7px; height: 7px; border-radius: 50%; }
.eb-moment-label { font-size: 13px; }

/* ---- Avatars ---- */
.eb-avatar { border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
.eb-avatar-stack { display: flex; align-items: center; }
.eb-avatar-more { width: 26px; height: 26px; border-radius: 50%; background: var(--border); color: var(--sub); font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* ---- Insights ---- */
.eb-range-toggle { display: flex; border: 1px solid var(--border); border-radius: 20px; padding: 3px; }
.eb-range-btn { padding: 6px 13px; border-radius: 16px; font-size: 12.5px; color: var(--sub); }
.eb-range-btn-active { background: var(--ink); color: var(--bg); }
.eb-insight-list { display: flex; flex-direction: column; }
.eb-insight { padding: 22px 4px; border-bottom: 1px solid var(--border); }
.eb-insight-top { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 8px; }
.eb-insight-title { font-size: 16px; font-weight: 700; margin: 0; }
.eb-insight-metric { display: flex; align-items: center; gap: 6px; font-family: 'Instrument Serif', Georgia, serif; font-size: 18px; flex-shrink: 0; }
.eb-insight-body { font-size: 14px; color: var(--sub); line-height: 1.6; max-width: 68ch; margin: 0 0 12px; }
.eb-insight-related { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.eb-related-chip { font-size: 11.5px; padding: 5px 11px; border-radius: 16px; border: 1px solid var(--border); }
.eb-related-chip:hover { border-color: var(--accent); color: var(--accent); }

/* ---- Action items page ---- */
.eb-tab-row { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
.eb-tab { display: flex; align-items: center; gap: 7px; padding: 10px 16px; font-size: 13.5px; font-weight: 600; color: var(--sub); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.eb-tab-active { color: var(--ink); border-bottom-color: var(--accent); }
.eb-tab-count { font-size: 11px; background: var(--border); color: var(--ink); padding: 1px 7px; border-radius: 10px; }
.eb-tab-active .eb-tab-count { background: rgba(255,101,72,0.15); color: var(--accent); }

/* ---- Skeleton ---- */
.eb-skeleton { background: linear-gradient(90deg, var(--border) 25%, #EFEDE7 50%, var(--border) 75%); background-size: 200% 100%; animation: eb-shimmer 1.4s ease infinite; border-radius: 4px; }
@keyframes eb-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ---- Toast ---- */
.eb-toast {
  position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%);
  background: var(--ink); color: var(--bg);
  padding: 11px 18px; border-radius: 8px;
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500;
  animation: eb-toast-in .25s ease;
  z-index: 40;
}
@keyframes eb-toast-in { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }

/* ---- Modal ---- */
.eb-modal-backdrop {
  position: absolute; inset: 0; background: rgba(24,24,24,0.35);
  display: flex; align-items: center; justify-content: center;
  z-index: 50; padding: 20px;
}
.eb-modal {
  background: var(--panel); border-radius: 12px; width: 100%;
  border: 1px solid var(--border);
  animation: eb-modal-in .2s ease;
}
@keyframes eb-modal-in { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
.eb-modal-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px; border-bottom: 1px solid var(--border); }
.eb-modal-title { font-weight: 700; font-size: 15px; }
.eb-modal-body { padding: 22px 20px 24px; }

.eb-upload-zone { display: flex; flex-direction: column; align-items: center; text-align: center; padding: 28px 12px; border: 1.5px dashed var(--border); border-radius: 10px; color: var(--sub); cursor: pointer; }
.eb-upload-title { font-weight: 700; color: var(--ink); font-size: 14px; margin: 12px 0 4px; }
.eb-upload-check { width: 40px; height: 40px; border-radius: 50%; background: rgba(61,139,103,0.14); color: var(--success); display: flex; align-items: center; justify-content: center; margin-bottom: 4px; }
.eb-spinner { width: 26px; height: 26px; border-radius: 50%; border: 2.5px solid var(--border); border-top-color: var(--accent); animation: eb-spin .7s linear infinite; }
@keyframes eb-spin { to { transform: rotate(360deg); } }

.eb-format-options { display: flex; gap: 8px; }
.eb-format-option { flex: 1; padding: 10px; border: 1px solid var(--border); border-radius: 7px; font-size: 12.5px; font-weight: 600; }
.eb-format-option-active { border-color: var(--ink); background: var(--ink); color: var(--bg); }

@media (max-width: 640px) {
  .eb-h1 { font-size: 34px; }
  .eb-metric-strip { flex-wrap: wrap; row-gap: 18px; }
  .eb-metric { flex: 1 1 40%; padding: 0 12px; border-right: none; }
  .eb-metric-divider { display: none; }
  .eb-hero { align-items: flex-start; }
  .eb-hero-controls { width: 100%; }
}
`;
