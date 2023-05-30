function getGoals(){
    $.get('http://localhost:3000/goals', function(data){
        viewModel.goals(data);
    });
}

function ViewModel(){
    var self = this;
    self.goals = ko.observableArray();
    self.goalInputName = ko.observable();
    self.goalInputType = ko.observable();
    self.goalInputDeadline = ko.observable();
    self.selectedGoals = ko.observableArray();
    self.isUpdate = ko.observable(false);
    self.updateId = ko.observable();

    self.canEdit = ko.computed(function(){
        return self.selectedGoals().length > 0;
    });

    self.addGoal = function(){
        var name = $('#name').val();
        var type = $('#type').val();
        var deadline = $('#deadline').val();


        $.ajax({
            url: 'http://localhost:3000/goals',
            data: JSON.stringify({
                "name": name,
                "type": type,
                "deadline": deadline
            }),
            type: "POST",
            contentType: "application/json",
            success: function(data){
                self.goals.push({
                    _id : data._id,
                    name: data.name,
                    type: data.type,
                    deadline: data.deadline
                });
                console.log('Goal added...');
            },
            error: function(xhr,status,err){
                console.log(err);
            }
        });
        self.goalInputName = "";
    }

    self.editSelect = function(){
        self.updateId = self.selectedGoals()[0];
        var goal = self.goals.pop(x => x._id === self.updatedId)

        self.isUpdate(true);
        self.goalInputName(goal.name);
        self.goalInputType(goal.type);
        self.goalInputDeadline(goal.deadline);

    }

    self.updateGoal = function(){
        var id = self.updateId;
        var name = $('#name').val();
        var type = $('#type').val();
        var deadline = $('#deadline').val();


        $.ajax({
            url: 'http://localhost:3000/goals/'+ id,
            data: JSON.stringify({
                "name": name,
                "type": type,
                "deadline": deadline
            }),
            type: "PUT",
            contentType: "application/json",
            success: function(data){
                self.goals.push({
                    _id : data._id,
                    name: data.name,
                    type: data.type,
                    deadline: data.deadline
                });
                console.log('Goal updated...');
            },
            error: function(xhr,status,err){
                console.log(err);
            }
            
        });
        self.selectedGoals.removeAll();
        self.goalInputName = "";
        self.isUpdate(false);
        
    }

    self.deleteSelect = function(){
        $.each(self.selectedGoals(), function(index, value){
            
            $.ajax({
                url: 'http://localhost:3000/goals/' + value,
                type: "DELETE",
                async: true,
                timeout: 300000,
                success: function(data){
                    console.log('Goal removed...');
                },
                error: function(xhr,status,err){
                    console.log(err);
                }
            });
            self.goals.remove(x => x._id === value);
            self.selectedGoals.removeAll();
        });
        
    }

    self.types = ko.observableArray(['Health & fitness', 'Professional', 'Relationship']);
}

var viewModel = new ViewModel();

ko.applyBindings(viewModel);