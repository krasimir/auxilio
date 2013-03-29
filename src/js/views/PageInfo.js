Views.register("PageInfo", {
    initialize: function() {
        var view = this;
        this.port = chrome.extension.connect({ name: "PageInfo" });      
        this.port.onMessage.addListener(function (response) {
            var html = "";
            if(response) {
                html += view.getDataBlock("Page", response.data.url);
                html += view.getDataBlock("Meta data", view.formatMetaData(response.data.meta));
                html += view.getDataBlock("Titles", view.formatTitlesData(response.data.titles));
                html += view.getDataBlock("Sections and articles", view.formatSectionsAndArticlesData(response.data));
                html += view.getDataBlock("Header, footer and navigation", view.formatHeaderFooterAndNav(response.data));
                html += view.getDataBlock("Other", view.formatOther(response.data));
            } else {
                html += "Error getting data ...";
            }
            view.el.find("#pageinfo-data-holder").empty().html(html);
            view.setShowTagsEvents();
        });
    },
    getDataBlock: function(title, data) {
        return '<h3>' + title + '</h3><section class="data">' + data + '</section>';
    },
    formatMetaData: function(list) {
        if(list) {
            var html = '';
            for(var i=0; i<list.length; i++) {
                var attributes = $(list[i])[0].attributes;
                for(var j=0; j<attributes.length; j++) {
                    if(attributes[j].name != "content") {
                        html += "&lt;meta " + attributes[j].name + "=\"" + attributes[j].value + "\" ...<br />";
                    }
                }
            }
            return html;
        } else {
            return "";
        }
    },
    formatTitlesData: function(data) {
        var html = '';
        html += this.formatTagData("h1", data.h1);
        html += this.formatTagData("h2", data.h2);
        html += this.formatTagData("h3", data.h3);
        html += this.formatTagData("h4", data.h4);
        html += this.formatTagData("h5", data.h5);
        html += this.formatTagData("h6", data.h6);
        return html;
    },
    formatSectionsAndArticlesData: function(data) {
        var html = '';
        html += this.formatTagData("section", data.section);
        html += this.formatTagData("article", data.article);
        return html;
    },
    formatHeaderFooterAndNav: function(data) {
        var html = '';
        html += this.formatTagData("header", data.footer);
        html += this.formatTagData("footer", data.footer);
        html += this.formatTagData("nav", data.nav);
        return html;
    },
    formatOther: function(data) {
        var html = '';
        html += this.formatTagData("a", data.links);
        html += this.formatTagData("p", data.paragraphs);
        html += this.formatTagData("img", data.images);
        return html;
    },
    formatTagData: function(tag, arr) {
        var disabled = (arr.length == 0 ? ' disabled' : '');
        return '<a href="#" class="show-tags btn' + disabled + '" data="' + tag + '">' + tag + ' (' + arr.length + ')</a>';        
    },
    setShowTagsEvents: function() {
        var view = this;
        var buttons = this.el.find(".show-tags");
        for(var i=0; i<buttons.length; i++) {
            var button = buttons.eq(i);
            button.on("mouseover", function() {
                var tag = $(this).attr("data");
                view.port.postMessage({ type: "PageInfoHighlightTag", tag: tag, color: "#F00"});
            });
            button.on("mouseout", function() {
                var tag = $(this).attr("data");
                view.port.postMessage({ type: "PageInfoHighlightTag", tag: tag, color: ""});
            });
        }
    },
    render: function() {
        var view = this;
        this.el.html(this.template);
        this.el.find("#Navigation").on("click", function() { view.dispatch("change-view", "Navigation"); });
        this.el.find("#get-data").on("click", function() {
            view.el.find("#pageinfo-data-holder").empty().html('<section>loading ...</section>');
            view.port.postMessage({ type: "GetPageInfoData"});
        });
        view.el.find("#pageinfo-data-holder").empty().html('<section>loading ...</section>');
        this.port.postMessage({ type: "GetPageInfoData"});
        return this;
    }
});