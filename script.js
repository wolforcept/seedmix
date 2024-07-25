SIZE = 25;

function pop(parentObj) {

    if (DATA.sun > 100) {
        addSun(-100);
        refreshUI();
    }

    const obj = createObject("carrots:1", parentObj.getX(), parentObj.getY());

    let i = 0;
    let velX = -10 + Math.random() * 20, velY = -20;
    let accX = 0, accY = 1;
    let interval = setInterval(() => {
        obj.setX(obj.getX() + velX);
        obj.setY(obj.getY() + velY);
        velX += accX;
        velY += accY;
        i++;
        if (i > 30) clearInterval(interval);
    }, 1000 / 60);
}

const onClicks = {
    "seed_bag": pop
}

function joinObjects(obj1, obj2) {

    const id = obj1.getId();
    const id2 = obj2.getId();

    if (id !== id2) return;

    const stage = getStageOf(id);
    const maxStage = DEFINITIONS[id].maxStage;
    if (stage >= maxStage) return;

    try {
        obj1.droppable("destroy");
        obj2.droppable("destroy");

        obj1.remove();
        obj2.remove();

        createObject(nextStageOf(id), obj1.getX(), obj1.getY());
    } catch (e) {
    }
}

function createObject(id, x, y) {
    const preId = id.split(":")[0];
    const obj = $(`
    <div class="obj" style="width: ${SIZE}vw; height: ${SIZE}vw; background-color:#${DEFINITIONS[preId].color ?? "00000000"};">
        <img src="images/${DEFINITIONS[preId].images[getStageOf(id)]}.png" style="width: ${SIZE}vw">
    </div>`);
    obj.attr('id', id);

    if (onClicks[id]) obj.on('click', () => onClicks[preId](obj));
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
            joinObjects(draggedElement, droppedElement);
        },
    });

    if (x) obj.setX(x); else obj.setX((50 - SIZE / 2) + 'vw');
    if (y) obj.setY(y); else obj.setY((50 - SIZE / 2) + 'vw');

    return obj;
}

function stepObject(id) {
    switch (id) {
        case "carrots4": addSun(1); return;
        case "carrots5": addSun(2); return;
        case "carrots6": addSun(4); return;
    }
}

function step() {
    addSun(1);
    $(".obj").each((_, x) => stepObject($(x).getId()));
    refreshUI();
}

function refreshUI() {
    $("#sunBar").css("width", (100 * DATA.sun / DATA.maxSun) + "%");
    // $("#sunBar").html(DATA.sun + "/" + DATA.maxSun);
}

load();
if ($(".obj").length === 0) {
    createObject("seed_bag:1");
}

setInterval(save, 10 * 1000);
setInterval(step, 1000);
refreshUI();