var app = angular.module('politiko', ['ui', 'ui.bootstrap']);

app.controller('Politiko', function ($scope){

	$scope.pending = 0;

	['cands', 'issues', 'stances', 'sources'].forEach(function (table){
		$scope[table] = [];
		$scope.pending++;
		Papa.parse('data/' + table + '.csv', {
			download: true,
			header: true,
			complete: function (r){
				$scope[table] = r.data;
				if (!--$scope.pending){ $scope.postProcessing(); }
			}
		});
	});

	$scope.positions = [
		{name: "President", id: "p"},
		{name: "Vice President", id: "vp"},
		// {name: "Senator", id: "s"}
	];

	$scope.postProcessing = function (){
		$scope.offset = $scope.issues.length * 2 + 10; // used for offsetting negative values when sorting candidates
		$scope.curIssue = $scope.issues[0];
	}

	$scope.isCollapsed = true;

	$scope.stanceMap = {
		for: 1,
		noStand: 0,
		NA: 0,
		against: -1
	}

	/////////////////// END OF PARSING //////////////////////////

	$scope.view = 'quiz';
	$scope.includeDeductions = {value: true};

	$scope.setView = function (view) {
		$scope.view = view;
	}

	$scope.setCurIssue = function (issue){
		$scope.curIssue = issue;
	}

	$scope.candOrder = function (cand){
		return [$scope.offset - cand.score, cand.name];
	}

	$scope.source = function(cand, issue){
		return $scope.sources.find(function (stance){
			return stance.name == cand.name;
		})[issue.name];
	}

	$scope.update = function (){

		$('div#question').fadeOut(200, function (){
			$scope.$apply(function (){

				for(var i in $scope.cands){

					var cand = $scope.cands[i];
					cand.breakdown = [];
					var score = 0;
					for(var i in $scope.issues){
						var issue = $scope.issues[i];
						var myStance = issue.weight ? issue.weight : 0;
						var candStance = $scope.stanceMap[$scope.getStance(cand, issue)];
						var weight = myStance * candStance;

						if(!!weight){
							cand.breakdown.push({
								name: issue.name,
								weight: weight,
								src: $scope.sources.find(function (src){
									return src.name == cand.name;
								})[issue.name]
							});
							score += weight;
						}

					}

					cand.score = score;

				}

				$scope.curIssue = $scope.issues[Math.min($scope.issues.indexOf($scope.curIssue) + 1, $scope.issues.length - 1)];

				$('div#question').fadeIn(300);

			});
		});

	}

	$scope.getCands = function (pos){
		return $scope.cands.filter(function (c){
			return c.pos === pos.id;
		});
	}

	$scope.getStance = function (cand, issue){
		return $scope.stances.find(function (s){
			return s.name == cand.name;
		})[issue.name];
	}

	$scope.getIcon = function (weight){
		var result;
		switch(weight) {
			case "-2":
			case "-1":
				result = "icon-minus";
				break;
			case "0":
				result = "icon-question-sign";
				break;
			case "1":
			case "2":
				result = "icon-plus";
				break;
			default:
				result = "";
		}
		return result;
	}

});