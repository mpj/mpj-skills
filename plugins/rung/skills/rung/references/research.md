# Research: why the shop is built this way

Two research passes ran before any voice was rebuilt (2026-08-22, web research via subagents). Summaries and sources, kept because the design decisions in this directory lean on them.

## Pass 1: the style-bleed problem is real and measurable

The trigger: first-round voice pastiches all carried the model's own register through the costume (em dashes, "load-bearing," the "not X, it's Y" reversal, tidy triads). Findings:

* The tells are quantified per-model. Sam Paech's EQ-Bench "Slop Score" weights overrepresented slop words (60%), "not X, but Y" contrast patterns (25%), and slop trigrams (15%) per model: https://eqbench.com/slop-score.html. Wikipedia editors maintain a working catalog: https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing.
* Each model has an attributable idiolect. LLM authorship attribution reaches ~95% accuracy across five model families: https://arxiv.org/abs/2506.17323; "Beyond 'AI Language'" argues per-model idiolects rather than one generic AI style: https://arxiv.org/pdf/2608.06589. Claude's profile leans em dashes, concessive balancing, warm hedging.
* Why it happens: RLHF mode collapse (lower token entropy, attractor states: https://www.researchgate.net/publication/381308235, https://gwern.net/doc/reinforcement-learning/preference-learning/mode-collapse/abstract) plus deliberate character training. The "assistant axis" paper finds models adopt a persona early and drift back to the default trajectory; when persona and prior conflict, the prior usually wins: https://arxiv.org/pdf/2601.10387. Later model generations carry heavier character training, so the prior is stronger.

Design consequence: persona is a *per-response* battle, not a one-time instruction. Hence anchors in context for every writing agent, and a mechanical gate that doesn't care what the model intended.

## Pass 2: what actually works, ranked

1. **Verbatim samples + completion framing** (the big one). Few-shot with real passages gave up to 23.5x higher style fidelity than zero-shot, and text-completion framing was strongest: https://arxiv.org/abs/2509.24930. Samples must be verbatim with original formatting. Hence the anchoring requirement in every brief.
2. **Two-pass generation.** Content pass, then a style/precision pass in a fresh context; single-pass trades style against correctness ("AI-Slop to AI-Polish": https://arxiv.org/abs/2504.07532). Hence the draft-then-line-pass shape.
3. **Mechanical voice bibles.** Trait descriptions outperform author names; contrastive counter-examples sharpen the boundary (https://arxiv.org/abs/2604.26460). Hence the derive-your-own-bible setup step.
4. **Mechanical lint.** The only 100%-reliable layer for what it covers; used as a gate feeding re-edit, not blind find-replace. Prior art: https://github.com/jalaalrd/anti-ai-slop-writing. Hence `scripts/style-lint.mjs`.
5. **Negative instructions are weak alone.** Stacked DON'Ts get ignored; naming the banned thing raises its salience (the "pink elephant" analysis: https://eval.16x.engineer/blog/the-pink-elephant-negative-instructions-llms-effectiveness-analysis). Positive substitution works, and Anthropic's own guidance endorses it. Hence every ban in the hygiene rules pairs with a replacement ("for asides use parentheses or commas").

## The finding the research missed (learned in production)

No amount of style fidelity protects factual fidelity. The anchored, linted, five-times-edited flagship piece carried an invented concrete ("eighteen months ago") through the entire shop, because editors verify against a ground-truth sheet and a fabrication that fits the sheet's silence passes. The veridicality step (writer lists concretes, repo-aware agent checks them against the world) exists because of this, and it is the one stage with no substitute in the literature above.
