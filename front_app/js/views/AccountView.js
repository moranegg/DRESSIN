define([
    "app",
    "models/UserModel",
    "text!templates/AccountTemplate.html",

    "parsley"
], function(app,UserModel,AccountTemplate){

    var AccountView = Backbone.View.extend({
        el: '#content',
        template: _.template(AccountTemplate),

        initialize: function(){
            _.bindAll(this);
            this.content = this.$('#content');


            //Listen for session

        },

        events: {

        },

        render: function(){
            this.template = _.template(AccountTemplate);
            this.$el.html(this.template({user: app.session.user.toJSON()}));

            return this;
        },

        close: function(){
            this.stopListening();
            this.undelegateEvents();
            this.unbind();
        }

    });

    return AccountView;
});