/**
 * @desc		stores the POST state and response state of authentication for user
 */
define([
    "app",
    "models/LocalisationModel"
], function(app, LocalisationModel){

    var UserModel = Backbone.Model.extend({

        initialize: function(){
            _.bindAll(this);

            this.localisation = new LocalisationModel(this.get('localisation'));
        },

        defaults: {
            id: 0,
            username: '',
            email: '',
            birthday:'',
            isAdmin: false,
            isBoutique: false,
            localisation: []
        },

        url: function(){
            return app.API + '/user';
        }

    });
    
    return UserModel;
});
