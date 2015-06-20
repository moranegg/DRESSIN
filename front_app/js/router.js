/**
 * @desc        backbone router for pushState page routing
 */

define([
    "app",

    "models/SessionModel",
    "models/UserModel",

    "views/HeaderView",
    "views/HomeView",
    "views/RegisterView",
    "views/AccountView"
], function(app, SessionModel, UserModel, HeaderView, HomeView, RegisterView, AccountView){

    var FrontRouter = Backbone.Router.extend({

        headerView: null,
        HomeView: null,
        RegisterView: null,


        routes: {
            "" : "index",
            "register": "register",
            "account": "account"
        },

        initialize: function (){
            // Every page view in the router should need a header.
            // Instead of creating a base parent view, just assign the view to this
            // so we can create it if it doesn't yet exist
            if(this.headerView == null){
                this.headerView = new HeaderView({});
                this.headerView.setElement($(".header")).render();
            }
        },

        show: function(view, options){

            // Close and unbind any existing page view
            if(this.currentView){
                this.currentView.close();
            }
            // Establish the requested view into scope
            this.currentView = view;

            // Need to be authenticated before rendering view.
            // For cases like a user's settings page where we need to double check against the server.
            if (typeof options !== 'undefined' && options.requiresAuth){
                var self = this;

                app.session.checkAuth({
                    success: function(res){
                        // If auth successful, render inside the page wrapper
                        $('#content').html( self.currentView.render().$el);
                    }, error: function(res){
                        self.navigate("/", { trigger: true, replace: true });
                    }
                });


            } else {

                // Render inside the page wrapper
                $('#content').html(this.currentView.render().$el);
                //this.currentView.delegateEvents(this.currentView.events);        // Re-delegate events (unbound when closed)
            }
            return view;

        },

        index: function() {
            if (this.HomeView == null) {
                this.HomeView = new HomeView({ model: app.session.user });
            }

            this.curretView = this.HomeView;
            this.curretView.render();

            //this.changeView("#content",new HomeView({ model: app.session.user }));

        },

        register:function(){
            if (this.RegisterView == null) {
                this.RegisterView = new RegisterView({ model: app.session.user });
            }

            this.curretView = this.RegisterView;
            this.curretView.render();

            //this.changeView("#content",new RegisterView({ model: app.session.user }));
        },

        account: function(){
            this.changeView("#content",new AccountView({ model: app.session.user }),{ });
        },

        changeView: function (selector, view, options) {
            if (this.currentView)
                this.currentView.close();
            this.currentView = view;

            if (typeof options !== 'undefined' && options.requiresAuth){
                var self = this;

                app.session.checkAuth({
                    success: function(res){
                        // If auth successful, render inside the page wrapper
                        $('#content').html( self.currentView.render().$el);
                    }, error: function(res){
                        self.navigate("/", { trigger: true, replace: true });
                    }
                });


            }else{
                view.render().el;
            }



            return view;
        }
    });

    return FrontRouter;

});