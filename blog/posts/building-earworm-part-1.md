---
title: "Building Earworm, part 1: a log and a word cloud"
description: Stages one and two of a small app for logging the songs stuck in my head.
date: 2026-09-21
draft: true
---

Whatever song is stuck in my head usually means something, so I'm building a place to log it. Each entry is the song, the artist, and whatever it dragged up. At the end of the month, the notes turn into a word cloud of what I kept coming back to.

I built it with Claude Code. This post covers the first two of four stages and the decisions that came up along the way.

## Starting from an old prototype

I had a React prototype from an earlier idea called AuraFocus: a mood-based playlist generator with a Pomodoro timer. It came with a decent shell (Vite, TypeScript, MUI, React Router, and Clerk for auth) and nothing else Earworm needed. Stage one kept the shell and removed the mood form, the timer, the search page, and the auth routes.

## Stage one: a form and a list

The first version has one form (song, artist, and a free-text note) and a list of entries grouped by month. Entries are saved to `localStorage`.

That meant the app worked with no configuration and no account from the first commit. The tradeoff is rewriting the data layer when a real backend arrives in stage three.

`localStorage` can throw. Private browsing and a full storage quota both raise errors on write, so saves are wrapped:

```ts
export function saveEntries(entries: Entry[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries))
  } catch {
    // Private browsing and full quotas both throw here. Entries stay in memory
    // for the session and the page keeps working.
  }
}
```

## Taking auth out, for now

The prototype's entry point threw an error when the Clerk key was missing, so the app couldn't start until someone set up a Clerk account. And since every entry lives in one browser, auth had nothing to protect yet. Clerk came out of the app for now. It comes back in stage three, when entries move to a server and need to belong to someone.

## Stage two: word clouds

Each month's notes go through a small pipeline: lowercase everything, split into words, drop common words like "the" and "because," drop anything shorter than three letters, count what's left, and keep the top 18. Font size scales with the count. No library.

### The big words clumped together

The first version laid words out alphabetically. In the test entries, the four most common words were *lagos*, *long*, *memory*, and *night*, which all sit next to each other in the alphabet. They landed in one row at the end, and the cloud read like a ranked list.

The fix was to order words by a hash of the word itself. That scatters them across the block, and since a word's hash never changes, the layout is the same on every render.

```ts
function scatter(word: string): number {
  let hash = 0
  for (let i = 0; i < word.length; i++) {
    hash = (hash * 31 + word.charCodeAt(i)) | 0
  }
  return hash
}

const display = [...words].sort((a, b) => scatter(a.word) - scatter(b.word))
```

### When nothing repeats

The size formula divides by the difference between the most and least common word's counts. In a month where every word appears once, that difference is zero. The code checks for that case and renders every word at the same small size, which is also the accurate picture of that month: nothing is standing out yet.

### What's left out

There's no stemming, so "minute" and "minutes" count as different words. Simple suffix stripping turns "memories" into "memori," which looks worse than the duplicate. It stays out for now.

## Next

Stage three moves entries to a real backend, probably Supabase, and brings Clerk back so entries belong to an account. Stage four adds song autocomplete through the iTunes Search API.

The code is [on GitHub](https://github.com/goatsaretasty/aurafocus).
