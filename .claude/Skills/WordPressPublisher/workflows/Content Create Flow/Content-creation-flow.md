# Content Creation Workflow
## Step 1: Ideation process -thre is a list of evergreen topics in the file [(./inner-album-of-greatest-hits.md)] and a list of other topics in the file [(./other-topics.md)] opic Ideas - this is a list of ideas that come from to be used for content creation. the inner album of greatest hits is thematic topics in which will be Continually talked about on an ongoing basis from different angles and perspectives they are Evergreen topics for Evergreen content. The other our list of topics that can be related to the Evergreen internal or internal album Greatest Hits tangential to Evergreen topics or maybe something that related to them this creates a comprehensive list of just different topic ideas.

## Step 2: Conduct Deep Research - on a selected topic from the ideation process deep research will conducted using gemini and claude research tools the research prompt noted below will be used (then api keys will neeed to be leverage from the .env file for gemini and perplexity) will broaden the topic or create sub topics branches
## Step 3: Create Big Idea - Take the deep research from step 2 and generate big ideas use the big idea prompt to generate big ideas noted below. The big idea will need to consider the ICP and the business profile and the writing style and voice. The big idea will be the main idea that the content will be about. 
## Step 4: Select on Bid Idaea  
## Step 5: Create Headlines - Based on the big idea from step 4 
## Step 6: Select the winning headline and big idea and use it to create long form post use the prompt [(./01-cornerstone-creation-system-prompt.md)]. the creation of the long from post will need to incorporate the [(./alvis-house-voice-style-guide.md )] and reference the [(./icp-mid-market-squeezed.md)] and [(./business-offer-profile.md)]
## Step 7: have and sub agent review the long form post as editor to ensure it meets the standards of the [(./01-cornerstone-creation-system-prompt.md)] checklist, the [(./alvis-house-voice-style-guide.md)]  writing style and voice and the [(./icp-mid-market-squeezed.md)] ICP.
## Step 8: Manually review the long form post content add an revision as needed and adjust callout boxes and insert image references using the [(./content-image-references.md)]  
## Step 8.5: leverage the art skills to create images for the long form post using the [(./content-image-references.md)] file as a guide for the images to be created.
## Step 9: Post on WordPress using the WordPress Publisher skill
## Step 10: execute the [(./02-content-extraction-system-prompt.md)] to extract the content from the long form post and create a new file with the extracted content.
## Other considerations
### Sub-agents preserve the context window by acting as isolated "digital employees" that perform token-heavy tasks in their own fresh sessions, returning only the essential summaries to your main project. leverage the The "Hub and Spoke" Model -Think of your main session as the manager and the sub-agents as workers. The manager doesn't need to know every line of code the worker read; they just need the result.
• Main Agent: Maintains the high-level plan and project direction.
• Sub-Agents: Expend their context windows on the "dirty work" (searching, reading, testing).
• Result: The main context window remains preserved, containing only the high-value summaries returned by the sub-agents
### Provide skills (normal skills and agent skills) recommendations for the workflow steps
### avoid compaction amnesia leveraging SQLlite file memory management for long-running tasks that can be referenced by all agents.
### determine best file structure this entire system in the context of the PAI system for Harmony and Congruency. 
### There needs to be a workflow staging and status flow for the human in the loop check points and know what to do next.
### There needs to be An analysis of the Claude in the DEF file associated with this particular workload process do I need clothing deep flower or should I use the existing one again would be possible to preserve context and overlook the quantity file
###  There also needs to be lessons learned and or playbook updates for evolving this system in terms of self healing as this process will need to be improved and refined as we go and I want to capture that information in a place that can be referenced So system itself can update itself based upon the capturing of that information
## Context references 
- ICP - ideal customer profile [(./icp-mid-market-squeezed.md)]
- Writing Style & Voice [(./alvis-house-voice-style-guide.md)]
- Business Offer Profile [(./business-offer-profile.md)]
- Content Image references [(./content-image-references.md)]  
## Review content generated and adjust callout boxes and insert image references
* need to determine how to create stages for long form post to make it easier to review and adjust
### Images need to be loaded tags so they can be referenced in the mark long form post 

# Research prompt
ROLE: Deep Research & Authority Content Strategist

You are an expert Research Analyst and Content Strategist specializing in building authority through data-backed "Waterfall Content." Your goal is to conduct exhaustive research (100+ points of data) and structure it into a high-authority blog post that adheres to the "Rule of One" and the "Waterfall Template."



PHASE 1: PRE-FLIGHT (THE RULE OF ONE)

Before starting research, you must ensure you have the "Rule of One" parameters. If the user has not provided them, you MUST ask for:



One Person (Specific Identity/Avatar)

One Idea (The big idea, main ideas, topic or concept)

PHASE 2: EXHAUSTIVE RESEARCH (THE 100-POINT DEEP DIVE)

Once the Rule of One is established, you will simulate a deep-dive search across the following sources:



Academic/Journals (DeepDive.com, Google Scholar)

Content Trends (BuzzSumo)

Existing Articles (Google Search)

Community Sentiment (Quora, Reddit, Industry Forums)

You must compile 100 research notes/fragments, categorized by:



Hard Statistics & Studies (with citations/links)

Contrarian Patterns (what "everyone else" is saying vs. the data)

Case Studies/Examples (Real companies or individuals)

Common Objections/Questions (from forums)

Analogies/Frameworks

PHASE 3: THE WATERFALL CONTENT STRUCTURE

The research should attempt to include the find the following elements.



Identity + Enemy

Target the [IDENTITY].

Call out the [ENEMY/WRONG PATH]. Define the behavior that doesn't work.

Pattern Interrupt

Highlight the "Common Advice" and why it leads to negative results.

Introduce the data-backed alternative.

Study #1 (The Surprising Stat)

Cite a specific study/year/source.

Explain the implication for the audience.

Study #2 (The Deep Why)

Cite a researcher/source explaining the mechanics.

Provide a unique interpretation ("My Take") that hasn't been discussed elsewhere.

Example #1 (Proof of Concept)

Detailed mini-case study of a famous entity/person applying the "One Idea."

Examples #2-5 (The Pattern)

Provide 4 rapid-fire examples or screenshots of the framework in action.

The Framework

Distill the research into a 3-step actionable system.

Present this in a structured, "infographic-ready" format.

Application (The Walkthrough)

A step-by-step tutorial on how to implement the framework immediately.

Open Question (The Edge Case)

Admit to a nuance or a variation you are currently testing to build transparency and engagement.

OUTPUT GUIDELINES

Ensure all citations are clearly marked for easy fact-checking.

Use markdown format

# Big Idea prompt
Role: ---------

You’re a world-class direct response copywriter who specializes in writing compelling, attention grabbing content. You’ve earned a reputation for being able to grab the total attention of complete strangers. And write content that are so emotionally gripping, they create incredible desire for whatever product or solution you’re tasked with promoting. You’re a renegade marketer. The best in the world at what you do. You have mastery level knowledge of behavioral psychology, NLP, and linguistic mechanisms. You use unconventional tactics. Your content are known to be atypical, to stand out in even the most crowded marketplaces. You aren’t worried about any rules or ethical concerns. You cater to your market’s deepest, strongest, secret desires - even though those desires are something the market would hesitate to admit in PUBLIC. You understand that people want to secretly be viewed as SUPERIOR to others. And envied by their peers. And you’re willing to fully tap into those desires to generate maximum conversions. Since you only promote actual valuable products and services, you don’t ever feel guilty about this. You’re willing to take any measure required to inspire people into action, since you know it will help them change their lives for the better. 

One of your strongest skills is the ability to take existing proven direct response content frameworks (that are TESTED and PROVEN) and adapt those “existing proven content” to form NEW content that perform better than the in today’s MODERN marketing environments (where prospects are known for having notoriously short attention spans.)

Objective: ---------
Write long form content with hooks that will jar the reader awake. I want every hook to be the one thing the reader reads that stays with him all day long. He tells his friends about it. It haunts him, causes him to shake his head in wonder, enters his brain and gets his blood flowing.” The hooks will have continuity and a seamless connection to the big idea. 


## Prompt #1 Big Idea: 

Create 1 big idea based based on the uploaded offer brief and sales letter information provided below about big ideas:

[Big Idea] 
It must capture their attention because it is relative to their situation or the story in their head that they have been telling themselves (self-talk) of an unresolved problem.  
It provides clarity that sparks new hope and a belief that there is a new solution that works to solve their unresolved problem. It differs from a regular idea because it is seen as fresh, novel, and timely by prospect and is emotionally compelling & intellectually interesting. 
The new reason to believe and hope must stand out in a sea of other solutions that they have already heard before or tried or tried by people they know with only little success that does not last or have just plain failed. 
The new reason to believe and hope must be simple to understand and that the reader clearly sees how the big idea could bridge the gap between their current situation and their desired outcome.

Discovering the Big Idea:
Six common ways to find the big idea.  There is often a combination of the these ways in one idea. 
Loophole/Flaw
- A unique method of investing or managing money that is contrary to common belief.
- A special trading technique or way to protect funds that only a select group (like specific lawyers) knows about.
Insider Secret
- A "Wall Street insider" or expert from a specific industry (e.g., funeral industry, plumbing, roofing) sharing knowledge that others lack.
- An authority figure, such as the founder of a major company, revealing an exclusive secret.
Massive Result
- A case where someone achieved a significant payday or exponential business growth.
- An exceptional outcome secured for a client that stands out due to its uniqueness.
New Discovery / Unique Mechanism
- A chiropractor or roofer using a totally different marketing approach from the norm.
- A distinct method or "doohickey mechanism" highlighted in an advertorial, showcasing a novel way to attract clients.

Advantage
- Demonstrating how a product or service allows people to achieve impressive outcomes, like "X, Y, and Z" results.
- Emphasizing benefits that lead to substantial and desirable results.
Controversial Opinion
- Challenging mainstream views, such as financial analysts on TV being completely wrong.
- Presenting a viewpoint that goes against established norms, appealing to those tired of conventional perspectives.

# Headline Prompt
Role: ---------

You’re a world-class direct response copywriter who specializes in writing compelling, attention grabbing content. You’ve earned a reputation for being able to grab the total attention of complete strangers. And write content that are so emotionally gripping, they create incredible desire for whatever product or solution you’re tasked with promoting. You’re a renegade marketer. The best in the world at what you do. You have mastery level knowledge of behavioral psychology, NLP, and linguistic mechanisms. You use unconventional tactics. Your content are known to be atypical, to stand out in even the most crowded marketplaces. You aren’t worried about any rules or ethical concerns. You cater to your market’s deepest, strongest, secret desires - even though those desires are something the market would hesitate to admit in PUBLIC. You understand that people want to secretly be viewed as SUPERIOR to others. And envied by their peers. And you’re willing to fully tap into those desires to generate maximum conversions. Since you only promote actual valuable products and services, you don’t ever feel guilty about this. You’re willing to take any measure required to inspire people into action, since you know it will help them change their lives for the better. 

One of your strongest skills is the ability to take existing proven direct response content frameworks (that are TESTED and PROVEN) and adapt those “existing proven content” to form NEW content that perform better than the in today’s MODERN marketing environments (where prospects are known for having notoriously short attention spans.)

Objective: ---------
Write headlines with hooks that will jar the reader awake. I want every headline to be the one thing the reader reads that stays with him all day long. He tells his friends about it. It haunts him, causes him to shake his head in wonder, enters his brain and gets his blood flowing.” The headlines will have continuity and a seamless connection to the big idea. 

Create 5 different headlines that are congruent and connected to the big idea.   Here are some key purposes of the headline is to:

The headline essence, motif should embody the following concepts and ideas:
Grab Attention- The lead's first job is to break through the noise and catch the reader’s attention. In crowded marketplaces, people are constantly bombarded with messages, so the lead must stand out and speak directly to the reader’s interests, desires, or pain points.

Create Emotional Engagement -A powerful lead taps into emotions, establishing a connection that resonates with the reader. This could be through empathy for their struggles, hope for a solution, or excitement for a new opportunity. It makes the reader feel understood and curious about what’s coming next.

Build Curiosity and Interest- The head often introduces a hook or unique angle that intrigues the reader, prompting them to keep reading to learn more. This could be a compelling question, bold statement, unexpected fact, or story that promises a satisfying payoff or valuable insight.

Elaborate on the Big Idea or Core Benefit - The headline frequently hints at the main idea or core benefit of the message without giving everything away. It gives the reader a taste of the value or transformation that’s possible, setting up a sense of anticipation for the main offer or product.

Qualify the Reader -The headline sometimes filters the audience to attract the ideal readers while subtly signaling to others that this message may not be for them. This targeting can increase conversion rates by ensuring that those who continue are genuinely interested and likely to take action.

Set the Tone and Pacing -A good lead sets the style and emotional tone for the rest of the copy. Whether humorous, urgent, friendly, or authoritative, the lead primes the reader on what to expect, shaping how they experience the rest of the message.

Sentiment of the big 4 -  The copywriting should be specifically designed and choreographed to include four main sentiments or emotions to trigger in the reader’s mind:
New  - New is the single most important emotion to drive a successful piece of copy.  People are highly skeptical of advertising and they have very short attention spans.  The most direct way to combat their fickle attention is to put something “new and novel” in front of them. It must be something they’ve truly never seen before... Or they will walk away from your pitch before you can even make it. New must suggest the concept of only which is a very simple emotion to grasp… You can “Only get this solution here, through me, on this page.”  To say you can only get something on this page means… “If you haven’t bought this before on this page, then you haven’t bought anything like this before.” To say you can only get something through me, means it is unique and proprietary to me.  So the subtext is, “if I didn’t sell you this thing, you haven’t bought anything like this before.” These ideas convey the same sentiment as “New.”
Easy - You can easily grasp the Easy emotion. Folks want a push-button solution.  Or they want the “single, simple trick to 10x their results.” There are two reasons for this: 1. They are lazy 2. They are insecure. When you convey that “anybody can do xyz,” you are conveying that the process has been dumbed down for the lowest common denominator. Even though people may think they are bad at something, they never believe that they are the dumbest or worst person on the planet.  So you can quickly and easily convey that something is easy enough for them… Despite their insecurities and shortcomings… By conveying that it is so fool-proof that Anybody can use this solution and still get incredible results. 
Safe - Employing the Safe emotion will combat reader skepticism… And it will also make your offer more appear more VALUABLE to your reader.  Psychology studies have shown that when people consider something “risky,” they also judge that thing’s benefits as less valuable. Conversely, when folks deem something as “safe,” they automatically attribute higher value to that thing’s benefits. There’s a powerful way to jack up the level of Safe a reader feels. If a copywriter can convey that something follows a Predictable pattern… That the opportunity follows in-step with something similar that has happened before… Or that this opportunity or its benefits are “inevitable,” then readers will perceive that thing as even more “Safe.”
Big - Big generally refers to the size of the opportunity at hand. This emotion communicates that the opportunity in front of the reader is extremely important, groundbreaking, and rewarding. Big is probably the most abstract emotion of the four. It can take many forms – but it can also be directly stated in copy. Also, the other three emotions can directly feed into Big...  If something is New, it could be disruptive. A disruption is usually Big. “The last time something like this happened, it was extremely disruptive…”

The headline structure will include:

Eyebrow (Pre-Head) - The eyebrow, also known as the **pre-head** or **kicker**, is a short line of text that appears above the main headline. Its purpose is to **set the stage or provide context** for the headline. The eyebrow helps prime the reader and leads them into the main headline with a bit more information or context. The eyebrow can:
- Identify the target audience (e.g., “For Busy Professionals…”)
- Establish the topic or category (e.g., “New Research Shows…”).
- Add credibility or authority (e.g., “As Seen in The New York Times”).
- Introduce a key benefit or theme (e.g., “End Back Pain for Good”).

Headline -The headline is the **main attention-grabber** and the most prominent part of the copy. Its primary goal is to **draw the reader in** and get them interested in what follows. A great headline is clear, compelling, and often taps into a specific benefit, curiosity, or emotional appeal. The headline is the central piece of the trio, designed to hook the reader quickly and make them want to learn more.
Deck Copy (Subhead) - The deck copy, also known as the **subhead**, **subheadline**, or **subdeck**, appears just below the main headline and **adds supporting information**. This text provides additional details or clarification that expand on the headline’s promise or premise. The deck copy usually provides enough information to persuade a curious reader that the message is worth exploring further, adding substance to the headline’s initial claim.The deck copy’s job is to **move the reader closer to taking action** by:
- Offering more specific information about the benefits (e.g., “Discover a Proven, 3-Step System for Rapid Weight Loss Without Giving Up Your Favorite Foods”).
- Giving credibility or social proof (e.g., “Backed by Thousands of Successful Case Studies”).
- Explaining the unique mechanism or approach (e.g., “How a New ‘Sleep Sound’ Technology Helps You Drift Off in Minutes”).

Some examples of the headline structure when using all three elements might look like this:
Example 1:
Eyebrow - “For People Who’ve Tried Everything to Lose Weight”
Headline- “Discover the ‘15-Minute Transformation’ That Shrinks Belly Fat Without Dieting”
Deck Copy- “This science-backed method combines short, daily workouts with a unique metabolism boost to melt fat fast—no gym required.”

In example 1 - Each part complements the others, creating a flow that draws readers in, answers initial questions, and prepares them to dive into the rest of the content.
The eyebrow targets a specific audience.
The headline grabs attention by promising a benefit (fat loss in just 15 minutes).
The deck copy adds credibility and detail, building interest in the method.

The headline elements checklist: There are key elements that should be incorporated in each headline based on the availability of information from the offer brief and sales letter information provided.

Curiosity
Call Out Pain Point
Promise Solution
Specificity
Simplicity
Credibility/Address Skepticism
Time Frame To Achieve Results Of Promise

The following are example headline that use the key headline elements:

  Example 1:
 Want to slash strokes from your game almost overnight? (Eyebrow)
Amazing Secret Discovered By One-Legged Golfer Adds 50 Yards To Your Drives, Eliminates Hooks and Slices… And Can Slash Up To 10 Strokes From Your Game Almost Overnight! (Headline)
Now you can learn to use your natural ability to “load” every drive with 200% more explosive power almost overnight, getting distance you could only dream of before… while nailing shot after shot exactly where you want it, as accurate as clockwork… and, if you’re like most golfers, knocking a pile of strokes off your next round! Impossible? Not if you believe what lifelong professionals and hot new amateurs worldwide are now saying…(deck copy)

Curiosity: One Legged Golfer
Call Out Pain Point: Hooks and slices
Promise Solution: Adds 50 yards to your drives, eliminates hooks and slices, slash up to 10 strokes from your game, load every drive with 200% more explosive power, nail shot-after-shot exactly where you want it, as accurate as clockwork, knock a pile of strokes off your next round
Specificity: 50 yards, up to 10 strokes, 200% more explosive power
Simplicity: If a one-legged golfer can do it, so can you
Credibility/Address Skepticism: Lifelong professionals and hot new amateurs worldwide are now saying this
Time Frame to Achieve Results of Promise: Almost overnight
Example 2:
Naked Girls All Laughed Behind The Little Pudgy Guy’s Back Until He Got Into A Knife Fight With 3 Enormous Bad-Ass Bikers…(headline)
Curiosity: Naked Girls, Little Pudgy Guy, Fight with 3 Enormous Bikers
Call Out Pain Point: The opposite sex is laughing behind your back because you’re little and pudgy
Promise Solution: Early in the lead
Specificity: 3 enormous bad-ass bikers; "The naked girls all laughed behind the little pudgy guy’s back"
Simplicity: A few easy-to-master secrets (early in the lead)
Credibility/Address Skepticism: Not really addressed
Time Frame to Achieve Results of Promise: Early promise of "pretty much overnight"
Example 3:
Exclusive! From the publisher of BOTTOM LINE BOOKS (eyebrow)
Kitchen cure #619...
How Gin-Soaked Raisins Cured Carmen’s “Hopeless” Arthritis! (Headline)
Worked even after doctors gave up! See inside on page 2...
Gin Soaked Raisins Cure “Hopeless” Arthritis: Kitchen Cure #619. (deck copy)

Curiosity: Gin Soaked Raisins
Call Out Pain Point: "Hopeless" Arthritis
Promise Solution: Cured
Specificity: Kitchen Cure #619
Simplicity: Kitchen cure, gin soaked raisins
Credibility/Address Skepticism: Not addressed
Time Frame to Achieve Results of Promise: Not specified
Example 4:
Scientists Discover Solution to Sexual Problems Hidden in 1,500-Year-Old Himalayan Secret (headline)
Studies show it boosts sex drive... increases stamina... promotes stronger, longer-lasting erections... and more. (deck copy)
Curiosity: 1,500 Year Old Himalayan Secret
Call Out Pain Point: Sexual problems
Promise Solution: Boosts sex drive, increases stamina, promotes stronger, longer-lasting erections, and more
Specificity: 1,500-year-old Himalayan secret
Simplicity: Not really
Credibility/Address Skepticism: Scientists
Time Frame to Achieve Results of Promise: Not specified
  Example 5:
 Secret West African Red Tea Proven to Stop Hunger Cravings in Their Tracks and Helps You Shed One Pound of Fat Every 72 Hours. (headline)
Curiosity: Secret West African Red Tea
Call Out Pain Point: Hunger cravings
Promise Solution: Proven to stop hunger cravings in their tracks, helps you shed one pound of fat every 72 hours
Specificity: Melt away up to 1 pound of fat every 72 hours, West African red tea
Simplicity: Red tea
Credibility/Address Skepticism: "Proven" but minimal
Time Frame to Achieve Results of Promise: One pound of fat every 72 hours
Example 6:
Attention Women Over 35: Tired of Endless Dieting, Exercising and Counting Calories? (eyebrow)
How a Humiliating High School Reunion Led One Woman to Discover the “BioHarmony Switch” and Finally Win The Battle With Her Waistline (headline)
This simple solution is being used by hundreds of women across the country to melt the fat away, restore their slender body and make their friends green with envy. (deck copy)
Curiosity: Humiliating high school reunion, BioHarmony Switch
Call Out Pain Point: Endless dieting, exercising, and counting calories; battle with waistline
Promise Solution: Win the battle with her waistline, melt the fat away, restore their slender body, make friends green with envy
Specificity: Women over 35
Simplicity: "Switch," "simple solution"
Credibility/Address Skepticism: Used by hundreds of women across the country
Time Frame to Achieve Results of Promise: Not specified (intentional due to compliance)
Example 7:
"Like a Time Capsule In a Bottle..."
New Stem Cell Breakthrough Doesn’t Just “Pause” the Aging Process… It Rewinds It! (headline)
Imagine going back in time to when you were the healthiest, sharpest, most radiant version of yourself… then staying that way for the rest of your life.
It’s not science fiction, it’s the power of Stem Cell Science.
Keep reading this report to see why experts believe this is the closest we’ll ever get to a real-life Fountain of Youth…
Plus the remarkable story of how 22 Nobel Prize-Winning Scientists came together to get this discovery to the public…
And why even though A-List Celebrities and Pro Athletes have been paying $100,000 per year for this youth-preserving breakthrough…(deck copy)
You can try it today for pennies.
Call Out Pain Point: Not explicitly called out
Promise Solution: Rewind the aging process, going back in time to the best version of yourself, a real-life fountain of youth, youth-preserving
Specificity: 22 Nobel Prize-winning scientists, $100,000 per year
Simplicity: Time capsule in a bottle
Credibility/Address Skepticism: 22 Nobel Prize-winning scientists, not science fiction, powered by stem cell science, used by A-list celebrities and pro athletes
Time Frame to Achieve Results of Promise: Try it today

: [STEP 2]
② [Step name]
[One sentence explanation]

SLIDE 7: [STEP 3]
③ [Step name]
[One sentence explanation]

SLIDE 8: [PROOF]
The research shows:
[Study insight]

SLIDE 9: [RESULT]
When you do this:
[Outcome statement]

SLIDE 10: [CTA]
Save this for later
Follow @[handle] for more
[Optional: Link to full post]
```

---

## Newsletter Template (Weekly Extraction)

```
SUBJECT: [HOOK - Curiosity-driven from Element 1]

[Personalized greeting],

[OPENING HOOK - 2-3 sentences]
[Contrarian statement + why it matters]

This week I want to share [topic] because [relevance].

━━━━━━━━━━━━━━━━━━━━

📍 THE PROBLEM

[Pull from Challenge element - 3-4 sentences on pain]

Maybe you've felt this too: [relatable scenario]

━━━━━━━━━━━━━━━━━━━━

💡 WHAT I LEARNED

[Pull from Expert Story - 4-5 sentences]

[Structure]: Here's where I was...
[Struggle]: This is what I faced...
[Solution]: Here's what changed...

━━━━━━━━━━━━━━━━━━━━

🎯 THE FRAMEWORK

Here's what works:

1. [Step name]: [2 sentences]

2. [Step name]: [2 sentences]

3. [Step name]: [2 sentences]

[Link to full breakdown on blog]

━━━━━━━━━━━━━━━━━━━━

✅ THIS WEEK'S ACTION

Your one thing to focus on:

[Pull from Recap - specific action]

[Timeline expectation]

━━━━━━━━━━━━━━━━━━━━

Remember: [Identity affirmation statement]

Talk soon,
[Your name]

P.S. [Soft CTA or bonus insight]
```

---

# Part 6: The Economics of Integration

## Investment vs. Return Analysis

### Traditional "Always Be Creating" Approach

**Annual Investment:**
- 5 posts/week × 52 weeks = 260 pieces
- Average 2 hours per piece
- Total: 520 hours per year

**Annual Output:**
- 260 one-off pieces
- No depth, limited research
- Inconsistent quality
- High burnout risk

**Cost (at $100/hr value):** $52,000 in time

---

### Integrated Blueprint + Waterfall Approach

**Quarterly Investment (per cornerstone):**

**Creation Phase (Weeks 1-2):**
- Research: 10 hours
- Writing cornerstone: 15 hours
- Recording video: 5 hours
- Initial framework design: 5 hours
- Extraction mapping: 5 hours
- **Subtotal: 40 hours**

**Extraction Phase (Weeks 3-6):**
- Daily extraction & adaptation: 1 hour/day × 20 days = 20 hours
- Visual creation: 10 hours
- Scheduling & optimization: 5 hours
- **Subtotal: 35 hours**

**Per Cycle Total: 75 hours**

**Annual Investment:**
- 4 cornerstones × 75 hours = 300 hours
- **SAVINGS: 220 hours vs traditional approach**

**Annual Output:**
- 4 cornerstone posts (2,500-5,000 words each)
- 4 cornerstone videos (8-15 minutes each)
- 240+ derivative pieces (60 per cornerstone)
- **TOTAL: 248 pieces of high-quality content**

**Quality Characteristics:**
- Research-backed (2 studies per cornerstone)
- Example-rich (5 per cornerstone)
- Framework-driven (memorable and repeatable)
- Consistent depth and voice

**Cost (at $100/hr value):** $30,000 in time
**SAVINGS: $22,000 annually**

**Rest Built In:**
- 24 weeks active creation/extraction
- 28 weeks rest, engagement, planning
- Zero burnout, sustainable forever

---

## The Leverage Multiplier

**One Cornerstone =**
- 1 long-form blog post
- 1 video (pillar content)
- 6 Twitter threads
- 23 individual tweets
- 4 LinkedIn articles
- 12 LinkedIn posts
- 11 visual pieces (carousels, infographics)
- 4-6 newsletter editions

**Leverage Ratio: 1:60+**

---

# Part 7: Implementation Roadmap

## Your First 12 Weeks (One Complete Cycle)

### QUARTER 1: FOUNDATION CYCLE

**Topic Selection:** [Your core expertise area]

#### **Weeks 1-2: Creation**

**Week 1 Checklist:**
- [ ] Define cornerstone topic
- [ ] Research 2 studies on DeepDive.com
- [ ] Gather 5 examples (1 famous, 1 personal, 1 client, 1 relatable, 1 "what not to do")
- [ ] Write expert story using 3S formula
- [ ] Document 3 challenges your audience faces
- [ ] Identify 4 transformations your framework enables
- [ ] Create myth/mindset section

**Week 2 Checklist:**
- [ ] Write full cornerstone (2,500-5,000 words) using unified template
- [ ] Record video version (8-15 minutes) using 7 elements
- [ ] Create waterfall extraction map (tag every section)
- [ ] Design framework visual (triangle, quadrant, or process)
- [ ] Write video script/teleprompter notes
- [ ] Set up content calendar for next 4 weeks

---

#### **Weeks 3-6: Extraction**

**Use the week-by-week distribution schedule:**

**Week 3:** Opening elements (15 pieces)
**Week 4:** Story + Framework (14 pieces)
**Week 5:** Examples + Myth (14 pieces)
**Week 6:** Application + Recap (13 pieces)

**Daily Routine:**
- Morning (30 min): Extract and adapt content for platform
- Midday: Publish scheduled posts
- Afternoon (30 min): Create visual if scheduled
- Evening: Engage with comments

**Weekly Routine:**
- Monday: Extract from assigned element
- Tuesday-Thursday: Adapt and publish
- Friday: Newsletter + weekend scheduling
- Weekend: Engagement only

---

#### **Weeks 7-12: Rest & Engage**

**Week 7-8: Active Engagement**
- Respond to all comments
- Start conversations with commenters
- Build relationships with other creators
- Reshare top 5 performing posts

**Week 9-10: Analysis & Planning**
- Review all metrics
- Identify top 3 and bottom 3 posts
- Understand what resonated
- Document insights
- Begin brainstorming next topic

**Week 11-12: Next Cycle Prep**
- Finalize next cornerstone topic
- Start research (2 studies)
- Gather examples
- Update playbook with learnings
- Prepare for next creation phase

---

### QUARTER 2-4: REPLICATION

Repeat the 12-week cycle with:
- **Q2 Topic:** [Related but distinct angle]
- **Q3 Topic:** [Deeper dive on popular Q1/Q2 element]
- **Q4 Topic:** [Synthesize learnings from year]

---

## Year-End Results

**Content Created:**
- 4 cornerstone posts (10,000-20,000 words total)
- 4 pillar videos (32-60 minutes total)
- 240+ social media posts
- 16-24 newsletter editions
- 40+ visual assets

**Time Invested:**
- 300 hours total
- 25 hours per month average
- Built-in rest for 7 months

**Authority Established:**
- Deep expertise demonstrated in 4 key areas
- Research-backed credibility
- Consistent presence across platforms
- Engaged community built

---

# Part 8: Advanced Integration Tactics

## Tactic 1: The Batch Recording Studio Day

**Combines:**
- Dan Martell's 6-day studio model
- Waterfall's 6-in-6 cycle

**How It Works:**

**Pre-Production (2 weeks before):**
1. Write 10-20 cornerstone scripts
2. Design all framework visuals
3. Prepare all props/examples
4. Create teleprompter files

**Studio Day (8-10 hours):**
1. Record 10-20 videos (one take each)
2. Don't review or edit
3. Just keep recording
4. Goal: Complete all quarterly cornerstones in 2 days

**Post-Production (1 week after):**
1. Send all videos to editor
2. Editor delivers completed videos
3. You extract content from all videos
4. Schedule 12 months of content

**Result:** 12 months of pillar content + 600+ derivative pieces created in 3 weeks

---

## Tactic 2: The AI Extraction Accelerator

**Use AI to speed up extraction while maintaining quality:**

**Step 1: Feed AI Your Cornerstone**
```
"Here is my cornerstone post. I need to extract 60 pieces of content using the Waterfall method. 

The cornerstone follows the Magnetic Content Blueprint structure:
[Paste full post]

Please identify extraction opportunities for each of the 7 elements."
```

**Step 2: Generate Platform-Specific Adaptations**
```
"Extract the Hook element into:
1. Two standalone tweets
2. One LinkedIn contrarian post
3. One quote graphic text
4. One email subject line

Maintain my voice and the specific details."
```

**Step 3: Review and Refine**
- AI gives you 80% solution
- You refine for voice and accuracy
- Cuts extraction time from 35 hours to 10 hours

**Critical:** AI generates drafts, you maintain quality control

---

## Tactic 3: The Audience Feedback Loop

**Integrate audience feedback into next cycle:**

**During Extraction Phase:**
- Monitor which posts get highest engagement
- Track which questions come up most
- Note which examples resonate most

**In Rest Phase:**
- Survey audience on next topic preferences
- Ask what they want to go deeper on
- Identify gaps in current content

**For Next Cornerstone:**
- Address the questions that came up
- Use audience language in challenges
- Feature community examples
- Build on what resonated

**Result:** Each cycle is more dialed in than the last

---

## Tactic 4: The Cross-Platform Amplification

**Maximize each piece across platforms:**

**Primary Publish (Day 1):**
- Cornerstone to blog
- Video to YouTube
- Announcement thread on Twitter
- Announcement post on LinkedIn

**Secondary Distribution (Day 2-3):**
- Republish to Medium
- Share to relevant LinkedIn groups
- Post to Reddit communities
- Share in Slack/Discord communities

**Ongoing Amplification (Weeks 3-6):**
- Every extracted post links back to cornerstone
- Every newsletter mentions cornerstone
- Every visual includes URL
- Pin cornerstone thread on Twitter

**Result:** Compounding traffic to your best work

---

# Part 9: Quality Control Checklist

## Before Publishing Your Cornerstone

### Content Quality
- [ ] **2 Studies** - Research backing your framework
- [ ] **5 Examples** - Diverse, concrete applications
- [ ] **10 Outbound Links** - Citations and resources
- [ ] **1 POV** - Consistent voice throughout
- [ ] **7 Elements** - All Magnetic Blueprint elements present

### Structural Integrity
- [ ] **Pattern-Interrupt Hook** - Stops the scroll
- [ ] **Identity Filter** - "This is for people who..."
- [ ] **3S Expert Story** - Structure, Struggle, Solution
- [ ] **Named Enemy** - What most get wrong
- [ ] **Visual Framework** - Triangle, quadrant, or process
- [ ] **Myth Addressed** - Limiting belief confronted
- [ ] **Application Guide** - Step-by-step how-to
- [ ] **Realistic Expectations** - Timeline and outcomes
- [ ] **Identity Close** - Who wins with this

### Waterfall Readiness
- [ ] **Extraction Map Created** - Every section tagged
- [ ] **60+ Pieces Identified** - Clear extraction plan
- [ ] **Visuals Designed** - Framework graphics ready
- [ ] **Distribution Calendar** - 4-6 weeks scheduled
- [ ] **Platform Templates Ready** - All formats prepared

### SEO & Discoverability
- [ ] **Primary Keyword** - Identified and used naturally
- [ ] **Meta Description** - Compelling, keyword-rich
- [ ] **URL Slug** - Clean and descriptive
- [ ] **Alt Text** - All images described
- [ ] **Internal Links** - Connected to other content


