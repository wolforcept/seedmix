SIZE = 25;

function pop(parentObj) {
    const obj = createObject("carrots1", parentObj.getX(), parentObj.getY());

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

    const id1 = obj1.getId();
    const id2 = obj2.getId();

    if (id1 !== id2) return;

    const junctionId = JOINS[id1 + "+" + id2];
    if (!junctionId) return

    try {
        obj1.droppable("destroy");
        obj2.droppable("destroy");

        obj1.remove();
        obj2.remove();

        createObject(junctionId, obj1.getX(), obj1.getY());
    } catch (e) {
    }
}

function createObject(id, x, y) {
    const obj = $(`<div class="obj" style="width: ${SIZE}vw; height: ${SIZE}vw; background-color:#${getColor(id)};"><img src="images/${getImgName(id)}.png" style="width: ${SIZE}vw"></div>`);
    obj.attr('id', id);

    if (onClicks[id]) obj.on('click', () => onClicks[id](obj));
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

load();
if ($(".obj").length === 0) {
    createObject("seed_bag");
}