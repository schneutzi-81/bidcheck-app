# BidCheck - Quick Validation

A Go/No-Go decision support tool for bid qualification at SoftwareOne.

![BidCheck Screenshot](docs/screenshot.png)

## Features

- **38 Decision Criteria** across 6 categories:
  - Exclusion Criteria (8 fields) - Any "No" = Automatic NO-GO
  - Win Probability (7 fields) - 30% weight
  - Delivery Capability (6 fields) - 25% weight
  - Commercial Viability (5 fields) - 20% weight
  - Strategic Alignment (3 fields) - 15% weight
  - Proposal Feasibility (4 fields) - 10% weight

- **RFP Document Upload & AI Analysis**
  - Drag & drop PDF, Word, Excel files
  - Automatic requirement extraction
  - AI-powered criterion evaluation
  - Source evidence with page references

- **Evidence Review Panel**
  - View exact quotes from RFP documents
  - See page numbers and section context
  - Confirm or reject AI suggestions
  - Add your own comments

- **Smart Scoring**
  - Real-time weighted score calculation
  - Visual category breakdown
  - GO / CONDITIONAL GO / REVIEW REQUIRED / NO-GO recommendations

- **Role-Based Filtering**
  - Filter by: Sales, Presales, Delivery, Finance, Legal, Sales Leader
  - AI-automatable field highlighting

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/bidcheck.git
cd bidcheck

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
bidcheck/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles & Tailwind
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Configuration

### Scoring Weights

Edit the `CATEGORY_WEIGHTS` object in `src/App.jsx`:

```javascript
const CATEGORY_WEIGHTS = {
  exclusion: 0,           // Binary pass/fail
  winProbability: 0.30,   // 30%
  deliveryCapability: 0.25, // 25%
  commercialViability: 0.20, // 20%
  strategicAlignment: 0.15, // 15%
  proposalFeasibility: 0.10 // 10%
};
```

### Adding/Modifying Criteria

Edit the `FIELDS` object in `src/App.jsx` to add or modify criteria:

```javascript
{
  id: 'uniqueFieldId',
  label: 'Field Label',
  description: 'Question to answer?',
  owner: 'Sales', // Sales, Presales, Delivery, Finance, Legal, Sales Leader
  aiSource: 'Data Source',
  aiPotential: 'high', // high, medium, low
  weight: 2 // Scoring weight within category
}
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## Roadmap

- [ ] Backend API integration
- [ ] Real AI/ML document analysis
- [ ] PDF export
- [ ] Database persistence
- [ ] User authentication
- [ ] Approval workflow
- [ ] CRM integration (Salesforce)
- [ ] HR system integration (certifications)
- [ ] Resource planner integration

## License

Internal use only - SoftwareOne

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## Support

Contact the Presales team for questions or issues.
