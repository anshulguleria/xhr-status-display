$(document).ready(function () {

	

	$('#xhr-init').on('click', function () {
		$.ajax({
			url: 'test.txt',
			contentType: 'application/javascript',
			success: function(response){
				console.log('xhr success');
				console.log('object is: ', response);
			},
			error: function (err) {
				console.log('xhr failure');
			}
		});				
	});
});