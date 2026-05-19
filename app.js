const { createApp, ref, onMounted } = Vue;

createApp({
  setup() {
    const questions = ref([]);
    const currentQuestionIndex = ref(0);
    const correctAnswers = ref(0);
    const incorrectAnswers = ref(0);
    const results = ref([]);
    const isLoading = ref(true); // Флаг загрузки данных

    const shuffleArray = (array) => {
      return array.sort(() => Math.random() - 0.5);
    };

    const shuffleVariantsInQuestions = (questionsArray) => {
      return questionsArray.map(question => ({
        ...question,
        variants: shuffleArray([...question.variants])
      }));
    };

    const loadQuestions = async () => {
      try {
        const response = await fetch('questions.json');
        const data = await response.json();
        
        const shuffledQuestions = data.sort(() => Math.random() - 0.5);
        console.log(data)
        questions.value = shuffleVariantsInQuestions(shuffledQuestions.slice(0, 30));
        
      } catch (error) {
        console.error("Ошибка при загрузке вопросов:", error);
      } finally {
        isLoading.value = false;
      }
    };

    onMounted(() => {
      loadQuestions();
    });

    const checkAnswer = (variant, index) => {
      const selectedVariants = questions.value[currentQuestionIndex.value].variants.map((v, idx) => ({
        ...v,
        selected: idx === index
      }));
      
      const correctVariant = questions.value[currentQuestionIndex.value].variants.find(v => v.isCorrect);
      
      results.value.push({
        question: questions.value[currentQuestionIndex.value].question,
        variants: selectedVariants,
        isCorrect: variant.isCorrect,
        correctAnswer: correctVariant.text
      });

      if (variant.isCorrect) {
        correctAnswers.value++;
      } else {
        incorrectAnswers.value++;
      }

      currentQuestionIndex.value++;
    };

    return {
      questions,
      currentQuestionIndex,
      correctAnswers,
      incorrectAnswers,
      results,
      checkAnswer,
      isLoading
    };
  }
}).mount('#app');