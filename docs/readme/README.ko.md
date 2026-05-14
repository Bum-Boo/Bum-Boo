# Bum-Boo

> 실제 사용자를 위한 local-first 생산성 도구, AI-assisted workflow system, Windows 데스크톱 유틸리티를 만듭니다.

[Overview](../../README.md) | [English](README.en.md) | [Korean](README.ko.md) | [Chinese](README.zh-CN.md) | [Japanese](README.ja.md)

저는 보기 좋은 데모보다 실제로 쓸 수 있는 도구에 초점을 둡니다. 주요 관심사는 local-first 자동화, AI-assisted workflow system, Windows 데스크톱 유틸리티입니다.

## 무엇을 만드는가

| 영역 | 초점 |
| --- | --- |
| Local-first AI workflow | Codex나 MCP 스타일 시스템이 사용자의 데이터를 로컬에 둔 채 읽고, 정리하고, 변경안을 제안하도록 돕는 도구. |
| 데스크톱 생산성 | 단축키, 검색, 컨트롤러 입력, 미디어 제어, 반복 작업을 줄이는 Windows 유틸리티. |
| 콘텐츠 운영 | 비개발자도 콘텐츠를 수집, 검토, 정리, 재사용할 수 있게 하는 내부 운영 도구. |
| 안전을 고려한 도구 | 보이는 상태, 명확한 자동화 범위, 되돌릴 수 있는 작업, 솔직한 한계 표시. |

## 대표 프로젝트

| 프로젝트 | 보여주는 것 |
| --- | --- |
| [Vaultwright](https://github.com/Bum-Boo/Vaultwright) | Codex/MCP workflow를 위한 local-first Obsidian vault 유지관리 계층. |
| [BBCC](https://github.com/Bum-Boo/BBCC) | 창작 workflow와 미디어 제어를 위한 Windows 컨트롤러 단축키 매핑 도구. |
| [BB TxT](https://github.com/Bum-Boo/BBTxT) | 소스 코드, 로그, 설정, 읽을 수 있는 파일을 빠르게 찾는 로컬 텍스트 검색 도구. |
| [Naver-Cafe-Posts-Downloader](https://github.com/Bum-Boo/Naver-Cafe-Posts-Downloader) | 네이버 카페 게시글을 로컬에서 관리하는 Windows 아카이브 매니저. |
| [BIGLOADEB](https://github.com/Bum-Boo/BIGLOADEB) | Windows용 계정 중심 Instagram 게시물 수집 및 로컬 미디어 관리 도구. |
| [BTS Sec](https://github.com/Bum-Boo/BTS_sec) | 허가된 웹/로컬 프로젝트를 위한 방어적 보안 감사 툴킷. |

## 프로젝트 그룹

- **Local-first AI workflow:** Vaultwright, BTS Sec.
- **데스크톱 생산성:** BBCC, BB TxT.
- **콘텐츠 운영:** Naver-Cafe-Posts-Downloader, BIGLOADEB.
- **안전을 고려한 도구:** BTS Sec, Vaultwright, CheeseKit.

## 진행 중 / 크리에이터 도구

**[CheeseKit](https://github.com/Bum-Boo/BumBoo-Cheese-Kit)**은 CHZZK 라이브 스트리밍 도구와 안전한 bot library를 위한 로컬 데스크톱 root app입니다. 아직 v0.1/mock-first creator-tooling 프로젝트이므로 release path, preview, real-adapter boundary가 더 단단해질 때까지 보조 프로젝트로 둡니다.

## 설계 가치

- **보이는 상태:** 도구가 무엇을 하고 무엇이 바뀌었는지 사용자가 알 수 있어야 합니다.
- **범위가 명확한 자동화:** 자동화는 사용자가 승인한 경계 안에서만 동작해야 합니다.
- **되돌릴 수 있는 작업:** 파괴적이거나 되돌리기 어려운 작업을 자동화 뒤에 숨기지 않습니다.
- **Local-first 데이터 처리:** 개인 데이터와 workflow 데이터는 사용자가 명시적으로 선택하지 않는 한 로컬에 머물러야 합니다.
- **솔직한 한계:** 실험적, 내부용, mock, 미완성 기능은 직접 표시합니다.

## 링크

- [bumboo.fun](https://bumboo.fun)

## 메모

일부 프로젝트는 실험적이거나 내부용이거나 초기 단계입니다. 공개 설명에서는 도구가 하는 일, 누구에게 도움이 되는지, 안전 경계가 어디인지, 아직 구현되지 않은 것이 무엇인지 실용적으로 밝히는 것을 우선합니다.
