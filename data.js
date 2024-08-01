var DATA = {
    sun: 1000,
    maxSun: 1000,
};

function addSun(val) {
    DATA.sun = Math.max(0, Math.min(DATA.maxSun, DATA.sun + val));
}

function save() {
    const objs = [];
    $(".obj").each((_, x) => {
        const obj = $(x);
        objs.push({ id: obj.getId(), stage: obj.getStage(), x: obj.getX(), y: obj.getY() });
    });
    localStorage.setItem("seedmix_saved_objs", JSON.stringify(objs));
    localStorage.setItem("seedmix_saved_data", JSON.stringify(DATA));
    console.log("game saved.")
    return objs;
}

function load() {

    const objs = JSON.parse(localStorage.getItem("seedmix_saved_objs"));
    if (objs) objs.forEach(o => createObject(o));

    const data = JSON.parse(localStorage.getItem("seedmix_saved_data"));
    if (data) {
        DATA = { ...DATA, ...data };
    }
}

function generateSunRelativeToStage(obj, multiplier = 1) {
    const id = obj.getId();
    const stage = obj.getStage();
    const { maxStage } = DEFINITIONS[id];
    if (stage >= maxStage)
        addSun(multiplier * (stage - maxStage));
}

function popSunRelativeToStage(obj, probs = [.001, .002, .005]) {
    const id = obj.getId();
    const stage = obj.getStage();
    const { maxStage } = DEFINITIONS[id];
    if (stage >= maxStage && Math.random() < probs[stage - maxStage]) {
        const sunObj = createObject({ id: "sun", x: obj.getX(), y: obj.getY() });
        popObj(sunObj);
    }
    // addSun(stage - maxStage);
}

const DEFINITIONS = {
    "sun": {
        color: "ffa11920",
        onClick: (obj) => {
            addSun(100);
            obj.remove();
            refreshUI();
        }
    },
    "springSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        images: [],
        onClick: (obj) => {
            if (DATA.sun >= 50) {
                addSun(-50);
                refreshUI();
            } else {
                return;
            }

            const id = springVegetables.gaussianRandom(1);
            const newObj = createObject({ id, stage: 1, x: obj.getX(), y: obj.getY() });
            popObj(newObj);
        },
    },
    "carrot": {
        color: "e4831c",
        maxStage: 4,
        row: 25, col: 2,
        step: generateSunRelativeToStage
    },

    // SPRING
    "kale": {
        color: "65935e",
        maxStage: 5,
        row: 3, col: 10,
        values: [12, 25, 40],
        step: obj => generateSunRelativeToStage(obj)
    },
    "parsnip": {
        color: "c9b282",
        maxStage: 5,
        row: 1, col: 2,
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
    "rhubarb": {
        color: "cf5c5c",
        row: 4, col: 2,
        maxStage: 4,
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
    "potato": {
        color: "a47d4f",
        maxStage: 6,
        row: 2, col: 10,
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
    "strawberry": {
        color: "b72238",
        maxStage: 6,
        row: 19, col: 2,
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
    "green bean": {
        color: "8ec764",
        maxStage: 7,
        row: 1, col: 10,
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
    "garlic": {
        color: "b38297",
        maxStage: 5,
        row: 3, col: 2,
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
    "cauliflower": {
        color: "e3d5b8",
        maxStage: 6,
        images: ["2,2", "2,3", "2,4", "2,5", "2,6", "2,7"],
        values: [12, 25, 40],
        step: generateSunRelativeToStage
    },
}

const springVegetables = ["kale", "parsnip", "rhubarb", "potato", "strawberry", "green bean", "garlic", "cauliflower"];

const allVegetables = [...springVegetables];

allVegetables.forEach(id => {
    const def = DEFINITIONS[id];
    // def.images.forEach((_, i) => def.images[i] = `vegetables/${def.images[i].split(',')[0]},${def.images[i].split(',')[1]}`);
    def.isVegetable = true;
    def.step = generateSunRelativeToStage;
    // def.getValue = () => 10;
    if (def.values)
        def.getValue = (obj) => def.values[obj.getStage() - def.maxStage] ?? 0;


    if (def.row && def.col) {
        def.images = [];
        for (let i = 0; i < def.maxStage; i++)
            def.images[i] = def.row + "," + (def.col + i);
        console.log(id, def)
    }
});

Object.keys(DEFINITIONS).forEach(id => {
    const def = DEFINITIONS[id];
    if (!def.render) {
        def.render = (obj) => {
            if (def.isVegetable) {
                const stage = obj.getStage();
                const imgRowCol = def.images[Math.min(stage, def.maxStage) - 1].split(',');
                const img = $(`<img class="img" src="images/vegetables/row-${imgRowCol[0]}-column-${imgRowCol[1]}.png"></img>`);
                if (stage > def.maxStage) {
                    const starImg = $(`<img class="star" src="images/star_${stage - def.maxStage}.png" >`);
                    return [img, starImg];
                }
                return [img]
            } else {
                const img = $(`<img class="img" src="images/${id}.png"></img>`);
                return [img]
            }
        }
    }
})

