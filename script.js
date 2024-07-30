SIZE = 25;

function pop(parentObj) {

    if (DATA.sun > 100) {
        addSun(-100);
        refreshUI();
    } else {
        // return;
    }

    const obj = createObject({ id: "carrots", stage: 1, x: parentObj.getX(), y: parentObj.getY() });

    const life = 10 + Math.random() * 10;
    let i = 0;
    let velX = -4 + Math.random() * 8, velY = -12 - Math.random() * 3;
    let accX = 0, accY = 1;
    let interval = setInterval(() => {
        obj.setX(obj.getX() + velX);
        obj.setY(obj.getY() + velY);
        velX += accX;
        velY += accY;
        i++;
        if (i > life) clearInterval(interval);
    }, 1000 / 60);
}

function tryJoinObjects(obj1, obj2) {

    const id = obj1.getId();
    const stage = obj1.getStage();
    const id2 = obj2.getId();
    const stage2 = obj2.getStage();
    const maxStage = DEFINITIONS[id].maxStage;

    if (id !== id2 || stage !== stage2 || stage >= maxStage + 3) return;

    obj1.remove();
    obj2.remove();

    createObject({ id, stage: stage + 1, x: obj1.getX(), y: obj1.getY() });
}

function createObject({ id, stage, x, y }) {
    const { images, maxStage, onClick } = DEFINITIONS[id];
    const color = DEFINITIONS[id].color ?? "00000000";
    const obj = $(`
    <div class="obj" style="width: ${SIZE}vw; height: ${SIZE}vw; background-color:#${color};">
        <img class="img" src="images/${images[Math.min(stage, maxStage) - 1] ?? id}.png">
    </div>`);
    if (stage > maxStage)
        obj.append($(`<img class="star" src="images/star_${stage - maxStage}.png" >`))
    obj.attr('id', id);
    obj.attr('stage', stage);

    if (onClick) obj.on('click', () => onClick(obj));
    $('body').append(obj);

    obj.draggable({
        drag: (event, ui) => obj.css('z-index', 20000),
        stop: (event, ui) => obj.css('z-index', 10000 + obj.getY()),
    });

    obj.droppable({
        refreshPositions: true,
        greedy: true,
        tolerance: "touch",
        drop: function (event, ui) {
            var draggedElement = ui.draggable;
            var droppedElement = $(this);
            obj.droppable('option', 'accept', draggedElement);
            return tryJoinObjects(draggedElement, droppedElement);
        },
    });

    if (x) obj.setX(x); else obj.setX((50 - SIZE / 2) + 'vw');
    if (y) obj.setY(y); else obj.setY((50 - SIZE / 2) + 'vw');

    return obj;
}


function step() {
    addSun(1);
    $(".obj").each((_, x) => {
        const obj = $(x);
        const def = DEFINITIONS[obj.getId()];
        const step = def.step;
        if (step) step(obj);
    });
    refreshUI();
}

function refreshUI() {
    $("#sunBar").css("width", (100 * DATA.sun / DATA.maxSun) + "%");
    // $("#sunBar").html(DATA.sun + "/" + DATA.maxSun);
}

load();
if ($(".obj").length === 0) {
    createObject({ id: "seedBag", stage: 1 });
}

// setInterval(save, 10 * 1000);
setInterval(step, 1000);
refreshUI();