define([
    "app",
    'models/UserModel',
    "text!templates/AccountTemplate.html",
    "text!templates/HomeTemplate.html",

    "parsley"
], function(app,UserModel, AccountTemplate, HomeTemplate){

    var HomeView = Backbone.View.extend({
        el: '#content',
        template: _.template(HomeTemplate),

        initialize: function(){
            _.bindAll(this);
            this.content = this.$('#content');


        //Listen for session

        },

        events: {
          'click #sign-up' : 'signUp'
        },

        render: function(){
            this.template = _.template(HomeTemplate);

             this.$el.html(this.template({ user: app.session.user.toJSON() }));
             return this;
        },

        signUp: function(){
            app.router.navigate("register", { trigger: true, replace: true });

        },
        close: function(){
            this.stopListening();
            this.undelegateEvents();
            this.unbind();
        }


    });

    return HomeView;
});