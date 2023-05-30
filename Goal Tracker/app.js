var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongojs = require('mongojs');
const db = mongojs('mongodb://127.0.0.1:27017/goaltracker',['goals'])


app.use(bodyParser.json());
app.set("view engine", "html");
app.set("client", path.join(__dirname, "client"));
app.use(express.static(path.join(__dirname, "client")));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/client' +'/index.html'));
});

app.get('/goals', function(req, res){
    db.goals.find(function(err, docs){
        if(err){
            res.send(err);
        }else{
            console.log('Getting goals...');
            res.json(docs);
        }
    });
});

app.post('/goals', function(req, res){
    db.goals.insert(req.body, function(err, docs){
        if(err){
            res.send(err);
        }else{
            console.log('Adding goals...');
            res.json(docs);
        }
    });
});

app.put('/goals/:id', function(req, res){
    db.goals.findAndModify({query:{_id: mongojs.ObjectId(req.params.id)},
    update: {$set:{
        name: req.body.name,
        type: req.body.type,
        deadline: req.body.deadline
    }}, 
    new: true
    },function(err, docs){
        if(err){
            res.send(err);
        }else{
            console.log('Updating goals...');
            res.json(docs);
        }
    });
});

app.delete('/goals/:id', function(req, res){
    db.goals.remove({_id: mongojs.ObjectId(req.params.id)}, function(err, docs){
        if(err){
            res.send(err);
        }else{
            console.log('Removing goals...');
            res.json(docs);
        }
    });
});

app.listen(3000);
console.log('Running on port 3000..');