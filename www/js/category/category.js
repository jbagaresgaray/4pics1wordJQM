$(document).ready(function(){
	'use strict';

	console.log('category');

	$(document).on("click","#sports_card",function(){
		console.log('sports_card');
		$.mobile.changePage("#game");
	});

	$(document).on("click","#vocabulary_card",function(){
		console.log('vocabulary_card');
		$.mobile.changePage("#game");
	});

	$(document).on("click","#countries_card",function(){
		console.log('countries_card');
		$.mobile.changePage("#game");
	});

	$(document).on("click","#computer_card",function(){
		console.log('computer_card');
		$.mobile.changePage("#game");
	});
});
