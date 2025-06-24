
      // Game configuration
      const difficultySettings = {
        easy: {
          words: [
            "sun",
            "dog",
            "cat",
            "run",
            "play",
            "fun",
            "day",
            "cool",
            "nice",
            "happy",
            "book",
            "walk",
            "talk",
            "sing",
            "jump",
            "love",
            "kind",
            "help",
            "hope",
            "life",
            "good",
            "time",
            "year",
            "hand",
            "work",
            "home",
            "food",
            "water",
            "light",
            "dark",
          ],
          timePerWord: 5,
          label: "Easy",
        },
        medium: {
          words: [
            "garden",
            "picture",
            "kitchen",
            "window",
            "travel",
            "yellow",
            "number",
            "program",
            "amazing",
            "important",
            "building",
            "computer",
            "keyboard",
            "freedom",
            "mountain",
            "creative",
            "language",
            "happiness",
            "learning",
            "example",
            "question",
            "awesome",
            "beautiful",
            "consider",
            "different",
            "exercise",
            "favorite",
            "together",
            "vacation",
            "solution",
          ],
          timePerWord: 7,
          label: "Medium",
        },
        hard: {
          words: [
            "accomplishment",
            "sophisticated",
            "determination",
            "responsibility",
            "concentration",
            "extraordinary",
            "appreciation",
            "collaboration",
            "enthusiastic",
            "fascinating",
            "revolutionary",
            "philosophical",
            "development",
            "opportunity",
            "intelligence",
            "organization",
            "comfortable",
            "understand",
            "personality",
            "experience",
            "technology",
            "environment",
            "information",
            "mathematics",
            "programming",
            "inspiration",
            "vocabulary",
            "absolutely",
            "immediately",
            "consideration",
          ],
          timePerWord: 10,
          label: "Hard",
        },
      };

      // DOM elements
      const tabTriggers = document.querySelectorAll(".tab-trigger");
      const tabContents = document.querySelectorAll(".tab-content");
      const startButton = document.getElementById("start-button");
      const endButton = document.getElementById("end-button");
      const pauseButton = document.getElementById("pause-button");
      const resumeButton = document.getElementById("resume-button");
      const currentWordElement = document.getElementById("current-word");
      const wordInput = document.getElementById("word-input");
      const gameArea = document.getElementById("game-area");
      const gameOver = document.getElementById("game-over");
      const introScreen = document.getElementById("intro-screen");
      const timerContainer = document.getElementById("timer-container");
      const timeLeftElement = document.getElementById("time-left");
      const progressBar = document.getElementById("progress-bar");
      const scoreElement = document.getElementById("score");
      const wpmElement = document.getElementById("wpm");
      const accuracyElement = document.getElementById("accuracy");
      const wordsCountElement = document.getElementById("words-count");
      const comboDisplay = document.getElementById("combo-display");
      const comboCount = document.getElementById("combo-count");
      const highScoreElement = document.getElementById("high-score");
      const finalScoreElement = document.getElementById("final-score");
      const finalWpmElement = document.getElementById("final-wpm");
      const finalAccuracyElement = document.getElementById("final-accuracy");
      const maxComboElement = document.getElementById("max-combo");
      const correctWordsElement = document.getElementById("correct-words");
      const newHighScoreElement = document.getElementById("new-high-score");
      const newHighScoreValueElement = document.getElementById(
        "new-high-score-value"
      );
      const themeToggle = document.getElementById("theme-toggle");
      const themeIcon = document.getElementById("theme-icon");
      const pauseOverlay = document.getElementById("pause-overlay");
      const homeButton = document.getElementById("home-button");
      const soundControl = document.getElementById("sound-control");

      // Audio elements
      const correctSound = document.getElementById("correct-sound");
      const wrongSound = document.getElementById("wrong-sound");
      const gameOverSound = document.getElementById("game-over-sound");
      const comboSound = document.getElementById("combo-sound");
      const clickSound = document.getElementById("click-sound");

      // Game state
      let currentDifficulty = "easy";
      let gameStarted = false;
      let gameEnded = false;
      let gamePaused = false;
      let currentWord = "";
      let score = 0;
      let combo = 0;
      let maxCombo = 0;
      let wordsTyped = 0;
      let correctWords = 0;
      let timeLeft = 0;
      let timerInterval = null;
      let startTime = 0;
      let wpm = 0;
      let accuracy = 100;
      let streak = 0;
      let highScore = localStorage.getItem("typingHighScore")
        ? parseInt(localStorage.getItem("typingHighScore"))
        : 0;
      let soundEnabled = true;

      // Initialize the game
      function init() {
        highScoreElement.textContent = highScore;

        // Set up tab switching
        tabTriggers.forEach((tab) => {
          tab.addEventListener("click", () => {
            if (gameStarted) {
              showToast(
                "Please end the current game before changing difficulty.",
                "info"
              );
              return;
            }

            const tabName = tab.dataset.tab;
            setDifficulty(tabName);
          });
        });

        // Set up event listeners
        startButton.addEventListener("click", startGame);
        endButton.addEventListener("click", endGame);
        pauseButton.addEventListener("click", pauseGame);
        resumeButton.addEventListener("click", resumeGame);
        wordInput.addEventListener("input", handleInput);

        // Theme toggle
        themeToggle.addEventListener("click", toggleTheme);

        // Home button
        homeButton.addEventListener("click", goHome);

        // Sound control
        soundControl.addEventListener("click", toggleSound);

        // Check if user prefers dark mode
        if (
          localStorage.getItem("theme") === "dark" ||
          (window.matchMedia("(prefers-color-scheme: dark)").matches &&
            !localStorage.getItem("theme"))
        ) {
          document.body.classList.add("dark");
          updateThemeIcon(true);
        } else {
          updateThemeIcon(false);
        }

        // Check if sound is disabled
        if (localStorage.getItem("soundDisabled") === "true") {
          soundEnabled = false;
          updateSoundIcon(false);
        }
      }

      // Toggle sound
      function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem("soundDisabled", !soundEnabled);
        updateSoundIcon(soundEnabled);
        playSound(clickSound);
        showToast(`Sound ${soundEnabled ? "enabled" : "disabled"}`, "info");
      }

      // Update sound icon
      function updateSoundIcon(isEnabled) {
        if (isEnabled) {
          soundControl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
          </svg>
        `;
        } else {
          soundControl.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="22" y1="9" x2="16" y2="15"></line>
            <line x1="16" y1="9" x2="22" y2="15"></line>
          </svg>
        `;
        }
      }

      // Go to the home/beginning state
      function goHome() {
        // If a game is in progress, end it first
        if (gameStarted) {
          endGame();
        }

        // Reset UI to initial state
        gameArea.style.display = "none";
        gameOver.style.display = "none";
        introScreen.style.display = "block";
        startButton.style.display = "inline-flex";
        startButton.textContent = "Start Game";
        startButton.innerHTML =
          'Start Game <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';
        pauseButton.style.display = "none";
        endButton.style.display = "none";
        timerContainer.style.display = "none";

        // Enable tab changes
        tabTriggers.forEach((tab) => {
          tab.disabled = false;
        });

        playSound(clickSound);
        showToast("Back to home screen", "info");
      }

      // Play sound if enabled
      function playSound(audioElement) {
        if (soundEnabled) {
          audioElement.currentTime = 0;
          audioElement
            .play()
            .catch((e) => console.error("Audio play error:", e));
        }
      }

      // Pause the game
      function pauseGame() {
        if (!gameStarted || gameEnded || gamePaused) return;

        gamePaused = true;

        // Stop the timer
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }

        // Show pause overlay
        pauseOverlay.style.display = "flex";

        // Update buttons
        pauseButton.style.display = "none";

        // Add animation
        currentWordElement.classList.add("bounce");
        setTimeout(() => {
          currentWordElement.classList.remove("bounce");
        }, 500);

        playSound(clickSound);
        showToast("Game paused", "info");
      }

      // Resume the game
      function resumeGame() {
        if (!gamePaused) return;

        gamePaused = false;

        // Hide pause overlay
        pauseOverlay.style.display = "none";

        // Restore buttons
        pauseButton.style.display = "inline-flex";

        // Restart the timer
        startTimer();

        // Focus on input
        wordInput.focus();

        playSound(clickSound);
        showToast("Game resumed", "info");
      }

      // Toggle theme between light and dark mode
      function toggleTheme() {
        const isDarkMode = document.body.classList.contains("dark");
        document.body.classList.toggle("dark");

        // Save preference to localStorage
        if (isDarkMode) {
          localStorage.setItem("theme", "light");
        } else {
          localStorage.setItem("theme", "dark");
        }

        updateThemeIcon(!isDarkMode);
        playSound(clickSound);
      }

      // Update theme icon based on current theme
      function updateThemeIcon(isDarkMode) {
        if (isDarkMode) {
          themeIcon.innerHTML = `
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        `;
        } else {
          themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        `;
        }
      }

      // Set difficulty level
      function setDifficulty(difficulty) {
        // Reset tab states
        tabTriggers.forEach((tab) => {
          tab.setAttribute("aria-selected", "false");
        });

        tabContents.forEach((content) => {
          content.dataset.state = "inactive";
          content.style.display = "none";
        });

        // Set active tab
        document
          .getElementById(`tab-${difficulty}`)
          .setAttribute("aria-selected", "true");
        const activeContent = document.querySelector(
          `.tab-content[data-tab="${difficulty}"]`
        );
        activeContent.dataset.state = "active";
        activeContent.style.display = "block";

        currentDifficulty = difficulty;
        playSound(clickSound);
      }

      // Start the game
      function startGame() {
        gameStarted = true;
        gameEnded = false;
        gamePaused = false;
        score = 0;
        combo = 0;
        maxCombo = 0;
        wordsTyped = 0;
        correctWords = 0;
        wpm = 0;
        accuracy = 100;
        streak = 0;
        startTime = Date.now();

        // Update UI
        startButton.style.display = "none";
        pauseButton.style.display = "inline-flex";
        endButton.style.display = "inline-flex";
        introScreen.style.display = "none";
        gameArea.style.display = "block";
        gameOver.style.display = "none";
        timerContainer.style.display = "flex";
        pauseOverlay.style.display = "none";

        // Disable tab changes
        tabTriggers.forEach((tab) => {
          tab.disabled = true;
        });

        // Update stats display
        updateStats();

        // Get first word and start timer
        getNewWord();

        // Focus on input
        wordInput.focus();

        playSound(clickSound);
        showToast("Game started! Type the words as fast as you can.", "info");
      }

      // Get a new word to type
      function getNewWord() {
        const words = difficultySettings[currentDifficulty].words;
        const randomIndex = Math.floor(Math.random() * words.length);
        currentWord = words[randomIndex];

        // Display the word with character highlighting
        renderCurrentWord();

        // Reset input and timer
        wordInput.value = "";
        timeLeft = difficultySettings[currentDifficulty].timePerWord;

        // Update UI
        timeLeftElement.textContent = timeLeft.toFixed(1) + "s";
        progressBar.style.width = "100%";
        progressBar.className = "progress-indicator green";

        // Start new timer
        startTimer();
      }

      // Start the timer
      function startTimer() {
        // Clear previous timer if exists
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        // Start new timer
        timerInterval = setInterval(() => {
          timeLeft -= 0.1;

          // Update timer display and progress bar
          timeLeftElement.textContent = Math.max(0, timeLeft).toFixed(1) + "s";
          const progressPercent = Math.max(
            (timeLeft / difficultySettings[currentDifficulty].timePerWord) *
              100,
            0
          );
          progressBar.style.width = progressPercent + "%";

          // Update progress bar color
          if (progressPercent < 30) {
            progressBar.className = "progress-indicator red";
          } else if (progressPercent < 60) {
            progressBar.className = "progress-indicator orange";
          } else {
            progressBar.className = "progress-indicator green";
          }

          // Check if time is up
          if (timeLeft <= 0) {
            handleTimeout();
          }
        }, 100);
      }

      // Render current word with character highlighting
      function renderCurrentWord() {
        currentWordElement.innerHTML = "";

        const userInput = wordInput ? wordInput.value : "";

        for (let i = 0; i < currentWord.length; i++) {
          const charSpan = document.createElement("span");
          charSpan.textContent = currentWord[i];
          charSpan.className = "character";

          if (i < userInput.length) {
            if (userInput[i].toLowerCase() === currentWord[i].toLowerCase()) {
              charSpan.className += " character-correct";
            } else {
              charSpan.className += " character-incorrect";
            }
          }

          currentWordElement.appendChild(charSpan);
        }
      }

      // Handle input changes
      function handleInput(e) {
        if (gamePaused) return;

        const userInput = e.target.value;

        // Update the word display with highlighting
        renderCurrentWord();

        // Check if word is complete and correct
        if (userInput.toLowerCase() === currentWord.toLowerCase()) {
          // Calculate points and update stats
          const earnedPoints = calculatePoints();
          score += earnedPoints;
          combo++;
          maxCombo = Math.max(maxCombo, combo);
          wordsTyped++;
          correctWords++;
          streak++;

          // Add animation
          currentWordElement.classList.add("bounce");
          setTimeout(() => {
            currentWordElement.classList.remove("bounce");
          }, 500);

          // Check for new high score
          if (score > highScore) {
            highScore = score;
            localStorage.setItem("typingHighScore", highScore.toString());
            highScoreElement.textContent = highScore;
            showToast("New high score!", "success");
          }

          // Update stats display
          updateStats();

          // Show combo if greater than 1
          if (combo > 1) {
            comboDisplay.style.display = "flex";
            comboCount.textContent = `x${combo}`;
          } else {
            comboDisplay.style.display = "none";
          }

          // Play sound effect
          playSound(correctSound);

          // Show streak messages
          if (streak === 3) {
            showToast("3 in a row! Keep going!", "success");
            playSound(comboSound);
          } else if (streak === 5) {
            showToast("5 in a row! You're on fire!", "success");
            playSound(comboSound);
          } else if (streak === 10) {
            showToast("10 in a row! Incredible!", "success");
            playSound(comboSound);
          } else if (combo > 0 && combo % 5 === 0) {
            showToast(`Combo x${combo}!`, "success");
            playSound(comboSound);
          }

          // Get a new word
          getNewWord();
        }
      }

      // Handle timeout (when time runs out for current word)
      function handleTimeout() {
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }

        // Reset combo
        combo = 0;
        comboDisplay.style.display = "none";

        // Update stats
        wordsTyped++;
        updateStats();

        // Reset streak
        if (streak > 0) {
          playSound(wrongSound);
          showToast("Time's up! Combo lost.", "error");
          streak = 0;
        }

        // Get a new word
        getNewWord();
      }

      // Calculate points based on word length, time left, and combo
      function calculatePoints() {
        const basePoints = currentWord.length * 5;
        const timeBonus = Math.round(timeLeft * 2);
        const comboMultiplier = combo >= 10 ? 3 : combo >= 5 ? 2 : 1;

        return (basePoints + timeBonus) * comboMultiplier;
      }

      // Update game statistics
      function updateStats() {
        scoreElement.textContent = score;

        // Calculate WPM
        if (correctWords > 0) {
          const elapsedMinutes = (Date.now() - startTime) / 60000;
          wpm = Math.round(correctWords / elapsedMinutes);
          wpmElement.textContent = wpm;
        }

        // Calculate accuracy
        if (wordsTyped > 0) {
          accuracy = Math.round((correctWords / wordsTyped) * 100);
          accuracyElement.textContent = accuracy + "%";
        }

        // Update words counter
        wordsCountElement.textContent = correctWords + "/" + wordsTyped;
      }

      // End the game
      function endGame() {
        gameStarted = false;
        gameEnded = true;
        gamePaused = false;

        // Clear timer
        if (timerInterval) {
          clearInterval(timerInterval);
          timerInterval = null;
        }

        // Update UI
        startButton.style.display = "inline-flex";
        startButton.textContent = "Play Again";
        startButton.innerHTML =
          'Play Again <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>';

        pauseButton.style.display = "none";
        endButton.style.display = "none";
        gameArea.style.display = "none";
        gameOver.style.display = "block";
        timerContainer.style.display = "none";
        pauseOverlay.style.display = "none";

        // Enable tab changes
        tabTriggers.forEach((tab) => {
          tab.disabled = false;
        });

        // Calculate final stats
        const elapsedMinutes = (Date.now() - startTime) / 60000;
        const finalWpm = Math.round(correctWords / elapsedMinutes || 0);
        const finalAccuracy =
          Math.round((correctWords / wordsTyped) * 100) || 0;

        // Update game over screen
        finalScoreElement.textContent = score;
        finalWpmElement.textContent = finalWpm;
        finalAccuracyElement.textContent = finalAccuracy + "%";
        maxComboElement.textContent = maxCombo + "x";
        correctWordsElement.textContent = correctWords;

        // Show new high score if applicable
        if (score >= highScore) {
          newHighScoreElement.style.display = "flex";
          newHighScoreValueElement.textContent = score;
        } else {
          newHighScoreElement.style.display = "none";
        }

        playSound(gameOverSound);
        showToast("Game over!", "info");
      }

      // Show toast notification
      function showToast(message, type = "info") {
        const toastContainer = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        toastContainer.appendChild(toast);

        // Auto remove toast after 3 seconds
        setTimeout(() => {
          toast.style.animation = "slideOut 0.3s forwards";
          setTimeout(() => {
            toastContainer.removeChild(toast);
          }, 300);
        }, 3000);
      }

      // Add keyboard shortcut for pause/resume
      document.addEventListener("keydown", (e) => {
        // If Escape key is pressed and game is running
        if (e.key === "Escape" && gameStarted && !gameEnded) {
          if (gamePaused) {
            resumeGame();
          } else {
            pauseGame();
          }
        }
      });

      // Initialize the game on load
      window.addEventListener("load", init);
