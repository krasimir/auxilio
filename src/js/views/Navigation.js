Views.register("Navigation", {
    initialize: function() {
        
    },
    render: function() {
        var view = this;
        this.el.html(this.template);
        this.el.find("a").on("click", function(e) {
        	view.dispatch("change-view", $(e.currentTarget).attr("id"));
        });
        return this;
    }
});