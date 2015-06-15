FinancialsSchema = new SimpleSchema({
    companyId: {
        type: String
    },
    ticker: {
        type: String
    },
    financialsType: {
        type: String
    },
    rowLabels: {
        type: [String],
        optional: true
    },
    asOfDate: {
        type: String
    },
    scale: {
        type: String,
        optional: true
    },
    data: {
        type: [Object],
        optional: true
    },
    'data.$.label': {
        type: String
    },
    'data.$.value': {
        type: String
    },
    'data.$.modifiers': {
        type: String,
        optional: true
    }
});

Financials = new Meteor.Collection('financials');
Financials.attachSchema(FinancialsSchema);
console.log('Created Financials collection');

insertFinancials = function(key, financials) {
    var keyParts = key.split(".");

    console.log('resultMetadata=%s', JSON.stringify(financials.resultMetadata));
    console.log('columnHeaders=%s', financials.resultMetadata.columnHeaders);
    console.log('length=%s', financials.resultMetadata.columnHeaders.length);
    var columnHeaders = financials.resultMetadata.columnHeaders;
    for (var i = 0; i < columnHeaders.length; i++) {
        var asOfDate = columnHeaders[i];
        var dataArray = financials.resultMetadata.rowHeaders.map(function(label, index) {
            return {
                label:label,
                value:financials.result[asOfDate][label],
                modifiers:financials.resultMetadata.rowModifiers[index]
            };
        });
        console.log('data=%s', JSON.stringify(dataArray));

        var insertFinancials = Financials.findOne({ticker: keyParts[0], financialsType: keyParts[1], asOfDate: asOfDate});

        if (insertFinancials == null) {
            var company = Companies.findOne({ticker: keyParts[0]});
            console.log("company:%s", JSON.stringify(company, null, 2));
            insertFinancials = {
                asOfDate: asOfDate,
                companyId: company._id,
                ticker: keyParts[0],
                financialsType: keyParts[1],
                rowLabels: financials.resultMetadata.rowHeaders,
                scale: financials.resultMetadata.scale,
                data: dataArray
            };
            //console.log("inserting:%s", JSON.stringify(insertFinancials, null, 2));
            Financials.insert(insertFinancials);
            console.log("Inserted financials - ticker:%s type:%s asOfDate:%s", keyParts[0], keyParts[1], asOfDate);
        } else {
            Financials.update({_id: insertFinancials._id},
                {$set:{
                    rowLabels: financials.resultMetadata.rowHeaders,
                    scale: financials.resultMetadata.scale,
                    data: dataArray
                }});
            console.log("Updated financials - ticker:%s type:%s asOfDate:%s", keyParts[0], keyParts[1], asOfDate);
        }
    }
};
