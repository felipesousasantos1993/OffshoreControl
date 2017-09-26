$(document).ready(function() {
	funcoes();
});

function funcoes() {	
	$('[data-toggle="tooltip"]').tooltip();
	$('.datepicker').datepicker({
		language: 'pt-BR',
		format: 'dd/mm/yyyy'
	});
}


function parseDate(input) {
	if (undefined !== input)  {
		var parts = input.split('/');
		return new Date(parts[2], parts[1]-1, parts[0]); 
	}
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};