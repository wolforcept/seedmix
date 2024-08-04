var DATA = {
    sun: 1000,
    maxSun: 1000,
    money: 0,
};

function hacks() {
    DATA.money = 99999;
    DATA.maxSun = 99999;
    DATA.sun = DATA.maxSun;
}

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

function seedBagClicked(obj, season, primaryCost) {

    const stars = obj.getStars();
    const calculatedCost = Math.floor(primaryCost / (([1, 1.5, 2, 3])[stars]));

    if (DATA.sun >= calculatedCost) {
        addSun(-calculatedCost);
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
        onClick: (obj) => seedBagClicked(obj, "spring", 20),
    },
    "summerSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "summer", 50),
    },
    "autumnSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "autumn", 100),
    },
    "winterSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "winter", 200),
    },
    "springSuperSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "spring", 20),
    },
    "summerSuperSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "summer", 50),
    },
    "autumnSuperSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "autumn", 100),
    },
    "winterSuperSeedBag": {
        color: "33ae5a",
        maxStage: 1,
        onClick: (obj) => seedBagClicked(obj, "winter", 200),
    },

    // SPRING

    "carrot": {
        color: "e4831c",
        maxStage: 4,
        row: 25, col: 2,
    },
    "kale": {
        color: "65935e",
        maxStage: 5,
        row: 3, col: 10,
    },
    "parsnip": {
        color: "c9b282",
        maxStage: 5,
        row: 1, col: 2,
    },
    "rhubarb": {
        color: "cf5c5c",
        row: 4, col: 2,
        maxStage: 4,
    },
    "potato": {
        color: "a47d4f",
        maxStage: 6,
        row: 2, col: 10,
    },
    "strawberry": {
        color: "b72238",
        maxStage: 6,
        row: 19, col: 2,
    },
    "green bean": {
        color: "8ec764",
        maxStage: 6,
        row: 1, col: 10,
    },
    "garlic": {
        color: "b38297",
        maxStage: 5,
        row: 3, col: 2,
    },
    "cauliflower": {
        color: "e3d5b8",
        row: 2, col: 2,
        maxStage: 6,
    },

    // SUMMER


    "rice": {
        color: "b98722",
        maxStage: 5,
        row: 18, col: 2,
    },

    "blueberry": {
        color: "31427f",
        maxStage: 6,
        row: 5, col: 10,
    },

    "corn": {
        color: "ffef8a",
        maxStage: 6,
        row: 8, col: 10,
    },

    "hops": {
        color: "e5ee9c",
        maxStage: 6,
        row: 19, col: 10,
    },

    "hot pepper": {
        color: "a31512",
        maxStage: 6,
        row: 5, col: 2,
    },

    "melon": {
        color: "d5645f",
        maxStage: 6,
        row: 4, col: 10,
    },

    "radish": {
        color: "ad0e35",
        maxStage: 5,
        row: 7, col: 2,
    },

    "red cabbage": {
        color: "b15c92",
        maxStage: 6,
        row: 7, col: 10,
    },

    "starfruit": {
        color: "f9d429",
        maxStage: 6,
        row: 8, col: 2,
    },

    "squash": {
        color: "c4ad24",
        maxStage: 6,
        row: 25, col: 10,
    },

    "tomato": {
        color: "a31512",
        maxStage: 6,
        row: 5, col: 2,
    },

    "wheat": {
        color: "f6e6ab",
        maxStage: 5,
        row: 6, col: 10,
    },

    // AUTUMN

    "amaranth": {
        color: "6b3861",
        maxStage: 5,
        row: 20, col: 10,
    },

    "artichoke": {
        color: "133e0e",
        maxStage: 6,
        row: 9, col: 10,
    },

    "beet": {
        color: "9b7c8f",
        maxStage: 5,
        row: 12, col: 2,
    },

    "bok choy": {
        color: "e9f0d2",
        maxStage: 5,
        row: 10, col: 10,
    },

    "broccoli": {
        color: "084f21",
        maxStage: 5,
        row: 26, col: 2,
    },

    "cranberries": {
        color: "822633",
        maxStage: 6,
        row: 11, col: 10,
    },

    "eggplant": {
        color: "1b133b",
        maxStage: 6,
        row: 9, col: 2,
    },

    "grape": {
        color: "492562",
        maxStage: 6,
        row: 20, col: 2,
    },

    "pumpkin": {
        color: "d87219",
        maxStage: 6,
        row: 10, col: 2,
    },

    "yam": {
        color: "b6706b",
        maxStage: 5,
        row: 11, col: 2,
    },

    // WINTER

    "powdermelon": {
        color: "bde6d0",
        maxStage: 6,
        row: 26, col: 10,
    },

    "ancient fruit": {
        color: "e3d5b8",
        maxStage: 6,
        row: 13, col: 2,
    },

    "cactus": {
        color: "e3d5b8",
        maxStage: 6,
        row: 21, col: 10,
    },

    "fiber": {
        color: "86561d",
        maxStage: 4,
        row: 23, col: 11,
    },

    "pineapple": {
        color: "d99819",
        maxStage: 6,
        row: 22, col: 10,
    },

    "taro root": {
        color: "e3d5b8",
        maxStage: 5,
        row: 22, col: 2,
    },

    "sweet berry": {
        color: "801d22",
        maxStage: 6,
        row: 17, col: 2,
    },

    // "tea": {
    //     color: "e3d5b8",
    //     maxStage: 6,
    //     row: 20, col: 10,
    //     price: 51,
    // },

    "coffee bean": {
        color: "7c2c23",
        maxStage: 6,
        row: 21, col: 2,
    },

}

const specialVegetables = ["coffee bean", "ancient fruit", "cactus", "fiber", "pineapple", "taro root", "sweet berry"];
const springVegetables = ["carrot", "kale", "parsnip", "rhubarb", "potato", "strawberry", "green bean", "garlic", "cauliflower",]; // 8
const summerVegetables = ["rice", "blueberry", "corn", "hops", "hot pepper", "melon", "radish", "red cabbage", "starfruit", "squash", "tomato", "wheat",]; // 12
const autumnVegetables = ["amaranth", "artichoke", "beet", "bok choy", "broccoli", "cranberries", "eggplant", "grape", "pumpkin", "yam",]; // 12
const winterVegetables = ["powdermelon", ...specialVegetables]; // 8
const allNormalVegetables = [...springVegetables, ...summerVegetables, ...autumnVegetables, ...winterVegetables];
const allVegetables = [...specialVegetables, ...springVegetables, ...summerVegetables, ...autumnVegetables, ...winterVegetables];

[
    springVegetables,
    summerVegetables,
    autumnVegetables,
    winterVegetables,
].forEach((arr, i) => {
    arr.forEach((id, j) => {
        const def = DEFINITIONS[id];

        def.values = [];
        for (let v = 0; v < 4; v++) {
            const s1 = 1 + (i + j);
            const s2 = 1 + (j + v);
            const s3 = 1 + (i + j + v);
            def.values[v] = s1 * Math.floor(4 + .9 * (s3 * s2));
        }
        def.price = def.values[0];

        console.log(i, j, id, def.values);
    });
})

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
            if (stars < 0) return 2;
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

