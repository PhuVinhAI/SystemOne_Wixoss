---
name: prompt-authoring
description: Write, review, and evaluate reusable prompts for text generation and typed decision models. Use for production prompts, prompt revisions, and workflows where models choose actions from evidence and evolving state.
---

# Reusable prompt authoring

Start from the model's actual API and the task's expected result. Write a contract that works across inputs. Use failures to identify missing evidence, ambiguous instructions, or missing operations, then test the revised contract against other inputs.

## Build the contract

1. State the role and the boundary of authority. Say what the model decides and what the host or caller performs. Keep private views separate from public or audit views.
2. Put the current state and the evidence in clearly delimited sections. Prefer structured JSON or compact records for structured data. Put the live snapshot and the active requirement before long reference material. Keep the complete decision-critical state under the model's full-read range when possible.
3. Define an observable result and its required format. For typed decisions, ask one question at a time and use short labels with mutually exclusive criteria. Include an insufficient-evidence label when the caller needs to distinguish uncertainty from a negative result.
4. Make operation labels describe the action's meaning, not only its physical shape. A physically possible mutation is not legal until the current state, timing and source rule establish what it means.
5. Separate independent questions into one request only when they use the same state and do not depend on one another. Keep dependent choices sequential and include previous answers in the next state.
6. Give the model an ordered decision procedure. It should identify the active requirement, check prerequisites and visibility, choose the next operation, and preserve unfinished work. Ask for one next action, not a complete hidden plan.
7. When a decision needs review, ask about the specific prerequisites for that action. Check the candidate against current evidence. Treat agreement between calls to the same model as one signal and verify important outcomes independently.
8. Keep prompts direct. Use headings or delimiters when they clarify boundaries. Start without examples. Add diverse examples if they resolve a known ambiguity, then check that the same behavior transfers to unseen cases.

## State and evidence rules

- Distinguish raw values, values already recorded and values the model must infer. Include the evidence needed to interpret a value together with the value itself.
- Keep the active source record, the outstanding task and committed actions close together. On each step, carry forward enough state to tell completed work from pending work.
- Put domain records in data sections. Fix general ambiguities in instructions and fix source errors in the source records.
- Let the model explicitly report missing evidence when the decision requires it.

## Typed API choices

- Use `choice` for one label from unordered alternatives. Keep criteria labels stable and descriptions distinct.
- Use `noul` only for a genuinely binary question and preserve its probability. Choose an application threshold outside the prompt.
- Use `score` only for an ordered scale. Define observable low-to-high levels and retain the fractional result.
- Do not treat confidence as the selected label's probability.

## Evaluation before release

Compare prompt variants with the same model and fixtures. Use ordinary cases and relevant boundary, missing-evidence, hidden-information or multi-step cases. Preserve some inputs for validation after tuning. Assert decisions and effects, including valid actions that should pass review and invalid actions that should fail. Record the prompt version, request ID, outcome and usage when available. Report transport failures separately from decision failures.

Read the current [Nace Questions](https://console.nace.ai/docs/drex/guides/questions), [Nace State](https://console.nace.ai/docs/drex/guides/state), and [Drex Max](https://console.nace.ai/docs/drex/guides/drex-max) documentation when the API contract or context limits may have changed. The principles also align with [OpenAI prompt engineering](https://platform.openai.com/docs/guides/prompt-engineering), [OpenAI reasoning practices](https://platform.openai.com/docs/guides/reasoning-best-practices), [Anthropic agent design](https://www.anthropic.com/engineering/building-effective-agents), and Google's [prompting strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies).
