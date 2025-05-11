# 10xBikeTravels 🏍️

10xBikeTravels is a web application designed to help motorcyclists plan engaging and personalized motorcycle routes. Using AI technology, the application generates route suggestions based on rider preferences, starting point, and desired distance or duration.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![Test Coverage](https://img.shields.io/badge/coverage-81%25-yellowgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()

## 🌐 Demo

The application is available online at [https://bike-travels.vercel.app/](https://bike-travels.vercel.app/)

## 🚀 Features

- **Personalized Route Generation**: Generate motorcycle routes based on your preferences, including scenic views, twisty roads, or avoiding highways
- **Flexible Planning**: Specify your starting point and preferred distance or duration
- **Motorcycle Type Customization**: Tailor routes to your motorcycle type (cruiser, sportbike, etc.)
- **Save Your Favorites**: Store, manage and review your favorite routes
- **User Authentication**: Secure access to your personal profile and saved routes
- **Responsive Design**: Access the application on any device

## 📋 Table of Contents

- [Demo](#-demo)
- [Installation](#-installation)
- [Usage](#-usage)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Contributing](#-contributing)
- [License](#-license)

## 🔧 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account (for backend)
- OpenRouter.ai API key

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/WojcikMM/10xBikeTravels.git
   cd 10xBikeTravels
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the `example.env` file:

   ```
   NEXT_PUBLIC_OPENROUTER_KEY=your_openrouter_key
   NEXT_PUBLIC_OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   NEXT_PUBLIC_OPENROUTER_MODEL=your_preferred_model
   NEXT_PUBLIC_OPENROUTER_APP_URL=your_app_url

   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚴 Usage

### Generating a Route

1. Log in to your account
2. Navigate to the route generation page
3. Enter your starting point (e.g., "Warsaw, Palace of Culture")
4. Select your route priority (scenic, twisty, avoid highways)
5. Specify your desired distance (km) or duration (hours)
6. Click "Generate Route" to create your personalized journey

### Managing Routes

- **Save Route**: After generating a route, click "Save" to add it to your collection
- **View Saved Routes**: Access your saved routes from the dashboard
- **Delete Route**: Remove routes you no longer need

## 🧪 Testing

The project includes a comprehensive test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- **Unit Tests**: Testing individual components and services
- **Integration Tests**: Testing component interactions
- **Mock API**: Using MSW to simulate API responses without making real network calls

## 📁 Project Structure

```
10xBikeTravels/
├── __mocks__/             # Jest mocks
├── __tests__/             # Test files
│   ├── components/        # Component tests
│   ├── lib/               # Service tests
│   ├── mocks/             # MSW mocks
│   └── utils/             # Test utilities
├── app/                   # Next.js app directory (routes)
│   ├── dashboard/         # Dashboard pages
│   ├── generate/          # Route generation
│   └── profile/           # User profile
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── common/            # Shared components
│   ├── layouts/           # Layout components
│   └── routes/            # Route-related components
├── lib/                   # Core logic and services
│   ├── ai/                # AI integration services
│   ├── auth/              # Authentication logic
│   └── supabase/          # Database interactions
├── public/                # Static assets
└── styles/                # Global styles
```

## 🔧 Technologies

### Frontend

- **Next.js 13**: React framework with app router
- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Ant Design**: UI component library
- **Styled Components**: CSS-in-JS styling

### Backend

- **Supabase**: Backend-as-a-Service with PostgreSQL
- **OpenRouter.ai**: AI model integration

### Testing

- **Jest**: Testing framework
- **React Testing Library**: Component testing
- **MSW (Mock Service Worker)**: API mocking
- **Testing Utilities**: Custom test helpers

### CI/CD & Hosting

- **GitHub Actions**: CI/CD pipelines
- **Docker**: Containerization
- **DigitalOcean**: Cloud hosting
- **Vercel**: Application hosting platform

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- This project was developed as part of the 10xDevs course
- Special thanks to all contributors and testers
