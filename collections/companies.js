CompanySchema = new SimpleSchema({
    ticker: {
        type: String
    },
    market: {
        type: String
    },
    name: {
        type: String
    },
    headquarters: {
        type: String
    },
    quoteLink: {
        type: String
    },
    secFilingsLink: {
        type: String
    },
    gicsSector: {
        type: String
    },
    gicsSubIndustry: {
        type: String
    },
    cik: {
        type: String
    },
    /*
    commentCount: {
        type: Number,
        optional: true,
        autoform: {
            omit: true
        }
    },
    */
    dateFirstAdded: {
        type: Date,
        optional: true
    }
});

Companies = new Meteor.Collection('companies');
Companies.attachSchema(CompanySchema);
console.log('Created Companies collection');

insertS_P500 = function(key, item) {
    if (key == 'changes') {
        console.warn('S&P 500 changes are not yet handled.');
    } else if (key == 'components') {
        var companyList = JSON.parse(item.result.toString());
        for (var companyName in companyList) {
            var oldCompany = Companies.findOne({ticker: companyName});
            var company = companyList[companyName];
            if (oldCompany == null) {
                var companyDetails = {
                    ticker: company["Ticker symbol"],
                    market: company["Market"].toUpperCase(),
                    name: company["Security"],
                    headquarters: company["Address of Headquarters"],
                    quoteLink: company["Quote Link"],
                    secFilingsLink: company["SEC filings"],
                    gicsSector: company["GICS Sector"],
                    gicsSubIndustry: company["GICS Sub Industry"],
                    cik: company["CIK"]
                };
                var dfa = company["Date first added"];
                if (dfa) {
                    if (dfa.indexOf('[') != -1) {
                        dfa = dfa.substring(0, dfa.indexOf('['));
                    }
                    console.log('Date first added: %s', dfa);
                    companyDetails.dateFirstAdded = Date.parse(dfa);
                }

                Companies.insert(companyDetails);
                console.log("inserted company: %s", JSON.stringify(companyDetails, null, 2));
            } else {
                var companyDetails = {
                    ticker: company["Ticker symbol"],
                    market: company["Market"].toUpperCase(),
                    name: company["Security"],
                    headquarters: company["Address of Headquarters"],
                    quoteLink: company["Quote Link"],
                    secFilingsLink: company["SEC filings"],
                    gicsSector: company["GICS Sector"],
                    gicsSubIndustry: company["GICS Sub Industry"],
                    cik: company["CIK"]
                };
                var dfa = company["Date first added"];
                if (dfa) {
                    if (dfa.indexOf('[') != -1) {
                        dfa = dfa.substring(0, dfa.indexOf('['));
                    }
                    console.log('Date first added: %s', dfa);
                    companyDetails.dateFirstAdded = Date.parse(dfa);
                }

                Companies.update({_id: oldCompany._id}, { $set: companyDetails});
                console.log("updated company: %s", JSON.stringify(companyDetails, null, 2));
            }
        }
    } else {
        console.error('unrecognized S&P 500 key: %s', key);
    }
};

insertCompany = function(key, company_details) {
    var keyParts = key.split(".");

    var company = Companies.findOne({company: keyParts[0]});
    if (company == null) {
        company = {};
        company.company = keyParts[0];
        company[keyParts[1]] = company_details;
        Companies.insert(company);
    } else {
        var element = {};
        element[keyParts[1]] = company_details;
        Companies.update({_id: company._id}, { $set: element});
    }
};

CompanyPages = new Meteor.Pagination(Companies, {
    router: 'iron-router',
    homeRoute: ['/', '/companies'],
    itemTemplate: 'company',
    route: 'companies',
    routerTemplate: 'companies',      // default: 'pages'
    //templateName: 'companies',
    perPage: 20,
    sort: {
        ticker: 1
    }
});