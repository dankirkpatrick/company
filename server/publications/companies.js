// Publish a list of companies
Meteor.publish('allCompanies', function() {
    return Companies.find();
});

Meteor.publish('companySector', function(ticker) {
    var company = Companies.findOne({ticker:ticker});
    if (typeof(company) != 'undefined') {
        //console.log("Sector: ticker=%s sector=%s", company.ticker, company.gicsSector);
        return Companies.find({gicsSector:company.gicsSector});
    } else {
        return null;
    }
});

Meteor.publish('companyIndustry', function(ticker) {
    var company = Companies.findOne({ticker:ticker});
    if (typeof(company) != 'undefined') {
        //console.log("Industry: ticker=%s industry=%s", company.ticker, company.gicsSubIndustry);
        return Companies.find({gicsSubIndustry:company.gicsSubIndustry});
    } else {
        return null;
    }
});

// Publish a list of companies
Meteor.publish('singleCompany', function(ticker) {
    return Companies.find({ticker:ticker});
});

// Publish a list of companies
Meteor.publish('sectorCompanies', function(sector) {
    return Companies.find({gicsSector:sector});
});

// Publish a list of companies
Meteor.publish('industryCompanies', function(industry) {
    return Companies.find({gicsSubIndustry:industry});
});
