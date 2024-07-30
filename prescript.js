$.fn.setX = function (val) {
    if (typeof val === 'string' || val instanceof String)
        this.css('left', val);
    else
        this.css('left', val + "px");
};

$.fn.setY = function (val) {
    if (typeof val === 'string' || val instanceof String)
        this.css('top', val);
    else
        this.css('top', val + "px");
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
    return Number(this.attr('stage'));
};
