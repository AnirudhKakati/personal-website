// Global variables
let isDarkMode = false;

// Header Scroll Effect
const header = document.getElementById('header');
window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', function() {
    navLinks.classList.add('active');
});

// Dark Mode Toggle
const modeToggle = document.querySelector('.mode-toggle');
const body = document.body;

modeToggle.addEventListener('click', function() {
    isDarkMode = !isDarkMode;
    body.classList.toggle('dark-mode');
    
    if (isDarkMode) {
        modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Update hero visualization colors if it exists
    if (typeof updateVisualizationColors === 'function') {
        updateVisualizationColors();
    }
});

// Skill Categories Filter
const skillCategories = document.querySelectorAll('.skill-category');
const skillItems = document.querySelectorAll('.skill-item');

skillCategories.forEach(category => {
    category.addEventListener('click', function() {
        const selectedCategory = this.dataset.category;
        
        // Update active class for buttons
        skillCategories.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter skill items
        skillItems.forEach(item => {
            if (selectedCategory === 'all' || item.dataset.category === selectedCategory) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Publication Abstract Toggle
const publicationCards = document.querySelectorAll('.publication-card');

publicationCards.forEach(card => {
    const toggleBtn = card.querySelector('.publication-toggle');
    
    toggleBtn.addEventListener('click', function() {
        card.classList.toggle('expanded');
        
        if (card.classList.contains('expanded')) {
            this.innerHTML = 'Hide Abstract <i class="fas fa-chevron-up"></i>';
        } else {
            this.innerHTML = 'Show Abstract <i class="fas fa-chevron-down"></i>';
        }
    });
});


const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    emailjs.sendForm('service_67sf6xu', 'template_t28ffdu', this)
      .then(() => {
        alert('Message sent successfully!');
        contactForm.reset();
      }, (error) => {
        alert('Oops, something went wrong');
        console.error(error);
      });
  });
}

// Background Particles
function createParticles() {
    const particleCount = 30;
    const colors = isDarkMode ? ['#0b8a9d', '#0a2342', '#f68e1f'] : ['#0b8a9d', '#0a2342', '#f68e1f'];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size between 5 and 15px
        const size = Math.random() * 10 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Random color
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.2 + 0.1;
        
        // Add to body
        document.body.appendChild(particle);
        
        // Animate
        animateParticle(particle);
    }
}

function animateParticle(particle) {
    const duration = Math.random() * 20 + 20; // 20-40 seconds
    particle.style.transition = `transform ${duration}s linear`;
    
    moveParticle(particle);
    
    // Continue animation
    setInterval(() => moveParticle(particle), duration * 1000);
}

function moveParticle(particle) {
    const xMove = Math.random() * 100 - 50; // -50 to 50
    const yMove = Math.random() * 100 - 50; // -50 to 50
    particle.style.transform = `translate(${xMove}vw, ${yMove}vh)`;
}

// Create data visualization for hero section
function createHeroVisualization() {
    const container = document.getElementById('hero-visualization');
    if (!container) return;
    
    // Clear previous SVG if any
    container.innerHTML = '';
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create data nodes (representing data points)
    const dataNodes = [];
    for (let i = 0; i < 30; i++) {
        dataNodes.push({
            id: i,
            group: Math.floor(Math.random() * 5)
        });
    }
    
    // Create links between nodes
    const links = [];
    for (let i = 0; i < dataNodes.length; i++) {
        const numLinks = Math.floor(Math.random() * 3) + 1;
        for (let j = 0; j < numLinks; j++) {
            const target = Math.floor(Math.random() * dataNodes.length);
            if (target !== i) {
                links.push({
                    source: i,
                    target: target,
                    value: Math.random()
                });
            }
        }
    }
    
    // Set up force simulation
    const simulation = d3.forceSimulation(dataNodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(50))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Add links
    const link = svg.append('g')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke', isDarkMode ? '#3a506b' : '#0b8a9d')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => Math.sqrt(d.value) * 2);
    
    // Define color scale for nodes
    const color = d3.scaleOrdinal()
        .domain([0, 1, 2, 3, 4])
        .range(['#0a2342', '#0b8a9d', '#f68e1f', '#5c946e', '#a288e3']);
    
    // Add nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(dataNodes)
        .enter()
        .append('circle')
        .attr('r', 5)
        .attr('fill', d => color(d.group))
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    // Add animation to the nodes
    node.append('title')
        .text(d => `Node ${d.id}`);
    
    // Update positions on each tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
    
    // Drag functions
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    
    // Function to update colors when toggling dark/light mode
    window.updateVisualizationColors = function() {
        link.attr('stroke', isDarkMode ? '#3a506b' : '#0b8a9d');
    };
}

// Initialize particles and visualization
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    createHeroVisualization();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
})