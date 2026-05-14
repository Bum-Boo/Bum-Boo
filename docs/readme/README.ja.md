# Bum-Boo

> 実際のユーザーのために、local-first の生産性ツール、AI-assisted workflow system、Windows デスクトップユーティリティを作っています。

[Overview](../../README.md) | [English](README.en.md) | [Korean](README.ko.md) | [Chinese](README.zh-CN.md) | [Japanese](README.ja.md)

見栄えのよいデモだけではなく、実際の作業で使える実用的なソフトウェアを重視しています。主な関心領域は local-first automation、AI-assisted workflow system、Windows デスクトップユーティリティです。

## 作っているもの

| 領域 | 焦点 |
| --- | --- |
| Local-first AI workflow | Codex や MCP 形式のシステムが、ユーザーデータをローカルに保ったまま調査、整理、変更提案を行えるようにするツール。 |
| デスクトップ生産性 | ショートカット、検索、コントローラー入力、メディア操作、日常の摩擦を減らす Windows ユーティリティ。 |
| コンテンツ運用 | 非エンジニアでもコンテンツを収集、確認、整理、再利用できる内部ツール。 |
| 安全性を意識したツール | 見える状態、範囲を限定した自動化、戻せる操作、正直な制限説明。 |

## 代表プロジェクト

| プロジェクト | 示しているもの |
| --- | --- |
| [Vaultwright](https://github.com/Bum-Boo/Vaultwright) | Codex/MCP workflow 向けの local-first Obsidian vault メンテナンス層。 |
| [BBCC](https://github.com/Bum-Boo/BBCC) | クリエイティブ workflow とメディア操作向けの Windows コントローラーショートカットマッピング。 |
| [BB TxT](https://github.com/Bum-Boo/BBTxT) | ソースコード、ログ、設定、読み取り可能なファイルを対象にした高速なローカルテキスト検索。 |
| [Naver-Cafe-Posts-Downloader](https://github.com/Bum-Boo/Naver-Cafe-Posts-Downloader) | Naver Cafe 投稿向けのローカル Windows アーカイブ管理ツール。 |
| [BIGLOADEB](https://github.com/Bum-Boo/BIGLOADEB) | Windows 向けのアカウント中心 Instagram 投稿収集とローカルメディア管理。 |
| [BTS Sec](https://github.com/Bum-Boo/BTS_sec) | 許可された Web/ローカルプロジェクト向けの防御的セキュリティ監査ツールキット。 |

## プロジェクトグループ

- **Local-first AI workflow:** Vaultwright, BTS Sec.
- **デスクトップ生産性:** BBCC, BB TxT.
- **コンテンツ運用:** Naver-Cafe-Posts-Downloader, BIGLOADEB.
- **安全性を意識したツール:** BTS Sec, Vaultwright, CheeseKit.

## 進行中 / クリエイターツール

**[CheeseKit](https://github.com/Bum-Boo/BumBoo-Cheese-Kit)** は、CHZZK ライブ配信ツールと安全な bot library のためのローカルデスクトップ root app です。まだ v0.1/mock-first の creator-tooling プロジェクトなので、release path、preview、real-adapter boundary がより整うまでは secondary project として扱います。

## 設計価値

- **見える状態:** ツールが何をしていて、何が変わったのかをユーザーが把握できること。
- **範囲を限定した自動化:** 自動化はユーザーが承認した境界内にとどまること。
- **戻せる操作:** 破壊的または不可逆な作業を自動化の背後に隠さないこと。
- **Local-first data handling:** ユーザーが明示的に選ばない限り、個人データや workflow データをローカルに保つこと。
- **正直な制限:** 実験的、内部用、mock、未完成の機能は明確に表示すること。

## リンク

- [bumboo.fun](https://bumboo.fun)

## メモ

一部のプロジェクトは実験的、内部用、または初期段階です。公開説明では、ツールが何をするのか、誰に役立つのか、安全境界はどこか、まだ実装されていないものは何かを実用的に示します。
