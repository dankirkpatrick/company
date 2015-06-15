primaryNav = [
    {
        template: 'viewsMenu',
        order: 10
    },
    {
        template: 'adminMenu',
        order: 20
    }
];

secondaryNav = [
    {
        template:'notificationsMenu',
        order: 10
    }
];

// array containing items in the admin menu
adminMenu = [];

// array containing items in the views menu
viewsMenu = [
    {
        route: 'companies',
        label: 'companies',
        description: 'company_financials'
    }
];

heroModules = [];

footerModules = [];

threadModules = [];

// ------------------------------------- Schemas -------------------------------- //

// array containing properties to be added to the settings schema on startup.
addToSettingsSchema = [];

// ------------------------------ Dynamic Templates ------------------------------ //

templates = {};

getTemplate = function (name) {
    // if template has been overwritten, return this; else return template name
    return !!templates[name] ? templates[name] : name;
};
