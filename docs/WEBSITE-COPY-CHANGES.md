# Website copy changes for Antigravity

Everything here is marketing-site copy only. No application code. Written so it
can be handed over without further explanation.

Last updated 8 September 2026.

---

## 1. Multiple employees of the same role are now allowed

**What changed:** a company could previously hire exactly one of each role. That
limit is gone. A client can now hire three Sales Representatives, two Lead
Generation Specialists, or as many of anything as the work needs. Each one is a
separately billed seat at the listed monthly price.

**Where the copy needs to change:**

- **Pricing page.** Anywhere a role is presented as a single item, make it clear
  the price is per employee per month and that you can hire more than one.
  Suggested phrasing: *"$249 per month, per Sales Representative. Hire as many
  as the work needs."*
- **Employees / talent pool page.** Same idea. The mental model to sell is
  headcount, not features: you are staffing a company, so you add people.
- **How it works.** If it implies a fixed team, adjust to say the team grows
  when you hire and shrinks when you dismiss, and billing follows.

**Do not claim** any specific capacity figure yet. See section 5.

---

## 2. Payment and cancellation policy is now real, and should be stated

The product now sends these automatically. Saying so on the site removes a
purchase objection, and it is all true as of today.

- Reminder **3 days before** payment is due
- Reminder **on the day** payment is due
- If a payment fails, a notice **the day after**
- The workforce **keeps running for 3 days** after a failed payment
- A warning **before** anything is interrupted
- After that the team **pauses, it is never deleted**, and one payment brings it
  back exactly as it was
- If a client cancels, their team **keeps working until the end of the period
  they have already paid for**

**Where:** pricing page, FAQ, terms, and refund page.

**Suggested FAQ entries:**

> **What happens if my payment fails?**
> We tell you the day after, and nothing changes for three days. Your team keeps
> working. If it still has not gone through, your employees pause. They are
> never deleted, and they pick up exactly where they left off the moment payment
> goes through.

> **What if I cancel?**
> Your team keeps working until the end of the period you have already paid for.
> No early cut-off, and nothing is deleted.

---

## 3. Remove any remaining free-trial language

The trial no longer exists anywhere in the product. Paid from day one, sold on
the 30-day money-back guarantee.

**Check for and remove:** "7 day trial", "free trial", "try free", "no credit
card required", "start free". The last one matters: Stripe's checkout page shows
"Start for free" only when a full discount applies, and that is not the normal
customer path.

**Replace with** the guarantee: *"30 days. If it does not earn its keep, you get
your money back."*

---

## 4. Roles that cannot be bought yet

Bookkeeper and Receptionist are listed as coming soon in the product and cannot
be hired. The site must not sell them.

**Where:** wherever roles are listed, these two need a "Notify me" rather than a
"Hire" path, and no pricing presented as buyable.

---

## 5. Capacity figures: not yet, and here is why

You asked for average usage or calls per day per agent so a client can judge how
many they need. That number should not be invented, and I do not have it yet.

**What is true today:** no customer has run enough volume to measure anything.
The honest figure comes from real usage over real days.

**What to publish in the meantime:** nothing numeric. Suggested holding copy:

> **How many do I need?**
> Start with one. Your General Manager will tell you when the work is backing
> up, and you can add another the same day.

That is both honest and better sales copy than a number nobody trusts.

**What I will need to produce the real figure:** two to four weeks of live
customer usage. The task-per-agent-per-day data is already recorded, so it is a
query rather than new instrumentation when the time comes.

---

## 6. Sending domain, small but worth knowing

Password resets, payment reminders and problem-report replies now come from
**getstaffai.com**. The signup confirmation email still comes from a Supabase
shared address; that is an engineering change, not a copy one, and it is on my
list.

**Where this touches copy:** if any page tells people which address to expect
mail from, or to whitelist a sender, it should say `getstaffai.com`.

---

## 7. Wording worth reusing

Two lines from the product that tested well and are consistent with the
positioning of selling results rather than technology:

- On dismissal: *"This deletes their runtime and cannot be undone. Their past
  work and conversations are kept, but hiring the role again creates a new
  employee rather than bringing this one back."*
- On problem reports: *"We are early, and the people who tell us what is broken
  are the reason this gets better."*

The second is a good honesty note for an early-stage site and could sit on the
about or roadmap page as is.
