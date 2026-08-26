const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 14;
const cellsVertical = 10;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: document.getElementById('maze-container'),
    engine: engine,
    options: {
        wireframes: false,
        width,
        height,
        background: '#1b1f27'
    }
});
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

// Walls (granice planszy)
const wallThickness = 6;
const borders = [
    Bodies.rectangle(width / 2, 0, width, wallThickness, { isStatic: true, render: { fillStyle: '#ecf0f1' } }),
    Bodies.rectangle(width / 2, height, width, wallThickness, { isStatic: true, render: { fillStyle: '#ecf0f1' } }),
    Bodies.rectangle(0, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#ecf0f1' } }),
    Bodies.rectangle(width, height / 2, wallThickness, height, { isStatic: true, render: { fillStyle: '#ecf0f1' } })
];
World.add(world, borders);

// ===== Generowanie labiryntu =====
const shuffle = arr => {
    let counter = arr.length;
    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);
        counter--;
        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
};

const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
    if (grid[row][column]) {
        return;
    }
    grid[row][column] = true;

    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);

    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;

        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            continue;
        }
        if (grid[nextRow][nextColumn]) {
            continue;
        }

        if (direction === 'left') {
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }

        stepThroughCell(nextRow, nextColumn);
    }
};

stepThroughCell(startRow, startColumn);

const wallColor = '#34495e';

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            {
                label: 'wall',
                isStatic: true,
                render: { fillStyle: wallColor }
            }
        );
        World.add(world, wall);
    });
});

verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            {
                label: 'wall',
                isStatic: true,
                render: { fillStyle: wallColor }
            }
        );
        World.add(world, wall);
    });
});

// Cel (meta)
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * 0.6,
    unitLengthY * 0.6,
    {
        label: 'goal',
        isStatic: true,
        render: { fillStyle: '#2ecc71' }
    }
);
World.add(world, goal);

// Kulka
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: 'ball',
        frictionAir: 0.06,
        render: { fillStyle: '#e74c3c' }
    }
);
World.add(world, ball);

// Sterowanie WASD / strzałki / wirtualny D-pad
let won = false;

const DIRS = {
    up:    { x: 0,  y: -5 },
    down:  { x: 0,  y: 5  },
    left:  { x: -5, y: 0  },
    right: { x: 5,  y: 0  }
};

const applyImpulse = dir => {
    if (won) return;
    const { x, y } = ball.velocity;
    const d = DIRS[dir];
    Body.setVelocity(ball, { x: x + d.x, y: y + d.y });
};

document.addEventListener('keydown', event => {
    if (event.keyCode === 87 || event.keyCode === 38) applyImpulse('up');     // W / Up
    if (event.keyCode === 68 || event.keyCode === 39) applyImpulse('right');  // D / Right
    if (event.keyCode === 83 || event.keyCode === 40) applyImpulse('down');   // S / Down
    if (event.keyCode === 65 || event.keyCode === 37) applyImpulse('left');   // A / Left
});

// Wirtualny D-pad – przytrzymanie przycisku daje powtarzane impulsy,
// tak jak przytrzymanie klawisza na klawiaturze.
const touchIntervals = {};
document.querySelectorAll('.touch-controls button').forEach(btn => {
    const dir = btn.dataset.dir;

    const start = e => {
        e.preventDefault();
        applyImpulse(dir);
        clearInterval(touchIntervals[dir]);
        touchIntervals[dir] = setInterval(() => applyImpulse(dir), 120);
    };
    const stop = e => {
        if (e) e.preventDefault();
        clearInterval(touchIntervals[dir]);
    };

    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointercancel', stop);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('contextmenu', e => e.preventDefault());
});

// Warunek wygranej
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ['ball', 'goal'];
        if (
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label) &&
            !won
        ) {
            won = true;
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});

document.getElementById('mazeReplayBtn').addEventListener('click', () => {
    window.location.reload();
});
document.getElementById('mazeCloseBtn').addEventListener('click', () => {
    // Jeśli labirynt jest w iframe modala (na stronie głównej), poproś rodzica o zamknięcie.
    // Jeśli jest otwarty samodzielnie (np. wpisany w przeglądarce), spróbuj zamknąć okno.
    if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'closeMaze' }, '*');
    } else {
        window.close();
    }
});
