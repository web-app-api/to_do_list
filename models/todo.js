const
    mongoose = require('mongoose'),
    _ = require('underscore'),
    mongoosePaginate = require('mongoose-paginate-v2');
const
    Type = mongoose.SchemaTypes;

const TodoSchema = mongoose.Schema({
    id: { type: Type.ObjectId },
    content: { type: Type.String, required: true },
    isDone: { type: Type.Boolean, default: false },
    priority: { type: Type.Number, max: 3, min: 1, default: 1 },
    order: { type: Type.Number },
    date: { type: Date, default: Date.now },

});

// add plugins
TodoSchema.plugin(mongoosePaginate);

// Define a pre-save method for TodoSchema
TodoSchema.pre('save', function(next) {
    var self = this;

    module.exports.find({}, function(err, doc) {
        // https://underscorejs.org/#max
        let lastOrder = (_.max(doc, d => d.order).order) || 0;
        self.order = lastOrder + 1;
        next();
    });

});

module.exports = mongoose.model('Todo', TodoSchema);