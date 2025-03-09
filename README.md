# Agent One

An AI-powered agent that introduces users to Bryan Johnson's "Don't Die Blueprint" and generates personalized longevity blueprints.

![Agent One Logo](https://placeholder-for-your-logo.com/logo.png)

## About

Agent One is an open-source AI assistant developed for the [DDoraHacks Hackathon Bounty #999](https://dorahacks.io/hackathon/bounty/999). It helps users understand the principles of Bryan Johnson's approach to longevity and creates personalized "Don't Die Blueprints" based on individual health data and goals.

## Features

- **Interactive AI Agent**

  - Simple explanations of Bryan Johnson's "Don't Die Blueprint"
  - Q&A capability for longevity-related questions
  - Evidence-based insights about longevity practices

- **Personalized Blueprint Generator**

  - Custom recommendations based on user profiles (age, diet, activity level, health goals)
  - Adaptation of the blueprint principles to individual circumstances
  - Actionable insights tailored to user needs

- **Health Tracker Integration**

  - Optional connections to wearable devices and fitness apps
  - API integrations for real-time health data processing
  - Data visualization of health metrics over time

- **Exportable Reports**
  - PDF download option for personalized blueprints
  - Shareable format for healthcare providers
  - Progress tracking and milestone achievements

## Technologies Used

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, NextKs
- **AI/ML**: Gemini API, TensorFlow.js
- **Data Storage**: AstraDB
- **Integration**: Health Kit API, Google Fit API, Fitbit API
- **Deployment**: Docker, AWS/GCP

## Installation

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn
- AstraDB (local or Atlas account)
- AstraDB API key

### Setup

1. Clone the repository

```bash
git clone https://github.com/czDamian/agent-one.git
cd agent-one
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Configure environment variables

```bash
cp .env.example .env
# Edit .env with your API keys and database connection string
```
### Start the development server
```bash
npm run dev
# or
yarn dev

```

### Open Browser

Open your browser and navigate to http://localhost:3000

### Usage
#### Basic Interaction

1. Create an account or log in
2. Chat with the AI agent
3. Explore the "Personalize Blueprint" explanation section
4. Ask questions about the blueprint or longevity practices
5. Generate your personalized blueprint



## Architecture

┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Frontend │◄────►│ Backend │◄────►│ Database │
│ React App │ │ Node.js │ │ AstraDB │
└───────────────┘ └───────┬───────┘ └───────────────┘
│
┌─────────────┼─────────────┐
│ │ │
┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│ Gemini API │ │ Health Data │ │ Data │
│ │ │ APIs │ │ Analytics │
└───────────────┘ └───────────────┘ └───────────────┘


## Meet The Team

Damian Olebuezie - AI Engineer
Stephanie - UI/UX Designer
Damian Olebuezie - Frontend and Backend Developer

## License
This project is licensed under the MIT License - see the LICENSE file for details.