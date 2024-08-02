SIZE = 16;
const c = 0;
function popObj(obj) {

    const width = $('body').width();
    const height = $('body').height();
    const s = width * SIZE / 100;

    const places = {};
    for (let x = 0; x < width - s; x += s) {
        for (let y = 0; y < height - s; y += s) {
            places[Math.floor(x) + "," + Math.floor(y)] = true;
        }
    }

    $('.obj').each((_, o) => {
        const obj = $(o);
        places[Math.floor(obj.getX()) + "," + Math.floor(obj.getY())] = false;
    });

    const freePlaces = Object.keys(places).filter(x => places[x]);

    if (freePlaces.length === 0) return;

    const place = freePlaces.random().split(',');

    const x2 = Number(place[0]);
    const y2 = Number(place[1]);

    let x = obj.getX();
    let y = obj.getY();

    // const c1 = (c + (x1 + x2) / 2);
    // const c2 = ((y1 + y2) / 2);

    // const life = Math.abs(x1 - x2);
    // // const speed = Math.abs(x2 - x1) / 50;
    // const speed = 5;

    // let i = 0;
    const interval = setInterval(() => {

        //     const x = i;
        //     // const y = ((-4 * c * c + 4 * c * (x - x1) + (x1 - x2) * (x1 - x2)) * (x - x2) * y1 - (x - x1) * (-4 * c * c + 4 * c * (x - x2) + (x1 - x2) * (x1 - x2)) * y2) / ((-4 * c * c + (x1 - x2) * (x1 - x2)) * (x1 - x2));
        //     const y = (((x - x2) * (x - c1) * y1) / ((x1 - x2) * (x1 - c1)))
        //         + (((x - x1) * (x - c1) * y2) / ((x2 - x1) * (x2 - c1)))
        //         + (((x - x2) * (x - x1) * ((y1 + y2) / 2)) / ((c1 - x1) * (c1 - x2)));


        //     //(((x-x2)*(x-(c+(x1+x2)/2))*y1)/((x1-x2)*(x1-(c+(x1+x2)/2))))+(((x-x1)*(x-(c+(x1+x2)/2))*y2)/((x2-x1)*(x2-(c+(x1+x2)/2))))+(((x-x2)*(x-x1)*((y1+y2)/2))/(((c+(x1+x2)/2)-x1)*((c+(x1+x2)/2)-x2)))

        //     // ((-4 c^2 + 4 c (x - x1) + (x1 - x2)^2) (x - x2) y1 - (x - x1) (-4 c^2 + 4 c (x - x2) + (x1 - x2)^2) y2)/((-4 c^2 + (x1 - x2)^2) (x1 - x2))

        //     obj.setX(x);
        //     obj.setY(y);
        //     // obj.css("transform", `scale(${Math.min(1, .5 + (i / life) / 2)})`);

        //     i += speed;

        const dx = Math.abs(x2 - x);
        const dy = Math.abs(y2 - y);

        // obj.css('z-index', 99999999);
        if (dx < 1 && dy < 1) {
            clearInterval(interval);
            obj.setX(x2);
            obj.setY(y2);
            // align(obj);
        } else {
            x = (x - x2) * .9 + x2;
            y = (y - y2) * .9 + y2;
            obj.setX(x);
            obj.setY(y);
        }


    }, 1000 / 60);

}

// let o1, o2, o3;
// let i = 0;
// 
// createObject({ id: "springSeedBag", x: 100, y: 500 });
// setInterval(() => {
//     const width = $('body').width();
//     const height = $('body').height();
//     if (i === 0) {
//         o1 = createObject({ id: "springSeedBag", x: 100, y: 0 });
//         // o1 = createObject({ id: "springSeedBag", x: 0, y: 0, scale: .5 });
//         popObj(o1, 100, 500);
//     }
//     if (i === 15) {
//         // o2 = createObject({ id: "springSeedBag", x: 500, y: 0 });
//         // o2 = createObject({ id: "springSeedBag", x: 500, y: 0, scale: .5 });
//         // popObj(o2, 100, 600);
//     }
//     if (i === 30) {
//         // o3 = createObject({ id: "springSeedBag", x: 0, y: 500 });
//         // o3 = createObject({ id: "springSeedBag", x: 0, y: 500, scale: .5 });
//         // popObj(o3, 100, 700);
//     }
//     if (i === 45) {
//         // o4 = createObject({ id: "springSeedBag", x: 500, y: 500 });
//         // o4 = createObject({ id: "springSeedBag", x: 500, y: 500, scale: .5 });
//         // popObj(o4, 100, 800);
//     }
//     i++;
//     if (i === 500) {
//         o1.remove();
//         // o2.remove();
//         // o3.remove();
//         // o4.remove();
//     }
//     if (i === 500)
//         i = 0;
// }, 1000 / 60);
// ((x-b1)*(x-c1)*a2) / ((a1-b1)*(a1-c1))   +   ((x-a1)*(x-c1)*b2) / ((b1-a1)*(b1-c1))   +   ((x-b1)*(x-a1)*c2) / ((c1-a1)*(c1-b1)) 

function tryJoinObjects(obj1, obj2) {

    const id = obj1.getId();
    const stage = obj1.getStage();
    const id2 = obj2.getId();
    const stage2 = obj2.getStage();
    const maxStage = DEFINITIONS[id].maxStage;

    if (id !== id2 || stage !== stage2 || stage >= maxStage + 3 || obj1.attr('done') || obj2.attr('done')) return false;

    obj1.attr('done', true);
    obj2.attr('done', true);

    const x = obj2.getX();
    const y = obj2.getY();

    obj1.remove();
    obj2.remove();

    createObject({ id, stage: stage + 1, x, y });

    return true;
}

function align(obj) {
    const s = SIZE * $('body').width() / 100;
    obj.setX(s * Math.round(obj.getX() / s));
    obj.setY(s * Math.round(obj.getY() / s));
    obj.css('z-index', Math.floor(obj.getY()));
}

function createObject(props) {
    let { id, stage, x, y, scale } = props;
    console.log("creating obj ", id);
    if (!stage) stage = 1;
    const { maxStage, onClick, render } = DEFINITIONS[id];
    const color = DEFINITIONS[id].color ?? "00000000";
    const obj = $(`<div class="obj" style="width: ${SIZE}vw; height: ${SIZE}vw; background-color:#${color};"></div>`);
    obj.attr('id', id);
    obj.attr('stage', stage);
    if (scale) obj.css("transform", `scale(${scale})`);
    $('body').append(obj);
    obj.render();
    obj.setX(x);
    obj.setY(y);

    if (onClick) obj.on('click', () => onClick(obj));

    obj.draggable({
        start: () => {
            obj.attr('startx', obj.getX());
            obj.attr('starty', obj.getY());
        },
        drag: (event, ui) => {
            obj.css('z-index', 999999);
            const def = DEFINITIONS[obj.getId()];
            if (def.getValue) {
                const value = def.getValue(obj);
                if (value > 0) {
                    const sellBar = $('#sellBar');
                    sellBar.addClass("visible");
                    sellBar.html(`Sell for ${value} <img src="images/coin.png">`);
                }
            }
        },
        stop: (event, ui) => {
            const width = $('body').width();
            const height = $('body').height();
            const s = SIZE * width / 100;
            const startX = Number(obj.attr('startx'));
            const startY = Number(obj.attr('starty'));
            const finalX = s * Math.round(obj.getX() / s);
            const finalY = s * Math.round(obj.getY() / s);

            if (Math.abs(finalX - startX) < 3 && Math.abs(finalY - startY) < 3 && onClick) onClick(obj)

            if (finalX >= 0 && finalY >= 0 && finalX < width - s && finalY < height - s) {
                obj.setX(finalX);
                obj.setY(finalY);
            } else {
                obj.setX(startX);
                obj.setY(startY);
            }
            align(obj);
            $('#sellBar').removeClass("visible");
        },
    });

    obj.droppable({
        refreshPositions: true,
        greedy: true,
        drop: function (event, ui) {
            var draggedElement = ui.draggable;
            var droppedElement = $(this);
            const joined = tryJoinObjects(draggedElement, droppedElement);

            const startX = Number(draggedElement.attr('startx'));
            const startY = Number(draggedElement.attr('starty'));

            if (!joined) {
                droppedElement.setX(startX);
                droppedElement.setY(startY);
            }
        },
    });

    align(obj);

    return obj;
}

function step() {
    addSun(1);
    $(".obj").each((_, x) => {
        const obj = $(x);
        const { step } = DEFINITIONS[obj.getId()];
        if (step) step(obj);
        // obj.css('z-index', 10000 - obj.getY());
        // console.log(obj.css('z-index'))
    });

    DATA.lastOnline = Date.now();

    refreshUI();
}

function refreshUI() {
    $("#sunBar").css("width", (100 * DATA.sun / DATA.maxSun) + "%");
    $("#sellBar").droppable({
        drop: function (event, ui) {
            var getValue = DEFINITIONS[ui.draggable.getId()].getValue;
            if (getValue) {
                addMoney(getValue(ui.draggable));
                ui.draggable.remove();
            }
        },
    });
    $("#moneyWrapper").html(DATA.money + "&nbsp;");
}

function refreshShopUI() {
    const shop = $('#shopWrapper');
    shop.empty();

    const icons = [
        { id: 'springSeedBag', price: 41 },
        { id: 'summerSeedBag', price: 64 },
        { id: 'autumnSeedBag', price: 143 },
        { id: 'winterSeedBag', price: 220 },
    ];

    springVegetables.forEach(vegetable => {
        const def = DEFINITIONS[vegetable];
        const imgCoords = def.images[0].split(',');
        const img = `vegetables/row-${imgCoords[0]}-column-${imgCoords[1]}`;
        icons.push({ id: vegetable, img, price: def.price })
    })

    icons.forEach(({ price, id, img }) => {
        const div = $(`<div class="shopIcon"><img src="images/${img ?? id}.png"><div class="price"><div class="priceWrapper">${price}</div>&nbsp;<img src="images/coin.png"></div></div>`);
        div.on('click', () => {
            if (DATA.money >= price) {
                addMoney(-price);
                const obj = createObject({ id, x: 0, y: 0 });
                popObj(obj);
                toggleShop();
            }
        })
        shop.append(div);
    });
}

load();
if ($(".obj").length === 0) {
    createObject({ id: "springSeedBag" });
}

setInterval(save, 10 * 1000);
setInterval(step, 1000);
refreshUI();
addSun((Date.now() - DATA.lastOnline) / (1000));

const shopButton = $("#shopButton");
shopButton.on('click', toggleShop);
// toggleShop();

function toggleShop() {
    const shop = $("#shop");
    shop.css('transition', 'margin .5s');
    if (shop.hasClass('shown')) {
        shop.removeClass('shown');
    } else {
        shop.addClass('shown');
        refreshShopUI();
    }
}