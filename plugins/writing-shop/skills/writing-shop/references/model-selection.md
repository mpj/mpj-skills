# Which model sits in which seat

Added 2026-08-31, eight days after the run it reacts to. The shop was built model-agnostic and then run entirely on whatever model the session happened to be, which was Claude Opus 5. This file records what happened when that assumption was tested, and what the seats should run on.

## The fault the shop could not see

The first run produced a piece that passed every gate and still read wrong to its reader. The verdict was one word, *sirligt*, and two named sentences:

> "I mention it now because you should know where this ends up."
> "Filling those seats required an audition, and the audition is where the interesting thing happened."

Neither trips any of the gate's four rules. Every word in them is ordinary. The fault is **discourse signposting**: announcing the shape of the text rather than carrying content, telegraphing that something notable is coming, explaining the writer's own organizational choices, and stitching paragraphs with references to the essay's own structure.

It has a name in applied linguistics. Hyland splits metadiscourse into *interactional* (hedges, boosters, attitude markers, self-mention: the writer's stance) and *interactive* (transitions, **frame markers**, **endophoric markers**: guiding the reader through the text's own structure). Frame markers are defined as devices that announce discourse goals, label stages, sequence material and shift topic. Both named sentences are frame markers.

Jiang and Hyland (*English for Specific Purposes* 79, 2025) measured the machine profile directly: LLM essays prioritise transitions and endophoric markers while collapsing hedges, boosters and attitude markers. Their engagement-marker study counts 5.40 engagement markers per 1,000 words in ChatGPT essays against 16.99 in student essays, with **zero personal asides in 72,819 words**. Reinhart et al. (*PNAS* 122(8), 2025) locate the cause in post-training rather than pretraining: base Llama matches human grammar and the instruction-tuned variant does not.

**Do not build a gate on total metadiscourse density.** The machine total is *lower* than the human total, because the interactional half collapses. The signal is the **ratio** of interactive to interactional markers, and a naive density gate would push the prose further toward the machine profile.

## The irony worth recording

Claude Opus 5 has the lowest lexical slop score on EQ-Bench's 125-model board: **6.59, against a human baseline of 6.90.** It is better than human on precisely the axis this shop's linter measures. Optimising hard against surface slop appears to have moved the tell up into discourse structure, where nothing measures it. Freeburg's em-dash work shows the same over-compliance: Claude drops to 0.19 em dashes per 1,000 words under a prose constraint, against a human baseline of 3.23. **Zero is also a tell.**

## The bake-off (2026-08-31)

Five models, one completion each. Identical inputs: 1,189 words of verbatim Spolsky (three essays, punctuation intact), the same standing prompt and hygiene rules, the same settled structure spec, and the same ground-truth sheet. Subject was this shop and the pull request that carried it, so the already-published Opus 5 piece serves as a control.

Scored three ways: frame-marker regexes (deterministic), the lint gate, and two blind judges anonymised A-E. **Both judges were chosen from families not competing** (DeepSeek V4 Pro, Kimi K3), because a Claude judge cannot be trusted here: Surge AI documented an autograder preferring a response for "clear organization, transitions, and varied sentence structure" where human experts unanimously preferred the plain one. An in-family editor scores signposting as a virtue.

| Model | Words | Lint | Judge total (of 40) | DeepSeek | Kimi | $/M in→out |
|---|---|---|---|---|---|---|
| `openai/gpt-5.6-sol` | 1,028 | **0 findings** | **29.5** | **1st** | 3rd | 2 → 10 |
| `anthropic/claude-fable-5` | 1,023 | 1 (quoted tell) | 28.5 | 2nd | **1st** | 10 → 50 |
| `anthropic/claude-opus-5` | 1,083 | 1 (quoted tell) | 26.0 | 3rd | 2nd | 5 → 25 |
| `meta/muse-glimmer-30b` | 894 | 1 (quoted tell) | 19.0 | 5th | 4th | 0.35 → 1.50 |
| `google/gemini-3.1-pro-preview` | 1,280 | 2 (triads) | 14.5 | 4th | 5th | 2 → 12 |

**Opus 5 reproduced the complaint in paragraph two.** Its fifth sentence: "It's not going to merge itself, either, and that's the interesting part." Kimi, not knowing which model wrote it: "The reader quoted 'the audition is where the interesting thing happened' as the offending specimen, and C hands him back 'that's the interesting part' in paragraph two. An unforced, verbatim-adjacent re-offense." The brief it was working from is about this exact failure.

**Gemini 3.1 Pro failed the test that reputation had won for it.** It was ranked second on structural argument before the run and finished last and fourth. Kimi: "the performing machine: billboards, caps, Q&A, explained jokes, factual slips." It opened with `ZERO` in capitals, wrote "There is exactly one point to understand about teaching an AI to write," tripped the triad rule twice, and made a factual error inside an essay about fact-checking.

**No model is clean.** Both judges found signposting in all five texts. Worst offenders quoted: Sol, "This is the part people forget when they talk about voice." Fable 5, "Here is the mistake that made all of this necessary." Muse Glimmer, "Here is the ludicrous part, and it is the only analogy I will use." The difference between models is quantity and repairability, not presence.

### The seats

- **Head writer: `openai/gpt-5.6-sol`.** Only clean lint, top three with both judges, first with one, and 60% cheaper than Opus 5. Its own fault is preciousness; Kimi called it "the most polished and the second-most precious."
- **Head writer, alternate: `anthropic/claude-fable-5`**, when voice matters more than cost. Kimi's pick, on the grounds that its faults are "three sentences an editor can strike in thirty seconds" while its virtues cannot be edited into the others. Double Opus 5's price.
- **Structure advisor: `anthropic/claude-opus-5`.** The density that hurts its prose is an asset when it is ruling on shape rather than writing.
- **Precision editor and tightening advisor: any non-Claude family**, for the judge-bias reason above. Never let a Claude model rule on Claude prose.
- **Rejected: `google/gemini-3.1-pro-preview`.**

## The larger effect, which is not the model

The same Opus 5 scored **8.5 frame markers per 1,000 words** writing the published piece across a long editorial conversation, and **0.93** writing the bake-off essay in a single clean completion. That gap is larger than every difference between models in the table above.

It is confounded (different prompt wording, single-shot against a multi-turn thread with editorial letters passing through it), so it is a hypothesis and not a finding. But it points somewhere useful: **a short, clean, anchored context for the writing seat may be worth more than any model swap.** Worth testing properly before spending effort on model selection.

Two supporting findings argue the same way. Few-shot style fidelity is flat beyond roughly four exemplars (Wang et al., Findings of EMNLP 2025), and PersonalBench (arXiv 2608.19746) finds verbatim anchoring beats merely describing the style by 0.006, with every method below the human cross-author floor. **The 23.5x figure in `research.md` is few-shot against zero-shot and still stands. The belief that more anchoring is better does not.** Spend that context on structural prohibitions instead.

## Detection, and why the linter was not extended

A frame-marker regex set was written and run for the bake-off. Against the judges it **undercounts by roughly four times**: it found one hit per essay where the judges found three to six each, and it matched only one of the five worst-offender sentences they quoted.

It is not shipped, for two reasons. Lexicalised patterns reach only the lexicalised head of the distribution, and the tool that has gone furthest here (`theclaymethod/unslop`) warns in its own README that "a cue-deletion attack collapses the scaffold metric": ban the marker words and the model keeps announcing without them, which is a more sophisticated version of the same bug and invisible to the gate. Its own latest evaluation was a no-ship on precision. A useful detector needs document-level metrics (interactive-to-interactional ratio, share of paragraphs opening on a discourse cue rather than a claim) scored jointly with the lexical layer, and thresholds calibrated on the target author's corpus rather than set globally, because "in other words" is fatal in one essayist and native in another.

Until that exists, the tightening seat is the detector, and the rule it works to is the plainest thing found in the whole search: **delete the frame and keep the fact it was wrapped around; if there is no fact underneath, delete the sentence.**

## One warning

Opus 5 is independently reported to reproduce input text nearly verbatim. This shop feeds every writing agent 300-word passages of a living author's published prose. That is a licensing question rather than a style question, and it should be checked before it becomes one.
