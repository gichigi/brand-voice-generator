# Brand Voice Generator

An AI-powered platform that helps businesses create consistent, on-brand content. Stop asking ChatGPT to "make it sound good" - generate killer content that's tailored to your audience and sounds just like you, every time.

## Features

- 🎯 **Brand Voice Framework**: Get a unique 3-pillar framework that captures your brand's personality
- ✍️ **Content Generation**: Create blog posts, social media content, and more with your brand voice
- 📚 **Content Library**: Store and organize all your generated content in one place
- 🎨 **Modern UI**: Beautiful, responsive design with a neo-brutalist aesthetic
- 🚀 **Quick Setup**: Get started in minutes with a simple onboarding process

## Tech Stack

- **Frontend**: Next.js 15.2, React 19.1
- **Styling**: Tailwind CSS, Radix UI
- **AI Integration**: OpenAI API
- **Database**: Convex
- **Authentication**: Clerk/Auth0

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/gichigi/bvg.git
   cd bvg
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
bvg/
├── app/             # Next.js app directory
├── components/      # Reusable UI components
├── convex/         # Convex database setup
├── hooks/          # Custom React hooks
├── lib/            # Utility functions
├── public/         # Static assets
└── styles/         # Global styles
```

## Features in Development

- Content repurposing tools
- SEO optimization features
- Team collaboration
- Content calendar integration
- API access for custom integrations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 