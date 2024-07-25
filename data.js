function save() {
    const objs = [];
    $(".obj").each((_, x) => {
        const obj = $(x);
        objs.push({ id: obj.getId(), x: obj.getX(), y: obj.getY() });
    });
    localStorage.setItem("seedmix_save", JSON.stringify(objs));
    return objs;
}

function load() {
    const objs = JSON.parse(localStorage.getItem("seedmix_save"));
    if (!objs) return [];
    objs.forEach(o => {
        createObject(o.id, o.x, o.y);
    });
}

function getColor(id) {
    switch (id) {
        case "seed_bag": return "33ae5a";
        case "carrots1":
        case "carrots2":
        case "carrots3":
        case "carrots4": return "e4831c";
    }
    return "00000000";
}

function getImgName(id) {
    switch (id) {
        case "carrots1": return "row-25-column-2";
        case "carrots2": return "row-25-column-3";
        case "carrots3": return "row-25-column-4";
        case "carrots4": return "row-25-column-5";
    }
    return id;
}

const JOINS = {
    "carrots1+carrots1": "carrots2",
    "carrots2+carrots2": "carrots3",
    "carrots3+carrots3": "carrots4",
}