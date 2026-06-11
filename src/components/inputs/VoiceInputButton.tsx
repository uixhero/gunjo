"use client";

import * as React from "react";
import {
    IconLoader2 as Loader,
    IconMicrophone as Microphone,
    IconPlayerStopFilled as Stop,
} from "@tabler/icons-react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./Button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../overlay/Tooltip";

type SpeechRecognitionEvent = Event & {
    resultIndex: number;
    results: SpeechRecognitionResultList;
};

type SpeechRecognitionErrorEvent = Event & {
    error?: string;
};

type SpeechRecognitionInstance = EventTarget & {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    maxAlternatives: number;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
    abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

declare global {
    interface Window {
        SpeechRecognition?: SpeechRecognitionConstructor;
        webkitSpeechRecognition?: SpeechRecognitionConstructor;
    }
}

export type VoiceInputStatus = "idle" | "requesting" | "listening" | "unsupported" | "permission-denied" | "error";

export interface VoiceInputButtonLabels {
    start?: string;
    stop?: string;
    requesting?: string;
    unsupported?: string;
    permissionDenied?: string;
    error?: string;
}

export interface VoiceInputButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
    onTranscript: (transcript: string) => void;
    onListeningChange?: (listening: boolean) => void;
    onStatusChange?: (status: VoiceInputStatus) => void;
    onToggle?: () => void;
    listening?: boolean;
    defaultListening?: boolean;
    language?: string;
    labels?: VoiceInputButtonLabels;
}

function getSpeechRecognitionConstructor() {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

async function requestMicrophoneAccess(timeoutMs = 8000) {
    if (!navigator.mediaDevices?.getUserMedia) {
        const error = new Error("Microphone permission API is unavailable.");
        error.name = "NotSupportedError";
        throw error;
    }

    let timeoutId: number | null = null;
    const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
            const error = new Error("Microphone permission request timed out.");
            error.name = "TimeoutError";
            reject(error);
        }, timeoutMs);
    });

    let stream: MediaStream;
    try {
        stream = await Promise.race([
            navigator.mediaDevices.getUserMedia({ audio: true }),
            timeout,
        ]);
    } finally {
        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
        }
    }

    for (const track of stream.getTracks()) {
        track.stop();
    }
}

export function VoiceInputButton({
    onTranscript,
    onListeningChange,
    onStatusChange,
    onToggle,
    listening,
    defaultListening = false,
    language = "ja-JP",
    labels,
    disabled,
    className,
    ...props
}: VoiceInputButtonProps) {
    const [status, setStatus] = React.useState<VoiceInputStatus>("idle");
    const [isSupported, setIsSupported] = React.useState(true);
    const [uncontrolledListening, setUncontrolledListening] = React.useState(defaultListening);
    const recognitionRef = React.useRef<SpeechRecognitionInstance | null>(null);
    const stoppedByUserRef = React.useRef(false);
    const finalTranscriptRef = React.useRef("");
    const interimTranscriptRef = React.useRef("");
    const statusRef = React.useRef<VoiceInputStatus>("idle");
    const isListeningControlled = listening !== undefined;
    const currentListening = isListeningControlled ? listening : uncontrolledListening;

    const updateStatus = React.useCallback((nextStatus: VoiceInputStatus) => {
        statusRef.current = nextStatus;
        setStatus(nextStatus);
    }, []);

    const resolvedLabels = {
        start: labels?.start ?? "音声入力",
        stop: labels?.stop ?? "録音を停止",
        requesting: labels?.requesting ?? "マイクのアクセス権を確認しています。",
        unsupported: labels?.unsupported ?? "このブラウザは音声入力に対応していません。",
        permissionDenied: labels?.permissionDenied ?? "マイクのアクセス権が許可されていません。",
        error: labels?.error ?? "音声入力を開始できませんでした。",
    };

    React.useEffect(() => {
        const supported = Boolean(getSpeechRecognitionConstructor());
        setIsSupported(supported);
        if (!supported) updateStatus("unsupported");
    }, [updateStatus]);

    React.useEffect(() => {
        statusRef.current = status;
        onStatusChange?.(status);
    }, [onStatusChange, status]);

    React.useEffect(() => {
        return () => {
            recognitionRef.current?.abort();
        };
    }, []);

    const setListening = React.useCallback(
        (nextListening: boolean) => {
            if (!isListeningControlled) {
                setUncontrolledListening(nextListening);
            }
            onListeningChange?.(nextListening);
        },
        [isListeningControlled, onListeningChange]
    );

    const emitTranscript = React.useCallback(() => {
        const transcript = (finalTranscriptRef.current || interimTranscriptRef.current).trim();
        finalTranscriptRef.current = "";
        interimTranscriptRef.current = "";
        if (transcript.length > 0) {
            onTranscript(transcript);
        }
    }, [onTranscript]);

    const stopRecognition = React.useCallback(() => {
        stoppedByUserRef.current = true;
        recognitionRef.current?.stop();
        setListening(false);
        updateStatus("idle");
    }, [setListening, updateStatus]);

    const startRecognition = React.useCallback(async () => {
        const SpeechRecognition = getSpeechRecognitionConstructor();
        if (!SpeechRecognition) {
            setIsSupported(false);
            updateStatus("unsupported");
            return;
        }

        updateStatus("requesting");
        stoppedByUserRef.current = false;
        finalTranscriptRef.current = "";
        interimTranscriptRef.current = "";

        try {
            await requestMicrophoneAccess();

            const recognition = new SpeechRecognition();
            recognition.lang = language;
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.maxAlternatives = 1;
            recognition.onresult = (event) => {
                let interim = "";
                let finalText = "";
                for (let index = event.resultIndex; index < event.results.length; index += 1) {
                    const result = event.results[index];
                    const transcript = result[0]?.transcript ?? "";
                    if (result.isFinal) {
                        finalText += transcript;
                    } else {
                        interim += transcript;
                    }
                }
                if (finalText) {
                    finalTranscriptRef.current = `${finalTranscriptRef.current} ${finalText}`.trim();
                }
                interimTranscriptRef.current = interim.trim();
            };
            recognition.onerror = (event) => {
                if (event.error === "not-allowed" || event.error === "service-not-allowed") {
                    updateStatus("permission-denied");
                } else {
                    updateStatus("error");
                }
                setListening(false);
            };
            recognition.onend = () => {
                emitTranscript();
                recognitionRef.current = null;
                setListening(false);
                if (
                    stoppedByUserRef.current ||
                    statusRef.current === "listening" ||
                    statusRef.current === "requesting"
                ) {
                    updateStatus("idle");
                }
            };
            recognitionRef.current = recognition;
            recognition.start();
            setListening(true);
            updateStatus("listening");
        } catch (error) {
            const errorName = error instanceof Error ? error.name : "";
            setListening(false);
            if (errorName === "NotAllowedError" || errorName === "PermissionDeniedError") {
                updateStatus("permission-denied");
            } else if (errorName === "NotSupportedError") {
                setIsSupported(false);
                updateStatus("unsupported");
            } else {
                updateStatus("error");
            }
        }
    }, [emitTranscript, language, setListening, updateStatus]);

    const handleClick = React.useCallback(() => {
        onToggle?.();
        if (currentListening || status === "requesting") {
            stopRecognition();
        } else {
            void startRecognition();
        }
    }, [currentListening, onToggle, startRecognition, status, stopRecognition]);

    const isUnavailable = disabled || !isSupported;
    const tooltip = !isSupported
        ? resolvedLabels.unsupported
        : status === "permission-denied"
            ? resolvedLabels.permissionDenied
            : status === "error"
                ? resolvedLabels.error
                : status === "requesting"
                    ? resolvedLabels.requesting
                    : currentListening
                        ? resolvedLabels.stop
                        : resolvedLabels.start;
    const label = currentListening || status === "requesting" ? resolvedLabels.stop : resolvedLabels.start;

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="inline-flex shrink-0 rounded-md" tabIndex={isUnavailable ? 0 : -1}>
                    <Button
                        {...props}
                        type="button"
                        variant={props.variant ?? "ghost"}
                        size={props.size ?? "icon"}
                        className={cn(
                            "h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground",
                            currentListening && "bg-destructive-subtle text-destructive-subtle-foreground hover:bg-destructive-subtle hover:text-destructive-subtle-foreground",
                            status === "requesting" && "bg-primary-subtle text-primary-subtle-foreground hover:bg-primary-subtle hover:text-primary-subtle-foreground",
                            className
                        )}
                        onClick={handleClick}
                        disabled={isUnavailable}
                        aria-label={label}
                        aria-pressed={currentListening}
                    >
                        {status === "requesting" ? (
                            <Loader className="h-5 w-5 animate-spin" />
                        ) : currentListening ? (
                            <Stop className="h-4 w-4" />
                        ) : (
                            <Microphone className="h-5 w-5" />
                        )}
                    </Button>
                </span>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
    );
}
