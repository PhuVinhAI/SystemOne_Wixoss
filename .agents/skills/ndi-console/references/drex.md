# Drex decisions through the Console API

Drex and the document tools share `https://console.nace.ai`, the Console-issued bearer key in `NACE_API_KEY`, and account credit. Use the [official TypeScript SDK](https://console.nace.ai/docs/developer-tools/typescript/questions) for the project and the [public API contract](https://console.nace.ai/openapi.json) to verify the request.

## Request

POST `/v1/systemone` with a text or JSON `state` and a `questions` object. Each question's key is its stable ID in the response. Send `model: "drex-max-v1.1"` explicitly for reproducible runs. Use `client.models.list()` or `GET /v1/models` to check access and record the version returned in `model`. See [models](https://console.nace.ai/docs/drex/reference/models).

The bundled [hello-drex.json](../assets/hello-drex.json) is a complete synthetic request with all three question types. From a clone of this repository, after setting the key locally:

```sh
curl --fail-with-body --max-time 70 \
  https://console.nace.ai/v1/systemone \
  -H "Authorization: Bearer $NACE_API_KEY" \
  -H "Content-Type: application/json" \
  --data-binary @skills/ndi-console/assets/hello-drex.json
```

When the skill is installed elsewhere, resolve the JSON file relative to the installed skill directory. This command makes one paid evaluation when it succeeds; it does not automatically retry. Do not print the key or use verbose HTTP logging.

### Question types

| Type | Request shape | Response fields |
| --- | --- | --- |
| `noul` | An `instructions` string asking a yes/no question; optional `criteria` descriptions under `true` and `false` | `noul`, the probability of yes |
| `choice` | `criteria` maps each label to its description or `null`; add instructions to disambiguate the task | `choice`, `confidence`, `probabilities` |
| `score` | `criteria` is a string array ordered from the lowest level to the highest | `score`, `legend`, `confidence`, `probabilities` |

For example, the following is one request about a fictional record:

```json
{
  "model": "drex-max-v1.1",
  "state": {"message": "Could you send me a copy of my receipt?"},
  "questions": {
    "requests_document": {
      "type": "noul",
      "instructions": "Is the sender requesting a document?"
    },
    "topic": {
      "type": "choice",
      "instructions": "What is the primary request?",
      "criteria": {
        "document_copy": "A copy of an existing receipt or other document.",
        "refund": "The return of a payment.",
        "other": null
      }
    },
    "urgency": {
      "type": "score",
      "instructions": "How urgent is the request based on explicit time constraints?",
      "criteria": ["No deadline stated", "A deadline is stated", "Immediate action is required"]
    }
  }
}
```

Keep related questions about the same state in one request. The current contract accepts 1–512 questions, but start with what the user needs. Send `questions` as an object, not an array, and keep IDs nonempty. See [questions](https://console.nace.ai/docs/drex/guides/questions).

### Author the prompt

- Put the record and relevant evidence in `state`. Use `instructions` to name the field or evidence to judge, and `criteria` to define what qualifies.
- In `choice`, give each label a distinct boundary. Add an explicit label for out-of-scope or insufficient evidence when either is possible. Use a separate `noul` if downstream logic needs its own evidence check.
- In `score`, describe observable thresholds from low to high for one dimension. Use the distribution to test for a minimum level.
- Keep comparisons on the same model and state format. Test common cases, missing evidence, and ambiguous label boundaries on independent labeled examples before tuning cutoffs.

### Image requests

Use the top-level `images` array for PNG, JPEG or WebP with the API or SDK. Refer to the images as “Image 1”, “Image 2”, and so on. Keep media bytes outside `state` and `questions`. The hosted MCP `decide` supports text and JSON. For large text states, Drex MAX 1.1 selects passages based on the questions. Send the relevant excerpts or keep the text state around 8,000 tokens or less if all of it matters. See [Drex Max](https://console.nace.ai/docs/drex/guides/drex-max).

## Read the answer

This endpoint returns a synchronous JSON response with `answers`, `model`, `usage`, `evaluation_time_ms` and `request_id`. Read `answers` by the original question IDs. It does not return a document job to poll.

- `noul` is a number between 0 and 1. Preserve it and set decision thresholds for the user's use case; the API does not choose a universal Boolean cutoff.
- A choice includes its selected label and distribution. Keep `confidence` as returned; it is not interchangeable with the winning label's probability.
- A score is an expected level on zero-based indices and can be fractional. `legend` names the levels, while `probabilities` uses string indices such as `"0"`. Keep the fractional score for numerical analysis; if a display label is needed, the most probable level and the rounded score can differ.
- Save the served model and request ID for diagnosis. `evaluation_time_ms` measures model work, not the full client round trip. Consult current pricing for usage; do not hardcode a promotional credit or rate into generated code.

These fields are explained in [reading answers](https://console.nace.ai/docs/drex/guides/reading-answers). Predictions need validation against the user's task; a successful response is not an independent factual check.

## Combine with NDI documents

For “read this invoice and decide where it should go,” use the [document API guide](api.md) to Parse or Extract the selected file, wait for that job, then put the relevant text or structured fields in Drex `state`. Keep the document's citations and job ID alongside the Drex answer and request ID. The input state can include user-provided policy text or structured rules needed to answer the questions.

Parse PDFs before sending their relevant text or extracted fields to `/v1/systemone`. If the user already has text or JSON, use it directly. A document Classify job labels files/pages; a Drex choice evaluates the supplied text or record. Select the route that matches the requested input and result.

Check the current [state and size limits](https://console.nace.ai/docs/drex/guides/state) before processing long content. Avoid silently truncating facts that could change a decision; tell the user when a necessary scope exceeds the chosen model's limits.

## Timeouts and retries

Use a client timeout of at least 60 seconds. For retryable rate/capacity/server failures, honor `retry-after-ms` when present, otherwise `Retry-After`, and use bounded backoff. Fix 401, 402 and 422 errors instead of repeating them unchanged. Preserve the response's request ID without logging private input or credentials.

The document API's `Idempotency-Key` deduplication does **not** establish deduplication for `/v1/systemone`. Every successful evaluation is billed. After a transport timeout, the response may have been lost after completion; a retry can be another successful charge. Do not send speculative duplicate requests or promise an exactly-once evaluation. Apply retries within the user's scope and disclose unresolved completion uncertainty.

See [Drex errors and retries](https://console.nace.ai/docs/drex/guides/errors-and-retries).
