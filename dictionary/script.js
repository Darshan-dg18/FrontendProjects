const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const result = document.getElementById('result');
const errorDiv = document.getElementById('error');
const soundButton = document.querySelector('.pronunciation');

let audio;

// Function to fetch word data
async function fetchWordData(word) {
    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
            throw new Error('Word not found');
        }
        
        const data = await response.json();
        return data[0];
    } catch (error) {
        throw error;
    }
}

// Function to display word data
function displayWordData(data) {
    result.style.display = 'block';
    errorDiv.style.display = 'none';
    
    // Word and pronunciation
    const wordElement = document.querySelector('.word');
    const wordTypeElement = document.querySelector('.word-type');
    const pronunciationElement = document.querySelector('.word-pronunciation');
    
    wordElement.textContent = data.word;
    wordTypeElement.textContent = data.meanings[0].partOfSpeech || '';
    pronunciationElement.textContent = data.phonetic || '';
    
    // Set up audio
    if (data.phonetics && data.phonetics.length > 0) {
        const phoneticWithAudio = data.phonetics.find(p => p.audio);
        if (phoneticWithAudio) {
            audio = new Audio(phoneticWithAudio.audio);
            soundButton.style.display = 'block';
        } else {
            soundButton.style.display = 'none';
        }
    } else {
        soundButton.style.display = 'none';
    }
    
    // Meanings
    const meaningDiv = document.querySelector('.word-meaning');
    meaningDiv.innerHTML = '<h3>Meaning:</h3>';
    
    const definitions = data.meanings[0].definitions;
    definitions.forEach((def, index) => {
        if (index < 3) { // Show only first 3 definitions
            const p = document.createElement('p');
            p.textContent = `${index + 1}. ${def.definition}`;
            meaningDiv.appendChild(p);
        }
    });
    
    // Example
    const exampleDiv = document.querySelector('.word-example');
    const firstExample = definitions[0].example;
    
    if (firstExample) {
        exampleDiv.innerHTML = `
            <h3>Example:</h3>
            <p>${firstExample}</p>
        `;
        exampleDiv.style.display = 'block';
    } else {
        exampleDiv.style.display = 'none';
    }
    
    // Synonyms
    const synonymsDiv = document.querySelector('.synonyms');
    const synonyms = data.meanings[0].synonyms;
    
    if (synonyms && synonyms.length > 0) {
        synonymsDiv.innerHTML = `
            <h3>Synonyms:</h3>
            <div class="synonyms-list">
                ${synonyms.slice(0, 5).map(syn => `<span class="synonym-item">${syn}</span>`).join('')}
            </div>
        `;
        synonymsDiv.style.display = 'block';
    } else {
        synonymsDiv.style.display = 'none';
    }
}

// Function to handle search
async function handleSearch() {
    const word = searchInput.value.trim();
    
    if (!word) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Please enter a word';
        result.style.display = 'none';
        return;
    }
    
    try {
        const wordData = await fetchWordData(word);
        displayWordData(wordData);
    } catch (error) {
        result.style.display = 'none';
        errorDiv.style.display = 'block';
        errorDiv.textContent = 'Could not find the word. Please try another word.';
    }
}

// Event listeners
searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

soundButton.addEventListener('click', () => {
    if (audio) {
        audio.play();
    }
});
