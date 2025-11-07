import Groq from 'groq-sdk'

// Initialize Groq client
const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true // For client-side usage
})

// Configuration for problems by grade level
const gradeConfig = {
  'K': { problemCount: 3, complexity: 'very simple' },
  '1': { problemCount: 5, complexity: 'simple' },
  '2': { problemCount: 6, complexity: 'basic' },
  '3': { problemCount: 8, complexity: 'moderate' },
  '4': { problemCount: 9, complexity: 'intermediate' },
  '5': { problemCount: 10, complexity: 'advanced elementary' }
}

// Subject-specific instructions
const subjectInstructions = {
  'Math': {
    'K': 'counting, number recognition, simple addition with numbers 1-10',
    '1': 'addition and subtraction with numbers up to 20',
    '2': 'addition, subtraction, and simple multiplication with numbers up to 50',
    '3': 'multiplication, division, and fractions with numbers up to 100',
    '4': 'multi-digit multiplication, division, decimals, and fractions',
    '5': 'advanced fractions, decimals, percentages, and basic algebra'
  },
  'Science': {
    'K': 'basic observations about nature, animals, and plants',
    '1': 'simple experiments, weather, and animal habitats',
    '2': 'life cycles, states of matter, and simple machines',
    '3': 'ecosystems, the water cycle, and energy',
    '4': 'earth science, physical science, and the scientific method',
    '5': 'chemistry basics, biology, and advanced scientific concepts'
  },
  'Reading': {
    'K': 'letter recognition, simple words, and picture comprehension',
    '1': 'sight words, simple sentences, and basic comprehension',
    '2': 'short paragraphs, main idea, and character identification',
    '3': 'longer passages, inference, and vocabulary',
    '4': 'complex texts, theme, and figurative language',
    '5': 'advanced comprehension, analysis, and critical thinking'
  },
  'Writing': {
    'K': 'letter tracing, simple words, and drawing',
    '1': 'simple sentences, capitalization, and punctuation',
    '2': 'paragraph writing, descriptive words, and basic grammar',
    '3': 'multi-paragraph writing, dialogue, and editing',
    '4': 'essay structure, persuasive writing, and research',
    '5': 'advanced essays, creative writing, and literary analysis'
  }
}

/**
 * Generate a worksheet using Groq API
 * @param {string} grade - Student's grade level (K-5)
 * @param {string} subject - Subject area (Math, Science, Reading, Writing)
 * @param {string} studentName - Student's name
 * @param {string} userPrompt - User's creative story prompt
 * @returns {Promise<Object>} Generated worksheet with story and problems
 */
export async function generateWorksheet(grade, subject, studentName, userPrompt) {
  const config = gradeConfig[grade]
  const subjectInstruction = subjectInstructions[subject][grade]

  // Use panel-based system for Math, traditional for others
  if (subject === 'Math') {
    return generateMathPanelWorksheet(grade, config, subjectInstruction, studentName, userPrompt)
  }

  const systemPrompt = `You are a creative and educational worksheet generator for ${grade === 'K' ? 'Kindergarten' : `${grade} grade`} students.

Create a fun, engaging worksheet with:
1. A short story (3-5 sentences) based on the user's prompt
2. ${config.problemCount} age-appropriate ${subject} problems
3. Make it educational but FUN and creative!

Grade Level: ${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
Subject: ${subject}
Focus: ${subjectInstruction}
Complexity: ${config.complexity}

Return ONLY a valid JSON object with this EXACT structure (no markdown, no code blocks):
{
  "story": "A fun engaging story here...",
  "problems": [
    {
      "question": "The question text",
      "answer": "The correct answer",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"]
    }
  ]
}

Types can be: "multiple_choice", "fill_blank", "short_answer", "true_false"
For fill_blank type, use "____" in the question where the answer goes.
Make questions relate to the story when possible!`

  const userMessage = `Student name: ${studentName}
Story prompt: ${userPrompt}

Create a ${subject} worksheet for grade ${grade}.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.1-8b-instant', // Fast and capable model
      temperature: 0.8,
      max_tokens: 2048,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from API')
    }

    // Try to parse the response, handling potential markdown code blocks
    let cleanContent = content.trim()

    // Remove markdown code blocks if present
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    const worksheet = JSON.parse(cleanContent)

    // Validate the structure
    if (!worksheet.story || !Array.isArray(worksheet.problems)) {
      throw new Error('Invalid worksheet structure')
    }

    return {
      story: worksheet.story,
      problems: worksheet.problems,
      subject,
      grade,
      studentName,
      generatedAt: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error generating worksheet:', error)

    // Retry logic for network errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      console.log('Retrying due to network error...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      return generateWorksheet(grade, subject, studentName, userPrompt)
    }

    throw error
  }
}

/**
 * Get example prompts for a subject
 * @param {string} subject - Subject area
 * @returns {Array<string>} Example prompts
 */
/**
 * Generate a Math worksheet with comic panel-style incremental story
 * @param {string} grade - Student's grade level
 * @param {Object} config - Grade configuration
 * @param {string} subjectInstruction - Subject-specific instruction
 * @param {string} studentName - Student's name
 * @param {string} userPrompt - User's creative story prompt
 * @returns {Promise<Object>} Generated worksheet with panels
 */
async function generateMathPanelWorksheet(grade, config, subjectInstruction, studentName, userPrompt) {
  const systemPrompt = `You are creating a COMIC BOOK STYLE math worksheet for ${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`} students.

IMPORTANT: Create an incremental story that unfolds across ${config.problemCount} comic-style panels, like a storybook!

Grade Level: ${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
Math Focus: ${subjectInstruction}
Complexity: ${config.complexity}

Available asset categories:
- characters: dragon, unicorn, robot, pirate, astronaut, cat, dog, bear, wizard
- objects: apple, cookie, treasure, star, book, flower, coin, ball, gift, pizza, car, rocket
- backgrounds: garden, space, ocean, house, castle, forest, mountain, school
- actions: plus, minus, multiply, divide, equals, question, arrow_right, arrow_left

Return ONLY valid JSON (no markdown, no code blocks):
{
  "storyTitle": "The Adventure Title",
  "panels": [
    {
      "storyBeat": "Short sentence describing what happens in THIS panel (like a comic caption)",
      "question": "The math question that fits this story moment",
      "answer": "The correct answer",
      "answerType": "line",
      "assets": [
        {
          "category": "characters",
          "name": "dragon",
          "x": 20,
          "y": 50,
          "size": "4rem",
          "layer": 2
        },
        {
          "category": "objects",
          "name": "apple",
          "x": 60,
          "y": 40,
          "size": "2.5rem",
          "layer": 1
        }
      ]
    }
  ]
}

RULES:
1. Each panel tells ONE story beat that flows from the previous one
2. Story should progress: beginning → middle → end
3. Position assets using x/y percentages (0-100)
4. Use 2-4 assets per panel to illustrate the math problem
5. answerType: "line" (default), "box", or "multiple_choice"
6. For multiple_choice, include "options": ["A", "B", "C", "D"]
7. Keep story beats SHORT (one sentence)
8. Make the math visual - show it with the assets!

Example for "2 + 3 = ?":
- Asset 1: 2 apples on left (x: 25)
- Asset 2: plus sign (x: 50)
- Asset 3: 3 apples on right (x: 75)`

  const userMessage = `Student: ${studentName}
Story theme: ${userPrompt}

Create ${config.problemCount} connected story panels with math problems.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.9, // Higher creativity for stories
      max_tokens: 3072, // More tokens for panel data
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from API')
    }

    let cleanContent = content.trim()
    if (cleanContent.startsWith('```')) {
      cleanContent = cleanContent.replace(/```json\n?/g, '').replace(/```\n?/g, '')
    }

    const worksheet = JSON.parse(cleanContent)

    if (!worksheet.panels || !Array.isArray(worksheet.panels)) {
      throw new Error('Invalid worksheet structure - missing panels')
    }

    return {
      storyTitle: worksheet.storyTitle || 'Math Adventure',
      panels: worksheet.panels,
      subject: 'Math',
      grade,
      studentName,
      generatedAt: new Date().toISOString(),
      isPanelBased: true
    }
  } catch (error) {
    console.error('Error generating panel worksheet:', error)

    if (error.message.includes('network') || error.message.includes('fetch')) {
      console.log('Retrying due to network error...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      return generateMathPanelWorksheet(grade, config, subjectInstruction, studentName, userPrompt)
    }

    throw error
  }
}

export function getExamplePrompts(subject) {
  const examples = {
    'Math': [
      'A dragon collecting apples in a magical garden',
      'A pirate searching for treasure on an island',
      'An astronaut counting stars in space',
      'A wizard mixing potions with magical ingredients'
    ],
    'Science': [
      'Explore the life cycle of butterflies in a beautiful garden',
      'Learn about weather by helping animals prepare for a storm',
      'Discover plants and animals in a jungle expedition',
      'Study the solar system with friendly astronauts'
    ],
    'Reading': [
      'Read about a brave knight going on a quest to save the kingdom',
      'Follow a curious cat exploring a mysterious house',
      'Learn about a family of bears living in the forest',
      'Discover the adventures of a time-traveling kid'
    ],
    'Writing': [
      'Write about a day in the life of a superhero who can talk to animals',
      'Describe a magical treehouse and what happens inside',
      'Create a story about making a new friend at school',
      'Write about discovering a secret door in your room'
    ]
  }

  return examples[subject] || []
}
