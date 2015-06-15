// Publish a list of financials for a single company
Meteor.publish('companyFinancialsDates', function(ticker) {
    return Financials.find({ticker:ticker}, {fields:{rowLabels:0, rowModifiers:0, data:0}, sort:{financialsType:1, asOfDate:1}});
});

// Publish a list of financials for a single company
Meteor.publish('singleFinancials', function(id) {
    return Financials.find({_id:id});
});

// Publish a list of financials for a single company
Meteor.publish('companyTypeFinancials', function(ticker, financialsType) {
    return Financials.find({ticker:ticker, financialsType: financialsType}, {sort: {asOfDate: 1}});
});

