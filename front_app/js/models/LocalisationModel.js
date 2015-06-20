/**
 * @desc
 */
define([
    "app"
], function(app){

    var LocalisationModel = Backbone.Model.extend({

        initialize: function(){
            _.bindAll(this);
        },

        defaults: {
            country:'France',
            city:'Paris',
            street:'',
            number:''
        },

        url: function(){
            return app.API + '/localisation';
        }

    });

    return LocalisationModel;
});
