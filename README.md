# Fuzzy.ai Fraud Detection Example

An example using [Fuzzy.ai](https://fuzzy.ai) to detect fradulent credit card transactions. To learn more, [read the blog post](https://blog.fuzzy.ai/2017/04/13/build-fraud-detection-into-your-apps/) about the project.

## Usage

To test the app, visit https://fraud-detection.fuzzy.ai/ and complete the form, or use the "fill with random data" button.

## Development Installation

If you want to run your own instance of the bot, clone this repository and do the following:

1. Run `npm install`
1. Copy `env.example` to `.env` and populate values:
  1. Copy your Fuzzy.ai API Key from your [Fuzzy.ai Dashboard](https://fuzzy.ai/) to `API_KEY`.
  1. Create an "Empty" agent and copy the ID to `AGENT_ID`.
1. Run the bot via `npm run dev`.
