# Indicative anchors for the interviewer's seat

**Everything below this line is synthetic. No real person said any of it.** The interviewer is a composite and the three guests, their towns, their employers, their log lines and their clocks are all invented. Nothing here is a transcript, a reconstruction of a transcript, or anyone's actual words.

**Why the file exists.** The interviewer's seat was built on real Booknotes transcripts and those became unreachable on 2026-09-13; the three dead routes are recorded in `advisors.md`. The skill's strongest finding is that naming an author without his text in context regresses the output to the model's default register, so a seat with no anchor at all is a seat running on a description, which is the thing anchoring exists to replace. This is the substitute, and it is weaker than the real thing. It says so here rather than in a footnote, because a reader who mistakes it for a transcript will trust it more than it deserves.

**Replace it if supply reopens.** Verbatim questions from a real interviewer beat invented ones, and whether such text may be copied into this repository is issue #5's question and not this file's. If that ruling comes back permissive and the transcripts are reachable, this file goes.

**What it is for, exactly.** A seat continues a texture. It cannot continue a list of adjectives. The value here is mechanical: the shape of a question that stops after one clause, the habit of hanging the next question on the noun in the last answer, the naive question asked without embarrassment, the finger pointed at the object on the bench. Those survive being invented. What does not survive is the judgment of a real interviewer about which question to ask next, and no corpus written by a model can supply that. The doctrine in `advisors.md` remains the authority; this is the texture underneath it.

**How it was made, 2026-09-13.** Written by DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`) in one stateful conversation, three calls, sequential, under a brief carrying the doctrine's mechanical constraints and an explicit order to invent every subject and reproduce nothing. Never a Claude model, for the reason the whole shop exists. The subjects were chosen to be unlike each other on purpose: a night-time outage, an unpaid maintainer, and a trade with no software in it at all, that last one because the seat's voice is a person visibly not the expert in the room.

**Measured, not asserted.** 136 questions. Every one under sixty-six characters. Median length 25 characters in the outage interview, 24 in the compiler interview, 27 in the clock interview. The longest question in the file runs 46 characters. The doctrine's own number, taken from the real corpus while it was reachable, was a median under sixty-six.

---

## One: a payment outage, overnight

Q: What was the first alert?
A: PagerDuty went off with "PaymentGatewayErrorRateHigh" at 2:58 AM.
Q: And the threshold?
A: The error rate crossed 5% over a rolling five-minute window.
Q: Where were you?
A: At home, in bed, phone on the nightstand.
Q: What did you see on the lock screen?
A: The alert preview: "PaymentGatewayErrorRateHigh: 12% Error Rate".
Q: And the time on the phone?
A: 2:58 AM.
Q: What does your badge say?
A: "Mira Chen, Site Reliability Engineer, Payments."
Q: What dashboard did you open first?
A: The "Payment Success Rate" dashboard on Grafana.
Q: And the number it showed?
A: 43%. Normally it's above 99%.
Q: When did it dip?
A: The graph showed a sharp drop at 2:47 AM.
Q: How did you know it was 2:47?
A: I hovered over the inflection point on the timeline.
Q: And the log line that confirmed it?
A: At 3:12 AM I found "ERROR PaymentGateway timeout after 30000ms for txn_id=8a7d9f".
Q: What is txn_id=8a7d9f?
A: A sample transaction that timed out, a $340 payment to a merchant.
Q: How did you find that log?
A: In Kibana, filtering for "PaymentGateway" and "timeout" in the last hour.
Q: And the number of timeouts in that hour?
A: 847 timeouts.
Q: Who else was on call?
A: Only me; my teammate Priya from Payments Core Reliability was backup but asleep.
Q: Did you wake her?
A: Not yet; I wanted to diagnose first.
Q: What is on the laptop screen right now?
A: The same Grafana dashboard, now showing 98.7%.
Q: When did it recover?
A: Around 4:15 AM after I rolled back a config change.
Q: What config change?
A: A connection timeout value in gateway-service.yml changed from 5000 to 30000 ms.
Q: Who changed it?
A: A deploy by the Payments team at 10 PM the previous night.
Q: And the file name?
A: gateway-service.yml in the payments-config repo.
Q: What line?
A: Line 42: `connectionTimeoutMs: 30000`.
Q: How did you trace it to that line?
A: I diffed the last two deployments in Jenkins and saw the timeout change.
Q: And the Jenkins job name?
A: "payments-gateway-deploy-prod".
Q: What command did you run to roll back?
A: `kubectl rollout undo deployment/payment-gateway -n payments`
Q: And how long did the rollout take?
A: About three minutes, pods cycling.
Q: What was the total downtime?
A: From 2:47 to 4:15, so 88 minutes.
Q: How many transactions failed?
A: Around 2,100 transactions.
Q: And the total dollar amount?
A: Roughly $740,000 in failed payments.
Q: Who did you notify first?
A: I sent a Slack message to #incident-response: "Payment outage resolved, root cause: timeout config change."
Q: Who questioned "timeout config change"?
A: The VP of Engineering, Daniel, asked, "Was this the gateway timeout?"
Q: And your response?
A: I pasted the diff: `-connectionTimeoutMs: 5000` `+connectionTimeoutMs: 30000` and the rollback command.
Q: What is that cup?
A: Cold coffee I made at 3:30 AM and forgot.
Q: How many cups did you have?
A: Three, but only finished one.
Q: What is the incident ticket number?
A: I filed INC-2025-04-12-003 in Jira.
Q: And the postmortem doc?
A: A Google Doc titled "Payment Outage Postmortem 2025-04-12".
Q: What did you learn?
A: That a timeout increase can mask downstream latency and cascade.
Q: What did your manager say?
A: At the 9 AM standup, she said, "Good catch, but why wasn't it caught in staging?"
Q: And your answer?
A: Staging doesn't simulate 3 AM traffic patterns.
Q: What fix did you deploy later?
A: We added a circuit breaker on the gateway and set a timeout ceiling of 10 seconds.
Q: In what file?
A: circuit-breaker-config.yml, line 17.
Q: And the dashboard now?
A: Still 98.7%, but I'm watching the p99 latency.
Q: What is the p99 latency?
A: 1.2 seconds, up from 800 ms yesterday.
Q: When did you sleep?
A: I napped from 7 AM to 10 AM on the couch in the office.
Q: Where is the couch?
A: In the wellness room on floor 3.

## Two: an unpaid compiler maintainer

Q: What is your name?
A: Leo Vargas.
Q: And what do you maintain?
A: The owlcc compiler for the Owl language.
Q: What is Owl?
A: A small functional language for GPU shaders.
Q: Who uses it?
A: Me, mostly, and a few graphics researchers.
Q: Where is the code?
A: On GitHub, under leovargas/owlcc.
Q: What is the URL?
A: github.com/leovargas/owlcc.
Q: How many stars?
A: 47, last I checked.
Q: When did you start?
A: First commit was in March 2017.
Q: And the commit hash?
A: bc45a12, "Initial import of parser."
Q: What language is the compiler written in?
A: About 90% C and 10% OCaml for the type checker.
Q: Why two languages?
A: I started in OCaml, then rewrote the backend in C for speed.
Q: How many lines of C?
A: The main compiler code is 84,000 lines across 23 files.
Q: Which file has the parser?
A: parse.c, 6,400 lines.
Q: And the type checker file?
A: typeck.ml, 2,100 lines of OCaml.
Q: How many contributors total?
A: Three contributors, including me.
Q: Who are the other two?
A: Sergey Petrov from Moscow and an anonymous user "shaderfan".
Q: How much do you earn from this?
A: Nothing. I've never asked for money.
Q: Why do you do it?
A: It's how I relax. It's my garden.
Q: What is that object on your desk?
A: A printed copy of the Owl language manual.
Q: And the manual's date?
A: September 2023, third edition, still draft.
Q: What was the hardest bug?
A: A register allocation bug on ARM64 only, producing wrong results for nested ifs.
Q: How did it manifest?
A: A shader that did `if (a > b) { if (c > d) { x = 1; } else { x = 2; } }` would always set x to 2.
Q: When did you first see it?
A: A user reported it in Issue #341 on November 12, 2022.
Q: And the title of Issue #341?
A: "Incorrect branch on Apple Silicon for nested conditionals."
Q: How did you reproduce it?
A: I wrote a minimal Owl program with nested if-else and compared output on x86-64 vs ARM64.
Q: Where is that test file?
A: tests/regress/arm-nest-if.owl, 12 lines.
Q: How long did it take to fix?
A: Seven months, from November 2022 to June 2023.
Q: How did you finally find it?
A: I single-stepped the generated assembly and saw that a register was reused without spilling.
Q: In what file was the bug?
A: regalloc.c, around line 1,340, in the function `assignRegs`.
Q: What was the exact line?
A: The `live_range_overlap` check was missing for conditional blocks that shared a register.
Q: What was the fix?
A: Added a spill instruction when two conditionals' lifetimes overlap on the same register.
Q: And the commit hash for that fix?
A: 4d7f8b0, "Fix ARM64 register spilling for nested ifs."
Q: How many tests did you add?
A: 17 new regression tests for ARM64 codegen.
Q: What test runner do you use?
A: A custom Python script called `owl_test.py` that runs all .owl files.
Q: Where is that script?
A: In the `tools/` directory, `tools/owl_test.py`.
Q: How many total tests now?
A: 1,203 tests, covering parser, type checker, and codegen.
Q: Do you have a CI server?
A: No CI, I run tests manually on an old Mac Mini.
Q: What model Mac Mini?
A: A 2020 M1 Mac Mini with 16 GB RAM.
Q: Where is it physically?
A: In my basement, on a wooden shelf.
Q: What does it sound like when you compile?
A: Silent; the fan never kicks in.
Q: And what is the last build time?
A: 4 minutes 12 seconds for a clean build and test suite.
Q: When did you last do a release?
A: Owlcc 0.9.1, on February 2, 2025.
Q: What was new in 0.9.1?
A: Fixed the ARM64 bug and added matrix literals.
Q: How many downloads?
A: 23 downloads from the release page.
Q: And the next release plan?
A: Version 1.0 when I finish the SPIR-V backend.
Q: How does that feel?
A: Like I'm almost there. Eight years.

## Three: a repairer of tower clocks

Q: What do you do?
A: I repair and maintain church tower clocks.
Q: And where?
A: In Haverwick, a small town in Northumberland.
Q: What is the clock you are fixing now?
A: The one in St. Cuthbert's tower, built in 1887.
Q: How did you get into this?
A: I apprenticed under my uncle, who was the village clock keeper for thirty years.
Q: What is that tool on the bench?
A: That's a depthing tool for setting the distance between wheel and pinion.
Q: And the handle is?
A: Made of boxwood, worn smooth.
Q: Which wheel are you working on?
A: The escape wheel, it has 30 teeth and one is bent.
Q: How can you see the bend?
A: I hold it against a flat brass plate and rock it; the bent tooth is high.
Q: What happens if a tooth is bent?
A: The escapement will skip or jam, and the clock stops.
Q: How did you know to look at the escape wheel?
A: The clock was gaining then stopping; that's a classic escape wheel problem.
Q: When did it stop?
A: Last Tuesday, at 4:47 in the morning.
Q: How do you know the exact time?
A: The clock's maintenance log shows the last tick at 4:47.
Q: Where is that log?
A: In a green folder inside the stone stairwell.
Q: What is the folder made of?
A: Cardboard, with "St. Cuthbert's Clock" written in pencil.
Q: Who wrote that?
A: My uncle, on his first visit in 1962.
Q: And the log's first entry says?
A: "Oiled and cleaned all three trains. Keeps time within a minute a week."
Q: How long have you been doing this?
A: 27 years, since 1998.
Q: And the town population?
A: About 2,300, but the clock serves the farms around too.
Q: What is that brass plate with the curved slot?
A: It's the pendulum crutch, it adjusts the beat.
Q: What is "the beat"?
A: The even tick-tock of the pendulum swinging.
Q: How do you know if it's even?
A: I listen and count the interval between ticks with a metronome.
Q: What metronome?
A: A mechanical one, a pyramid shape, wind-up.
Q: What is the number on the dial?
A: It's set to 60 beats per minute.
Q: And the pendulum's length?
A: The pendulum rod is exactly 39.14 inches, a seconds pendulum.
Q: Why 39.14?
A: That's the length in inches for a pendulum with a two-second period.
Q: Did you measure that?
A: I measured with a steel tape from the suspension to the center of the bob.
Q: What is the bob made of?
A: Cast iron, painted black.
Q: And the tick rate is?
A: One tick per second, so the escapement wheel turns once per minute.
Q: What is that small bottle on the bench?
A: Clock oil, synthetic, for the pivots.
Q: How much oil do you apply?
A: A needle's drop on each pivot, never a brush.
Q: What happens if you use too much?
A: The oil spreads and collects dust, and the pivot gets sticky.
Q: When was the last time this clock was oiled?
A: I oiled it last October for the harvest festival.
Q: How do you get up the tower?
A: I climb 89 stone steps to the clock room.
Q: What is that rope near the ladder?
A: That's for the winding mechanism, to lift the weight.
Q: What does the weight weigh?
A: The going weight is 56 pounds.
Q: How often do you wind it?
A: Once a week, every Monday at 9 AM.
Q: And the strike weight?
A: 72 pounds for the hour bell.
Q: What bell does St. Cuthbert's have?
A: One tenor bell, cast in 1721 by the Penfold foundry.
Q: Who made the clock movement?
A: J. B. Goode of Leeds, in 1887, according to the stamp on the frame.
Q: What is the frame made of?
A: Cast iron, painted black, with brass pillars.
Q: What is that shaving on the floor?
A: A brass curl from when I lightly filed the bent tooth straight.
Q: Do you file or replace?
A: For a small bend, I gently tap it back with a soft mallet and then file.
Q: What is the mallet made of?
A: Rawhide, with a hickory handle.
Q: And the tool for setting the depthing?
A: I adjust the two arms until the wheel meshes without binding.
Q: How do you test the mesh?
A: I rotate the train by hand and feel for rough spots.