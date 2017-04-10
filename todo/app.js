/**
 * Created by 4kshay on 1/17/2017.
 */

module.exports = function (app) {
    app.get('/hello/:name', function(req, res){
        res.send('hello ' + req.params.name + ' age:' + req.query.age);
    });
    app.get('/todo', readAllTodos);

    var todos = [
        {title: 'Milk', note: 'Buy Organic'},
        {title: 'Bread', note: 'One loaf'}
    ];

    function readAllTodos(req, res) {
        res.json(todos);
    }
};