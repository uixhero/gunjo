import type { DocContent } from "./types";

/**
 * 日本語コンテンツ。ComponentLayout は nav 辞書から日本語/英語の
 * bilingual title を解決する。ここではページ固有の title/description
 * を補完し、特に description は日本語ページで英語 fallback にならないようにする。
 */
export const componentContentJa: Record<string, DocContent> = {
  "components/button": {
    title: "Button",
    description: "ボタン、またはボタン風の見た目のコンポーネントを表示します。",
  },
  "components/tooltip-button": {
    title: "TooltipButton",
    description: "ボタン操作にツールチップ説明を組み合わせ、アイコンだけの操作や補足が必要な操作の意味を明確にします。",
  },
  "components/copy-button": {
    title: "CopyButton",
    description: "クリップボードへのコピー操作を、ツールチップとコピー済み状態のフィードバック付きで表示します。",
  },
  "components/input": {
    title: "Input",
    description: "フォームの入力フィールド、または入力欄風のコンポーネントを表示します。",
  },
  "components/form": {
    title: "Form",
    description: "ラベル、入力欄、説明、エラーメッセージを一貫した余白と状態で組み合わせるフォームプリミティブです。",
  },
  "components/input-otp": {
    title: "InputOTP",
    description: "ワンタイムパスワードや確認コードを、桁ごとのスロットで入力するコンポーネントです。",
  },
  "components/label": {
    title: "Label",
    description: "入力欄や選択肢に紐づくラベルを表示します。",
  },
  "components/badge": {
    title: "Badge",
    description: "バッジ、またはバッジ風のコンポーネントを表示します。",
  },
  "components/icon": {
    title: "アイコン",
    description: "アイコンの大きさ、線幅、支援技術への伝え方を GunjoUI 全体で揃えるプリミティブです。",
  },
  "components/empty-state": {
    title: "EmptyState",
    description: "データがない、検索結果がない、読み込みに失敗したなどの状態を、説明と次の操作付きで表示します。",
  },
  "components/separator": {
    title: "Separator",
    description: "コンテンツを視覚的・意味的に区切ります。",
  },
  "components/skeleton": {
    title: "Skeleton",
    description: "読み込み中のコンテンツの形を示すプレースホルダーです。",
  },
  "components/spacer": {
    title: "Spacer",
    description: "flex レイアウト内で余白を伸縮または固定サイズで確保します。",
  },
  "components/switch": {
    title: "Switch",
    description: "オン/オフを切り替えるコントロールです。",
  },
  "components/textarea": {
    title: "Textarea",
    description: "テキストエリア、またはテキストエリア風のコンポーネントを表示します。",
  },
  "components/time-picker": {
    title: "TimePicker",
    description: "時と分を選択し、24時間表記の値として扱う時刻入力です。",
  },
  "components/checkbox": {
    title: "Checkbox",
    description: "オン/オフを切り替えるコントロールです。",
  },
  "components/radio-group": {
    title: "Radio Group",
    description: "いずれか1つだけ選択できるラジオボタン群です。",
  },
  "components/number-input": {
    title: "NumberInput",
    description: "上下ボタン付きの数値入力です。最小値、最大値、増減単位を指定できます。",
  },
  "components/password-input": {
    title: "PasswordInput",
    description: "パスワードの表示・非表示を切り替えられる入力欄です。",
  },
  "components/password-requirement-list": {
    title: "PasswordRequirementList",
    description: "パスワード要件の達成状態をチェックリストとして表示します。",
  },
  "components/password-strength-meter": {
    title: "PasswordStrengthMeter",
    description: "アプリ側で計算したパスワード強度を段階表示します。",
  },
  "components/password-group": {
    title: "PasswordGroup",
    description: "パスワード入力、要件、強度、エラー、無効化理由を1つの入力グループとして扱います。",
  },
  "components/phone-input": {
    title: "PhoneInput",
    description: "国番号の表示と電話番号の入力補助を組み合わせた入力欄です。",
  },
  "components/postal-code-input": {
    title: "PostalCodeInput",
    description: "郵便番号の入力と 3桁-4桁の整形を扱う入力欄です。",
  },
  "components/range-slider": {
    title: "RangeSlider",
    description: "境界のある範囲から最小値と最大値を選択するスライダーです。",
  },
  "components/mention": {
    title: "Mention",
    description: "@ などのトリガー文字で候補を表示し、テキストエリアへメンションを挿入します。",
  },
  "components/spinner": {
    title: "Spinner",
    description: "処理中であることを示すインジケーターです。",
  },
  "components/stepper": {
    title: "Stepper",
    description: "複数ステップの進行状況を、完了・現在地・未完了の状態で示すコンポーネントです。",
  },
  "components/slider": {
    title: "Slider",
    description: "指定範囲から値を選ぶ入力コンポーネントです。",
  },
  "components/progress": {
    title: "進捗バー",
    description: "タスクの進捗を示すインジケーターです。",
  },
  "components/select": {
    title: "Select",
    description: "ボタンで開く選択肢のリストを表示します。",
  },
  "components/search-input": {
    title: "SearchInput",
    description: "検索アイコンとクリア操作を備えた検索入力欄です。",
  },
  "components/avatar": {
    title: "Avatar",
    description: "ユーザーを表す画像で、フォールバック付きです。",
  },
  "components/avatar-group": {
    title: "AvatarGroup",
    description: "複数のアバターを重ねて表示し、表示しきれない人数を +N とメンバー一覧で確認できるグループ表示です。",
  },
  "components/img": {
    title: "画像",
    description: "ローディングスケルトンとエラー時のフォールバック付きの画像コンポーネントです。",
  },
  "components/image-preview": {
    title: "ImagePreview",
    description: "アセットカード、選択ダイアログ、メディア確認で使う枠付きの画像プレビュー面です。",
  },
  "components/kbd": {
    title: "Kbd",
    description: "キーボードショートカットのキーを表示します。",
  },
  "components/alert": {
    title: "アラート",
    description: "注意を促すためのコールアウトを表示します。",
  },
  "components/status-screen": {
    title: "StatusScreen",
    description: "404、エラー、オフライン、権限なし、メンテナンス、公開前など、全画面の状態フィードバックを表示します。",
  },
  "components/banner": {
    title: "バナー",
    description: "ページ全体に関係するお知らせや状態を横長のバーで表示します。",
  },
  "components/doc-note": {
    title: "DocNote",
    description: "本文中の補足説明、参考リンク、緊急ではない注釈を表示します。",
  },
  "components/text-link": {
    title: "TextLink",
    description: "本文中のリンクを表示し、新しいタブで開くリンクには外部リンクアイコンを自動で併記します。",
  },
  "components/toggle-group": {
    title: "Toggle Group",
    description: "オン/オフできる二値のボタン群です。",
  },
  "components/toggle": {
    title: "Toggle",
    description: "押下状態を持つ単体のオン/オフボタンです。",
  },
  "components/tag": {
    title: "Tag",
    description: "分類、状態、キーワードなどの短いラベルを、必要に応じて削除操作付きで表示します。",
  },
  "components/tool-pill": {
    title: "ToolPill",
    description: "編集ツールやモード切り替えを、ツールチップ付きのアイコンピルとして表示します。",
  },
  "components/timeline": {
    title: "Timeline",
    description: "履歴、進行状況、予定などを時系列の項目として縦方向に表示します。",
  },
  "components/tree-view": {
    title: "TreeView",
    description: "ファイル、設定、階層カテゴリなどの親子構造を開閉できるツリーとして表示します。",
  },
  "components/file-tree": {
    title: "FileTree",
    description: "ファイルとフォルダの階層を、容量や件数、行アクション、単一選択・複数選択つきで表示します。",
  },
  "components/card": {
    title: "Card",
    description: "ヘッダー・本文・フッター付きのカードを表示します。",
  },
  "components/list": {
    title: "List",
    description: "マーカーや余白をカスタマイズできるセマンティックなリストです。",
  },
  "components/markdown-renderer": {
    title: "MarkdownRenderer",
    description: "Markdown 文字列を GunjoUI の本文スタイルに合わせて描画します。",
  },
  "components/accordion": {
    title: "Accordion",
    description: "見出しをクリックすると該当セクションが開閉する縦積みの UI です。",
  },
  "components/accordion-group": {
    title: "AccordionGroup",
    description: "ラベル、説明、すべて開く・すべて閉じるを切り替える操作を備えたアコーディオンのグループです。",
  },
  "components/searchable-accordion": {
    title: "SearchableAccordion",
    description: "検索入力、カテゴリ、件数表示、該当なし表示を組み合わせたアコーディオンです。",
  },
  "components/breadcrumb": {
    title: "パンくず",
    description: "階層リンクで現在のリソースへのパスを表示します。",
  },
  "components/footer": {
    title: "Footer",
    description: "ブランド、リンクグループ、著作権表記をページ下部にまとめて表示します。",
  },
  "components/header": {
    title: "Header",
    description: "ロゴ、主要ナビゲーション、右側の操作をページ上部にまとめて表示します。",
  },
  "components/dropdown-menu": {
    title: "DropdownMenu",
    description: "ボタンで開くメニュー（アクションや機能の一覧）を表示します。",
  },
  "components/alert-dialog": {
    title: "AlertDialog",
    description: "削除や破棄など、重要な操作の前に明示的な確認を求めるモーダルダイアログです。",
  },
  "components/popover": {
    title: "ポップオーバー",
    description: "トリガーに紐づく補足情報、軽いフォーム、状態、短い確認を画面遷移なしで表示します。",
  },
  "components/command": {
    title: "コマンド",
    description: "検索入力、候補リスト、ショートカットを組み合わせて、コマンド選択 UI を構成します。",
  },
  "components/calendar": {
    title: "Calendar",
    description: "日付の入力・編集ができるカレンダーコンポーネントです。",
  },
  "components/combobox": {
    title: "Combobox",
    description: "検索しながら候補を選択できるコンボボックスです。",
  },
  "components/date-picker": {
    title: "DatePicker",
    description: "単一の日付を選択するカレンダーポップオーバー付きの入力コンポーネントです。",
  },
  "components/date-range-picker": {
    title: "DateRangePicker",
    description: "開始日と終了日をまとめて選択する、2か月表示のカレンダーポップオーバーです。",
  },
  "components/editable-field": {
    title: "EditableField",
    description: "読み取り表示と明示的な保存・キャンセル付き編集を切り替えられる、ラベル付きフィールドです。",
  },
  "components/table": {
    title: "Table",
    description: "列見出しと行データを組み合わせて、比較しやすい一覧を表示する表コンポーネントです。",
  },
  "components/statistic": {
    title: "Statistic",
    description: "指標名、主値、増減、補足をまとめて表示する統計コンポーネントです。",
  },
  "components/tabs": {
    title: "Tabs",
    description: "一度に1つだけ表示されるタブパネル群です。",
  },
  "components/toast": {
    title: "Toast",
    description: "一時的に表示する短いメッセージです。",
  },
  "components/tooltip": {
    title: "ツールチップ",
    description: "ホバーやフォーカス時に、操作名・補足・無効理由などの短い情報を表示します。",
  },
  "components/dialog": {
    title: "Dialog",
    description: "背後を無効化したオーバーレイのウィンドウです。",
  },
  "components/drawer": {
    title: "Drawer",
    description: "画面の端から補助的な内容を開き、設定や詳細をその場で確認できるドロワーです。",
  },
  "components/modal": {
    title: "モーダル",
    description: "現在の画面に重ねて、確認・入力・重要な補足を短い操作面として表示します。",
  },
  "components/onboarding-flow": {
    title: "オンボーディング",
    description: "初期設定や導入手順を複数ステップに分けて案内するフローです。",
  },
  "components/carousel": {
    title: "Carousel",
    description: "スライドやカルーセル表示用のコンポーネントです。",
  },
  "components/code": {
    title: "Code",
    description: "本文中の短いコード、コマンド、値を読み分けやすく表示します。",
  },
  "components/code-block": {
    title: "CodeBlock",
    description: "ファイル名、言語ラベル、コピー操作付きでコードブロックを表示します。",
  },
  "components/color-swatch": {
    title: "ColorSwatch",
    description: "カラー値とトークン名を並べて表示し、必要に応じて値をコピーできます。",
  },
  "components/data-table": {
    title: "DataTable",
    description: "列定義、絞り込み、ページ送りを組み合わせて行データを表示するテーブルです。",
  },
  "components/action-data-table": {
    title: "ActionDataTable",
    description: "行選択、一括操作、行操作を組み合わせたデータテーブルです。",
  },
  "components/pagination": {
    title: "Pagination",
    description: "複数ページに分かれた一覧や検索結果を移動するためのナビゲーションです。ページ番号、省略記号、前後移動に加えて、件数サマリーや表示件数の選択と組み合わせて使います。",
  },
  "components/document-pager": {
    title: "ドキュメントページャー",
    description: "前後のドキュメントへ移動するためのナビゲーションです。",
  },
  "components/sort-button": {
    title: "Sort Button",
    description: "ソート順を切り替えるボタンです。",
  },
  "components/tag-input": {
    title: "TagInput",
    description: "複数のタグを入力・削除できるタグ入力欄です。",
  },
  "components/filter-button": {
    title: "フィルターボタン",
    description: "条件の選択状態をボタン上のバッジとポップオーバーで扱うフィルター操作です。",
  },
  "components/progress-widget": {
    title: "進捗ウィジェット",
    description: "進捗値、補足文、進捗バーをカードとしてまとめて表示します。",
  },
  "components/notification-center": {
    title: "通知センター",
    description: "通知の一覧と管理用の UI です。",
  },
  "components/status-bar": {
    title: "Status Bar",
    description: "ステータスや情報を表示するバーです。",
  },
  "components/sidebar-item": {
    title: "サイドバー項目",
    description: "サイドバー内で使う選択行です。アイコン、ラベル、件数、階層、開閉、削除操作を同じ行幅で揃えて表示します。",
  },
  "components/h-stack": {
    title: "水平スタック",
    description: "操作、ラベル、短い項目を横方向に並べ、余白・揃え・折り返しを制御します。",
  },
  "components/v-stack": {
    title: "垂直スタック",
    description: "フォーム、カード、説明ブロックなどを縦方向に積み、余白・揃え・高さ内の配置を制御します。",
  },
  "components/scroll-area": {
    title: "スクロール領域",
    description: "表示領域を意図的に制限し、縦横スクロールを一貫したスタイルで扱います。",
  },
  "components/context-menu": {
    title: "ContextMenu",
    description: "右クリックで開くメニューです。",
  },
  "components/menubar": {
    title: "Menubar",
    description: "デスクトップアプリでよくある常時表示のメニューバーです。",
  },
  "components/hover-card": {
    title: "HoverCard",
    description: "リンク先の内容をプレビュー表示するカードです。",
  },
  "components/sheet": {
    title: "シート",
    description: "現在の画面を残したまま、補助的な設定・フォーム・ナビゲーションを画面端から表示する Dialog ベースのパネルです。",
  },
  "components/resizable": {
    title: "リサイズ可能",
    description: "キーボード操作にも対応した、リサイズ可能な分割パネルレイアウトです。",
  },
  "components/collapsible-panel-toggle": {
    title: "CollapsiblePanelToggle",
    description: "境界線上に配置して、左右上下の折りたたみパネルを開閉するトグルボタンです。",
  },
  "components/chat-input": {
    title: "チャット入力",
    description: "メッセージ入力、添付、送信、停止、無効化理由をまとめて扱うチャット用の入力欄です。",
  },
  "components/chat-composer": {
    title: "チャットコンポーザー",
    description: "チャット入力の前後に選択肢、作業コンテキスト、使用量、補助アクセサリを組み合わせる上位コンテナです。",
  },
  "components/chat-message": {
    title: "チャットメッセージ",
    description: "アシスタント、ユーザー、システム、入力中の会話行を表示するメッセージコンポーネントです。",
  },
  "components/chat-panel": {
    title: "チャットパネル",
    description: "チャットメッセージとチャット入力を組み合わせ、サポートやアシスタントの会話面を構成するパネルです。",
  },
  "components/app-rail": {
    title: "アプリレール",
    description: "左側の細いプライマリナビゲーションです。",
  },
  "components/right-rail": {
    title: "右レール",
    description: "デスクトップで、主コンテンツの右側に補助情報を置くレールです。",
  },
  "components/page-aside": {
    title: "ページ補助",
    description: "ページ内リンク、ページステータス、関連リンクなどの補助情報を、広い画面では右レール、狭い画面では本文内の折りたたみ領域へ配置します。",
  },
  "components/share-modal": {
    title: "共有モーダル",
    description: "公開リンクの有効化、URLコピー、共有状態の確認をまとめて扱うモーダルです。",
  },
  "components/floating-panel": {
    title: "FloatingPanel",
    description: "作業面やキャンバス上に、ツール、状態、補助情報を重ねて表示するパネルです。必要に応じてドラッグやリサイズも有効化できます。",
  },
  "components/marquee-frame": {
    title: "マーキーフレーム",
    description: "パターンや画面を、擬似ブラウザと表示サイズ切り替えの中で確認するフレームです。",
  },
  "components/spatial-canvas": {
    title: "空間キャンバス",
    description: "パネルやノードを配置できる、ドット背景とグリッド間隔を持つキャンバス面です。",
  },
  "components/toast-provider": {
    title: "Toast Provider",
    description: "トーストの表示と管理を行います。",
  },
  "components/file-uploader": {
    title: "File Uploader",
    description: "ドラッグ＆ドロップ対応のファイルアップロードです。",
  },
  "components/inspector-panel": {
    title: "インスペクター",
    description: "選択中の対象に紐づくプロパティを、セクションとフィールドで閲覧・編集するパネルです。",
  },
  "components/command-palette": {
    title: "コマンドパレット",
    description: "ナビゲーションやアクション用のグローバルコマンドパレットです。",
  },
  "components/charts": {
    title: "チャートの概要",
    description: "ダッシュボードパターンで使うチャートプリミティブとチャートカードのカテゴリ概要です。",
  },
  "components/analytics-card": {
    title: "分析カード",
    description: "チャート、差分、補足情報を載せるメトリックカードです。",
  },
  "components/sparkline-chart": {
    title: "スパークライン",
    description: "密度の高いカード向けの小さな線・面・ステップチャートです。",
  },
  "components/line-chart": {
    title: "折れ線チャート",
    description: "複数系列の時系列比較に使う線・面チャートです。",
  },
  "components/ribbon-chart": {
    title: "リボンチャート",
    description: "期間ごとの流量や構成量の広がりを示すリボンチャートです。",
  },
  "components/radial-bar-chart": {
    title: "ラジアルバーチャート",
    description: "進捗・比率・容量を同心円のバーで比較するチャートです。",
  },
  "components/bar-chart": {
    title: "棒グラフ",
    description: "平均値マーカー付きの縦棒・横棒チャートです。",
  },
  "components/stacked-bar-chart": {
    title: "積み上げ棒チャート",
    description: "グループごとの内訳を比較する縦・横の積み上げ棒チャートです。",
  },
  "components/distribution-bar": {
    title: "分布バー",
    description: "セグメントやチャネル構成を示す積み上げ割合バーです。",
  },
  "components/mini-distribution-bar-card": {
    title: "ミニ分布バーカード",
    description: "カテゴリ構成や利用率を、密集したティックバーでコンパクトに示すカードです。",
  },
  "components/segment-timeline-card": {
    title: "セグメントタイムラインカード",
    description: "睡眠ステージ、稼働状態、配送状態などの時間範囲を横方向に示すカードです。",
  },
  "components/donut-chart": {
    title: "ドーナツチャート",
    description: "中央ラベル付きで構成比を示すドーナツチャートです。",
  },
  "components/pie-chart": {
    title: "円グラフ",
    description: "セグメントの構成比を比較する円グラフです。",
  },
  "components/gauge-chart": {
    title: "ゲージチャート",
    description: "スコアや進捗、容量を示す半円ゲージです。",
  },
  "components/segmented-gauge-card": {
    title: "セグメントゲージカード",
    description: "支出、進捗、リスクなどを複数セグメントの半円ゲージで示すカードです。",
  },
  "components/radar-chart": {
    title: "レーダーチャート",
    description: "複数軸の正規化スコアを比較するレーダーチャートです。",
  },
  "components/heatmap-chart": {
    title: "ヒートマップ",
    description: "曜日・時間・コホートの密集度を示すヒートマップです。",
  },
  "components/activity-timeline-card": {
    title: "活動タイムラインカード",
    description: "活動量、睡眠、業務負荷などの時間帯別データを、概要値・タイムライン・内訳バーでまとめるカードです。",
  },
  "components/labeled-donut-card": {
    title: "ラベル付きドーナツカード",
    description: "中央サマリーと外部ラベルで、セグメントの構成比を読み取りやすくするドーナツカードです。",
  },
  "components/retention-cohort-card": {
    title: "継続率コホートカード",
    description: "獲得月や開始時期ごとの継続率を、期間別に比較するコホートカードです。",
  },
  "components/quadrant-matrix": {
    title: "4象限マトリクス",
    description: "項目を x/y の位置で配置してランキングできる4象限マトリクスです。",
  },
  "components/chart-legend": {
    title: "チャート凡例",
    description: "チャート系列やセグメントのラベル・値を表示します。",
  },
  "components/choropleth-map": {
    title: "塗り分け地図",
    description: "GeoJSON 風の境界データで地域別の密集度、地点マーカー、ランキングを示す地図です。",
  },
  "components/concentric-progress-card": {
    title: "同心円進捗カード",
    description: "ストレージ、クォータ、利用率を複数リングで示す進捗カードです。",
  },
  "components/asset-card": {
    title: "Asset Card",
    description: "メディアライブラリや制作物一覧で使う、選択・お気に入り・スコア表示付きのアセットカードです。",
  },
  "components/asset-grid": {
    title: "Asset Grid",
    description: "アセットカードをレスポンシブなグリッドやグループ単位で表示します。",
  },
  "components/metadata-list": {
    title: "MetadataList",
    description: "インスペクターや詳細パネルで使う、ラベルと値のメタ情報リストです。",
  },
  "components/tag-editor": {
    title: "TagEditor",
    description: "タグ入力、削除、候補からの追加をまとめて扱うタグ編集 UI です。",
  },
  "components/asset-inspector-panel": {
    title: "Asset Inspector Panel",
    description: "アセットのプレビュー、タグ、メタデータ、操作をまとめて確認・編集するインスペクターパネルです。",
  },
  "components/media-lightbox": {
    title: "メディアライトボックス",
    description: "メディアを大きく確認するための、ズーム・前後移動・操作付きライトボックスです。",
  },
  "components/media-picker-dialog": {
    title: "メディア選択ダイアログ",
    description: "ライブラリ内のアセットを検索し、単体または複数選択するためのダイアログです。",
  },
  "components/aspect-ratio": {
    title: "AspectRatio",
    description: "画像、動画、iframe などのメディア枠を、指定した縦横比で保つレイアウトプリミティブです。",
  },
  "components/cluster": {
    title: "Cluster",
    description: "タグ、ボタン、短い操作群を、折り返し可能な横並びとしてまとめるレイアウトプリミティブです。",
  },
  "components/container": {
    title: "Container",
    description: "ページやセクションの横幅、左右余白、中央寄せを一貫して制御するレイアウトプリミティブです。",
  },
  "components/device-frame": {
    title: "DeviceFrame",
    description: "デスクトップ、タブレット、モバイルの表示サイズを切り替えられる擬似ブラウザフレームです。",
  },
  "components/grid": {
    title: "Grid",
    description: "列数、間隔、最小幅を指定して、カードやメディアを整列する CSS grid ラッパーです。",
  },
  "components/dashboard": {
    title: "Dashboard",
    description: "サイドバーとヘッダー付きの標準ダッシュボードレイアウトです。",
  },
  "components/editor": {
    title: "Editor",
    description: "Figma 風のエディタレイアウト（サイドバーとキャンバス）です。",
  },
  "components/settings": {
    title: "Settings",
    description: "ナビとフォームエリアのある設定ページレイアウトです。",
  },
  "components/auth": {
    title: "Auth",
    description: "ログイン・サインアップ用の分割画面レイアウトです。",
  },
  "components/kanban": {
    title: "Kanban",
    description: "横スクロールのボードレイアウトです。",
  },
  "components/landing": {
    title: "Landing",
    description: "ヒーローと機能セクションのあるランディングページです。",
  },
  "components/chat": {
    title: "Chat",
    description: "メッセージアプリ用のレイアウトです。",
  },
  "components/bannalyze": {
    title: "Bannalyze",
    description: "Bannalyze 用テンプレートです。",
  },
  "components/media-library": {
    title: "Media Library",
    description: "メディアライブラリ用のレイアウトです。",
  },
};
