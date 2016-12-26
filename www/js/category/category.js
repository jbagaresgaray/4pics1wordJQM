$(document).ready(function(){
	'use strict';

	console.log('category');

	$('#sports_card').click(function(){
		console.log('sports_card');
		// $.mobile.changePage( "../templates/game.html", { transition: "pop", changeHash: false });
		window.location.href= "game.html";
	});

	$('#vocabulary_card').click(function(){
		console.log('sports_card');
	});

	$('#countries_card').click(function(){
		console.log('sports_card');
	});

	$('#computer_card').click(function(){
		console.log('sports_card');
	});
});
