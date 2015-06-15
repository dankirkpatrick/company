CompanyDataController = RouteController.extend({
    template: 'company_data',
    getTitle: function () {
        return 'Company Data for ' + this.params.ticker;
    },
    waitOn: function() {
        this.companySub = Meteor.subscribe('singleCompany', this.params.ticker);
        this.financialsSub = Meteor.subscribe('companyFinancialsDates', this.params.ticker);
        this.sectorSub = Meteor.subscribe('companySector', this.params.ticker);
        this.industrySub = Meteor.subscribe('companyIndustry', this.params.ticker);
        /*
        var sector = Session.get('sector');
        if (sector) {
            this.sectorSub = Meteor.subscribe('sectorCompanies', sector);
        }
        var industry = Session.get('industry');
        if (industry) {
            this.industrySub = Meteor.subscribe('industryCompanies', industry);
        }
        */
        return [this.companySub, this.financialsSub, this.sectorSub, this.industrySub];
    },
    company: function() {
        return Companies.findOne({ticker: this.params.ticker});
    },
    sector: function(sect) {
        return Companies.find({gicsSector: sect});
    },
    industry: function(ind) {
        return Companies.find({gicsSubIndustry: ind});
    },
    financials: function() {
        return Financials.find({ticker: this.params.ticker}, {sort: {financialsType:1, asOfDate:1}});
    },
    data: function() {
        var company = this.company();
        var sectorCompanies = (typeof(company) != 'undefined')? this.sector(company.gicsSector) : null;
        var industryCompanies = (typeof(company) != 'undefined')? this.industry(company.gicsSubIndustry) : null;
        var columnCount = 0;
        var dataCount = {};
        var financials = [];
        var columnHeaders = [];
        var allFinancials = this.financials().fetch();
        var ticker = this.params.ticker;
        allFinancials.forEach(function(f) {
            if (!dataCount.hasOwnProperty(f.financialsType)) {
                columnHeaders[columnCount] = {
                    link: '/financials/' + ticker + '/' + f.financialsType,
                    text: f.financialsType
                };
                dataCount[f.financialsType] = { column: columnCount++, count: 0 };
            }
            if (typeof(financials[dataCount[f.financialsType].count]) == 'undefined') {
                financials[dataCount[f.financialsType].count] = [];
            }
            //console.log('storing [%d, %d]: %s', dataCount[f.financialsType].count, dataCount[f.financialsType].column, f.asOfDate);
            financials[dataCount[f.financialsType].count++][dataCount[f.financialsType].column] = {
                link: '/financials/' + f._id,
                text: f.asOfDate
            }
        });

        for (var i = 0; i < financials.length; i++) {
            for (var j= 0; j < financials[i].length; j++) {
                if (financials[i][j] == null) {
                    financials[i][j] = { link: "#", text: "" };
                }
            }
        }

        return {
            company:company,
            sectorCompanies:sectorCompanies,
            industryCompanies: industryCompanies,
            financialsHeaders: columnHeaders,
            financials:financials
        };
    },
    fastRender: true
});

Meteor.startup(function () {
    Router.route('/company/:ticker', {
        name: 'company_data',
        controller: CompanyDataController,
        template: 'company_data'
    });
});