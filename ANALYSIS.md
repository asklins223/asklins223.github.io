# Repository Analysis

## Overview
- The site is a statically generated Hexo blog (`Hexo 6.3.0`) that publishes Chinese-language content under the "Asklins_Blog" brand and exposes metadata for social platforms.【F:index.html†L1-L58】【F:index.html†L90-L110】

## Theme configuration
- The global `ASYNC_CONFIG` object configures author details, favicon behavior, theme switching defaults, search, and localization strings, revealing that the theme supports dynamic light/dark modes, a custom visibility-change icon, and internationalized search messaging.【F:index.html†L36-L88】
- Theme styles are loaded through `/css/index.css` via the `trm-switch-style` link element after the configuration block, enabling runtime theme toggling based on stored preferences or OS color scheme.【F:index.html†L89-L104】

## JavaScript architecture
- `js/main.js` defines a `SwupScriptsPlugin` that watches `contentReplaced` events to inject deferred scripts and inline blocks after page transitions, ensuring asynchronous navigation keeps third-party resources synchronized.【F:js/main.js†L1-L83】
- The same file implements a `SwupHeadPlugin` to replace head tags and update the document language when Swup swaps pages, preserving metadata coherence across navigations.【F:js/main.js†L84-L143】

## Content organization
- Archive pages reuse the same `ASYNC_CONFIG` and theme bootstrap, demonstrating consistent metadata and theme initialization across sections such as `/archives`.【F:archives/index.html†L1-L80】
