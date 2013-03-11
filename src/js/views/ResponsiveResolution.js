Views.register("ResponsiveResolution", {
    currentW: "",
    currentH: "",
    eventsSet: false,
    port: null,
    initialize: function() {
        var view = this;
        this.port = chrome.extension.connect({ name: "ResponsiveResolution" });      
        this.port.onMessage.addListener(function (request) {
            view.currentW = request.data.w;
            view.currentH = request.data.h;
            view.el.find("#width").val(request.data.w);
            view.el.find("#height").val(request.data.h);
        });
    },
    render: function() {
        var view = this;
        this.el.html(this.template);
        this.el.find("#width").val(this.currentW);
        this.el.find("#height").val(this.currentH);
        if(!this.eventsSet) {
            this.el.find("#predefined-sizes").on("change", function() { view.choosePredefined(); });
            this.el.find("#change").on("click", function() { view.change(); });
            this.el.find("#swap").on("click", function() { view.swap(); });
            this.el.find("#wAdd").on("click", function() { view.wAdd(); });
            this.el.find("#hAdd").on("click", function() { view.hAdd(); });
            this.el.find("#wRemove").on("click", function() { view.wRemove(); });
            this.el.find("#hRemove").on("click", function() { view.hRemove(); });
            this.el.find("#Navigation").on("click", function() { view.dispatch("change-view", "Navigation"); });
        }
        return this;
    },
    choosePredefined: function() {
        var value = this.el.find("#predefined-sizes").val();
        if(value != "") {
            value = value.split("x");
            this.resize(parseInt(value[0]), parseInt(value[1]));
        }
    },
    change: function() {
        if(this.el.find("#width").val() != "" && this.el.find("#height").val() != "") {
            this.resize(parseInt(this.el.find("#width").val()), parseInt(this.el.find("#height").val()));
        }
    },
    swap: function() {
        this.resize(this.currentH, this.currentW);
    },
    wAdd: function() {
        this.currentW += 1;
        this.resize(this.currentW, this.currentH);
    },
    hAdd: function() {
        this.currentH += 1;
        this.resize(this.currentW, this.currentH);
    },
    wRemove: function() {
        if(this.currentW == 0) return;
        this.currentW -= 1;
        this.resize(this.currentW, this.currentH);
    },
    hRemove: function() {
        if(this.currentH == 0) return;
        this.currentH -= 1;
        this.resize(this.currentW, this.currentH);
    },
    resize: function(w, h) {
        if(w == null || w == "" || h == null || h == "") return;
        var view = this;
        this.currentW = w;
        this.currentH = h;
        this.el.find("#width").val(w);
        this.el.find("#height").val(h);
        this.port.postMessage({
            data: {
                w: this.currentW,
                h: this.currentH
            }
        });
        view.render();
    }
})