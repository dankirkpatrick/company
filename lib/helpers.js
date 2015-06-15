isAdminById=function(userId){
    var user = Meteor.users.findOne(userId);
    return !!(user && isAdmin(user));
};

isAdmin=function(user){
    user = (typeof user === 'undefined') ? Meteor.user() : user;
    return !!user && !!user.isAdmin;
};

getCurrentTemplate = function() {
    //return Router.current().lookupTemplate();
};

getSiteUrl = function () {
    return getSetting('siteUrl', Meteor.absoluteUrl());
};

getSetting = function(setting, defaultValue){
    var settings = Settings.find().fetch()[0];

    if (Meteor.isServer && Meteor.settings && !!Meteor.settings[setting]) { // if on the server, look in Meteor.settings
        return Meteor.settings[setting];

    } else if (Meteor.settings && Meteor.settings.public && !!Meteor.settings.public[setting]) { // look in Meteor.settings.public
        return Meteor.settings.public[setting];

    } else if(settings && (typeof settings[setting] !== 'undefined')) { // look in Settings collection
        return settings[setting];

    } else if (typeof defaultValue !== 'undefined') { // fallback to default
        return  defaultValue;

    } else { // or return undefined
        return undefined;
    }

};

camelToDash = function (str) {
    return str.replace(/\W+/g, '-').replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
};

camelCaseify = function(str) {
    return dashToCamel(str.replace(' ', '-'));
};

dashToCamel = function (str) {
    return str.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};

// ------------------------------ Theme Settings ------------------------------ //

themeSettings = {
    'useDropdowns': true // whether or not to use dropdown menus in a theme
};

getThemeSetting = function(setting, defaultValue){
    if(typeof themeSettings[setting] !== 'undefined'){
        return themeSettings[setting];
    }else{
        return typeof defaultValue === 'undefined' ? '' : defaultValue;
    }
};

// ---------------------------------- URL Helper Functions ----------------------------------- //
goTo = function(url){
    Router.go(url);
};

// This function should only ever really be necessary server side
// Client side using .path() is a better option since it's relative
// and shouldn't care about the siteUrl.
getRouteUrl = function (routeName, params, options) {
    options = options || {};
    var route = Router.url(
        routeName,
        params || {},
        options
    );
    return route;
};

getSignupUrl = function(){
    return getRouteUrl('atSignUp');
};
getSigninUrl = function(){
    return getRouteUrl('atSignIn');
};
