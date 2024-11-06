document.querySelectorAll('.project a').forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const particles = 10;  // Número de partículas a generar
        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');

            // Posición inicial de la partícula
            const size = Math.random() * 5 + 5; // Tamaño aleatorio
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;

            // Calculamos las posiciones de las partículas
            const rect = link.getBoundingClientRect();
            const offsetX = (Math.random() - 0.5) * 50; // Desplazamiento aleatorio
            const offsetY = (Math.random() - 0.5) * 50;

            // Atributos de la partícula
            particle.style.left = `${e.clientX - rect.left - size / 2 + offsetX}px`;
            particle.style.top = `${e.clientY - rect.top - size / 2 + offsetY}px`;

            // Establecer el movimiento de la partícula
            particle.style.setProperty('--x', `${Math.random() * 200 - 100}px`);
            particle.style.setProperty('--y', `${Math.random() * 200 - 100}px`);

            // Añadimos la partícula al enlace
            link.appendChild(particle);

            // Eliminar la partícula después de la animación
            setTimeout(() => {
                particle.remove();
            }, 500);
        }
    });
});