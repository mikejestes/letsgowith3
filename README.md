# PokerVibes 🎭

A modern team estimation tool built with React, TypeScript, and TanStack Router. Perfect for agile teams doing planning poker sessions remotely.

## ✨ Features

- 🎯 **Story Estimation**: Collaborative estimation using planning poker techniques
- 🤝 **Team Collaboration**: Built for remote and distributed teams
- 📊 **Consensus Building**: Blind voting prevents anchoring bias
- 🎨 **Modern UI**: Built with Mantine UI components
- 🚀 **Type Safe**: Full TypeScript support with React Router
- 📱 **Responsive**: Works great on desktop and mobile devices

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Mantine UI components and hooks
- **State Management**: React Context API
- **Testing**: Playwright for E2E testing
- **Code Quality**: ESLint + Prettier

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd pokervibes
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run test` - Run Playwright tests
- `npm run test:ui` - Run Playwright tests with UI

## 🏗️ Project Structure

```
src/
├── components/          # Reusable Mantine-based components
├── pages/               # React Router page components
├── hooks/               # Custom React hooks (including Mantine hooks)
├── types/               # TypeScript definitions
└── constants/           # App constants
tests/                   # Playwright E2E tests
public/                  # Static assets
```

## 🎯 Planning Poker Concepts

This application implements planning poker (also known as Scrum poker), an agile estimation technique where:

1. **Story Presentation**: A product owner or scrum master presents a user story
2. **Independent Estimation**: Team members privately select their estimates
3. **Simultaneous Reveal**: All estimates are revealed at the same time
4. **Discussion**: If estimates vary significantly, team discusses and re-estimates
5. **Consensus**: Process continues until team reaches consensus

### Estimation Scale

Common Fibonacci sequence: 1, 2, 3, 5, 8, 13, 21, 34, 55, 89

- Larger numbers represent more uncertainty
- "?" for unknown complexity
- "☕" for break time

## 🧪 Testing

We use Playwright for end-to-end testing to ensure the application works correctly across different browsers and devices.

```bash
# Run tests
npm run test

# Run tests with UI (interactive mode)
npm run test:ui
```

## 🎨 Code Style

This project uses ESLint and Prettier for code formatting:

- **ESLint**: Enforces code quality rules
- **Prettier**: Handles code formatting
- **Tailwind CSS**: Utility-first CSS with class sorting

Code is automatically formatted on save in most editors. You can also run:

```bash
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm run test`
5. Format code: `npm run format`
6. Commit changes: `git commit -m 'Add amazing feature'`
7. Push to branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Mantine](https://mantine.dev/) for the beautiful UI components and hooks
- [React Router](https://reactrouter.com/) for reliable client-side routing
- [Tabler Icons](https://tabler-icons.io/) for the comprehensive icon set
- [Vite](https://vitejs.dev/) for lightning-fast development
