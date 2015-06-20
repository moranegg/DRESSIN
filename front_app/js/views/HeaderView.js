define([
    "app",
    "text!templates/HeaderTemplate.html",
    "bootstrap"
], function(app, HeaderTpl){

    var HeaderView = Backbone.View.extend({

        template: _.template(HeaderTpl),

        initialize: function () {
            _.bindAll(this);

            // Listen for session logged_in state changes and re-render
            app.session.on("change:logged_in", this.onLoginStatusChange);
        },

        events: {
            "click #logout-link"         : "onLogoutClick",
            "click #login-btn"           : "onLoginAttempt",
            "keyup #login-password-input": "onPasswordKeyup",
            "click #profile-view-btn" : "onProfileViewClick"
        },


        render: function () {
            if(DEBUG) console.log("RENDER::", app.session.user.toJSON(), app.session.toJSON());
            this.$el.html(this.template({
                logged_in: app.session.get("logged_in"),
                user: app.session.user.toJSON()
            }));
            return this;
        },

        onLoginStatusChange: function(evt){
            this.render();
            if(app.session.get("logged_in")) app.showAlert("Success!", "Logged in as "+app.session.user.get("username"), "alert-success");
            else app.showAlert("See ya!", "Logged out successfully", "alert-success");
        },

        // Allow enter press to trigger login
        onPasswordKeyup: function(evt){
            var k = evt.keyCode || evt.which;

            if (k == 13 && $('#login-password-input').val() === ''){
                evt.preventDefault();    // prevent enter-press submit when input is empty
            } else if(k == 13){
                evt.preventDefault();
                this.onLoginAttempt();
                return false;
            }
        },
        onLoginAttempt: function(evt){
            if(evt) evt.preventDefault();

            if(this.$("#login-form").parsley('validate')){
                app.session.login({
                    username: this.$("#login-username-input").val(),
                    password: this.$("#login-password-input").val()
                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log("SUCCESS", mod, res);

                    },
                    error: function(err){
                        if(DEBUG) console.log("ERROR", err);
                        app.showAlert('Bummer dude!', err.error, 'alert-danger');
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");

            }
        },
        onLogoutClick: function(evt) {
            evt.preventDefault();
            app.session.logout({});  // No callbacks needed b/c of session event listening
        },

        onProfileViewRequest: function(evt){
            evt.preventDefault();
            //todo: go to profileView
        }
    });

    return HeaderView;
});
