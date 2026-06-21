"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  X,
  Bot,
  Trash2,
  Loader2,
  Send,
  HelpCircle,
  TrendingUp,
  MapPin,
  FileText,
  AlertTriangle,
  BotIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getZoneHotspots,
  getCurrentAllocationPlan,
  getViolationsSummary,
  getViolationsTimeseries,
  getResourcesSummary,
  getForecasts,
} from "@/lib/api";

type Message = {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
};

const SUGGESTED_QUESTIONS = [
  {
    id: "why_high_risk",
    label: "Why is this zone high risk?",
    icon: AlertTriangle
  },
  {
    id: "top_hotspots",
    label: "Show top hotspots today",
    icon: MapPin
  },
  {
    id: "where_deploy",
    label: "Where should officers be deployed?",
    icon: Send
  },
  {
    id: "highest_predicted",
    label: "Which zone has highest predicted violations?",
    icon: TrendingUp
  },
  {
    id: "immediate_intervention",
    label: "Which area needs immediate intervention?",
    icon: HelpCircle
  },
  {
    id: "explain_risk_trend",
    label: "Explain today's risk trend",
    icon: TrendingUp
  },
  {
    id: "daily_report",
    label: "Generate daily enforcement report",
    icon: FileText
  },
  {
    id: "summarize_risk",
    label: "Summarize city risk status",
    icon: FileText
  },
];

const INITIAL_MESSAGES = (): Message[] => [
  {
    id: "welcome",
    sender: "bot",
    text: "Hello! I am your **NoParkPro AI Enforcement Copilot**. I can help you analyze traffic intelligence, optimize deployments, and generate report drafts from real-time command center telemetry.\n\nSelect one of the queries below to get started.",
    timestamp: new Date(),
  },
];

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[?.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

const INTENT_HANDLERS: Record<
  string,
  {
    label: string;
    aliases: string[];
    keywords: string[];
    execute: () => Promise<string>;
  }
> = {
  why_high_risk: {
    label: "Why is this zone high risk?",
    aliases: [],
    keywords: ["high risk", "risk zone", "dangerous zone", "hotspot reason", "why risk"],
    execute: async () => {
      const selectedZoneId = typeof window !== "undefined" ? localStorage.getItem("noparkpro_selected_zone_id") : null;
      const hotspotsRes = await getZoneHotspots();
      const hotspots = hotspotsRes.data || [];

      let targetZone = null;
      if (selectedZoneId && hotspots.length > 0) {
        targetZone = hotspots.find((h) => h.zoneId === selectedZoneId);
      }
      if (!targetZone && hotspots.length > 0) {
        targetZone = hotspots[0];
      }

      if (targetZone) {
        return `Zone **${targetZone.zoneName}** (${targetZone.shortName}) is currently classified as a **${targetZone.riskLevel.toUpperCase()}** risk area with a risk score of **${targetZone.riskScore}/100**.\n\nHere is why this area is flagged:\n• **Enforcement Demand**: It has recorded **${targetZone.violationCount}** active/historical violations.\n• **Predictive Analytics**: Models project **${targetZone.estimatedViolations}** violations in the next cycle if no enforcement action is taken.\n• **Zone Summary**: ${targetZone.summary || "This zone shows high illegal parking density during peak hours, significantly impacting traffic flow."}\n\n**Copilot Recommendation**:\nDeploy officers to key intersections in ${targetZone.shortName} to increase compliance and deter high-frequency infractions.`;
      } else {
        return `Currently, there are no active zones designated as elevated risk. The city traffic compliance indexes are within nominal ranges.`;
      }
    }
  },
  top_hotspots: {
    label: "Show top hotspots today",
    aliases: ["top hotspots"],
    keywords: ["hotspot", "hotspots", "top hotspots", "risky areas", "worst areas"],
    execute: async () => {
      const hotspotsRes = await getZoneHotspots({ limit: 5 });
      const hotspots = hotspotsRes.data || [];

      if (hotspots.length > 0) {
        return `Today's top **${hotspots.length}** highest-risk zones are:\n\n` +
          hotspots
            .map(
              (h, i) =>
                `${i + 1}. **${h.zoneName}** (${h.shortName}) — Risk: **${h.riskLevel.toUpperCase()}** (Score: ${h.riskScore}/100) with **${h.violationCount}** active violations.`
            )
            .join("\n") +
          `\n\nThese locations exhibit the highest predicted violation counts and should be prioritized for immediate officer deployment.`;
      } else {
        return `No active risk hotspots detected in the city today. All zones are operating under normal conditions.`;
      }
    }
  },
  where_deploy: {
    label: "Where should officers be deployed?",
    aliases: ["deployment recommendation"],
    keywords: ["deploy", "deployment", "officers", "patrol", "allocation", "resources"],
    execute: async () => {
      const planRes = await getCurrentAllocationPlan();
      const plan = planRes.data;

      if (plan && plan.assignments && plan.assignments.length > 0) {
        const topAssignments = plan.assignments.slice(0, 4);
        const expectedImpact = plan.impactMetrics?.find((m) => m.id === "expected-reduction")?.changePercentage || 24;

        return `Based on the current automated allocation plan, officers should be deployed primarily to:\n\n` +
          topAssignments
            .map(
              (a) =>
                `• **${a.zoneName}**: Allocate **${a.officers}** officers and **${a.towTrucks}** tow trucks (Priority: **${a.priority.toUpperCase()}**).`
            )
            .join("\n") +
          `\n\nThis deployment strategy is optimized to maximize violation reduction by an estimated **${Math.abs(expectedImpact)}%** in total active zones.`;
      } else {
        return `No active resource allocation plan is currently available. Please check the Resource Allocation panel to draft a new deployment strategy.`;
      }
    }
  },
  highest_predicted: {
    label: "Which zone has highest predicted violations?",
    aliases: [],
    keywords: ["prediction", "forecast", "future violations", "predicted violations"],
    execute: async () => {
      const forecastsRes = await getForecasts({ page: 1, pageSize: 15 });
      const forecasts = forecastsRes.data || [];

      if (forecasts.length > 0) {
        const sorted = [...forecasts].sort((a, b) => b.estimatedViolations - a.estimatedViolations);
        const top = sorted[0];

        return `The zone with the highest predicted violations is **${top.zoneName}**.\n\n• **Predicted Violations**: **${top.estimatedViolations}** violations expected.\n• **Confidence Score**: **${top.confidence}%** model accuracy confidence.\n• **Congestion Impact**: **${top.congestionImpact}**.\n• **Recommended Action**: ${top.recommendedAction || "Increase local patrol visibility."}\n• **Priority**: **${top.riskLevel.toUpperCase()}**`;
      } else {
        return `No predictive violation forecasts are available right now. Ensure the forecasting engine has completed its daily run.`;
      }
    }
  },
  immediate_intervention: {
    label: "Which area needs immediate intervention?",
    aliases: ["highest risk area"],
    keywords: ["immediate intervention", "intervention"],
    execute: async () => {
      const hotspotsRes = await getZoneHotspots({ limit: 5 });
      const hotspots = hotspotsRes.data || [];
      const criticalZones = hotspots.filter((h) => h.riskLevel === "critical" || h.riskLevel === "high");

      if (criticalZones.length > 0) {
        const primary = criticalZones[0];
        return `### Immediate Intervention Required\n\nThe area requiring the most urgent intervention is **${primary.zoneName}** (${primary.shortName}).\n\n• **Current Risk Level**: **${primary.riskLevel.toUpperCase()}**\n• **Risk Score**: **${primary.riskScore}/100**\n• **Active Infractions**: **${primary.violationCount}**\n• **Congestion Level**: Critically High\n\n**Recommended Intervention Actions**:\n1. Dispatch the nearest patrol unit to **${primary.zoneName}** immediately.\n2. Enable priority video stream analytics for this sector.\n3. Position a tow truck crew nearby to clear blocked transit lanes.\n\n` +
          (criticalZones.length > 1
            ? `Secondary intervention zones to monitor: **${criticalZones
                .slice(1)
                .map((c) => c.zoneName)
                .join(", ")}**.`
            : "");
      } else if (hotspots.length > 0) {
        const primary = hotspots[0];
        return `### Immediate Intervention Recommendation\n\nAlthough there are no zones marked 'CRITICAL', the highest-risk area is currently **${primary.zoneName}** (${primary.shortName}) with a risk score of **${primary.riskScore}/100**.\n\nWe recommend routine patrol checks in this area to prevent violation build-ups.`;
      } else {
        return `No active zones require immediate intervention. Enforcement compliance is at 100% across all sectors.`;
      }
    }
  },
  explain_risk_trend: {
    label: "Explain today's risk trend",
    aliases: [],
    keywords: ["risk trend", "today's trend", "trend", "risk trend analysis"],
    execute: async () => {
      const summaryRes = await getViolationsSummary();
      const summary = summaryRes.data;
      const timeseriesRes = await getViolationsTimeseries({ metric: "violations", grain: "hour" });
      const timeseries = timeseriesRes.data || [];

      const cityScore = summary.cityRiskScore;
      const deltaScore = summary.deltas?.cityRiskScore || 0;
      const activeViolations = summary.activeViolations;
      const deltaViolations = summary.deltas?.activeViolations || 0;

      let peakText = "during peak commute hours";
      if (timeseries.length > 0) {
        const sortedTimeseries = [...timeseries].sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
        const peakPoint = sortedTimeseries[0];
        if (peakPoint && peakPoint.value) {
          peakText = `around **${peakPoint.label}** with **${peakPoint.value}** violations`;
        }
      }

      return `### Today's Risk Trend Analysis\n\n• **City Risk Rating**: Currently at **${summary.cityRiskLevel.toUpperCase()}** risk, with a score of **${cityScore}/100** (Delta: **${
        deltaScore >= 0 ? "+" : ""
      }${deltaScore}**).\n• **Enforcement Pressure**: There are **${activeViolations}** active violations (Delta: **${
        deltaViolations >= 0 ? "+" : ""
      }${deltaViolations}** compared to the last hour).\n• **Peak Risk Spike**: Violations are hitting their peak **${peakText}**.\n• **High Risk Sectors**: We have **${summary.criticalZoneCount}** critical zones and **${summary.highRiskZoneCount}** high-risk zones active.\n\n**Trend Prediction**:\nThe risk index is currently **STABILIZING** due to active patrols, but is projected to experience a slight uptick in the next 4 hours as commute traffic increases. Maintain regular monitoring of core corridors.`;
    }
  },
  daily_report: {
    label: "Generate daily enforcement report",
    aliases: ["daily report"],
    keywords: ["report", "daily report", "enforcement report", "summary report"],
    execute: async () => {
      const [summaryRes, hotspotsRes, resourcesRes] = await Promise.all([
        getViolationsSummary(),
        getZoneHotspots({ limit: 3 }),
        getResourcesSummary(),
      ]);

      const s = summaryRes.data;
      const h = hotspotsRes.data || [];
      const r = resourcesRes.data;

      return `### Daily Enforcement Report\n` +
        `Generated: ${new Date().toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}\n\n` +
        `#### 1. City Risk & Compliance Overview\n` +
        `• **City Risk Index**: **${s.cityRiskLevel.toUpperCase()}** (Score: **${s.cityRiskScore}/100**)\n` +
        `• **Active Violations**: **${s.activeViolations}** (Change: **${
          s.deltas?.activeViolations >= 0 ? "+" : ""
        }${s.deltas?.activeViolations}**)\n` +
        `• **Predicted Violations (24h)**: **${s.predictedViolations24h}**\n` +
        `• **Monitored Areas**: **${s.highRiskZoneCount + s.criticalZoneCount}** elevated risk zones.\n\n` +
        `#### 2. Resource Deployment & Coverage\n` +
        `• **Active Resources**: **${r.totalActiveResources}** units in service.\n` +
        `• **Officer Deployment**: **${r.availableOfficers}** active officers.\n` +
        `• **Tow Truck Support**: **${r.availableTowTrucks}** tow units.\n` +
        `• **Current Coverage**: **${r.projectedCoverage}%** coverage.\n` +
        `• **Expected Violation Reduction**: **${r.expectedViolationReductionPercentage}%** reduction in incidents.\n\n` +
        `#### 3. Top Critical Hotspots\n` +
        h
          .map((zone, i) => `${i + 1}. **${zone.zoneName}** (${zone.shortName}) — Risk: **${zone.riskScore}** (Active: ${zone.violationCount})\n`)
          .join("") +
        `\n` +
        `#### 4. Operational Recommendations\n` +
        `1. **Target Patrols**: Deploy **${Math.ceil(
          r.availableOfficers / 3
        )}** available officers to **${h[0]?.zoneName || "Zone 1"}** where violations are spiking.\n` +
        `2. **Towing Enforcement**: Station tow trucks at congestion points in **${h[1]?.zoneName || "Zone 2"}** to maintain clear transit paths.\n` +
        `3. **Proactive Control**: Monitor predicted violations peaks to adjust shifts dynamically before risk scores scale up.`;
    }
  },
  summarize_risk: {
    label: "Summarize city risk status",
    aliases: ["risk summary"],
    keywords: ["city status", "city risk", "risk summary", "summarize city", "city overview"],
    execute: async () => {
      const [summaryRes, hotspotsRes] = await Promise.all([
        getViolationsSummary(),
        getZoneHotspots({ limit: 1 }),
      ]);
      const s = summaryRes.data;
      const topHotspot = hotspotsRes.data?.[0];

      return `### City Risk Status Summary\n\n` +
        `The city is operating under an overall **${s.cityRiskLevel.toUpperCase()}** risk status with a score of **${s.cityRiskScore}/100**.\n\n` +
        `• **Active Violations**: **${s.activeViolations}** (Delta: **${
          s.deltas?.activeViolations >= 0 ? "+" : ""
        }${s.deltas?.activeViolations}**)\n` +
        `• **Critical Risk Zones**: **${s.criticalZoneCount}** zones flagged with active critical warnings.\n` +
        `• **High Risk Zones**: **${s.highRiskZoneCount}** zones marked with high-risk scores.\n` +
        `• **Top Hotspot**: **${topHotspot ? `${topHotspot.zoneName} (${topHotspot.shortName})` : "None"}** with a risk score of **${topHotspot?.riskScore || 0}/100**.\n\n` +
        `**Operational Directive**:\nFocus active patrols on the **${s.criticalZoneCount}** critical zones. With current resource counts, we predict a **${s.recommendedDeploymentCount}** officer deployment count is required to stabilize risk factors.`;
    }
  }
};

export function AssistantChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize messages on mount (client-side only)
  useEffect(() => {
    setMessages(INITIAL_MESSAGES());
  }, []);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  // Flash the floating button icon if closed and new messages are added
  useEffect(() => {
    if (!isOpen && messages.length > INITIAL_MESSAGES().length) {
      setHasNewMessage(true);
    }
  }, [messages.length, isOpen]);

  // Focus input when the chat panel opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewMessage(false);
  };

  const handleClearChat = () => {
    if (confirm("Are you sure you want to clear the conversation history?")) {
      setMessages(INITIAL_MESSAGES());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleSendMessage = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (isLoading || !inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue("");
    await processQuestion(userText);
  };

  const handleQuestionSelect = async (questionId: string, questionLabel: string) => {
    if (isLoading) return;
    await processQuestion(questionLabel, questionId);
  };

  const processQuestion = async (questionText: string, preMatchedId?: string) => {
    if (isLoading) return;

    // Add user message immediately
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: questionText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      let answerText = "";
      
      // Determine question ID (either passed in or matched via intent matching)
      let questionId = preMatchedId || null;
      if (!questionId) {
        const normQuery = normalizeText(questionText);

        // 1. Match exact/normalized suggested question label
        const matchByLabel = SUGGESTED_QUESTIONS.find(
          (q) => normalizeText(q.label) === normQuery
        );
        if (matchByLabel) {
          questionId = matchByLabel.id;
        }

        // 2. Match exact/normalized aliases
        if (!questionId) {
          for (const [id, config] of Object.entries(INTENT_HANDLERS)) {
            const matchedAlias = config.aliases.find(
              (alias) => normalizeText(alias) === normQuery
            );
            if (matchedAlias) {
              questionId = id;
              break;
            }
          }
        }

        // 3. Match keyword substrings
        if (!questionId) {
          for (const [id, config] of Object.entries(INTENT_HANDLERS)) {
            const matchedKeyword = config.keywords.find(
              (kw) => normQuery.includes(normalizeText(kw))
            );
            if (matchedKeyword) {
              questionId = id;
              break;
            }
          }
        }
      }

      if (!questionId || !INTENT_HANDLERS[questionId]) {
        // No match -> Return fallback prototype message
        answerText = "I don't currently have knowledge for that request.\n\nThis AI Copilot is a prototype and currently supports:\n• Hotspot analysis\n• Risk monitoring\n• Deployment recommendations\n• Violation forecasting\n• Enforcement reporting\n\nPlease select a suggested action or ask a related question.";
      } else {
        // Match found -> Run modular execute handler
        answerText = await INTENT_HANDLERS[questionId].execute();
      }

      // Simulated delay for demo quality and realism
      await new Promise((resolve) => setTimeout(resolve, 800));

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: answerText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("AI Assistant API error: ", err);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        sender: "bot",
        text: `⚠️ **System Error**: I failed to retrieve live data for this query (Error: *${
          err.message || "Unknown error"
        }*). Please make sure the backend server is running and try again.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={index} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const renderMessageText = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("### ")) {
        return (
          <h4 key={idx} className="mt-4 mb-2 text-base font-bold text-slate-100 border-b border-slate-800 pb-1">
            {parseInlineMarkdown(line.substring(4))}
          </h4>
        );
      }
      if (line.startsWith("#### ")) {
        return (
          <h5 key={idx} className="mt-3 mb-1 text-sm font-semibold text-slate-200 uppercase tracking-wide">
            {parseInlineMarkdown(line.substring(5))}
          </h5>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="mt-5 mb-2 text-lg font-extrabold text-slate-100">
            {parseInlineMarkdown(line.substring(3))}
          </h3>
        );
      }

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <div key={idx} className="ml-4 pl-1 my-1.5 flex items-start gap-2.5 text-sm text-slate-300">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            <span className="leading-relaxed">{parseInlineMarkdown(line.substring(2))}</span>
          </div>
        );
      }

      const matchOrdered = line.match(/^(\d+)\.\s(.*)/);
      if (matchOrdered) {
        return (
          <div key={idx} className="ml-4 pl-1 my-1.5 flex items-start gap-2.5 text-sm text-slate-300">
            <span className="font-semibold text-primary shrink-0">{matchOrdered[1]}.</span>
            <span className="leading-relaxed">{parseInlineMarkdown(matchOrdered[2])}</span>
          </div>
        );
      }

      if (line.trim() === "") {
        return <div key={idx} className="h-2" />;
      }

      return (
        <p key={idx} className="text-sm my-1 leading-relaxed text-slate-300">
          {parseInlineMarkdown(line)}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-primary text-on-primary shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/40",
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
        aria-label="Open NoParkPro AI Copilot"
      >
        <div className="relative">
          <BotIcon className="h-6 w-6 animate-pulse" />
          {hasNewMessage && (
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-cyan-500 border border-slate-950"></span>
            </span>
          )}
        </div>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Right Side Chat Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full w-full flex-col border-l border-slate-800 bg-slate-950 text-slate-100 shadow-2xl transition-transform duration-300 ease-in-out sm:w-[450px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 py-3.5 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100 leading-tight">NoParkPro AI Enforcement Copilot</h2>
              <p className="text-[11px] font-medium text-slate-400">Enforcement & Telemetry Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearChat}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
              aria-label="Close panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex w-full items-start gap-2.5", msg.sender === "user" ? "justify-end" : "justify-start")}
            >
              {msg.sender === "bot" && (
                <div className="mt-0.5 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm shadow-sm",
                  msg.sender === "user"
                    ? "rounded-tr-none bg-primary text-on-primary max-w-[85%] font-medium"
                    : "rounded-tl-none bg-slate-900 border border-slate-800 max-w-[85%]"
                )}
              >
                {msg.sender === "user" ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="space-y-1">{renderMessageText(msg.text)}</div>
                )}
                <div
                  className={cn(
                    "mt-1.5 text-[9px] select-none opacity-50",
                    msg.sender === "user" ? "text-right text-on-primary/70" : "text-left text-slate-400"
                  )}
                >
                  {msg.timestamp.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          ))}

          {/* Loading bubble */}
          {isLoading && (
            <div className="flex justify-start items-start gap-2.5">
              <div className="mt-0.5 flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-900 border border-slate-800 px-4 py-3 max-w-[85%] text-slate-400 shadow-sm">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-xs font-semibold animate-pulse tracking-wide text-slate-300">
                    Analyzing city traffic intelligence...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions Section */}
        <div className="border-t border-slate-800 bg-slate-900/60 p-3 space-y-2 flex-shrink-0 max-h-[130px] overflow-y-auto custom-scrollbar">
          <div className="flex items-center gap-1.5 text-slate-400">
            <HelpCircle className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider">Suggested Copilot Actions</span>
          </div>
          <div className="grid grid-cols-1 gap-1.5">
            {SUGGESTED_QUESTIONS.map((question) => {
              const IconComp = question.icon;
              return (
                <button
                  key={question.id}
                  disabled={isLoading}
                  onClick={() => handleQuestionSelect(question.id, question.label)}
                  className="flex w-full items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-left text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-900 active:bg-slate-950 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer group"
                >
                  <IconComp className="h-3.5 w-3.5 shrink-0 text-slate-500 group-hover:text-primary transition-colors" />
                  <span className="flex-1 text-slate-300 group-hover:text-slate-100 transition-colors leading-normal">{question.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Input Section */}
        <div className="border-t border-slate-800 bg-slate-900 px-4 py-3 flex-shrink-0 sticky bottom-0">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about hotspots, deployments, risks, forecasts..."
              className="flex-1 min-w-0 min-h-[60px] max-h-[120px] w-full resize-none rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-primary focus:outline-none transition-colors overflow-y-auto hide-scrollbar"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="flex h-[44px] w-[44px] shrink-0 self-end cursor-pointer items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
