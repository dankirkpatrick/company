Template[getTemplate('footer')].helpers({
    footerModules: function () {
        return footerModules;
    },
    getTemplate: function () {
        return getTemplate(this.template);
    }
});