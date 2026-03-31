import OpenAI from "openai";

const MOCK_FIXES: Record<string, string> = {
  "image-alt": `<!-- Add descriptive alt text to images -->
<img src="photo.jpg" alt="Description of the image content" />

/* For decorative images, use empty alt */
<img src="decoration.jpg" alt="" role="presentation" />`,

  "color-contrast": `/* Ensure sufficient contrast ratio (4.5:1 for normal text) */
.text-element {
  color: #1a1a1a;        /* Dark text */
  background: #ffffff;    /* Light background */
}

/* Use a contrast checker tool to verify ratios */`,

  label: `<!-- Associate labels with form inputs -->
<label for="email-input">Email Address</label>
<input type="email" id="email-input" name="email" />

<!-- Or wrap the input inside the label -->
<label>
  Email Address
  <input type="email" name="email" />
</label>`,

  "button-name": `<!-- Add accessible text to buttons -->
<button aria-label="Close dialog">
  <svg>...</svg>
</button>

<!-- Or use visible text -->
<button>
  <svg>...</svg>
  <span>Close</span>
</button>`,

  "link-name": `<!-- Add descriptive link text -->
<a href="/pricing">View pricing plans</a>

<!-- For icon-only links, use aria-label -->
<a href="/settings" aria-label="Account settings">
  <svg>...</svg>
</a>`,

  "heading-order": `<!-- Use proper heading hierarchy -->
<h1>Page Title</h1>
  <h2>Section Title</h2>
    <h3>Subsection Title</h3>
  <h2>Another Section</h2>

<!-- Never skip levels (e.g., h1 → h3) -->`,
};

const DEFAULT_MOCK = `<!-- Fix this accessibility issue -->
<!-- Review the WCAG guidelines for this rule -->
<!-- Ensure proper semantic HTML and ARIA attributes -->`;

export async function generateFix(violation: {
  id: string;
  help: string;
  description: string;
  nodes?: { html: string }[];
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey || apiKey === "sk-placeholder") {
    return MOCK_FIXES[violation.id] || DEFAULT_MOCK;
  }

  const openai = new OpenAI({ apiKey });
  const sampleHtml = violation.nodes?.[0]?.html || "N/A";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content:
          "You are a web accessibility expert. Provide a concise HTML/CSS fix for the given WCAG violation. Include a brief comment explaining the fix. Return only the code.",
      },
      {
        role: "user",
        content: `Fix this accessibility violation:
Rule: ${violation.id}
Issue: ${violation.help}
Description: ${violation.description}
Affected HTML: ${sampleHtml}

Provide the corrected HTML/CSS code with a brief comment.`,
      },
    ],
  });

  return response.choices[0]?.message?.content || DEFAULT_MOCK;
}
