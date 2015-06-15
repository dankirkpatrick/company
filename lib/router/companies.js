// Controller for all posts lists
CompaniesListController = RouteController.extend({
    view: 'companies_list',
    before: function() {
        if(Meteor.isClient) {
            if (this.params.skip) {
                console.log("Setting skip to: %s", this.params.skip);
                Session.set("companySkip", this.params.skip);
            }
        }
        this.next();
    },
    waitOn: function() {
        this._terms = {
            view: this.view,
            //skip: this.params.skip || 0,
            //limit: getSetting('companiesPerPage', 20),
            category: this.params.slug
        };

        if(Meteor.isClient) {
            this._terms.query = Session.get("searchQuery");
            //this._terms.skip = Session.get("companySkip");
        }

        console.log("Core sub terms=%s", JSON.stringify(this._terms, null, 2));
        this.companiesSub = coreSubscriptions.subscribe('companiesList', this._terms);
        //this._terms.skip = this.params.skip || 0;
        //this._terms.limit = getSetting('companiesPerPage', 20);
        //this.companiesSub = Meteor.subscribe('companiesList', this._terms);
        return this.companiesSub;
    },
    /*
     subscriptions: function () {
     // take the first segment of the path to get the view, unless it's '/' in which case the view default to 'top'
     // note: most of the time this.params.slug will be empty
     this._terms = {
     view: this.view,
     skip: this.params.skip || 0,
     limit: this.params.limit || getSetting('companiesPerPage', 20),
     category: this.params.slug
     };

     if(Meteor.isClient) {
     this._terms.query = Session.get("searchQuery");
     }

     //console.log("terms=%s", JSON.stringify(this._terms, null, 2));
     this.companiesSub = coreSubscriptions.subscribe('companiesList', this._terms);
     },
     */

    data: function () {

        var skip = Session.get("companySkip");
        if(Meteor.isClient) {
            this._terms.query = Session.get("searchQuery");
            this._terms.skip = skip;
            this._terms.limit = getSetting('companiesPerPage', 20);
        }

        var parameters = getCompaniesParameters(this._terms);
        console.log("Parameters=%s", JSON.stringify(parameters, null, 2));

        var companies = Companies.find(parameters.find, parameters.options);
        var companyCount = companies.count();
        console.log("Company Count=%d", companyCount);

        return {
            companiesCursor: companies,
            companiesReady: this.companiesSub.ready(),
            hasPrevCompanies: skip > 0,
            hasNextCompanies: limit == companyCount,
            loadPrevHandler: function () {
                var categorySegment = Session.get('categorySlug') ? Session.get('categorySlug') + '/' : '';

                // TODO: use Router.path here?
                Router.go('/companies/' + categorySegment + (skip - limit));
            },
            loadNextHandler: function () {
                var categorySegment = Session.get('categorySlug') ? Session.get('categorySlug') + '/' : '';
                var next = parseInt(skip) + parseInt(limit);
                console.log('view:%s', Session.get('view'));
                console.log('categorySegment:%s', categorySegment);
                console.log('next:%s', next);
                // TODO: use Router.path here?
                Router.go('/companies/' + categorySegment + next);
            }
        };
    },

    onBeforeAction: function() {
        if (! this.post()) {
            if (this.postSubscription.ready()) {
                this.render(getTemplate('not_found'));
            } else {
                this.render(getTemplate('loading'));
            }
        } else {
            this.next();
        }
    },

    getTitle: function () {
        console.log('looking up view:%s', this.view);
        return i18n.t(this.view) + ' - ' + getSetting('title', "Scraper GUI");
    },

    getDescription: function () {
        if (Router.current().route.getName() == 'companies_default') { // return site description on root path
            return getSetting('description');
        } else {
            return i18n.t(_.findWhere(viewsMenu, {label: this.view}).description);
        }
    },

    onAfterAction: function() {
        Session.set('view', this.view);
    },

    fastRender: true
});

// Controller for company page

CompanyPageController = RouteController.extend({

    waitOn: function() {
        this.companySubscription = coreSubscriptions.subscribe('singleCompany', this.params.ticker);
        return [
            this.companySubscription,
            coreSubscriptions.subscribe('companyFinancials', this.params.ticker)
        ];
    },

    company: function() {
        var company = Companies.findOne({ticker: this.params.ticker});
        //console.log('Ticker:%s  Company:%s', this.params.ticker, JSON.stringify(company, null, 2));
        return company;
    },

    financials: function() {
        var financials = Financials.find({ticker: this.params.ticker});
        return financials;
    },

    getTitle: function () {
        if (!!this.company())
            return this.company().ticker + ' - ' + getSetting('title', "Scraper");
    },

    onBeforeAction: function() {
        if (! this.company()) {
            if (this.companySubscription.ready()) {
                this.render(getTemplate('not_found'));
            } else {
                this.render(getTemplate('loading'));
            }
        } else {
            this.next();
        }
    },

    /*
     onRun: function() {
     var sessionId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
     Meteor.call('increaseCompanyViews', this.params._id, sessionId);
     this.next();
     },
     */

    data: function() {
        var obj = {
            company: this.company(),
            financials: this.financials()
        };
        console.log("financials: %s", JSON.stringify(obj.financials.fetch(), null, 2));
        return obj;
    },
    fastRender: true
});

Meteor.startup(function () {

    /*
    Router.route('/companies', {
        name: 'companies_default',
        //  controller: getDefaultViewController(),
        controller: CompaniesListController,
        template: getTemplate('companies_list')
        //controller: getDefaultViewController()
    });

    Router.route('/companies/:skip?', {
        name: 'companies_list',
        controller: CompaniesListController,
        template: getTemplate('companies_list')
    });
*/
    // Company Page

    Router.route('/companies/company/:ticker', {
        name: 'company_page',
        controller: CompanyPageController,
        template: getTemplate('company_page')
    });

    Router.route('/companies/company/:_id/comment/:commentId', {
        name: 'company_page_comment',
        controller: CompanyPageController,
        onAfterAction: function () {
            // TODO: scroll to comment position
        }
    });
});
