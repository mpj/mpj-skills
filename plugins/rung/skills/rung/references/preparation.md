# One provisional rung ahead

The reader authorized this on 2026-09-19 after watching the wait between numbered parts. While they read the delivered part, prepare one candidate for the next, assuming they will say "I understand, go on." Their actual reply determines what is delivered. This replaces the earlier blanket ban on advance drafting; it does not authorize writing the whole explanation in advance.

## Start after delivery

The first eligible moment is **after Part 0 has been delivered**, preparing Part 1. Never prepare the welcome or Part 0 this way. Thereafter, after delivering Part N, prepare at most one candidate for Part N+1. A candidate cannot trigger preparation of its successor. Skip preparation when the session has reached its exit, when a reply is already waiting, or when earlier reader evidence is still awaiting assessment after a short detour.

Use a background-capable client that can release the current delivery before doing this work and give an arriving reply priority. Never withhold the current part while preparing its successor. If the harness cannot work while the reader reads, use the on-demand path and record that limitation; do not report preparation as active. The skill continues to specify a driver contract rather than ship a runner.

## Keep the assumption separate

Snapshot the delivered part, settled map, assessed ledger, verified facts and relevant seat histories. Identify this base with a revision, and give the candidate its own id. Its brief labels the assumed reply as **PROVISIONAL**, states the next subject, and lists the reader knowledge that subject requires. A claim to understand the current part is scoped to that part; it is not evidence that every node in the map is grounded. Do not invent a checkpoint answer.

The learner ledger and reader transcript receive no speculative turns. Continue the writer and interviewer from private copies of their existing histories, with the same anchors and stable prefixes; these are provisional continuations of the same seats, not newly anchored seats. Reuse their per-seat routing keys where supported. Only the candidate's storage receives those calls. The live histories remain available for a different reply without having to undo imagined evidence.

Keep one record with the base revision, assumptions and required knowledge, proposed subject and ordinal, provisional seat histories, exact draft and checkpoint, check results, and status. Distinguish incomplete work from a checked candidate. The assessor is not asked to grade an imagined reply.

## Do useful work while the reader reads

Prepare the writer's next part and its concretes, run the usual factual, leak and lint checks, and collect any findings into at most one speculative repair request. When the prose is settled, prepare the interviewer's question and check the assembled delivery. Preserve all checks required by the selected setting; kept work still owes its editorial passes. Unfinished passes or unresolved findings stay explicit and block release. There is no speculative repair loop.

There is still **one paid call at a time**, shared by foreground and preparation. An actual reply stops further speculative calls and gets priority over them. Use cancellable requests; cancel in-flight preparation when necessary, retain any completed work, and ignore late results from an abandoned candidate. A client unable to give foreground work priority must use on-demand generation. Silence from the reader is not consent to deliver the candidate, start another candidate or keep retrying.

## Reconcile the real reply

Record the actual reply and route it under `protocol.md`. Substantive answers still go to the assessor; a bare navigation move still supplies no evidence; a named short clarification can still take its bounded deferral. The assessor reads the real reply and any pending evidence, not the imagined reply or speculative prose as evidence of understanding. Its ordinary result supplies the next node and unresolved questions. The relay uses that result for the following decision, without commissioning another model merely to judge cache reuse.

* **Use unchanged** when the selected subject and required knowledge fit the actual result, the base has not otherwise changed, every asked question is addressed, and the candidate passes the delivery checks. "I understand, go on" is the expected case, not a magic string that waives assessment. A bare "go on" cannot inherit the candidate's assumed claim of understanding.
* **Revise only the difference** when the subject still fits but the reader needs a small clarification, a different example or a changed emphasis. Send the writer the existing draft, exact actual reply, verified assessment and precise differences. Preserve unaffected prose. Recheck the result and reuse the checkpoint question only if it still tests the revised part correctly; otherwise ask the interviewer to replace it. The relay never patches the writer's prose itself.
* **Replace** when the reply calls for a different subject, a misconception detour, a short clarification instead of the prepared lesson, or prerequisites the draft cannot safely assume. Use the actual-reply path. Do not append a correction to a lesson the reader is not ready for merely to salvage the preparation.
* **Discard** on a stop or exit, an unrelated base change, or a candidate whose partial output cannot be used. Missing or failed preparation is an ordinary on-demand turn, not a reason to delay the reply or lower the checks.

If preparation is incomplete when the reply arrives, reuse any completed draft that fits the actual result and finish only the missing work. A prepared writer draft can still save a call even when its checks or interviewer question are pending.

Before release, recheck facts that may have changed during the reading interval and rerun local gates on the exact delivery. Promote provisional seat histories only for a candidate actually accepted for delivery, after checking their live base is still current. Record the actual reply and reconciliation separately; preserve the provisional label on its original brief. Supply the verified actual context in subsequent seat briefs. A discarded branch remains diagnostic material, never a source of learner evidence or future seat context. Only delivery advances the part ordinal. Checkpoint questions and detours remain on demand from the real conversation, even when a matching candidate makes the final work small.

## Measure the result

Alongside the timing and cache fields in `protocol.md`, record candidate id and base, readiness when the reply arrived, outcome (used, revised, replaced or discarded), speculative calls and cost, and actual-reply-to-delivery elapsed time. Include cancellation and unused preparation in the cost. This trades some potentially wasted work for a shorter wait; the comparison is foreground wait and total work, not cache-hit rate alone. No latency improvement is claimed until a run measures it.
