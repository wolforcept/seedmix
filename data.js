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
        objs.push({ id: obj.getId(), x: obj.getX(), y: obj.getY() });
    });
    localStorage.setItem("seedmix_saved_objs", JSON.stringify(objs));
    localStorage.setItem("seedmix_saved_data", JSON.stringify(DATA));
    console.log("game saved.")
    return objs;
}

function load() {

    const objs = JSON.parse(localStorage.getItem("seedmix_saved_objs"));
    if (objs) {
        objs.forEach(o => {
            createObject(o.id, o.x, o.y);
        });
    }

    const data = JSON.parse(localStorage.getItem("seedmix_saved_data"));
    if (data) {
        DATA = { ...DATA, ...data };
    }
}

function getImgName(id) {

    if (id.startsWith('carrots')) {
        return "row-25-column-2";
    }
    // case "carrots1": return "row-25-column-2";
    // case "carrots2": return "row-25-column-3";
    // case "carrots3": return "row-25-column-4";
    // case "carrots4": return "row-25-column-5";
    return id;
}

const JOINS = {
    "carrots:1+carrots:1": "carrots:2",
    "carrots:2+carrots:2": "carrots:3",
    "carrots:3+carrots:3": "carrots:4",
}

const DEFINITIONS = {
    "seed_bag": {
        color: "33ae5a"
    },
    "carrots": {
        color: "e4831c",
        maxStage: 5,
        images: ["row-25-column-2", "row-25-column-3", "row-25-column-4", "row-25-column-5"]
    }
}