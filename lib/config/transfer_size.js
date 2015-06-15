Router.configureBodyParsers = function() {
    this.onBeforeAction(Iron.Router.bodyParser.json({limit: '10mb'}));
};
