---
title: Node.js & npm Quiz
description: Test your understanding of Node.js, npm, and package managers
date: 2025-07-17
section: appendix
order: 1
skip_menu: true
updated: 2025-07-17T22:24
---

# Node.js & npm Quiz


<script>
  import Quiz from '$lib/components/dataviz/Quiz.svelte';
  
  const quizConfig = {
    description: "Test your understanding of Node.js, npm, and package managers",
    questions: [
      {
        question: "What command do you run to install all packages listed in your project's package.json?",
        type: "input",
        correct: "npm install",
        placeholder: "Type the command...",
        explanation: "npm install (or pnpm install) downloads all packages listed in your project's package.json file. This is the first thing you run when setting up a new project."
      },
      {
        question: "How do you install pnpm globally on your computer?",
        type: "input",
        correct: "npm install -g pnpm",
        placeholder: "Type the command...",
        explanation: "npm install -g pnpm installs pnpm globally using npm. The -g flag makes it available system-wide, not just in the current project."
      },
      {
        question: "What command would you run to start a development server (assuming it's configured in package.json)?",
        type: "input",
        correct: "npm run dev",
        placeholder: "Type the command...",
        explanation: "npm run dev (or pnpm run dev) runs the 'dev' script defined in your package.json. This typically starts a development server for your project."
      },
      {
        question: "Which of these desktop applications were built with Node.js?",
        options: [
          "Microsoft Word and Excel",
          "Discord, WhatsApp Desktop, and VS Code",
          "Photoshop and Illustrator",
          "Chrome and Firefox"
        ],
        correct: 1,
        explanation: "Discord, WhatsApp Desktop, Figma Desktop, and VS Code are all built with Node.js technologies like Electron, showing how JavaScript can create desktop applications."
      },
      {
        question: "What's the main advantage of pnpm over npm?",
        options: [
          "It has completely different commands",
          "It's faster and uses less disk space",
          "It only works with specific frameworks",
          "It's more secure than npm"
        ],
        correct: 1,
        explanation: "pnpm is faster and uses less disk space because it downloads packages once and shares them between projects, rather than downloading separate copies for each project like npm does."
      },
      {
        question: "Before Node.js existed, where could JavaScript code run?",
        options: [
          "Only in web browsers",
          "On any computer or server",
          "Only on mobile devices",
          "Only in desktop applications"
        ],
        correct: 0,
        explanation: "Before Node.js, JavaScript could only run inside web browsers. Node.js changed everything by allowing JavaScript to run directly on computers and servers."
      },
      {
        question: "What does the analogy compare packages to?",
        options: [
          "Puzzle pieces",
          "LEGO blocks",
          "Recipe ingredients",
          "Car parts"
        ],
        correct: 1,
        explanation: "The slides compare packages to LEGO blocks - they're small pieces of code that do specific things, and you combine them to build larger applications."
      },
      {
        question: "If you want to install a package called 'express' for your entire computer (not just current project), what command would you use?",
        type: "input",
        correct: "npm install -g express",
        placeholder: "Type the command...",
        explanation: "npm install -g express installs the express package globally (-g flag) so it's available anywhere on your computer, not just in the current project folder."
      }
    ]
  };
</script>

<Quiz config={quizConfig} />