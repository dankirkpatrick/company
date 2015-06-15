FinancialsDataController = RouteController.extend({
    template: 'financials_data',
    getTitle: function() {
        var fin = this.financials();
        if (!!fin) {
            return fin.ticker + ": " + fin.financialsType;
        }
    },
    waitOn: function() {
        this.financialsSub = Meteor.subscribe('singleFinancials', this.params.financialsId);
        return this.financialsSub;
    },
    financials: function() {
        return Financials.findOne({_id: this.params.financialsId});
    },
    data: function() {
        return this.financials();
    },
    fastRender: true
});

Meteor.startup(function () {
    Router.route('/financials/:financialsId', {
        name: 'financials_data',
        controller: FinancialsDataController,
        template: 'financials_data'
    });
});