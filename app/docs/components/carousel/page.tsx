"use client";

import { ComponentDemoStates } from "@/components/doc/ComponentDemoStates";
import { CodeBlock } from "@/components/doc/CodeBlock";
import { CodeCopyButton, ComponentLayout, ComponentPreview } from "@/components/doc/ComponentHelpers";
import { PropsTable } from "@/components/doc/PropsTable";
import { useLocale } from "@/components/providers/LocaleProvider";
import displayMetadata from "@design/display-metadata.json";
import {
    Carousel,
    CarouselAutoplayToggle,
    CarouselContent,
    CarouselDots,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    CarouselThumbnail,
    CarouselThumbnails,
    Img,
    ImagePreview,
} from "@gunjo/ui";
import { UIXHERO_BASE_URL } from "@/lib/uixhero-links";

function CarouselSample({ vertical = false, isJa }: { vertical?: boolean; isJa: boolean }) {
    return (
        <div className={vertical ? "overflow-hidden py-12" : "overflow-hidden px-12"}>
            <Carousel
                opts={{ loop: true, duration: 28 }}
                orientation={vertical ? "vertical" : "horizontal"}
                className={vertical ? "h-64 w-64" : "w-64"}
                controls={{
                    navigation: true,
                    dots: !vertical,
                    previousClassName: vertical
                        ? "top-2 bg-background/90 sm:-top-12"
                        : "left-2 bg-background/90 sm:-left-12",
                    nextClassName: vertical
                        ? "bottom-2 bg-background/90 sm:-bottom-12"
                        : "right-2 bg-background/90 sm:-right-12",
                    labels: {
                        previous: isJa ? "前のスライド" : "Previous slide",
                        next: isJa ? "次のスライド" : "Next slide",
                        dots: isJa ? "スライド選択" : "Slide selector",
                        getDotLabel: (index) => isJa ? `${index + 1}枚目へ移動` : `Go to slide ${index + 1}`,
                    },
                }}
            >
                <CarouselContent className={vertical ? "h-64" : undefined}>
                    {[1, 2, 3, 4].map((item) => (
                        <CarouselItem key={item}>
                            <div className="p-1">
                                <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                                    <span className="text-3xl font-semibold">
                                        {isJa ? `${item}枚目` : `Slide ${item}`}
                                    </span>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
        </div>
    );
}

const cardItems = [
    { ja: "企画", en: "Plan" },
    { ja: "制作", en: "Build" },
    { ja: "確認", en: "Review" },
    { ja: "公開", en: "Launch" },
    { ja: "改善", en: "Improve" },
    { ja: "分析", en: "Analyze" },
];

function CarouselCard({ label, index }: { label: string; index: number }) {
    return (
        <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
            <span className="text-lg font-semibold">{label}</span>
        </div>
    );
}

function PeekCarouselSample({ isJa }: { isJa: boolean }) {
    return (
        <div className="w-full max-w-lg overflow-visible px-12 py-4">
            <Carousel opts={{ align: "start", containScroll: "trimSnaps", duration: 28 }} className="w-full">
                <CarouselContent>
                    {cardItems.slice(0, 5).map((item, index) => (
                        <CarouselItem key={item.en} className="basis-[68%]">
                            <CarouselCard label={isJa ? item.ja : item.en} index={index} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    label={isJa ? "前へ送る" : "Previous"}
                    className="-left-10 bg-background/90"
                    hideWhenDisabled
                />
                <CarouselNext
                    label={isJa ? "次へ送る" : "Next"}
                    className="-right-10 bg-background/90"
                    hideWhenDisabled
                />
                <CarouselDots
                    className="mt-4"
                    label={isJa ? "カード選択" : "Card selector"}
                    getDotLabel={(index) => isJa ? `${index + 1}枚目へ移動` : `Go to card ${index + 1}`}
                />
            </Carousel>
        </div>
    );
}

function MultiVisibleCarousel({ isJa, count }: { isJa: boolean; count: 2 | 3 }) {
    return (
        <Carousel
            opts={{ align: "start", containScroll: "trimSnaps", slidesToScroll: count, duration: 28 }}
            className="w-full"
        >
            <CarouselContent>
                {cardItems.map((item, index) => (
                    <CarouselItem key={item.en} className={count === 2 ? "basis-1/2" : "basis-1/3"}>
                        <CarouselCard label={isJa ? item.ja : item.en} index={index} />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious
                label={isJa ? `${count}枚戻る` : `Previous ${count}`}
                className="left-2 bg-background/90"
                hideWhenDisabled
            />
            <CarouselNext
                label={isJa ? `${count}枚送る` : `Next ${count}`}
                className="right-2 bg-background/90"
                hideWhenDisabled
            />
        </Carousel>
    );
}

function MultiVisibleCarouselSample({ isJa }: { isJa: boolean }) {
    return (
        <div className="w-full max-w-xl space-y-6 overflow-hidden px-10 py-4">
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{isJa ? "2枚表示 / 2枚送り" : "2 visible / scroll by 2"}</p>
                <MultiVisibleCarousel isJa={isJa} count={2} />
            </div>
            <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{isJa ? "3枚表示 / 3枚送り" : "3 visible / scroll by 3"}</p>
                <MultiVisibleCarousel isJa={isJa} count={3} />
            </div>
        </div>
    );
}

function PositionControlsCarouselSample({ isJa }: { isJa: boolean }) {
    return (
        <div className="w-full max-w-md overflow-hidden px-10 py-4">
            <Carousel opts={{ align: "start", containScroll: "trimSnaps", duration: 28 }} className="w-full">
                <CarouselContent>
                    {cardItems.slice(0, 5).map((item, index) => (
                        <CarouselItem key={item.en}>
                            <CarouselCard label={isJa ? item.ja : item.en} index={index} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    label={isJa ? "前へ送る" : "Previous"}
                    className="left-2 bg-background/90"
                    hideWhenDisabled
                />
                <CarouselNext
                    label={isJa ? "次へ送る" : "Next"}
                    className="right-2 bg-background/90"
                    hideWhenDisabled
                />
            </Carousel>
        </div>
    );
}

function ControlsPropsSample({ isJa }: { isJa: boolean }) {
    const examples = [
        {
            key: "navigation-dots",
            title: isJa ? "前後ボタン + ドット" : "Navigation + dots",
            controls: {
                navigation: true,
                dots: true,
                labels: {
                    previous: isJa ? "前へ送る" : "Previous",
                    next: isJa ? "次へ送る" : "Next",
                    dots: isJa ? "カード選択" : "Card selector",
                    getDotLabel: (index: number) => isJa ? `${index + 1}枚目へ移動` : `Go to card ${index + 1}`,
                },
            },
        },
        {
            key: "dots",
            title: isJa ? "ドットのみ" : "Dots only",
            controls: {
                dots: true,
                labels: {
                    dots: isJa ? "カード選択" : "Card selector",
                    getDotLabel: (index: number) => isJa ? `${index + 1}枚目へ移動` : `Go to card ${index + 1}`,
                },
            },
        },
        {
            key: "none",
            title: isJa ? "コントローラーなし" : "No controls",
            controls: false,
        },
    ];

    return (
        <div className="grid w-full max-w-3xl gap-5 py-4 sm:grid-cols-3">
            {examples.map((example) => (
                <div key={example.key} className="space-y-3 px-10">
                    <p className="text-center text-sm font-medium text-muted-foreground">{example.title}</p>
                    <Carousel
                        opts={{ loop: true, duration: 28 }}
                        className="mx-auto w-40"
                        controls={example.controls}
                    >
                        <CarouselContent>
                            {[1, 2, 3].map((item) => (
                                <CarouselItem key={item}>
                                    <div className="p-1">
                                        <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                                            <span className="text-xl font-semibold">{item}</span>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            ))}
        </div>
    );
}

const galleryImages = [
    {
        src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
        ja: "ワークステーション",
        en: "Workstation",
    },
    {
        src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
        ja: "スタジオ",
        en: "Studio",
    },
    {
        src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
        ja: "風景素材",
        en: "Landscape",
    },
];

function ImageCarouselSample({ isJa, autoPlay = false }: { isJa: boolean; autoPlay?: boolean }) {
    return (
        <div className="w-full max-w-2xl overflow-hidden px-10 py-4">
            <Carousel
                autoPlay={autoPlay}
                autoPlayInterval={3200}
                opts={{ align: "center", loop: true, duration: 32 }}
                className="w-full"
            >
                <CarouselContent>
                    {galleryImages.map((item) => (
                        <CarouselItem key={item.src} className="basis-[72%]">
                            <div className="p-1">
                                <ImagePreview
                                    src={item.src}
                                    alt={isJa ? item.ja : item.en}
                                    aspectRatio="video"
                                    className="rounded-lg"
                                    previewLabel={isJa ? "拡大表示" : "Open preview"}
                                >
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                                        <p className="text-sm font-medium">{isJa ? item.ja : item.en}</p>
                                    </div>
                                </ImagePreview>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    label={isJa ? "前の画像" : "Previous image"}
                    className="left-3 bg-background/90"
                />
                <CarouselNext
                    label={isJa ? "次の画像" : "Next image"}
                    className="right-3 bg-background/90"
                />
                <div className="mt-4 flex items-center justify-center gap-3">
                    <CarouselDots
                        label={isJa ? "画像選択" : "Image selector"}
                        getDotLabel={(index) => isJa ? `${index + 1}枚目の画像へ移動` : `Go to image ${index + 1}`}
                    />
                    {autoPlay ? (
                        <CarouselAutoplayToggle
                            playLabel={isJa ? "自動再生を開始" : "Play carousel"}
                            pauseLabel={isJa ? "自動再生を停止" : "Pause carousel"}
                        />
                    ) : null}
                </div>
            </Carousel>
        </div>
    );
}

function ImageFullNeighborCarouselSample({ isJa }: { isJa: boolean }) {
    return (
        <div className="w-full max-w-4xl overflow-hidden px-10 py-4">
            <Carousel
                opts={{ align: "center", loop: true, duration: 32 }}
                className="mx-auto w-[68%] min-w-72 max-w-xl"
            >
                <CarouselContent viewportClassName="overflow-visible">
                    {galleryImages.map((item) => (
                        <CarouselItem key={item.src} className="basis-full">
                            <div className="p-2">
                                <ImagePreview
                                    src={item.src}
                                    alt={isJa ? item.ja : item.en}
                                    aspectRatio="video"
                                    className="rounded-xl"
                                    previewLabel={isJa ? "拡大表示" : "Open preview"}
                                >
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                                        <p className="text-sm font-medium">{isJa ? item.ja : item.en}</p>
                                    </div>
                                </ImagePreview>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    label={isJa ? "前の画像" : "Previous image"}
                    className="left-2 bg-background/90 sm:-left-10"
                />
                <CarouselNext
                    label={isJa ? "次の画像" : "Next image"}
                    className="right-2 bg-background/90 sm:-right-10"
                />
                <CarouselDots
                    className="mt-4"
                    label={isJa ? "画像選択" : "Image selector"}
                    getDotLabel={(index) => isJa ? `${index + 1}枚目の画像へ移動` : `Go to image ${index + 1}`}
                />
            </Carousel>
        </div>
    );
}

function ThumbnailCarouselSample({ isJa }: { isJa: boolean }) {
    return (
        <div className="w-full max-w-xl overflow-hidden px-10 py-4">
            <Carousel opts={{ loop: true, duration: 32 }} className="w-full">
                <CarouselContent>
                    {galleryImages.map((item) => (
                        <CarouselItem key={item.src}>
                            <div className="p-1">
                                <ImagePreview
                                    src={item.src}
                                    alt={isJa ? item.ja : item.en}
                                    aspectRatio="video"
                                    className="rounded-lg"
                                    previewLabel={isJa ? "拡大表示" : "Open preview"}
                                >
                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                                        <p className="text-sm font-medium">{isJa ? item.ja : item.en}</p>
                                    </div>
                                </ImagePreview>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious
                    label={isJa ? "前の画像" : "Previous image"}
                    className="left-3 bg-background/90"
                />
                <CarouselNext
                    label={isJa ? "次の画像" : "Next image"}
                    className="right-3 bg-background/90"
                />
                <CarouselThumbnails
                    className="mt-4"
                    label={isJa ? "画像サムネイル" : "Image thumbnails"}
                >
                    {galleryImages.map((item, index) => (
                        <CarouselThumbnail
                            key={item.src}
                            index={index}
                            label={isJa ? `${item.ja}へ移動` : `Go to ${item.en}`}
                        >
                            <Img
                                src={item.src}
                                alt=""
                                aspectRatio="video"
                                className="h-full w-full rounded-none"
                                showSkeleton={false}
                            />
                        </CarouselThumbnail>
                    ))}
                </CarouselThumbnails>
            </Carousel>
        </div>
    );
}

export default function CarouselDocPage() {
    const { locale, sectionLabels } = useLocale();
    const isJa = locale === "ja";
    const statesTitle = isJa ? "状態とバリエーション" : "States and variants";

    const code = isJa
        ? `import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@gunjo/ui"

const slides = [1, 2, 3, 4]

export function CarouselDemo() {
  return (
    <Carousel
      className="w-64"
      opts={{ loop: true, duration: 28 }}
      controls={{
        navigation: true,
        dots: true,
        labels: {
          previous: "前のスライド",
          next: "次のスライド",
          dots: "スライド選択",
          getDotLabel: (index) => index + 1 + "枚目へ移動",
        },
        previousClassName: "left-2 bg-background/90 sm:-left-12",
        nextClassName: "right-2 bg-background/90 sm:-right-12",
      }}
    >
      <CarouselContent>
        {slides.map((item) => (
          <CarouselItem key={item}>
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                <span className="text-3xl font-semibold">
                  {item + "枚目"}
                </span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}`
        : `import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@gunjo/ui"

const slides = [1, 2, 3, 4]

export function CarouselDemo() {
  return (
    <Carousel
      className="w-64"
      opts={{ loop: true, duration: 28 }}
      controls={{
        navigation: true,
        dots: true,
        labels: {
          previous: "Previous slide",
          next: "Next slide",
          dots: "Slide selector",
          getDotLabel: (index) => "Go to slide " + (index + 1),
        },
        previousClassName: "left-2 bg-background/90 sm:-left-12",
        nextClassName: "right-2 bg-background/90 sm:-right-12",
      }}
    >
      <CarouselContent>
        {slides.map((item) => (
          <CarouselItem key={item}>
            <div className="p-1">
              <div className="flex aspect-square items-center justify-center rounded-md border bg-muted">
                <span className="text-3xl font-semibold">
                  {"Slide " + item}
                </span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}`;

    const usageCode = isJa
        ? `import { Carousel, CarouselContent, CarouselItem } from "@gunjo/ui"

const items = [
  { id: "plan", label: "企画" },
  { id: "build", label: "制作" },
  { id: "review", label: "確認" },
]

export function Gallery() {
  return (
    <Carousel opts={{ loop: true }}>
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg border bg-card p-4">
              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}`
        : `import { Carousel, CarouselContent, CarouselItem } from "@gunjo/ui"

const items = [
  { id: "plan", label: "Plan" },
  { id: "build", label: "Build" },
  { id: "review", label: "Review" },
]

export function Gallery() {
  return (
    <Carousel opts={{ loop: true }}>
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem key={item.id}>
            <div className="flex aspect-[4/3] items-center justify-center rounded-lg border bg-card p-4">
              <span className="text-lg font-semibold">{item.label}</span>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}`;

    const cardCarouselCode = isJa
        ? `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@gunjo/ui"

const cardItems = [
  { label: "企画" },
  { label: "制作" },
  { label: "確認" },
  { label: "公開" },
  { label: "改善" },
]

function CarouselCard({ label, index }) {
  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

export function PeekCarousel() {
  return (
    <div className="w-full max-w-lg overflow-visible px-12 py-4">
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps", duration: 28 }}
        className="w-full"
      >
        <CarouselContent>
          {cardItems.map((item, index) => (
            <CarouselItem key={item.label} className="basis-[68%]">
              <CarouselCard label={item.label} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          label="前へ送る"
          className="-left-10 bg-background/90"
          hideWhenDisabled
        />
        <CarouselNext
          label="次へ送る"
          className="-right-10 bg-background/90"
          hideWhenDisabled
        />
        <CarouselDots
          className="mt-4"
          label="カード選択"
          getDotLabel={(index) => index + 1 + "枚目へ移動"}
        />
      </Carousel>
    </div>
  )
}`
        : `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@gunjo/ui"

const cardItems = [
  { label: "Plan" },
  { label: "Build" },
  { label: "Review" },
  { label: "Launch" },
  { label: "Improve" },
]

function CarouselCard({ label, index }) {
  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

export function PeekCarousel() {
  return (
    <div className="w-full max-w-lg overflow-visible px-12 py-4">
      <Carousel
        opts={{ align: "start", containScroll: "trimSnaps", duration: 28 }}
        className="w-full"
      >
        <CarouselContent>
          {cardItems.map((item, index) => (
            <CarouselItem key={item.label} className="basis-[68%]">
              <CarouselCard label={item.label} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          label="Previous"
          className="-left-10 bg-background/90"
          hideWhenDisabled
        />
        <CarouselNext
          label="Next"
          className="-right-10 bg-background/90"
          hideWhenDisabled
        />
        <CarouselDots
          className="mt-4"
          label="Card selector"
          getDotLabel={(index) => "Go to card " + (index + 1)}
        />
      </Carousel>
    </div>
  )
}`;

    const multiVisibleCode = isJa
        ? `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@gunjo/ui"

const cardItems = [
  { label: "企画" },
  { label: "制作" },
  { label: "確認" },
  { label: "公開" },
  { label: "改善" },
  { label: "分析" },
]

function CarouselCard({ label, index }) {
  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

export function MultiVisibleCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        slidesToScroll: 3,
        duration: 28,
      }}
      className="w-full"
    >
      <CarouselContent>
        {cardItems.map((item, index) => (
          <CarouselItem key={item.label} className="basis-1/3">
            <CarouselCard label={item.label} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        label="3枚戻る"
        className="left-2 bg-background/90"
        hideWhenDisabled
      />
      <CarouselNext
        label="3枚送る"
        className="right-2 bg-background/90"
        hideWhenDisabled
      />
    </Carousel>
  )
}`
        : `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@gunjo/ui"

const cardItems = [
  { label: "Plan" },
  { label: "Build" },
  { label: "Review" },
  { label: "Launch" },
  { label: "Improve" },
  { label: "Analyze" },
]

function CarouselCard({ label, index }) {
  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

export function MultiVisibleCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        containScroll: "trimSnaps",
        slidesToScroll: 3,
        duration: 28,
      }}
      className="w-full"
    >
      <CarouselContent>
        {cardItems.map((item, index) => (
          <CarouselItem key={item.label} className="basis-1/3">
            <CarouselCard label={item.label} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious
        label="Previous 3"
        className="left-2 bg-background/90"
        hideWhenDisabled
      />
      <CarouselNext
        label="Next 3"
        className="right-2 bg-background/90"
        hideWhenDisabled
      />
    </Carousel>
  )
}`;

    const imageCarouselCode = isJa
        ? `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ImagePreview,
} from "@gunjo/ui"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
    label: "ワークステーション",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "スタジオ",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "風景素材",
  },
]

export function ImageCarousel() {
  return (
    <Carousel opts={{ align: "center", loop: true, duration: 32 }} className="w-full">
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src} className="basis-[72%]">
            <div className="p-1">
              <ImagePreview
                src={item.src}
                alt={item.label}
                aspectRatio="video"
                className="rounded-lg"
                previewLabel="拡大表示"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="前の画像" className="left-3 bg-background/90" />
      <CarouselNext label="次の画像" className="right-3 bg-background/90" />
      <CarouselDots
        className="mt-4"
        label="画像選択"
        getDotLabel={(index) => index + 1 + "枚目の画像へ移動"}
      />
    </Carousel>
  )
}`
        : `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ImagePreview,
} from "@gunjo/ui"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
    label: "Workstation",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "Landscape",
  },
]

export function ImageCarousel() {
  return (
    <Carousel opts={{ align: "center", loop: true, duration: 32 }} className="w-full">
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src} className="basis-[72%]">
            <div className="p-1">
              <ImagePreview
                src={item.src}
                alt={item.label}
                aspectRatio="video"
                className="rounded-lg"
                previewLabel="Open preview"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="Previous image" className="left-3 bg-background/90" />
      <CarouselNext label="Next image" className="right-3 bg-background/90" />
      <CarouselDots
        className="mt-4"
        label="Image selector"
        getDotLabel={(index) => "Go to image " + (index + 1)}
      />
    </Carousel>
  )
}`;

    const thumbnailCarouselCode = isJa
        ? `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbnail,
  CarouselThumbnails,
  ImagePreview,
  Img,
} from "@gunjo/ui"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
    label: "ワークステーション",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "スタジオ",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "風景素材",
  },
]

export function ThumbnailCarousel() {
  return (
    <Carousel opts={{ loop: true, duration: 32 }} className="w-full">
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src}>
            <div className="p-1">
              <ImagePreview
                src={item.src}
                alt={item.label}
                aspectRatio="video"
                className="rounded-lg"
                previewLabel="拡大表示"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="前の画像" className="left-3 bg-background/90" />
      <CarouselNext label="次の画像" className="right-3 bg-background/90" />
      <CarouselThumbnails className="mt-4" label="画像サムネイル">
        {galleryImages.map((item) => (
          <CarouselThumbnail
            key={item.src}
            index={galleryImages.indexOf(item)}
            label={item.label + "へ移動"}
          >
            <Img
              src={item.src}
              alt=""
              aspectRatio="video"
              className="h-full w-full rounded-none"
              showSkeleton={false}
            />
          </CarouselThumbnail>
        ))}
      </CarouselThumbnails>
    </Carousel>
  )
}`
        : `import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbnail,
  CarouselThumbnails,
  ImagePreview,
  Img,
} from "@gunjo/ui"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
    label: "Workstation",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "Landscape",
  },
]

export function ThumbnailCarousel() {
  return (
    <Carousel opts={{ loop: true, duration: 32 }} className="w-full">
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src}>
            <div className="p-1">
              <ImagePreview
                src={item.src}
                alt={item.label}
                aspectRatio="video"
                className="rounded-lg"
                previewLabel="Open preview"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="Previous image" className="left-3 bg-background/90" />
      <CarouselNext label="Next image" className="right-3 bg-background/90" />
      <CarouselThumbnails className="mt-4" label="Image thumbnails">
        {galleryImages.map((item) => (
          <CarouselThumbnail
            key={item.src}
            index={galleryImages.indexOf(item)}
            label={"Go to " + item.label}
          >
            <Img
              src={item.src}
              alt=""
              aspectRatio="video"
              className="h-full w-full rounded-none"
              showSkeleton={false}
            />
          </CarouselThumbnail>
        ))}
      </CarouselThumbnails>
    </Carousel>
  )
}`;

    const autoplayCarouselCode = isJa
        ? `import {
  Carousel,
  CarouselAutoplayToggle,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ImagePreview,
} from "@gunjo/ui"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
    label: "ワークステーション",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "スタジオ",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "風景素材",
  },
]

export function AutoplayCarousel() {
  return (
    <Carousel
      autoPlay
      autoPlayInterval={3200}
      opts={{ align: "center", loop: true, duration: 32 }}
      className="w-full"
    >
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src} className="basis-[72%]">
            <div className="p-1">
              <ImagePreview
                src={item.src}
                alt={item.label}
                aspectRatio="video"
                className="rounded-lg"
                previewLabel="拡大表示"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="前の画像" className="left-3 bg-background/90" />
      <CarouselNext label="次の画像" className="right-3 bg-background/90" />
      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselDots
          label="画像選択"
          getDotLabel={(index) => index + 1 + "枚目の画像へ移動"}
        />
        <CarouselAutoplayToggle playLabel="自動再生を開始" pauseLabel="自動再生を停止" />
      </div>
    </Carousel>
  )
}`
        : `import {
  Carousel,
  CarouselAutoplayToggle,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  ImagePreview,
} from "@gunjo/ui"

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=960&q=80",
    label: "Workstation",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "Studio",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "Landscape",
  },
]

export function AutoplayCarousel() {
  return (
    <Carousel
      autoPlay
      autoPlayInterval={3200}
      opts={{ align: "center", loop: true, duration: 32 }}
      className="w-full"
    >
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src} className="basis-[72%]">
            <div className="p-1">
              <ImagePreview
                src={item.src}
                alt={item.label}
                aspectRatio="video"
                className="rounded-lg"
                previewLabel="Open preview"
              >
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="Previous image" className="left-3 bg-background/90" />
      <CarouselNext label="Next image" className="right-3 bg-background/90" />
      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselDots
          label="Image selector"
          getDotLabel={(index) => "Go to image " + (index + 1)}
        />
        <CarouselAutoplayToggle playLabel="Play carousel" pauseLabel="Pause carousel" />
      </div>
    </Carousel>
  )
}`;

    const propsData = [
        {
            name: "opts",
            type: "CarouselOptions",
            description: isJa
                ? "ループ、スナップ位置、送る枚数など、カルーセルの挙動を細かく調整するための高度な設定です。通常は GunjoUI の props と組み合わせて使います。"
                : "Advanced behavior settings such as looping, snap alignment, and scroll step. Use them alongside GunjoUI props for normal composition.",
        },
        {
            name: "plugins",
            type: "CarouselPlugin",
            description: isJa
                ? "内部エンジンの拡張が必要な場合に使う高度な拡張口です。通常の前後ボタン、ドット、自動再生は GunjoUI の props と子コンポーネントで扱います。"
                : "Advanced extension point for the underlying carousel engine. Standard navigation, dots, and autoplay should be handled with GunjoUI props and child components.",
        },
        {
            name: "orientation",
            type: '"horizontal" | "vertical"',
            default: '"horizontal"',
            description: isJa ? "スライド方向を横または縦に切り替えます。" : "Changes the slide direction between horizontal and vertical.",
        },
        {
            name: "setApi",
            type: "(api: CarouselApi) => void",
            description: isJa ? "Carousel API を外部から扱うためのコールバックです。" : "Callback for receiving the Carousel API instance.",
        },
        {
            name: "autoPlay",
            type: "boolean",
            default: "false",
            description: isJa ? "一定間隔で次のスライドへ送ります。停止操作が必要な場合は CarouselAutoplayToggle を併用します。" : "Moves to the next slide on an interval. Pair with CarouselAutoplayToggle when users need playback control.",
        },
        {
            name: "autoPlayInterval",
            type: "number",
            default: "4000",
            description: isJa ? "自動再生の間隔をミリ秒で指定します。" : "Autoplay interval in milliseconds.",
        },
        {
            name: "pauseOnHover",
            type: "boolean",
            default: "true",
            description: isJa ? "ホバーまたはフォーカス時に自動再生を一時停止します。" : "Temporarily pauses autoplay on hover or focus.",
        },
        {
            name: "controls",
            type: "boolean | CarouselControlOptions",
            default: "false",
            description: isJa
                ? "前後ボタン、ドット、自動再生ボタンなどの既定コントローラーを表示します。細かい配置や独自 UI が必要な場合は CarouselPrevious / CarouselNext / CarouselDots を子要素として配置します。"
                : "Shows built-in controls such as previous/next buttons, dots, and autoplay toggle. Compose CarouselPrevious, CarouselNext, and CarouselDots manually when a custom layout is needed.",
        },
        {
            name: "viewportClassName",
            type: "string",
            description: isJa ? "CarouselContent の表示領域に追加するクラスです。左右のスライドを見せる場合などに overflow を調整します。" : "Additional class for the CarouselContent viewport. Use it to adjust overflow when adjacent slides should remain visible.",
        },
        {
            name: "label",
            type: "string",
            description: isJa ? "前後ボタンの aria-label とツールチップに使う文言です。" : "Text used for previous/next button aria-labels and tooltips.",
        },
        {
            name: "hideWhenDisabled",
            type: "boolean",
            default: "false",
            description: isJa ? "前後ボタンが無効な位置ではボタン自体を非表示にします。" : "Hides previous/next buttons when their direction is unavailable.",
        },
        {
            name: "index",
            type: "number",
            description: isJa ? "CarouselThumbnail が移動するスライド位置です。" : "Slide index targeted by CarouselThumbnail.",
        },
    ];

    return (
        <ComponentLayout
            title={displayMetadata.carousel.title}
            description={displayMetadata.carousel.description}
            usedComponents={[
                { name: "Carousel", href: "/docs/components/carousel" },
                { name: "TooltipButton", href: "/docs/components/tooltip-button" },
                { name: "Icon", href: "/docs/components/icon" },
                { name: "Img", href: "/docs/components/img" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
            ]}
            relatedComponents={[
                { name: "Card", href: "/docs/components/card" },
                { name: "Img", href: "/docs/components/img" },
                { name: "ImagePreview", href: "/docs/components/image-preview" },
            ]}
            uixheroLinks={[
                {
                    label: locale === "ja" ? "UIXHERO: カルーセル（Carousel）" : "UIXHERO: Carousel (in Japanese)",
                    href: `${UIXHERO_BASE_URL}/resources/ui-components/carousel`,
                },
            ]}
        >
            <ComponentPreview code={code} codeBlock={<CodeBlock code={code} />} previewHeight="auto">
                <CarouselSample isJa={isJa} />
            </ComponentPreview>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="states">
                    {statesTitle}
                </h2>
                <ComponentDemoStates
                    states={[
                        {
                            key: "horizontal",
                            title: isJa ? "1枚表示" : "Single item",
                            description: isJa
                                ? "最初は1枚だけ見せ、前後ボタンやドットで1枚ずつ切り替える基本形です。"
                                : "The basic pattern shows one item at a time and changes slides with previous/next controls or dots.",
                            preview: <CarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code,
                        },
                        {
                            key: "peek",
                            title: isJa ? "次のカードを少し見せる" : "Peek next item",
                            description: isJa
                                ? "現在のカードを主役にしつつ、次のカードだけを少し見せて横に続きがあることを伝えます。前後ボタンはカードに重ならない位置へ置きます。"
                                : "Shows about one and a half items so users can see that more content continues horizontally. Control this with CarouselItem width.",
                            preview: <PeekCarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code: cardCarouselCode,
                        },
                        {
                            key: "contained-cards",
                            title: isJa ? "表示領域に収めるカード" : "Contained cards",
                            description: isJa
                                ? "表示領域の中にカードだけを収める見せ方です。前後に余計なカードを見せず、現在のまとまりに集中させます。"
                                : "Keeps only the active set of cards inside the viewport so users can focus on the current group.",
                            preview: <MultiVisibleCarousel isJa={isJa} count={3} />,
                            previewHeight: "auto",
                            code: multiVisibleCode,
                        },
                        {
                            key: "multiple-visible",
                            title: isJa ? "表示枚数と送る枚数" : "Visible items and scroll step",
                            description: isJa
                                ? "2枚または3枚を同時に表示し、slidesToScroll で同じ枚数ずつ送ります。比較カードや商品一覧に向いています。"
                                : "Shows two or three items at once and uses slidesToScroll to move by the same count. Good for comparison cards and product strips.",
                            preview: <MultiVisibleCarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code: multiVisibleCode,
                        },
                        {
                            key: "position-controls",
                            title: isJa ? "位置に応じたボタン表示" : "Position-aware controls",
                            description: isJa
                                ? "先頭では戻るボタン、末尾では次へボタンを隠します。スクロール位置に応じて必要な操作だけを表示します。"
                                : "Hides the previous button at the start and the next button at the end, showing only controls that make sense for the current position.",
                            preview: <PositionControlsCarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code: multiVisibleCode,
                        },
                        {
                            key: "control-props",
                            title: isJa ? "コントローラーの表示切り替え" : "Control visibility props",
                            description: isJa
                                ? "標準的な前後ボタン、ドット、自動再生ボタンは controls prop で表示を切り替えられます。独自配置が必要な場合は個別コンポーネントを子要素として置きます。"
                                : "Built-in navigation, dots, and autoplay controls can be toggled with the controls prop. Compose the control components manually when the layout needs custom placement.",
                            preview: <ControlsPropsSample isJa={isJa} />,
                            previewHeight: "auto",
                            code,
                        },
                        {
                            key: "image",
                            title: isJa ? "画像カルーセル" : "Image carousel",
                            description: isJa
                                ? "画像を切り替える場合は、CarouselItem の中に ImagePreview を配置します。前後ボタン、ドット、現在位置を同じ Carousel 内で扱います。"
                                : "Place ImagePreview inside each CarouselItem for image galleries. Previous/next controls, dots, and current position stay in the same Carousel.",
                            preview: <ImageCarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code: imageCarouselCode,
                        },
                        {
                            key: "image-full-neighbors",
                            title: isJa ? "左右の画像を100%幅で見せる" : "Full-size adjacent images",
                            description: isJa
                                ? "中央の表示領域は1枚分のまま、左右の画像も同じ100%幅で外側に見せます。左右ボタンとドットで移動でき、画像以外のカード型コンテンツにも応用できます。"
                                : "Keeps the active viewport at one full slide while showing previous and next slides at the same 100% width outside the viewport. Previous/next controls and dots remain available.",
                            preview: <ImageFullNeighborCarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code: imageCarouselCode
                                .replace('className="w-full"', 'className="mx-auto w-[68%] min-w-72 max-w-xl"')
                                .replace("<CarouselContent>", '<CarouselContent viewportClassName="overflow-visible">')
                                .replace('className="basis-[72%]"', 'className="basis-full"')
                                .replace('className="left-3 bg-background/90"', 'className="left-2 bg-background/90 sm:-left-10"')
                                .replace('className="right-3 bg-background/90"', 'className="right-2 bg-background/90 sm:-right-10"'),
                        },
                        {
                            key: "thumbnail-controller",
                            title: isJa ? "画像サムネイルコントローラー" : "Image thumbnail controller",
                            description: isJa
                                ? "画像一覧ではドットだけでなくサムネイルで現在位置と移動先を確認できるようにします。CarouselThumbnail はクリックで該当スライドへ移動します。"
                                : "Image galleries can use thumbnails instead of dots so users can identify and jump to a specific slide.",
                            preview: <ThumbnailCarouselSample isJa={isJa} />,
                            previewHeight: "auto",
                            code: thumbnailCarouselCode,
                        },
                        {
                            key: "autoplay",
                            title: isJa ? "自動再生とコントローラー" : "Autoplay with controls",
                            description: isJa
                                ? "自動再生を使う場合は、停止と再開の操作を必ず用意します。ドットは現在位置の確認と直接移動に使います。"
                                : "When autoplay is enabled, include a play/pause control. Dots show the current position and allow direct navigation.",
                            preview: <ImageCarouselSample isJa={isJa} autoPlay />,
                            previewHeight: "auto",
                            code: autoplayCarouselCode,
                        },
                        {
                            key: "vertical",
                            title: isJa ? "縦方向" : "Vertical",
                            description: isJa
                                ? "縦方向に送るプレビューや短いステップ表示に使います。"
                                : "Use vertical orientation for stacked previews or short step sequences.",
                            preview: <CarouselSample vertical isJa={isJa} />,
                            previewHeight: "auto",
                            code: code.replace('className="w-64"', 'orientation="vertical" className="h-64 w-64"'),
                        },
                    ]}
                />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="props">
                    {sectionLabels.props}
                </h2>
                <PropsTable data={propsData} />
            </section>

            <section className="space-y-4">
                <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight" id="usage">
                    {sectionLabels.usage}
                </h2>
                <CodeCopyButton code={usageCode} />
                <CodeBlock code={usageCode} />
            </section>
            <section className="space-y-4">
                <div className="border-b pb-2">
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight" id="design-decisions">
                        {isJa ? "設計の判断" : "Design decisions"}
                    </h2>
                </div>
                {isJa ? (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>自動送りは既定で止めてある。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">autoPlay</code> の既定は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">false</code> です。動いているものは見つけにくく、動きに弱い人の負担にもなるので、必要な画面で明示的に入れる形にしています。入れたときは <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">controls</code> が止めるボタンを出し、<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code> で入り切りを伝えます。
                        </li>
                        <li>
                            <strong>止まるきっかけを、マウス以外にも用意する。</strong><code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pauseOnHover</code> は既定で入っていますが、止まるのはマウスを載せたときだけではありません。中の要素にキーボードで焦点が入ったとき（<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onFocusCapture</code>）も同じように止まります。読んでいる途中で勝手に送られないようにするためです。
                        </li>
                        <li>
                            <strong>何枚目かを読み上げに乗せる。</strong>全体は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="region"'}</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'aria-roledescription="carousel"'}</code>、1枚ごとに <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="group"'}</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'aria-roledescription="slide"'}</code>、下の点は <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="tablist"'}</code> と <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="tab"'}</code> に <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-selected</code> と1枚ずつの名前が付きます。
                        </li>
                    </ul>
                ) : (
                    <ul className="ml-4 list-disc space-y-2 text-sm text-muted-foreground">
                        <li>
                            <strong>Autoplay is off until you ask for it.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">autoPlay</code> defaults to <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">false</code>. Moving content is harder to find and it costs readers who are sensitive to motion, so it has to be switched on per screen. When it is on, <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">controls</code> renders a pause button that reports its state through <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-pressed</code>.
                        </li>
                        <li>
                            <strong>Pausing is not only a mouse gesture.</strong> <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">pauseOnHover</code> is on by default, but hovering is not the only trigger. Keyboard focus landing anywhere inside (<code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">onFocusCapture</code>) pauses it the same way, so nothing slides away mid-read.
                        </li>
                        <li>
                            <strong>Announce which slide this is.</strong> The frame carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="region"'}</code> with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'aria-roledescription="carousel"'}</code>, each slide carries <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="group"'}</code> with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'aria-roledescription="slide"'}</code>, and the dots are a <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="tablist"'}</code> of <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">{'role="tab"'}</code> elements with <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">aria-selected</code> and a per-slide name.
                        </li>
                    </ul>
                )}
            </section>
        </ComponentLayout>
    );
}
