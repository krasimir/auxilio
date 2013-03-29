Views.register("Responsive", {
    currentW: "",
    currentH: "",
    afterRender: false,
    port: null,
    wSlider: null,
    hSlider: null,
    sliderMax: 3000,
    mediaQueries: [],
    initialize: function() {
        var view = this;
        this.port = chrome.extension.connect({ name: "ResponsiveResolution" });      
        this.port.onMessage.addListener(function (request) {
            view.mediaQueries = request.data.mediaQueries;
            view.currentW = request.data.w;
            view.currentH = request.data.h;
            view.el.find("#width").val(request.data.w);
            view.el.find("#height").val(request.data.h);            
            view.updateSliders();
            view.showMediaQueries();
        });
        this.port.postMessage({ type: "give-me-current-window-size"});
    },
    render: function() {
        var view = this;
        this.el.html(this.template);
        this.el.find("#width").val(this.currentW);
        this.el.find("#height").val(this.currentH);
        this.el.find("#predefined-sizes").on("change", function() { view.choosePredefined(); });
        this.el.find("#swap").on("click", function() { view.swap(); });
        this.el.find("#wAdd").on("click", function() { view.wAdd(); });
        this.el.find("#hAdd").on("click", function() { view.hAdd(); });
        this.el.find("#wRemove").on("click", function() { view.wRemove(); });
        this.el.find("#hRemove").on("click", function() { view.hRemove(); });
        this.el.find("#Navigation").on("click", function() { view.dispatch("change-view", "Navigation"); });
        this.el.find("#width").on("blur", function() { view.change(); });
        this.el.find("#height").on("blur", function() { view.change(); });
        setTimeout(function() {
            view.wSlider = new Dragdealer(view.el.find("#w-slider").get(0), {
                callback:function(x, y) {                        
                    view.resize(Math.ceil(x * view.sliderMax), view.currentH);
                },
                animationCallback: function(x, y) {
                    view.el.find("#width").val(Math.ceil(x * view.sliderMax));
                }
            });
            view.hSlider = new Dragdealer(view.el.find("#h-slider").get(0), {
                callback:function(x, y) {                        
                    view.resize(view.currentW, Math.ceil(x * view.sliderMax));
                },
                animationCallback: function(x, y) {
                    view.el.find("#height").val(Math.ceil(x * view.sliderMax));
                }
            });
            view.updateSliders();
            view.showMediaQueries();
        }, 200);
        return this;
    },
    updateSliders: function() {
        var wCurrent = this.currentW / this.sliderMax;
        var hCurrent = this.currentH / this.sliderMax;
        if(this.wSlider) this.wSlider.setValue(wCurrent.toFixed(3), 0);
        if(this.hSlider) this.hSlider.setValue(hCurrent.toFixed(3), 0);
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
            type: "update-window-size",
            data: {
                w: this.currentW,
                h: this.currentH
            }
        });
    },
    showMediaQueries: function() {
        var html = '<section class="data">';
        if(this.mediaQueries == null || this.mediaQueries.length == 0) {
            html += 'none';
        } else {
            for(var i=0; i<this.mediaQueries.length; i++) {
                if(this.mediaQueries[i].file != null) {
                    html += '<strong><small>' + this.mediaQueries[i].file + '</small></strong>';
                    if(this.mediaQueries[i].medias && this.mediaQueries[i].medias.length > 0) {
                        html += '<ul>';
                        for(var j=0; j<this.mediaQueries[i].medias.length; j++) {
                            if(this.mediaQueries[i].medias[j].mediaText && this.mediaQueries[i].medias[j].mediaText != "") {
                                html += '<li>' + this.mediaQueries[i].medias[j].mediaText + '</li>';
                            }
                        }
                        html += '<ul>';
                    }
                }
            }
        }
        html += '</section>';
        this.el.find("#media-queries").empty().html(html);
    }
    
})