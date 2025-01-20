const mongoDB = require('mongoose');

const ToDolistSchema = mongoDB.Schema({
    TodoList: {
        type: String,
        required: true
    },
    Description: String,
    Status: String
}, {
    timestamps: true
});
const ToDolist = mongoDB.model('ToDolist', ToDolistSchema);

module.exports = ToDolist;