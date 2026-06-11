"use client";

import {
    BannalyzeTemplate,
    Button,
} from "@gunjo/ui";
import {
    IconBulb as Lightbulb,
    IconCheck as Check,
    IconChevronDown as ChevronDown,
    IconChevronRight as ChevronRight,
    IconCircleCheck as CheckCircle,
    IconCircleCheck as CheckCircle2,
    IconDownload as Download,
    IconGridDots as Grid,
    IconHistory as History,
    IconMapPin as MapPin,
    IconMaximize as Maximize2,
    IconMessage as MessageSquare,
    IconPlus as Plus,
    IconShare2 as Share2,
    IconTarget as Target,
    IconX as X,
    IconZoomIn as ZoomIn,
    IconZoomOut as ZoomOut,
} from "@tabler/icons-react";
import React, { useState } from "react";
import { cn } from "@gunjo/ui";

// --- Mock Data ---
const MOCK_RESULT = {
    overallScore: 7.9,
    targetSuitability: {
        score: 8,
        reason: "教育・保育現場向けに明るく親しみやすいデザインですが、アクセントカラーの調整で更なる適性向上が可能です。"
    },
    targetAudience: ["教育関係者", "保護者", "20-40代女性"],
    annotations: [
        { id: 1, x: 20, y: 20, title: "ロゴ配置", description: "視認性は良いですが、余白をもう少し取るとより引き立ちます。" },
        { id: 2, x: 50, y: 50, title: "メインコピー", description: "コントラスト比が4.5:1未満です。背景色を少し暗くするか文字色を調整してください。" },
        { id: 3, x: 20, y: 80, title: "CTAボタン", description: "配置は適切ですが、サイズを1.2倍にするとクリック率向上が見込めます。" },
        { id: 4, x: 80, y: 80, title: "イラスト", description: "ターゲット層にマッチした親しみやすい画風です。" }
    ],
    improvements: [
        { title: "コントラスト比の改善", description: "メインコピーの背景色とのコントラスト比を高め、可読性を向上させてください。", priority: "high" },
        { title: "CTAの強調", description: "ボタンにドロップシャドウを追加し、立体感を出してクリックを促しましょう。", priority: "medium" }
    ]
};

// --- Helper Components (Ported from app/src/components/review-result.tsx) ---

function CircularProgress({ value, size = 120, strokeWidth = 10, color = "text-primary" }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 10) * circumference;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 w-full h-full">
                <circle
                    className="text-muted/40"
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>
            <span className={cn("absolute text-4xl font-bold", color)}>{value}</span>
        </div>
    );
}

function AnnotationMarker({ id, x, y, isHovered, onHover }: { id: number; x: number; y: number; isHovered: boolean; onHover: (hover: boolean) => void }) {
    return (
        <div
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
            style={{ left: `${x}%`, top: `${y}%` }}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
        >
            <div className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all duration-200 border-2",
                isHovered
                    ? "bg-primary text-primary-foreground border-primary-border scale-110"
                    : "bg-background text-primary border-border"
            )}>
                <span className="font-bold text-sm">{id}</span>
            </div>
            {isHovered && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-[200px] bg-background text-xs p-2 rounded shadow-xl z-20 pointer-events-none text-left border border-border">
                    <div className="font-bold mb-1 text-foreground">{MOCK_RESULT.annotations.find(a => a.id === id)?.title}</div>
                    <div className="text-muted-foreground">{MOCK_RESULT.annotations.find(a => a.id === id)?.description}</div>
                </div>
            )}
        </div>
    );
}

export function BannalyzeTemplateDemo({ className }: { className?: string }) {
    const [hoveredAnnotation, setHoveredAnnotation] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<'original' | 'heatmap' | 'saliency'>('original');
    const [zoom, setZoom] = useState(100);

    return (
        <div className={cn("h-full w-full bg-background text-foreground flex overflow-hidden font-sans", className)}>
            <BannalyzeTemplate
                header={
                    <div className="flex items-center justify-between w-full h-14 bg-card px-4 text-card-foreground border-b border-border">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg">
                                <span className="font-bold text-lg tracking-tight">B</span>
                                <span className="font-medium">Bannalyze</span>
                            </div>
                            <div className="h-6 w-px bg-border mx-2" />
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-muted">
                                    <History className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-primary hover:text-primary-strong hover:bg-primary-subtle">
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-muted/40 p-1 rounded-lg border border-border">
                            <div className="flex items-center px-3 border-r border-border gap-2">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-primary hover:text-primary-strong">
                                    <Lightbulb className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex items-center gap-2 px-2">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => setZoom(s => Math.max(10, s - 10))}><ZoomOut className="h-3 w-3" /></Button>
                                <div className="w-24 px-2">
                                    <div className="h-1 bg-muted rounded-full w-full relative">
                                        <div className="absolute left-0 top-0 h-full bg-primary rounded-full" style={{ width: `${zoom}%` }}></div>
                                        <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-background border border-border rounded-full shadow cursor-pointer" style={{ left: `${zoom}%` }}></div>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground" onClick={() => setZoom(s => Math.min(200, s + 10))}><ZoomIn className="h-3 w-3" /></Button>
                                <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
                            </div>
                            <div className="border-l border-border pl-2">
                                <span className="text-xs text-muted-foreground px-2">1:1</span>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground">
                                    <Maximize2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-primary-subtle text-primary-subtle-foreground px-3 py-1.5 rounded-full border border-primary-border">
                                <CheckCircle2 className="h-4 w-4" />
                                <span className="text-xs font-bold">保存済み</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Share2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                }
                sidebar={null}
                inspector={
                    <div className="h-full flex flex-col bg-muted/30 border-l border-border w-[400px]">
                        <div className="p-4 border-b bg-background border-border flex items-center justify-between shadow-sm z-10">
                            <div className="flex gap-4">
                                <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-4 px-1">分析結果</button>
                                <button className="text-sm font-medium text-muted-foreground hover:text-foreground pb-4 -mb-4 px-1 flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" /> AIチャット
                                </button>
                            </div>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4" /></Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Overall Score Card */}
                            <div className="bg-background rounded-2xl p-6 shadow-sm border border-border text-center">
                                <div className="mb-4 inline-block px-3 py-1 bg-primary-subtle text-primary-subtle-foreground rounded-full text-xs font-bold">
                                    Version 2
                                </div>
                                <h3 className="text-lg font-bold text-foreground mb-4">総合スコア</h3>
                                <div className="mb-6 flex justify-center">
                                    <CircularProgress value={MOCK_RESULT.overallScore} />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed text-left">
                                    全体的に高品質なデザインですが、タイポグラフィとコントラストを調整することで、さらに視認性と訴求力を高めることができます。
                                </p>
                            </div>

                            {/* Target Suitability Card */}
                            <div className="bg-background rounded-2xl p-6 shadow-sm border border-border">
                                <div className="flex items-center gap-2 mb-4">
                                    <Target className="w-5 h-5 text-destructive" />
                                    <h3 className="text-lg font-bold text-foreground">ターゲット適合度</h3>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full border-4 border-destructive-border bg-destructive-subtle flex items-center justify-center">
                                            <span className="text-xl font-bold text-destructive">{MOCK_RESULT.targetSuitability.score}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground mt-1">SCORE</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-foreground leading-relaxed mb-3">
                                            {MOCK_RESULT.targetSuitability.reason}
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {MOCK_RESULT.targetAudience.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] rounded-full border border-border font-medium">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Improvements List */}
                            <div>
                                <h3 className="text-md font-bold text-foreground mb-3 flex items-center gap-2">
                                    <Lightbulb className="w-4 h-4 text-primary" />
                                    改善アクション
                                </h3>
                                <div className="space-y-3">
                                    {MOCK_RESULT.improvements.map((item, i) => (
                                        <div key={i} className="bg-background p-4 rounded-xl border border-border shadow-sm hover:border-primary-border hover:shadow-md transition-all cursor-pointer group">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={cn(
                                                        "w-2 h-2 rounded-full",
                                                        item.priority === "high" ? "bg-destructive" : "bg-primary"
                                                    )} />
                                                    <span className="text-xs font-bold text-muted-foreground uppercase">{item.priority === "high" ? "High" : "Medium"}</span>
                                                </div>
                                            </div>
                                            <h4 className="font-bold text-foreground text-sm mb-1 group-hover:text-primary">{item.title}</h4>
                                            <p className="text-xs text-muted-foreground">{item.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Annotations List */}
                            <div>
                                <h3 className="text-md font-bold text-foreground mb-3 flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    指摘箇所
                                </h3>
                                <div className="space-y-2">
                                    {MOCK_RESULT.annotations.map((ann) => (
                                        <div
                                            key={ann.id}
                                            onMouseEnter={() => setHoveredAnnotation(ann.id)}
                                            onMouseLeave={() => setHoveredAnnotation(null)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-lg border bg-background cursor-pointer transition-colors",
                                                hoveredAnnotation === ann.id
                                                    ? "bg-primary-subtle border-primary-border ring-1 ring-primary-border"
                                                    : "border-border hover:bg-muted/50"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                                                hoveredAnnotation === ann.id
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            )}>
                                                {ann.id}
                                            </div>
                                            <span className="text-sm font-medium text-foreground">{ann.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            >
                {/* Main Canvas Area */}
                <div className="flex flex-col h-full bg-muted/80">
                    <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8 bg-dot-pattern">
                        {/* Canvas Image Container */}
                        <div
                            className="relative shadow-2xl rounded-lg overflow-hidden transition-all duration-200 ease-out"
                            style={{ width: `${600 * (zoom / 100)}px`, height: `${337.5 * (zoom / 100)}px` }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=800&q=80"
                                alt="Banner Analysis Target"
                                className="w-full h-full object-cover"
                            />

                            {/* Annotation Overlay */}
                            {MOCK_RESULT.annotations.map(ann => (
                                <AnnotationMarker
                                    key={ann.id}
                                    id={ann.id}
                                    x={ann.x}
                                    y={ann.y}
                                    isHovered={hoveredAnnotation === ann.id}
                                    onHover={(hover) => setHoveredAnnotation(hover ? ann.id : null)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Floating Bar */}
                    <div className="h-32 bg-card border-t border-border p-4 flex items-center overflow-x-auto gap-4 px-8">
                        {/* History Thumbnails */}
                        <div className="flex items-center gap-2">
                            <div className="relative group cursor-pointer border-2 border-transparent hover:border-primary rounded-md overflow-hidden opacity-50 hover:opacity-100 transition-all">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=100&q=80" className="w-20 h-14 object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-foreground/60 text-[10px] text-background p-0.5 text-center">Version 1</div>
                            </div>
                            <div className="relative group cursor-pointer border-2 border-primary rounded-md overflow-hidden ring-2 ring-primary-border">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=100&q=80" className="w-20 h-14 object-cover" />
                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></div>
                                <div className="absolute inset-x-0 bottom-0 bg-primary text-[10px] text-primary-foreground p-0.5 text-center font-bold">Version 2</div>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-border mx-2" />

                        <button className="w-20 h-14 border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary-border hover:bg-muted transition-colors">
                            <Plus className="w-5 h-5 mb-1" />
                            <span className="text-[10px]">Add New</span>
                        </button>
                    </div>
                </div>
            </BannalyzeTemplate>
        </div>
    );
}
