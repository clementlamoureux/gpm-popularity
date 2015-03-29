var values = [];
var elPassed=0;
var fetched=0;

watchClicksEnabled = false;
var watchClicks = function(){
	if(!watchClicksEnabled){
		watchClicksEnabled = true;
		$('.song-table').find('thead').on('click', function(){
			setTimeout(function(){
				apply('all');
			}, 500);
		});
	}
}

var apply = function(numberOfEl){
	if(numberOfEl==='all' || values.length===numberOfEl){
		if(!$('.song-table').find('th[data-col="note"]').length){
			$('.song-table').find('th[data-col="title"]').before('<th data-col="note">LF</th>');
		}
		var max = parseInt(_.max(values, 'value').value);
		_.each(values, function(value){
			var result = 10 * parseInt(value.value);
			result = result/max;
			result = Math.ceil(result);
			var render = '';
			for(var i=0; i <= result; i++){
				render+='<span class="point"></span>';
			}
			$('.song-row').each(function(key, valueA){
				if($(valueA).find('[data-col="index"]').text()===value.track){
					$(valueA).find('[data-col="title"]').before('<td data-col="note">' + render + '</td>');
				}
			})
			
		});
		watchClicks()
	}
}
var fetchAll =  _.debounce(function(){
	if(fetched){
		apply('all');
		return false;
	}
	fetched = true;
	var numberOfEl = $('.song-row').length;
	$('.song-row').each(function( key, value ) {
		var title =  jQuery(value).find('[data-col="title"]').find('.content').clone().children().remove().end().text();
		var track =  jQuery(value).find('[data-col="index"]').find('.content').clone().children().remove().end().text();
		var artist =  jQuery(value).find('[data-col="artist"]').find('.text').clone().children().remove().end().text();
		$.get("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=453b53a3e4a54335490c26d32a071201&artist=" + artist + "&track=" + title + "&format=json", function(data) {
			if(data && data.track){
				values.push(
				{
					id: artist+title,
					track: track,
					value: data.track.listeners,
					element: value
				}
				);
			}else{
				values.push(
				{
					id: artist+title,
					value: 0,
					element: value
				}
				);
			}
			apply(numberOfEl);
		})
	});

}, 4000, {leading: false, trailing: true});

tableBindingDone = false;
tableBinding = function(){
	if(!tableBindingDone){
		tableBindingDone = true;

		$('.song-table').find('tbody').bind('DOMSubtreeModified', function(e) {
			console.log('substreemodified');
			fetchAll();
		});
	}

}
$('body').bind('DOMSubtreeModified', function(e) {
	if($('body').find('.song-table').length){
		tableBinding();
	}
});