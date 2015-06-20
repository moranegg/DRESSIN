define([
    "app",
    "models/UserModel",
    "text!templates/RegisterTemplate.html",

    "parsley"
], function(app,UserModel,RegisterTemplate){

    var RegisterView = Backbone.View.extend({
        el: '#content',
        template: _.template(RegisterTemplate),

        initialize: function(){
            _.bindAll(this);
            this.content = this.$('#content');


            //Listen for session

        },

        events: {
            'click #signup-btn'                     : 'createAccount',
            'keyup #login-password-input'           : 'onPasswordKeyup',
            'keyup #signup-password-confirm-input'  : 'onConfirmPasswordKeyup'
        },

        render: function(){
            this.template = _.template(RegisterTemplate);
            this.$el.html(this.template({user: app.session.user.toJSON()}));

            return this;
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

        // Allow enter press to trigger signup
        onConfirmPasswordKeyup: function(evt){
            var k = evt.keyCode || evt.which;

            if (k == 13 && $('#confirm-password-input').val() === ''){
                evt.preventDefault();   // prevent enter-press submit when input is empty
            } else if(k == 13){
                evt.preventDefault();
                this.onSignupAttempt();
                return false;
            }
        },

        createAccount: function(evt){
            if(evt) evt.preventDefault();
            if(this.$("#signup-form").parsley('validate')){
                app.session.signup({
                    username: this.$("#signup-username-input").val(),
                    email: this.$("#signup-user-email-input").val(),
                    password: this.$("#signup-password-input").val()

                }, {
                    success: function(mod, res){
                        if(DEBUG) console.log("SUCCESS", mod, res);
                        app.router.navigate("#account",true);

                    },
                    error: function(err){
                        if(DEBUG) console.log("ERROR", err);
                        app.showAlert('Uh oh!', err.error, 'alert-danger');
                    }
                });
            } else {
                // Invalid clientside validations thru parsley
                if(DEBUG) console.log("Did not pass clientside validation");

            }
        },
        close: function(){
            this.stopListening();
            this.undelegateEvents();
            this.unbind();
        }

    });

    return RegisterView;
});