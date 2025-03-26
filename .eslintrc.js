module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Allow images without using next/image component (for now - later you may want to migrate)
    "@next/next/no-img-element": "warn",

    // Allow unescaped entities in specific cases when they're needed
    "react/no-unescaped-entities": [
      "error",
      {
        forbid: [
          {
            char: ">",
            alternatives: ["&gt;"],
          },
          {
            char: "}",
            alternatives: ["&#125;"],
          },
        ],
      },
    ],

    // If needed, you can also disable the unused variables rule entirely
    // But it's better to fix them as we did above
    // '@typescript-eslint/no-unused-vars': 'warn',

    // Allow explicit any in specific cases where it's really needed
    "@typescript-eslint/no-explicit-any": "warn",
  },
};
