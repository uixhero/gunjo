# app/data/cold-test-findings — 回ごとの「発見」データ層

コールドテストの回で分かったことを、記事本文とは別の**データ**として持つ層です。
1つのデータを2箇所で描きます。

- 回ページ `/cold-tests/<round>` の要約ブロック（その回のぶんだけ）
- 業界の扉ページ `/cold-tests/categories/<slug>` の集約（その業界の全回ぶん）

記事原稿（`app/data/cold-test-rounds/*.json` の `article.markdown`）は**書き換えません**。
ここに書けるのは、記事に書いてあることだけです。記事に無い解釈を足さないでください。

## ファイル

`<round>.json` を1回につき1ファイル。回が無ければファイルも要りません
（findings が無い回では、回ページの要約ブロックは出ません）。

## 形

```jsonc
{
  "schemaVersion": 1,
  "round": 103,
  "lang": "ja",
  "findings": [
    {
      "id": "103-amount-derivation-handrolled",   // ファイルを跨いで一意
      "kind": "pitfall",                          // requirement | pitfall
      "group": "amount-derivation",               // 任意。同じ穴を回を跨いで束ねる
      "phenomenon": "…",                          // ⑴ 現象を、体験の言葉で1〜2文
      "where": {                                  // ⑵ どの画面のどこか
        "round": 103,                             //     回番号は必須
        "alsoRounds": [102],                      //     任意。同じ現象が出た別の回
        "screen": "自動車保険 保険金支払・精算管理",
        "spot": "支払明細の導出"
      },
      "cause": "…",                               // ⑶ 原因1文（pitfall のみ）
      "status": "resolved",                       // ⑷ resolved | fix-known | tracking
      "links": [                                  //     根拠へのリンク
        { "kind": "issue", "id": 347 },
        { "kind": "pr", "id": 348 },
        { "kind": "component", "slug": "amount-breakdown", "label": "AmountBreakdown" }
      ],
      "selfCheck": "…"                            // ⑸ 任意。読者が自分の画面で確かめる手順1文
    }
  ]
}
```

### kind

| 値 | 扉ページの見出し | 意味 |
| --- | --- | --- |
| `requirement` | この業界で要るもの | その業界の画面に毎回出てくる作法 |
| `pitfall` | 連載が先につまずいたところ | 連載が先に踏んで、記録した欠落や papercut |

`cause` は `pitfall` にだけ書きます。`requirement` は「要る」という事実で、原因はありません。

### status

現在の状態です。**過去の記録ではなく、書いた時点の実測**を入れます。
issue 番号が関わるものは `gh issue view <n> -R uixhero/gunjo` で state を見てから決めてください。

| 値 | 画面の表示 | 判定 |
| --- | --- | --- |
| `resolved` | 対応済み | issue が閉じていて、**src の該当の振る舞いが実際に変わっている**ことを確認した |
| `fix-known` | 直し方記録済み | 直し方は記録されているが、報告された振る舞いはまだ残っている（issue が開いている場合も、閉じているが該当部分は変わっていない場合も含む） |
| `tracking` | 追跡中 | まだ直し方が定まっていない |

閉じていない issue を「対応済み」と書かないでください。
issue が閉じていても、報告された振る舞いが src に残っているなら `fix-known` です。

### links

| kind | 必須 | 行き先 |
| --- | --- | --- |
| `issue` | `id` | `https://github.com/uixhero/gunjo/issues/<id>` |
| `pr` | `id` | `https://github.com/uixhero/gunjo/pull/<id>` |
| `component` | `slug`, `label` | `/docs/components/<slug>` |
| `docs` | `href`, `label` | そのまま |

### group

同じ穴が複数の回で出たときだけ使います。扉ページは `group` が同じ項目を1行にまとめ、
**いちばん早い回**の書き方を代表として出し、根拠の回を全部並べます。
状態は「いちばん進んでいないもの」を採ります（1つでも `tracking` があれば `tracking`、
1つでも `fix-known` があれば `fix-known`）。対応済みと言い過ぎないための規則です。

## いまの範囲

- 保険（`insurance`）の公開回 #101-105 のみ。スキーマを固めるためのパイロットです。
- 日本語のみ（`lang: "ja"`）。英語は別途。回ページの要約ブロックは日本語のページにだけ出ます。
- 下書き #200-204 は公開後に追補します。
