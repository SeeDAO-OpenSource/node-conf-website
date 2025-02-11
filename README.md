# SeeDAO Node Conference Website

A React-based web application for managing SeeDAO node conferences, built with modern web technologies and Web3 integration.

## 🚀 Features

- Multi-stage conference management (Preparatory, Meeting, and Adjournment stages)
- Season-based data organization
- Web3 integration with Wagmi and JoyID
- Responsive design with Tailwind CSS
- Markdown content support
- Real-time countdown functionality

## 🛠 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Web3 Integration**: 
  - Wagmi
  - JoyID
  - Ethers.js
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **UI Components**: 
  - HeroIcons
  - React Markdown
  - React Toastify
- **Date Handling**: Day.js

## 🏃‍♂️ Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd node-conf-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

- `/src` - Source code
  - `/pages` - Main application pages
  - `/components` - Reusable React components
  - `/config` - Configuration files
  - `/api` - API integration
  - `/types` - TypeScript type definitions
  - `/data` - Season-specific data

## 🔧 Configuration

The application uses various configuration files:
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## 🌐 Web3 Features

- Integration with SeeDAO SNS
- Wallet connectivity through Wagmi and JoyID
- Ethereum interaction using ethers.js

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the terms of the license included with the project.
