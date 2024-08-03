var DATA = {
    sun: 1000,
    maxSun: 1000,
    money: 0,
};

function addSun(val) {
    DATA.sun = Math.max(0, Math.min(DATA.maxSun, DATA.sun + val));
}

function addMoney(val) {
    DATA.money = Math.max(0, DATA.money + val);
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

function clear() {

    localStorage.clear();
    location.reload();
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
}

function seedBagClicked(obj, season) {

    const stars = obj.getStars();
    const cost = Math.floor(50 / (([1, 1.5, 2, 3])[stars]));

    if (DATA.sun >= cost) {
        addSun(-cost);
        refreshUI();
    } else {
        return;
    }

    let totalStages = 0;
    const values = [0, 0, 1, 5, 10, 30, 100, 200];
    $('.obj').each((_, o) => totalStages += values[Number($(o).getStage())]);
    console.log("totalStages:", totalStages);
    const stdev = totalStages > 1000 ? 3 : totalStages > 100 ? 2 : 1;

    const id = ({
        spring: springVegetables, summer: summerVegetables, autumn: autumnVegetables, winter: winterVegetables
    })[season].gaussianRandom(stdev);
    const newObj = createObject({ id, stage: 1, x: obj.getX(), y: obj.getY() });
    popObj(newObj);
}

const DEFINITIONS = {
    "sun": {
        color: "ffa11920",
        maxStage: 1,
        onClick: (obj) => {
            addSun(100);
            obj.remove();
            refreshUI();
        }
    },
    "springSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "spring"),
    },
    "summerSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "summer"),
    },
    "autumnSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "autumn"),
    },
    "winterSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "winter"),
    },

    // SPECIAL 

    "carrot": {
        color: "e4831c",
        maxStage: 4,
        row: 25, col: 2,
    },

    "coffee bean": {
        color: "e4831c",
        maxStage: 6,
        row: 21, col: 2,
    },

    // SPRING
    "kale": {
        color: "65935e",
        maxStage: 5,
        row: 3, col: 10,
        values: [12, 25, 40, 100],
        price: 2,
        step: obj => generateSunRelativeToStage(obj)
    },
    "parsnip": {
        color: "c9b282",
        maxStage: 5,
        row: 1, col: 2,
        values: [12, 25, 40, 100],
        price: 7,
        step: obj => popSunRelativeToStage(obj, [1, 1, 1])
    },
    "rhubarb": {
        color: "cf5c5c",
        row: 4, col: 2,
        maxStage: 4,
        values: [12, 25, 40, 100],
        price: 11,
    },
    "potato": {
        color: "a47d4f",
        maxStage: 6,
        row: 2, col: 10,
        values: [12, 25, 40, 100],
        price: 24,
    },
    "strawberry": {
        color: "b72238",
        maxStage: 6,
        row: 19, col: 2,
        values: [12, 25, 40, 100],
        price: 24,
    },
    "green bean": {
        color: "8ec764",
        maxStage: 6,
        row: 1, col: 10,
        values: [12, 25, 40, 100],
        price: 24,
    },
    "garlic": {
        color: "b38297",
        maxStage: 5,
        row: 3, col: 2,
        values: [12, 25, 40, 100],
        price: 36,
    },
    "cauliflower": {
        color: "e3d5b8",
        row: 2, col: 2,
        maxStage: 6,
        values: [12, 25, 40, 100],
        price: 51,
    },

    // SUMMER


    "rice": {
        color: "b98722",
        maxStage: 5,
        row: 18, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "blueberry": {
        color: "31427f",
        maxStage: 6,
        row: 5, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "corn": {
        color: "ffef8a",
        maxStage: 6,
        row: 8, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "hops": {
        color: "e5ee9c",
        maxStage: 6,
        row: 19, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "hot pepper": {
        color: "a31512",
        maxStage: 6,
        row: 5, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "melon": {
        color: "d5645f",
        maxStage: 6,
        row: 4, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "radish": {
        color: "ad0e35",
        maxStage: 5,
        row: 7, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "red cabbage": {
        color: "b15c92",
        maxStage: 6,
        row: 7, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "starfruit": {
        color: "f9d429",
        maxStage: 6,
        row: 8, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "squash": {
        color: "c4ad24",
        maxStage: 6,
        row: 25, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "tomato": {
        color: "a31512",
        maxStage: 6,
        row: 5, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "wheat": {
        color: "f6e6ab",
        maxStage: 5,
        row: 6, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    // AUTUMN

    "amaranth": {
        color: "6b3861",
        maxStage: 5,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "artichoke": {
        color: "133e0e",
        maxStage: 6,
        row: 9, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "beet": {
        color: "9b7c8f",
        maxStage: 5,
        row: 12, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "bok choy": {
        color: "e9f0d2",
        maxStage: 5,
        row: 10, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "broccoli": {
        color: "084f21",
        maxStage: 5,
        row: 26, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "cranberries": {
        color: "822633",
        maxStage: 6,
        row: 11, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "eggplant": {
        color: "1b133b",
        maxStage: 6,
        row: 9, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "grape": {
        color: "492562",
        maxStage: 6,
        row: 20, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "pumpkin": {
        color: "d87219",
        maxStage: 6,
        row: 10, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "yam": {
        color: "b6706b",
        maxStage: 5,
        row: 11, col: 2,
        values: [12, 25, 40, 100],
        price: 51,
    },

    // WINTER

    "powdermelon": {
        color: "bde6d0",
        maxStage: 6,
        row: 26, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    // OTHER

    "ancient fruit": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "cactus": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "fiber": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "pineapple": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "taro root": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "sweet berry": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

    "tea": {
        color: "e3d5b8",
        maxStage: 6,
        row: 20, col: 10,
        values: [12, 25, 40, 100],
        price: 51,
    },

}

const specialVegetables = ["carrot", "coffee bean", "ancient fruit", "cactus", "fiber", "pineapple", "taro root", "sweet berry", "tea"];
const springVegetables = ["kale", "parsnip", "rhubarb", "potato", "strawberry", "green bean", "garlic", "cauliflower",]; // 8
const summerVegetables = ["rice", "blueberry", "corn", "hops", "hot pepper", "melon", "radish", "red cabbage", "starfruit", "squash", "tomato", "wheat",]; // 12
const autumnVegetables = ["amaranth", "artichoke", "beet", "bok choy", "broccoli", "cranberries", "eggplant", "grape", "pumpkin", "yam",]; // 12
const winterVegetables = ["powdermelon"]; // 8
const allNormalVegetables = [...springVegetables, ...summerVegetables, ...autumnVegetables, ...winterVegetables];
const allVegetables = [...specialVegetables, ...springVegetables, ...summerVegetables, ...autumnVegetables, ...winterVegetables];

allVegetables.forEach(id => {
    const def = DEFINITIONS[id];
    // def.images.forEach((_, i) => def.images[i] = `vegetables/${def.images[i].split(',')[0]},${def.images[i].split(',')[1]}`);
    def.isVegetable = true;
    def.step = generateSunRelativeToStage;
    // def.getValue = () => 10;
    if (def.values)
        def.getValue = (obj) => {
            if (!obj) return def.values[def.values.length - 1];
            const stars = obj.getStars();
            if (stars <= 0) return 2;
            return (def.values[obj.getStage() - def.maxStage] ?? 2);
        }

    if (def.row !== undefined && def.col !== undefined) {
        def.images = [];
        for (let i = 0; i < def.maxStage; i++)
            def.images[i] = def.row + "," + (def.col + i);
    }

    def.id = id;
    def.name = String(id).titleCase();
});

Object.keys(DEFINITIONS).forEach(id => {
    const def = DEFINITIONS[id];
    if (!def.render) {
        def.render = (obj) => {
            const ret = [];

            const stage = obj.getStage() ?? 1;
            let img;
            if (def.isVegetable) {
                const imgRowCol = def.images[Math.min(stage, def.maxStage) - 1].split(',');
                img = $(`<img class="img" src="images/vegetables/row-${imgRowCol[0]}-column-${imgRowCol[1]}.png"></img>`);
            } else {
                img = $(`<img class="img" src="images/${id}.png"></img>`);
            }
            ret.push(img);

            if (stage > def.maxStage) {
                const starImg = $(`<img class="star" src="images/star_${stage - def.maxStage}.png" >`);
                ret.push(starImg);
            }

            return ret;
        }
    }
})

