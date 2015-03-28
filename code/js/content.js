var values = [];
var elPassed=0;
var fetched=0;
var apply = function(numberOfEl){
	if(values.length===numberOfEl - 1){
		var max = parseInt(_.max(values, 'value').value);
		_.each(values, function(value){
			var result = 10 * parseInt(value.value);
			result = result/max;
			result = Math.floor(result);
			var render = '';
			for(var i=0; i <= result; i++){
				render+='|';
			}
			if(!jQuery(value.element).find('[data-col="note"]').length){
				jQuery(value.element).find('[data-col="title"]').find('.content').parent().before('<td data-col="note">' + render + '</td>');
			}
		})
	}
}
var fetchAll =  _.debounce(function(){
	if(fetched){
		return false;
	}
	fetched = true;
	$('.song-table').find('th[data-col="title"]').before('<th data-col="note">LF</th>');

	console.log('fetchAll');
	var numberOfEl = $('.song-row').length;
	$('.song-row').each(function( key, value ) {
		var title =  jQuery(value).find('[data-col="title"]').find('.content').clone().children().remove().end().text();
		var artist =  jQuery(value).find('[data-col="artist"]').find('.text').clone().children().remove().end().text();
		$.get("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=453b53a3e4a54335490c26d32a071201&artist=" + artist + "&track=" + title + "&format=json", function(data) {
			if(data && data.track){
				values.push(
				{
					id: artist+title,
					value: data.track.listeners,
					element: value
				}
				);
			}
			apply(numberOfEl);
		})
	});

}, 4000, {leading: false, trailing: true});

$('body').bind('DOMSubtreeModified', function(e) {
	if($('body').find('.song-table').length){
		$('.song-table').bind('DOMSubtreeModified', function(e) {
			fetchAll();
		});
	}
});


setTimeout(function(){
}, 10000);