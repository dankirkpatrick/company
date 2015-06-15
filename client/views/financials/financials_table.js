Template['financials_table'].helpers({
    value: function() {
        return this;
    },
    cellValue: function() {
        return "<" + this.type + (this.classes? (" class=\""+this.classes+"\"") : "") + ">"
            + this.text + "</" + this.type + ">";
    },
    openTag: function() {
        return "<" + this.type + (this.classes? (" class=\""+this.classes+"\"") : "") + ">";
    },
    closeTag: function() {
        return "</" + this.type + ">";
    }
});
