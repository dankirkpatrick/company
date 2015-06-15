FinancialsTableController = RouteController.extend({
    template: 'financials_table',
    getTitle: function() {
        return this.params.ticker + ': ' + this.params.financialType;
    },
    waitOn: function() {
        this.financialsSub = Meteor.subscribe('companyTypeFinancials', this.params.ticker, this.params.financialsType);
        return this.financialsSub;
    },
    financials: function() {
        return Financials.find({ticker: this.params.ticker, financialsType: this.params.financialsType});
    },
    data: function() {
        var fin = this.financials().fetch();
        //console.log("fin: %s", JSON.stringify(fin));
        var table = [];

        table[0] = [ { type: 'th', text: this.params.financialsType, classes: 'table_title' } ];
        fin.forEach(function (f, colIndex) {
            table[0][colIndex+1] = { type: 'th', text: f.asOfDate, classes: 'column_header header' };
            if (!!f.rowLabels) f.rowLabels.forEach(function (label, rowIndex) {
                if (colIndex == 0) {
                    table[rowIndex+1] = [ { type: 'th', text: label, classes: 'rowHeader header' } ];
                }
                table[rowIndex+1][colIndex+1] = { type: 'td', text: f.data[rowIndex].value, classes: 'data '+f.data[rowIndex].modifiers };
            });
        });

        //console.log('Financials=%s',JSON.stringify(table));
        return { ticker: this.params.ticker, financialsType: this.params.financialsType, rows: table };
    },
    fastRender: true
});

Meteor.startup(function () {
    Router.route('/financials/:ticker/:financialsType', {
        name: 'financials_table',
        controller: FinancialsTableController,
        template: 'financials_table'
    });
});