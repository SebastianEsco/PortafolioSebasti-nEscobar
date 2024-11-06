let flock = [];

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    // Crear los agentes
    for (let i = 0; i < 150; i++) {
        flock.push(new Boid(random(width), random(height)));
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight); // Cambia el tamaño del canvas si se redimensiona la ventana
}

function draw() {
    clear(); 
    background(0, 0, 0, 25);

    let maxForce = 0.2; // Valor fijo intermedio para la fuerza máxima
    let maxSpeed = 5; // Valor fijo intermedio para la velocidad máxima

    for (let boid of flock) {
        boid.edges();
        boid.flock(flock, maxForce, maxSpeed);
        boid.update();
        boid.show();
    }
}



class Boid {
    constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = p5.Vector.random2D();
        this.velocity.setMag(random(2, 4));
        this.acceleration = createVector();
        this.maxForce = 0.1;
        this.maxSpeed = 4;
        this.size = random(6, 12); // Tamaño variable de cada boid
        this.noiseOffset = random(1000); // Offset de ruido para tamaño variable
    }

    edges() {
        if (this.position.x > width) this.position.x = 0;
        if (this.position.x < 0) this.position.x = width;
        if (this.position.y > height) this.position.y = 0;
        if (this.position.y < 0) this.position.y = height;
    }

    align(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;

        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.velocity);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    separation(boids) {
        let perceptionRadius = 30;
        let steering = createVector();
        let total = 0;

        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                let diff = p5.Vector.sub(this.position, other.position);
                diff.div(d);
                steering.add(diff);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    cohesion(boids) {
        let perceptionRadius = 50;
        let steering = createVector();
        let total = 0;

        for (let other of boids) {
            let d = dist(this.position.x, this.position.y, other.position.x, other.position.y);
            if (other != this && d < perceptionRadius) {
                steering.add(other.position);
                total++;
            }
        }

        if (total > 0) {
            steering.div(total);
            steering.sub(this.position);
            steering.setMag(this.maxSpeed);
            steering.sub(this.velocity);
            steering.limit(this.maxForce);
        }
        return steering;
    }

    flock(boids, maxForce, maxSpeed) {
        this.maxForce = maxForce;
        this.maxSpeed = maxSpeed;

        let t = millis() * 0.0005;
        let sepWeight = noise(t) * 1.5 + 0.5;
        let cohWeight = noise(t + 100) * 1.5 + 0.5;
        let aliWeight = noise(t + 200) * 1.5 + 0.5;

        let alignment = this.align(boids).mult(aliWeight);
        let cohesion = this.cohesion(boids).mult(cohWeight);
        let separation = this.separation(boids).mult(sepWeight);

        this.acceleration.add(alignment);
        this.acceleration.add(cohesion);
        this.acceleration.add(separation);

        let mouseForce = createVector(mouseX - this.position.x, mouseY - this.position.y);
        let distance = mouseForce.mag();
        if (distance < 150) {
            mouseForce.setMag(map(distance, 0, 150, 0.5, 0));
            mouseForce.mult(-1);
            this.acceleration.add(mouseForce);
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxSpeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    show() {
        noStroke();
        
        // Ajustamos los colores a tonos rosados y grisáceos
        let colorFactor = map(this.velocity.mag(), 0, this.maxSpeed, 100, 200); // Control de saturación rosada
        let col = color(200, colorFactor, 180, 70);  // Color con tintes rosados y opacidad baja
    
        fill(col);
    
        // Oscilación del tamaño de los boids usando ruido Perlin
        let sizeOscillation = map(noise(this.noiseOffset), 0, 1, this.size * 0.5, this.size * 1.5);
        this.noiseOffset += 0.01;
    
        push();
        translate(this.position.x, this.position.y);
        rotate(this.velocity.heading());
        triangle(-sizeOscillation, -sizeOscillation / 2, -sizeOscillation, sizeOscillation / 2, sizeOscillation, 0);
        pop();
    }
}
