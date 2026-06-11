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

    const code = `import {
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
          previous: "${isJa ? "前のスライド" : "Previous slide"}",
          next: "${isJa ? "次のスライド" : "Next slide"}",
          dots: "${isJa ? "スライド選択" : "Slide selector"}",
          getDotLabel: (index) => ${isJa ? 'index + 1 + "枚目へ移動"' : '"Go to slide " + (index + 1)'},
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
                  {${isJa ? 'item + "枚目"' : '"Slide " + item'}}
                </span>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}`;

    const usageCode = `import { Carousel, CarouselContent, CarouselItem } from "@gunjo/ui"

const items = [
  { id: "plan", label: "${isJa ? "企画" : "Plan"}" },
  { id: "build", label: "${isJa ? "制作" : "Build"}" },
  { id: "review", label: "${isJa ? "確認" : "Review"}" },
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

    const cardCarouselCode = `import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@gunjo/ui"

const cardItems = [
  { label: "${isJa ? "企画" : "Plan"}" },
  { label: "${isJa ? "制作" : "Build"}" },
  { label: "${isJa ? "確認" : "Review"}" },
  { label: "${isJa ? "公開" : "Launch"}" },
  { label: "${isJa ? "改善" : "Improve"}" },
]

function CarouselCard({ label, index }: { label: string; index: number }) {
  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

export function PeekCarousel() {
  return (
    <div className="w-full max-w-lg overflow-visible px-12 py-4">
      <Carousel opts={{ align: "start", containScroll: "trimSnaps", duration: 28 }} className="w-full">
        <CarouselContent>
          {cardItems.map((item, index) => (
            <CarouselItem key={item.label} className="basis-[68%]">
              <CarouselCard label={item.label} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious label="${isJa ? "前へ送る" : "Previous"}" className="-left-10 bg-background/90" hideWhenDisabled />
        <CarouselNext label="${isJa ? "次へ送る" : "Next"}" className="-right-10 bg-background/90" hideWhenDisabled />
        <CarouselDots
          className="mt-4"
          label="${isJa ? "カード選択" : "Card selector"}"
          getDotLabel={(index) => ${isJa ? 'index + 1 + "枚目へ移動"' : '"Go to card " + (index + 1)'}}
        />
      </Carousel>
    </div>
  )
}`;

    const multiVisibleCode = `import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@gunjo/ui"

const cardItems = [
  { label: "${isJa ? "企画" : "Plan"}" },
  { label: "${isJa ? "制作" : "Build"}" },
  { label: "${isJa ? "確認" : "Review"}" },
  { label: "${isJa ? "公開" : "Launch"}" },
  { label: "${isJa ? "改善" : "Improve"}" },
  { label: "${isJa ? "分析" : "Analyze"}" },
]

function CarouselCard({ label, index }: { label: string; index: number }) {
  return (
    <div className="flex aspect-[4/3] flex-col justify-between rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <span className="text-xs font-medium text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
      <span className="text-lg font-semibold">{label}</span>
    </div>
  )
}

export function MultiVisibleCarousel() {
  return (
    <Carousel opts={{ align: "start", containScroll: "trimSnaps", slidesToScroll: 3, duration: 28 }} className="w-full">
      <CarouselContent>
        {cardItems.map((item, index) => (
          <CarouselItem key={item.label} className="basis-1/3">
            <CarouselCard label={item.label} index={index} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="${isJa ? "3枚戻る" : "Previous 3"}" className="left-2 bg-background/90" hideWhenDisabled />
      <CarouselNext label="${isJa ? "3枚送る" : "Next 3"}" className="right-2 bg-background/90" hideWhenDisabled />
    </Carousel>
  )
}`;

    const imageCarouselCode = `import {
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
    label: "${isJa ? "ワークステーション" : "Workstation"}",
  },
  {
    src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    label: "${isJa ? "スタジオ" : "Studio"}",
  },
  {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=960&q=80",
    label: "${isJa ? "風景素材" : "Landscape"}",
  },
]

export function ImageCarousel() {
  return (
    <Carousel opts={{ align: "center", loop: true, duration: 32 }} className="w-full">
      <CarouselContent>
        {galleryImages.map((item) => (
          <CarouselItem key={item.src} className="basis-[72%]">
            <div className="p-1">
              <ImagePreview src={item.src} alt={item.label} aspectRatio="video" className="rounded-lg" previewLabel="${isJa ? "拡大表示" : "Open preview"}">
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-foreground/70 p-4 text-background">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </ImagePreview>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious label="${isJa ? "前の画像" : "Previous image"}" className="left-3 bg-background/90" />
      <CarouselNext label="${isJa ? "次の画像" : "Next image"}" className="right-3 bg-background/90" />
      <CarouselDots
        className="mt-4"
        label="${isJa ? "画像選択" : "Image selector"}"
        getDotLabel={(index) => ${isJa ? 'index + 1 + "枚目の画像へ移動"' : '"Go to image " + (index + 1)'}}
      />
    </Carousel>
  )
}`;

    const thumbnailCarouselCode = imageCarouselCode.replace(
        "CarouselDots,\n  CarouselItem,",
        "CarouselItem,\n  CarouselThumbnail,\n  CarouselThumbnails,\n  Img,"
    ).replace(
        /      <CarouselDots[\s\S]*?      \/>/,
        `      <CarouselThumbnails className="mt-4" label="${isJa ? "画像サムネイル" : "Image thumbnails"}">
        {galleryImages.map((item, index) => (
          <CarouselThumbnail key={item.src} index={index} label={${isJa ? 'item.label + "へ移動"' : '"Go to " + item.label'}}>
            <Img src={item.src} alt="" aspectRatio="video" className="h-full w-full rounded-none" showSkeleton={false} />
          </CarouselThumbnail>
        ))}
      </CarouselThumbnails>`
    );

    const autoplayCarouselCode = imageCarouselCode.replace(
        "Carousel,\n  CarouselContent,",
        "Carousel,\n  CarouselAutoplayToggle,\n  CarouselContent,"
    ).replace(
        '<Carousel opts={{ align: "center", loop: true, duration: 32 }} className="w-full">',
        '<Carousel autoPlay autoPlayInterval={3200} opts={{ align: "center", loop: true, duration: 32 }} className="w-full">'
    ).replace(
        "      <CarouselDots",
        `      <div className="mt-4 flex items-center justify-center gap-3">
        <CarouselDots`
    ).replace(
        "      />\n    </Carousel>",
        `        />
        <CarouselAutoplayToggle playLabel="${isJa ? "自動再生を開始" : "Play carousel"}" pauseLabel="${isJa ? "自動再生を停止" : "Pause carousel"}" />
      </div>
    </Carousel>`
    );

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
        </ComponentLayout>
    );
}
