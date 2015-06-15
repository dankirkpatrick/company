Meteor.startup(function () {
    Router.route('/store/:_collection/:_key', {where: 'server'})
        .get(function () {
            this.response.writeHead(200, {'Content-Type': 'application/json'});
            var table = {}; // TODO: implement me
            this.response.end(JSON.stringify(table));
        })
        .put(function () {
            var key = this.params._key;
            var collection = this.params._collection;
            var item = this.request.body;
            console.log('updating collection:%s key:%s', collection, key);
            //console.log(JSON.stringify(item, undefined, 2));
            // TODO: implement me
            this.response.end('Successfully updated collection:' + collection + '  key:' + key);
        })
        .post(function () {
            var collectionName = this.params._collection;
            //var collection = collections[collectionName];
            var key = this.params._key;
            var item = this.request.body;
            console.log('inserting collection:%s key:%s', collectionName, key);
            //console.log(JSON.stringify(item, undefined, 2));
            if (collectionName == 'financials') {
                insertFinancials(key, item);
            } else if (collectionName == 's_p500') {
                insertS_P500(key, item);
            } else {
                console.log('No implementation for storing collection: %', collectionName);
            }
            // TODO: implement me
            console.log('inserted collection:%s key:%s', collectionName, key);
            this.response.statusCode = 200;
            this.response.end('Successfully inserted item: ' + key.toString() + '\n');
        });
});