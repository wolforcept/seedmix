SIZE = 16;
function popObj(obj) {
    const width = $('body').width() * (1 - SIZE / 100);
    const height = $('body').height() - width * SIZE / 100;
    let life = 10 + Math.abs(gaussianRandom() * 15);
    let i = 0;
    let velX = gaussianRandom() * 16, velY = -16 - Math.random() * 16;
    let accX = 0, accY = 1;

    const x0 = obj.getX(), y0 = obj.getY();
    const xf = 200;
    const yf = 100;
    const t = 2 * 1000 / 60;
    const g = 4;

    const vx = (xf - x0) / t;
    const vy = ((yf - y0) / t) + g / 2 * t;

    velX = vx;
    velY = -vy;
    accY = g;
    life = t;

    let interval = setInterval(() => {
        obj.setX(Math.min(width, Math.max(0, obj.getX() + velX)));
        obj.setY(Math.min(height, Math.max(0, obj.getY() + velY)));
        obj.css("transform", `scale(${.5 + (i / life) / 2})`);
        velX += accX;
        velY += accY;
        i++;
        if (i > life) {
            clearInterval(interval);
            const s = SIZE * $('body').width() / 100;
            obj.setX(s * Math.round(obj.getX() / s));
            obj.setY(s * Math.round(obj.getY() / s));
            obj.css('z-index', 99999999);
        }

    }, 1000 / 60);
}

function tryJoinObjects(obj1, obj2) {

    const id = obj1.getId();
    const stage = obj1.getStage();
    const id2 = obj2.getId();
    const stage2 = obj2.getStage();
    const maxStage = DEFINITIONS[id].maxStage;

    if (id !== id2 || stage !== stage2 || stage >= maxStage + 3 || obj1.attr('done') || obj2.attr('done')) return false;

    obj1.attr('done', true);
    obj2.attr('done', true);

    obj1.remove();
    obj2.remove();

    createObject({ id, stage: stage + 1, x: obj2.getX(), y: obj2.getY() });

    return true;
}

function createObject(props) {
    const { id, stage, x, y } = props;
    const { maxStage, onClick, render } = DEFINITIONS[id];
    const color = DEFINITIONS[id].color ?? "00000000";
    const obj = $(`<div class="obj" style="width: ${SIZE}vw; height: ${SIZE}vw; background-color:#${color};"></div>`);
    obj.attr('id', id);
    obj.attr('stage', stage);

    if (onClick) obj.on('click', () => onClick(obj));
    $('body').append(obj);
    obj.render();

    obj.draggable({
        start: () => {
            obj.attr('startx', obj.getX());
            obj.attr('starty', obj.getY());
        },
        drag: (event, ui) => {
            obj.css('z-index', 20000);
            const def = DEFINITIONS[obj.getId()];
            if (def.getValue) {
                const value = def.getValue(obj);
                if (value > 0) {
                    const sellBar = $('#sellBar');
                    sellBar.addClass("visible");
                    sellBar.html("Sell for " + value + "$");
                }
            }
        },
        stop: (event, ui) => {
            obj.css('z-index', 10000 + obj.getY());

            const s = SIZE * $('body').width() / 100;
            obj.setX(s * Math.round(obj.getX() / s));
            obj.setY(s * Math.round(obj.getY() / s));

            $('#sellBar').removeClass("visible");
        },
    });

    obj.droppable({
        refreshPositions: true,
        greedy: true,
        // tolerance: "touch",
        drop: function (event, ui) {
            var draggedElement = ui.draggable;
            var droppedElement = $(this);
            const joined = tryJoinObjects(draggedElement, droppedElement);

            const startX = Number(draggedElement.attr('startx'));
            const startY = Number(draggedElement.attr('starty'));

            if (!joined) {
                console.log({ joined, startX, startY });
                droppedElement.setX(startX);
                droppedElement.setY(startY);
            }
        },
    });

    if (x) obj.setX(x); else obj.setX((50 - SIZE / 2) + 'vw');
    if (y) obj.setY(y); else obj.setY((50 - SIZE / 2) + 'vw');

    if (x && y) {
        const s = SIZE * $('body').width() / 100;
        obj.setX(s * Math.round(obj.getX() / s));
        obj.setY(s * Math.round(obj.getY() / s));
    }

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
    $("#sellBar").droppable({
        drop: function (event, ui) {
            var getValue = DEFINITIONS[ui.draggable.getId()].getValue;
            if (getValue) {
                addSun(getValue(ui.draggable));
                ui.draggable.remove();
            }
        },
    });
    // $("#sunBar").html(DATA.sun + "/" + DATA.maxSun);
}

load();
if ($(".obj").length === 0) {
    createObject({ id: "springSeedBag", stage: 1 });
}

setInterval(save, 10 * 1000);
setInterval(step, 1000);
refreshUI();