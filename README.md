# 🎨 Homeschool Worksheet Generator

A fun, interactive web app that generates custom printable worksheets for homeschool students using AI. Features a hand-drawn comic book aesthetic and creates engaging educational content for grades K-5.

## Features

- **4 Subject Areas**: Math, Science, Reading, and Writing
- **Grade Levels**: Kindergarten through 5th grade
- **AI-Powered**: Uses Groq API (free tier) to generate custom worksheets
- **Creative Prompts**: Students can describe the story they want their worksheet to be about
- **Print-Ready**: Optimized for printing on standard 8.5" x 11" paper
- **Hand-Drawn Aesthetic**: Fun, kid-friendly design with placeholder assets

## Tech Stack

- **Vue 3** (Composition API)
- **Vite** (Build tool)
- **Tailwind CSS** (Styling)
- **Vue Router** (Navigation)
- **Pinia** (State management)
- **Groq SDK** (LLM integration)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A free Groq API key (get one at [console.groq.com](https://console.groq.com))

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd homeschooler
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your Groq API key:
```
VITE_GROQ_API_KEY=your_actual_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser to the URL shown (typically `http://localhost:5173`)

## Project Structure

```
src/
├── assets/              # Static assets (placeholder for Forrest's drawings)
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── HandDrawnButton.vue
│   │   ├── HandDrawnInput.vue
│   │   └── HandDrawnTitle.vue
│   ├── setup/           # Setup screen components
│   │   ├── GradeSelector.vue
│   │   └── AvatarPicker.vue
│   ├── subjects/        # Subject selection components
│   │   └── SubjectCard.vue
│   └── worksheet/       # Worksheet display components
│       └── WorksheetDisplay.vue
├── views/               # Main page views
│   ├── SetupView.vue
│   ├── SubjectsView.vue
│   ├── PromptView.vue
│   └── WorksheetView.vue
├── stores/              # Pinia state management
│   ├── userStore.js
│   └── worksheetStore.js
├── services/            # API services
│   └── llmService.js
├── router/              # Vue Router configuration
│   └── index.js
├── App.vue              # Root component
├── main.js              # App entry point
└── style.css            # Global styles
```

## How It Works

### User Flow

1. **Setup Screen** (`/`): Enter name, select grade level (K-5), and choose an avatar
2. **Subjects Screen** (`/subjects`): Select from Math, Science, Reading, or Writing
3. **Prompt Screen** (`/prompt/:subject`): Enter a creative story prompt for the worksheet
4. **Worksheet Screen** (`/worksheet`): View, edit, and print the generated worksheet

### LLM Integration

The app uses Groq's free tier API with the `llama-3.1-70b-versatile` model to generate:
- A short story (3-5 sentences) based on the user's prompt
- Grade-appropriate problems (3-10, depending on grade level)
- Problems can be multiple choice, fill-in-the-blank, true/false, or short answer

### Worksheet Generation

Each worksheet includes:
- Student name and date
- Grade level
- Fun story section
- Educational problems based on the selected subject and grade
- Answer spaces (checkboxes, fill-in lines, etc.)
- Encouraging messages

## Configuration

### Grade-Level Configuration

The app automatically adjusts problem count and complexity based on grade:
- **Kindergarten**: 3-5 very simple problems
- **1st Grade**: 5 simple problems
- **2nd Grade**: 6 basic problems
- **3rd Grade**: 8 moderate problems
- **4th Grade**: 9 intermediate problems
- **5th Grade**: 10 advanced problems

### Customizing Subjects

Edit `src/services/llmService.js` to customize:
- Subject-specific instructions
- Problem types
- Example prompts

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service.

## Print Functionality

The app includes optimized print styles:
- Hides navigation buttons and UI elements when printing
- Formats worksheet to fit standard letter paper (8.5" x 11")
- Black and white optimized for home printing

## Future Enhancements

- [ ] Replace placeholder assets with Forrest's hand-drawn illustrations
- [ ] Add user authentication and worksheet history
- [ ] Save worksheets to a database
- [ ] Allow teachers to customize problem difficulty
- [ ] Add more subjects (History, Geography, Art, Music)
- [ ] Support for multiple languages
- [ ] Worksheet templates and themes

## Development Notes

- All data is stored in session memory (no persistence in MVP)
- No authentication required
- Completely client-side (except LLM API calls)
- Uses browser's native print functionality

## Troubleshooting

### API Key Issues

If you get errors about the API key:
1. Make sure your `.env` file exists in the root directory
2. Verify the key starts with `VITE_` (required for Vite)
3. Restart the dev server after adding/changing environment variables

### Print Styling Issues

If worksheets don't print correctly:
1. Use Chrome or Edge for best results
2. In print dialog, set margins to "Default" or "None"
3. Ensure "Background graphics" is enabled

## License

MIT

## Credits

Created for homeschool families who want fun, customized learning materials!

Assets to be drawn by Forrest (coming soon!) 🎨
