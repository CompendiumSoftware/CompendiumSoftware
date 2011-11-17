$(document).ready(function(){

	module('Confirm Button');


	test("simple default construction",1, function(){

		var button = $("<button/>").appendTo($("#qunit-fixture"));
		button.confirmButton();
		ok('initialization succeeded');
	});

	test("test click",1, function(){
		var button = $("<button/>").appendTo($("#qunit-fixture"));
		button.confirmButton();
		button.bind('confirmedclick', function(){
			fail("confirmed click shouldn't fire until confirm mode");
		});
		button.bind('click', function(){
			ok("clicks should stil fire");
		});

		button.click();
	});

	
	test("test confirm click",7, function(){
		var button = $("<button/>").appendTo($("#qunit-fixture"));
		button.confirmButton();
		button.bind('confirmedclick', function(){
			ok("in confirm mode confirm click should also fire");
		});
		button.bind('click', function(){
			ok("clicks should still fire");
		});

		button.confirmButton( 'mode', 'confirm');
		ok(!button.hasClass('ui-confirm'), 'ui-confirm style should not be applied until confirm mode');
		ok(button.hasClass('ui-confirm-normal'), 'ui-confirm-normal style should be set by default');

		stop();

		setTimeout(function(){
			equal('confirm', button.confirmButton('mode'), 'mode should change to confirm');
			ok(button.hasClass('ui-confirm'), 'confirm style should now be applied');
			ok(!button.hasClass('ui-confirm-normal'), 'normal style should be removed');
			button.click();
			start();
		}, 1000);
	});
	
	test("test interaction away from button",6, function(){
		var button = $("<button/>").appendTo($("#qunit-fixture"));
		button.confirmButton();
		button.bind('confirmedclick', function(){
			fail("if the button is no clicked, confirmedlickc should not fire");
		});

		button.confirmButton( 'mode', 'confirm');

		stop();

		setTimeout(function(){

			equal('confirm', button.confirmButton('mode'), 'mode should change to confirm');
			ok(button.hasClass('ui-confirm'), 'confirm style should now be applied');
			ok(!button.hasClass('ui-confirm-normal'), 'normal style should be removed');

			$(document).click();
			setTimeout(function(){
				equal('normal', button.confirmButton('mode'), 'after clickmode shoudl be normal again');
				ok(!button.hasClass('ui-confirm'), 'ui-confirm style should not be applied until confirm mode');
				ok(button.hasClass('ui-confirm-normal'), 'ui-confirm-normal style should be set by default');

				start();
			}, 1000);
		}, 1000);
	});
});
