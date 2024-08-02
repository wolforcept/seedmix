$.fn.setX = function (val) {
    if (val === undefined) {
        this.css('left', (50 - SIZE / 2) + 'vw');
        // } else if (typeof val === 'string' || val instanceof String) {
        //     this.css('left', val);
    } else {
        this.css('left', val + "px");
    }
};

$.fn.setY = function (val) {
    if (val === undefined) {
        this.css('top', (50 - SIZE / 2) + 'vw');
    }
    // else if (typeof val === 'string' || val instanceof String)
    //     this.css('top', val);
    else {
        this.css('top', val + "px");
    }
};

$.fn.getX = function () {
    const str = this.css('left');
    return Number(str.substring(0, str.length - 2));
};

$.fn.getY = function () {
    const str = this.css('top');
    return Number(str.substring(0, str.length - 2));
};

$.fn.getId = function () {
    return this.attr('id');
};

$.fn.getStage = function () {
    const str = this.attr('stage');
    if (!str) return 0;
    return Number(str);
};

$.fn.getStars = function () {
    const id = this.getId();
    const stage = this.getStage();
    const maxStage = DEFINITIONS[id].maxStage ?? 1;
    return Math.max(0, stage - maxStage);
};

$.fn.render = function () {
    const id = this.getId();
    const def = DEFINITIONS[id];
    this.empty();
    this.append(def.render(this));
};

Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
}

function gaussianRandom(mean = 0, stdev = 1) {
    const u = 1 - Math.random();
    const v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdev + mean;
}

Array.prototype.gaussianRandom = function (stdev) {
    let index = Math.floor(Math.abs(gaussianRandom(0, stdev)));
    while (index >= this.length) index -= this.length;
    return this[index];
}
