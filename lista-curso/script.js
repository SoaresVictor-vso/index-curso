window.courses = [
    {
        name: "Introduction to JavaScript",
        description: "Learn the basics of JavaScript, including variables, loops, and functions.",
        author: "John Doe",
        platform: "Udemy",
        image: "https://via.placeholder.com/400x225",
    },
    {
        name: "Advanced Python",
        description: "Master Python's advanced features such as decorators, generators, and more.",
        author: "Jane Smith",
        platform: "Coursera",
        image: "https://via.placeholder.com/400x225",
    },
    {
        name: "Web Development Bootcamp",
        description: "A complete guide to building websites from scratch using HTML, CSS, and JavaScript.",
        author: "Chris Johnson",
        platform: "Skillshare",
        image: "https://via.placeholder.com/400x225",
    },
];

document.addEventListener("DOMContentLoaded", async () => {
    //buscar cursos e colocar o resultado dentro de window.courses, adaptando para seguirem o mesmo modelo de objeto;
    
    displayCourses();
})

const courseListElement = document.getElementById('course-list');
const searchInput = document.getElementById('search-input');

// Function to display courses
async function fetchCourses(filter = "") {
    try {
        // Fazendo a requisição ao servidor
        const response = await fetch('/api/courses');
        const courses = await response.json();

        // Filtrando os cursos (caso necessário)
        const filteredCourses = courses.filter(course =>
            course.name.toLowerCase().includes(filter.toLowerCase()) ||
            course.author.toLowerCase().includes(filter.toLowerCase()) ||
            course.platform.toLowerCase().includes(filter.toLowerCase())
        );

        // Renderizando os cursos na página
        displayCourses(filteredCourses);
    } catch (error) {
        console.error("Erro ao buscar os cursos:", error);
    }
}

function displayCourses(courses) {
    courseListElement.innerHTML = ""; // Limpa os cursos anteriores

    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.className = "col-md-4 mb-4";

        courseItem.innerHTML = `
            <div class="card h-100 w-90 m-auto bg-light-blue">
                <img src="${course.image}" alt="${course.name}" class="course-image">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="course-description">${course.description}</p>
                    <p class="text-muted mb-1"><strong>Author:</strong> ${course.author}</p>
                    <p class="text-muted"><strong>Platform:</strong> ${course.platform}</p>
                </div>
            </div>
        `;
        courseListElement.appendChild(courseItem);
    });
}

// Evento de busca
searchInput.addEventListener('input', () => {
    fetchCourses(searchInput.value);
});

// Carregar cursos na inicialização
fetchCourses();
