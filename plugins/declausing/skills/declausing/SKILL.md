---
name: declausing
description: Rewrite prose that reads as machine-written into prose that reads as written by someone who meant it — by applying Orwell's rules from "Politics and the English Language", excluding rule 5, so domain terms survive. Use when asked to de-Claude, de-AI, de-slop, unstuff, plain-language, or declause a draft; when an email, memo, README or PR body sounds structured rather than said; or before sending anything written for a human who will notice. Rewrites the text and reports what it cut. Sibling of `truing` and `parsimony`.
---

# declausing

Orwell named the disease in 1946 and the description still fits: prose that
consists "in gumming together long strips of words which have already been set
in order by someone else, and making the results presentable by sheer humbug."
That is a literal account of next-token prediction. It is why his four
categories and the 2026 lists of AI tells are the same list — *tapestry* and
*landscape* are dying metaphors, *serves as* and *conduct an investigation of*
are verbal false limbs, *robust* and *comprehensive* are meaningless words, and
the participial tail that ends every other paragraph with *, underscoring the
importance of* is the anticlimax-saver he mocked. One framework, not two. The
attraction of writing this way, he said, is that it is easy. It is easier still
for a machine.

**Rule 5 is excluded.** Orwell's fifth rule bans the foreign phrase, the
scientific word and the jargon word. In business and technical prose those are
often the precise words, and swapping *idempotent* for something homely loses
the meaning rather than the padding. Rules 2 and 3 already catch the
pretentious long word; rule 5 would also catch the load-bearing one. Orwell
half-concedes this himself a paragraph earlier — the rule "does not imply in
every case preferring the Saxon word to the Latin one, though it does imply
using the fewest and shortest words that will cover one's meaning." Keep the
domain term. Cut everything built around it.

The remaining five, verbatim:

> (i) Never use a metaphor, simile, or other figure of speech which you are
> used to seeing in print.
> (ii) Never use a long word where a short one will do.
> (iii) If it is possible to cut a word out, always cut it out.
> (iv) Never use the passive where you can use the active.
> (vi) Break any of these rules sooner than say anything outright barbarous.

Rule 6 is not decoration and it is not optional. Mechanical rule-following is
itself a tell. A draft that obeys the first four with no exceptions reads like
a draft that obeyed four rules.

## Structure first, words second

This is the finding that matters most and the one most skills get wrong. A
banned-word list produces synonym substitution: *delve* becomes *explore*
becomes *examine*, and the sentence shape, the tricolons, the participial
tails and the flat rhythm all survive untouched. The text still reads as
machine-written because the machine-ness was never in the vocabulary. Do the
structural passes first. Most of the bad words disappear on their own when the
sentence around them is rebuilt, and the ones that remain are visible.

## The passes

Run them in order. Each is a procedure, not a quality to aim at.

**1. Find the claim.** For each paragraph, say in one sentence what it asserts.
If you cannot, the paragraph is decoration — cut it. If two paragraphs yield
the same sentence, cut one. Orwell's first question is *what am I trying to
say*, and prose that cannot answer it is not shortened by editing.

**2. Name the actor and the action.** Underline the first seven or eight words
of each sentence, ignoring a short introductory phrase. Flag the sentence if
the simple subject is an abstract noun, or if you read eight words before
reaching a verb. Then make the subject the character in the story and the verb
what that character does. *The outsourcing of high-tech work to Asia by
corporations means the loss of jobs* → *When corporations outsource high-tech
work to Asia, workers lose their jobs.*

De-nominalise on sight. Grep the suffixes — *-tion, -sion, -ment, -ance,
-ence, -ity, -ness, -al, -ure* — and apply the fix that matches:

| Shape | Example | Becomes |
|---|---|---|
| nominalisation as subject of an empty verb | the editor's belief is that | the editor believes |
| nominalisation after an empty verb | conducted an investigation of | investigated |
| after a subject delayer | it is the feeling of Enrique that | Enrique feels |
| two nominalisations joined by *of* | by examination of | by examining |
| stacked in a preposition chain | in the determination of the allocation of | in deciding how to allocate |

**3. Declause.** This pass does the most work and gives the skill its name.

- One idea per sentence. Split at the coordinating conjunction or the
  relative pronoun.
- **Kill every participial tail.** Any `, [verb]-ing …` hung off a sentence
  end: if it carries information, promote it to its own sentence with a real
  subject; if it does not, delete it. This single operation removes the
  highest-signal machine tell there is and satisfies rule 3 at the same time.
  Grep `, [a-z]*ing` and justify every hit.
- Unstack prepositional chains. Three or more *of/in/for/with* phrases in a
  row is a nominalisation chain wearing a disguise. Rebuild round a verb.
- Restore simple verbs from verbal false limbs: *render inoperative* → break,
  *militate against* → work against, *make contact with* → contact, *give rise
  to* → cause, *exhibit a tendency to* → tend to, *play a leading role in* →
  lead, *serves as* → is.
- Collapse phrasal connectives: *with respect to* → about, *the fact that* →
  that or nothing, *in view of* → because, *in order to* → to, *prior to* →
  before, *at this point in time* → now, *in the event that* → if.
- Undo every *not un-*. *Not uncommon* is common. Orwell wanted the formation
  laughed out of existence and he was right.
- Active voice, with one exception that overrides rule 4: old information
  goes first in a sentence, new information last. Where only the passive puts
  the already-known thing in the subject slot, keep the passive.

**4. Deflate.** Now the words, and only now.

- Dying metaphors — anything you are used to seeing in print. *Tapestry,
  landscape, realm, ecosystem, beacon, cornerstone, bedrock, testament,
  navigate, unlock, delve, harness, leverage, illuminate, foster, elevate,
  underscore, showcase, resonate.* Replace with the plain verb or cut the
  sentence to its claim.
- Meaningless words, by Orwell's own test: if the opposite word applied to
  the same object would also pass unchallenged, the word carries nothing.
  *Robust, comprehensive, nuanced, holistic, meaningful, seamless, vibrant,
  dynamic, profound, pivotal, crucial, transformative.* Both *its living
  quality* and *its peculiar deadness* pass. Neither says anything.
- Stakes inflation. No sentence may claim that a thing marks a pivotal
  moment, stands as a testament, or reflects a broader shift, unless the
  reader would lose information without it.

**5. Vary the rhythm.** Machine prose sits at a fourteen-to-twenty-two-word
median with almost no variance, and that flatness survives every vocabulary
fix. Read the draft and check sentence lengths across any three consecutive
sentences: if all three fall within four words of each other, split one and
merge two. End at least one paragraph on a short sentence. A long sentence
followed by a short one is the oldest working device in English and no model
reaches for it unprompted.

**6. Cut twenty per cent.** Rule 3, made countable. Count the words, cut a
fifth, count again. This is not optional and it is not approximate — the
constraint is what forces the judgement, and a draft that comes out at eight
per cent was edited rather than cut. Preamble goes first, then any sentence
restating what the previous one said, then the summary at the end that repeats
the summary at the start.

**7. Rule 6.** Read the result aloud. Anywhere the passes have produced
something stilted, clipped or barbarous, put the words back. A rule obeyed
into ugliness has failed.

## Structural faults to fix in passing

Prose written by a machine tends to arrive pre-formatted, and the formatting
is part of the tell. Headings on a text too short to need them. Every list
item opening with a bolded keyword and a colon. Every list containing exactly
three things. Bullets where sentences would do. A summary at the top, a
summary at the bottom, and a summary in each section. A closing paragraph
beginning *In conclusion* or *Ultimately*. The five-paragraph-essay skeleton
imposed on two hundred words. Strip them unless the document is genuinely a
reference someone will scan rather than read.

Two syntactic habits deserve their own mention because they scale fractally,
appearing in a phrase, a sentence, and the shape of a whole document:

- **Negative parallelism.** *Not X, but Y. It isn't just a tool, it's a
  discipline.* The false correction of a misconception nobody held. This is
  the single most diagnostic move in machine prose. Allow at most one per
  document, and only where a reader really might have believed X.
- **The rule of three.** One tricolon is rhetoric. Tricolons in series are a
  tic. If several consecutive lists each hold exactly three items, the number
  came from the machine and not from the world — say how many there are.

## What to report

Rewrite the text. Then, briefly: the word count before and after, the two or
three structural changes that did the most work, and anything rule 6 made you
put back. Do not itemise every edit.

## One caveat, carried deliberately

These are not forensics and this skill proves nothing about authorship. Human
writers use em dashes freely — *Huckleberry Finn* runs above every model
measured — and human prose has been drifting toward these patterns since 2024
anyway. Treat every item here as a prose fault worth fixing on its own merits.
That framing is also the durable one: the tells will shift, and bad writing
will not.
