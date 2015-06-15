Template[getTemplate('layout')].helpers({
    mobile_nav: function () {
        return 'mobile_nav';
    },
    nav: function () {
        return 'nav';
    },
    messages: function () {
        return 'messages';
    },
    notifications: function () {
        return 'notifications';
    },
    footer: function () {
        return 'footer';
    },
    pageName : function(){
        return getCurrentTemplate();
    },
    heroModules: function () {
        return heroModules;
    },
    getTemplate: function () {
        return this.template;
    }
});

Template[getTemplate('layout')].rendered = function(){
    // favicon
    var link = document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = getSetting('faviconUrl', '/img/favicon.ico');
    document.getElementsByTagName('head')[0].appendChild(link);

};

Template[getTemplate('layout')].events({
    'click .inner-wrapper': function (e) {
        if ($('body').hasClass('mobile-nav-open')) {
            e.preventDefault();
            $('body').removeClass('mobile-nav-open');
        }
    }
});