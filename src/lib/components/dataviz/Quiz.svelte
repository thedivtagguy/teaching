<script>
	import { onMount } from 'svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';

	export let config = {};

	let questions = [];
	let currentQuestion = 0;
	let selectedAnswers = [];
	let showResults = false;
	let score = 0;

	onMount(() => {
		if (config.questions) {
			questions = config.questions;
			selectedAnswers = new Array(questions.length).fill(null);
		}
	});

	// Reset input value when question changes
	$: if (currentQuestion !== undefined) {
		currentInputValue = '';
	}

	function selectAnswer(questionIndex, answerIndex) {
		if (selectedAnswers[questionIndex] === null || selectedAnswers[questionIndex] === undefined) {
			selectedAnswers[questionIndex] = answerIndex;
		}
	}

	let currentInputValue = '';

	function handleInputAnswer(questionIndex, value) {
		currentInputValue = value;
	}

	function submitInputAnswer(questionIndex) {
		if (selectedAnswers[questionIndex] === null || selectedAnswers[questionIndex] === undefined) {
			selectedAnswers[questionIndex] = currentInputValue;
		}
	}

	// Intelligent text comparison function
	function isTextAnswerCorrect(userAnswer, correctAnswer) {
		if (!userAnswer || !correctAnswer) return false;

		// Normalize both answers
		const normalize = (text) => {
			return text
				.toString()
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9\s]/g, '') // Remove punctuation
				.replace(/\s+/g, ' '); // Normalize whitespace
		};

		const normalizedUser = normalize(userAnswer);
		const normalizedCorrect = normalize(correctAnswer);

		// Exact match after normalization
		if (normalizedUser === normalizedCorrect) return true;

		// Check if it's a number - allow for small variations
		const userNum = parseFloat(userAnswer);
		const correctNum = parseFloat(correctAnswer);
		if (!isNaN(userNum) && !isNaN(correctNum)) {
			// Allow 5% margin for numbers
			const margin = Math.abs(correctNum) * 0.05;
			return Math.abs(userNum - correctNum) <= margin;
		}

		// Check if user answer contains all key words from correct answer
		const userWords = normalizedUser.split(' ');
		const correctWords = normalizedCorrect.split(' ');
		const keyWords = correctWords.filter((word) => word.length > 2); // Words longer than 2 chars

		if (keyWords.length > 0) {
			const matchedWords = keyWords.filter((word) => userWords.includes(word));
			// If user got 70% of key words, consider it correct
			return matchedWords.length / keyWords.length >= 0.7;
		}

		return false;
	}

	function nextQuestion() {
		if (currentQuestion < questions.length - 1) {
			currentQuestion++;
		} else {
			calculateScore();
			showResults = true;
		}
	}

	function calculateScore() {
		score = 0;
		for (let i = 0; i < questions.length; i++) {
			const question = questions[i];
			if (question.type === 'input') {
				// For input questions, use intelligent text comparison
				if (isTextAnswerCorrect(selectedAnswers[i], question.correct)) {
					score++;
				}
			} else {
				// For multiple choice questions, use exact index match
				if (selectedAnswers[i] === question.correct) {
					score++;
				}
			}
		}
	}

	function resetQuiz() {
		currentQuestion = 0;
		selectedAnswers = new Array(questions.length).fill(null);
		showResults = false;
		score = 0;
	}

	function getScoreColor(percentage) {
		if (percentage >= 80) return 'bg-green-500';
		if (percentage >= 60) return 'bg-yellow-500';
		return 'bg-red-500';
	}

	$: currentQ = questions[currentQuestion];
	$: scorePercentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
	$: answered =
		selectedAnswers[currentQuestion] !== null && selectedAnswers[currentQuestion] !== undefined;

	// Check if current question is correct (for input questions)
	$: isCurrentAnswerCorrect =
		currentQ && currentQ.type === 'input' && answered
			? isTextAnswerCorrect(selectedAnswers[currentQuestion], currentQ.correct)
			: currentQ && answered && currentQ.type !== 'input'
				? selectedAnswers[currentQuestion] === currentQ.correct
				: false;
</script>

{#if questions.length > 0}
	<div class="font-archivo mx-auto px-0">
		<Card class="border-none px-0 shadow-none">
			<CardHeader class="my-0 px-0 py-0">
				{#if config.title}
					<CardTitle class="font-libre-caslon  text-foreground mb-0 text-2xl font-bold">
						{config.title || 'Quiz'}
					</CardTitle>
				{/if}
				{#if config.description}
					<CardDescription class="font-archivo text-foreground my-0 text-base leading-6"
						>{config.description}</CardDescription
					>
				{/if}
			</CardHeader>

			<CardContent class="px-0">
				{#if !showResults}
					<!-- Question Progress -->
					<div>
						<div class="mb-3 flex items-center justify-between">
							<span class="font-archivo text-foreground text-sm font-medium"
								>Question {currentQuestion + 1} of {questions.length}</span
							>
							<Badge
								variant="default"
								class="font-fira border-foreground text-foreground  rounded-xs border text-xs"
							>
								{Math.round(((currentQuestion + 1) / questions.length) * 100)}%
							</Badge>
						</div>
						<div class="bg-base-200 border-foreground h-2 w-full overflow-hidden rounded border">
							<div
								class="bg-orange h-full transition-all duration-300"
								style="width: {((currentQuestion + 1) / questions.length) * 100}%"
							></div>
						</div>
					</div>

					<!-- Current Question -->
					{#if currentQ}
						<div class="mb-8">
							<h3 class="font-archivo text-foreground mb-6 text-lg leading-relaxed font-semibold">
								{currentQ.question}
							</h3>

							{#if currentQ.type === 'input'}
								<!-- Input Answer -->
								<div class="space-y-4">
									<div class="flex flex-col gap-2">
										<label
											class="font-archivo text-foreground text-sm font-medium"
											for="answer-input"
										>
											Your Answer:
										</label>
										<input
											id="answer-input"
											type="text"
											class="font-archivo w-full rounded-xs border-2 p-4 text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 {answered
												? isCurrentAnswerCorrect
													? 'border-green bg-green/10 text-foreground'
													: 'border-red bg-red/10 text-foreground'
												: 'border-base-300 bg-background text-foreground hover:border-foreground'}"
											value={answered ? selectedAnswers[currentQuestion] : currentInputValue}
											on:input={(e) => handleInputAnswer(currentQuestion, e.target.value)}
											on:keydown={(e) =>
												e.key === 'Enter' && !answered && submitInputAnswer(currentQuestion)}
											disabled={answered}
											placeholder={currentQ.placeholder || 'Type your answer here...'}
										/>
										{#if !answered}
											<Button
												class="bg-blue rounded-xs text-white"
												onclick={() => submitInputAnswer(currentQuestion)}
												disabled={!currentInputValue.trim()}
											>
												Submit Answer
											</Button>
										{/if}
									</div>
									{#if answered}
										<div class="flex items-center gap-2 text-sm font-medium">
											{#if isCurrentAnswerCorrect}
												<span class="text-green-600">✓ Correct!</span>
											{:else}
												<span class="text-red-600">✗ Incorrect</span>
												<span class="text-foreground opacity-75"
													>Correct answer: <strong>{currentQ.correct}</strong></span
												>
											{/if}
										</div>
									{/if}
								</div>
							{:else}
								<!-- Multiple Choice Options -->
								<div class="flex flex-col gap-3">
									{#each currentQ.options as option, index}
										<button
											class="font-archivo w-full cursor-pointer rounded-xs border p-4 text-left text-sm leading-relaxed transition-all duration-200 hover:-translate-y-0.5 hover:transform hover:shadow-sm disabled:cursor-not-allowed {selectedAnswers[
												currentQuestion
											] === index
												? answered && index === currentQ.correct
													? 'bg-green text-foreground border border-black'
													: answered && index !== currentQ.correct
														? 'bg-red border border-black text-white'
														: 'bg-blue border border-black text-white'
												: answered && index === currentQ.correct
													? 'bg-green text-foreground border border-black'
													: 'bg-background border-base-300 text-foreground hover:border-foreground'}"
											on:click={() => selectAnswer(currentQuestion, index)}
											disabled={answered}
										>
											{option}
										</button>
									{/each}
								</div>
							{/if}

							{#if answered && currentQ.explanation}
								<div
									class="bg-base-100 border-base-300 font-archivo text-foreground mt-6 rounded-xs border p-4 text-sm leading-6"
								>
									<strong class="text-foreground font-semibold">Explanation:</strong>
									{currentQ.explanation}
								</div>
							{/if}
						</div>

						<!-- Navigation -->
						<div class="mt-8 flex items-center justify-between">
							<div></div>
							<Button
								onclick={nextQuestion}
								disabled={!answered}
								variant="secondary"
								class=" rounded-xs"
							>
								{currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
							</Button>
						</div>
					{/if}
				{:else}
					<!-- Results -->
					<div class="py-8 text-center">
						<div class="mb-8 flex flex-col items-center">
							<div
								class="font-fira border-foreground mb-4 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 text-2xl font-bold text-white {getScoreColor(
									scorePercentage
								)}"
							>
								{scorePercentage}%
							</div>
							<p class="font-archivo text-foreground text-center text-lg leading-6">
								You scored <strong class="text-foreground font-semibold">{score}</strong> out of
								<strong class="text-foreground font-semibold">{questions.length}</strong>
							</p>
						</div>

						<Button
							onclick={resetQuiz}
							variant="outline"
							class="bg-background text-foreground border-foreground font-archivo hover:bg-foreground cursor-pointer rounded-xs border-2 px-6 py-2 font-medium shadow-[var(--shadow-btn-drop-shadow)] transition-all duration-200 hover:-translate-y-0.5 hover:transform hover:text-white"
						>
							Take Quiz Again
						</Button>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>
{:else}
	<Alert>
		<AlertDescription>No quiz questions found. Please check your configuration.</AlertDescription>
	</Alert>
{/if}

<style>
	/* Responsive adjustments */
	@media (max-width: 640px) {
		.max-w-2xl {
			margin: 1rem;
		}
	}
</style>
