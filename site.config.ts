// Edit this file to personalise the site.
export const site = {
  name: "Matt Clarke",
  githubUser: "MJClarke5",
  title: "Data Scientist",
  tagline:
    "I specialise in predictive modelling, time-series forecasting and natural language processing, using R and Python to turn complex data into clear, decision-ready insight. Recent work spans sports outcome prediction, financial sentiment analysis and pricing optimisation.",
  links: {
    github: "https://github.com/MJClarke5",
    linkedin: "https://www.linkedin.com/in/clarkejmatthew",
    email: "", // e.g. "you@example.com"
  },

  // Repos shown in the "Featured" section, in this order.
  // `blurb` overrides the GitHub description; `demo` overrides the homepage link.
  featured: [
    {
      repo: "Premier-League-Predictions",
      blurb: "Match-outcome predictions for the 2025–26 Premier League season, with a live web app.",
    },
    {
      repo: "Stock-Sentiment",
      blurb: "NLP on earnings-call transcripts (e.g. NVIDIA) to test whether management tone tracks stock moves.",
    },
    { repo: "DS-810", blurb: "Airbnb pricing optimisation and causal inference in R." },
    { repo: "DS-804", blurb: "Sentiment analysis of Apple (AAPL) text data and its relationship to price." },
  ] as { repo: string; blurb?: string; demo?: string }[],

  // Repos never shown.
  hidden: ["tidytuesday", "MUB-Data"],
  hideForks: true,
};
