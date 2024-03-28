const triviaContainer = document.getElementById('questions');
const scoreContainer = document.getElementById('score');
let score = 0;

async function generateTrivia() {
    const difficulty = document.getElementById('difficulty').value;
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    const apiUrl = `https://opentdb.com/api.php?amount=10&difficulty=${difficulty}&type=${type}&category=${category}`;

    // Reiniciar puntaje al generar nueva trivia
    score = 50;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        displayQuestions(data.results);
    } catch (error) {
        console.error('Error fetching trivia:', error);
    }
} 

function displayQuestions(questions) {
    triviaContainer.innerHTML = '';
    scoreContainer.innerHTML = '';

    // Calcular puntaje máximo posible
    const maxScore = questions.length * 10;

    // Actualizar la interfaz de usuario con el puntaje máximo
    scoreContainer.innerHTML = `<p>Puntaje máximo:${maxScore}</p>`;

    questions.forEach((question,index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <h3>Pregunta${index + 1}:</h3>
            <p>${question.question}</p>
            ${displayAnswers(question)}
        `;
        triviaContainer.appendChild(questionElement);
    });
}

function displayAnswers(question) {
    let answers = '';

    if (question.type === 'multiple') {
        answers = question.incorrect_answers.map(answer => `
            <input type="radio" name="question${question.question}" value="${answer}">
            <label>${answer}</label><br>
        `).join('');
        answers += `
            <input type="radio" name="question${question.question}" value="${question.correct_answer}">
            <label>${question.correct_answer}</label><br>
        `;
    } else {
        answers = `
            <input type="radio" name="question${question.question}" value="True">
            <label>Verdadero</label><br>
            <input type="radio" name="question${question.question}" value="False">
            <label>Falso</label><br>
        `;
    }

    // Event listener para comprobar respuesta y actualizar puntaje
    const answerInputs = document.querySelectorAll(`input[name="question${question.question}"]`);
    answerInputs.forEach(input => {
        input.addEventListener('change', () => {
            const selectedAnswer = input.value;
            console.log(score);
            if (selectedAnswer == question.correct_answer) {
                score += 10; // Sumar 100 puntos por respuesta correcta
                 
            }
        });
    });

    return answers;
} 



function resetTrivia() {
    triviaContainer.innerHTML = '';

    // Mostrar puntaje final al reiniciar la trivia
    scoreContainer.innerHTML += `<p>Puntaje final: ${score}</p>`;
}

// Cargar categorías al cargar la página
window.addEventListener('load', async () => {
    const categoriesResponse = await fetch('https://opentdb.com/api_category.php');
    const categoriesData = await categoriesResponse.json();
    const categorySelect = document.getElementById('category');

    categoriesData.trivia_categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
});