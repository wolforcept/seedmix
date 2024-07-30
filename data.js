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

const DEFINITIONS = {
    "seedBag": {
        color: "33ae5a",
        maxStage: 1,
        images: [],
        onClick: (obj) => pop(obj),
    },
    "carrots": {
        color: "e4831c",
        maxStage: 4,
        images: ["row-25-column-2", "row-25-column-3", "row-25-column-4", "row-25-column-5"],
        step: (obj) => {
            const id = obj.getId();
            const stage = obj.getStage();
            const { maxStage } = DEFINITIONS[id];
            if (obj.getStage() >= maxStage)
                addSun(maxStage - stage)
        }
    }
}