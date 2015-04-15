var values = [];
var elPassed=0;

watchClicksEnabled = false;
var watchClicks = function(){
	if(!watchClicksEnabled){
		watchClicksEnabled = true;
		$('.song-table').find('thead').on('click', function(){
			setTimeout(function(){
				apply('all');
			}, 500);
		});
		var temp = _.debounce(function(){
			setTimeout(function(){
				apply('all');
			}, 50);
		}, 250);
		$('#music-content').bind('scroll', function(){
			temp();
		});
	}
}

var apply = function(numberOfEl){
	if(numberOfEl==='all' || values.length===numberOfEl){
		var max = parseInt(_.max(values, 'value').value);
		_.each(values, function(value){
			var result = 10 * parseInt(value.value);
			result = result/max;
			result = Math.ceil(result) * 1.5;
			var render = '<span class="point" style="width:' + result + 'px">' + value.value + '</span>';
			$('.song-row').each(function(key, valueA){
				if($(valueA).find('[data-col="title"]').text()===value.title &&
					$(valueA).find('[data-col="album"]').text()===value.album &&
					$(valueA).find('[data-col="artist"]').text()===value.artist){
					if(!$(valueA).find('[data-col="note"]').length) {
						$(valueA).find('[data-col="title"]').prepend('<div data-col="note">' + render + '</div>');
					}
				}
			})
			
		});
		watchClicks()
		$('button.button[data-id="lf"]').html(values.length);
	}
}
var fetchAll =  _.debounce(function(){
	var numberOfEl = $('.song-row').length;
	$('.song-row').each(function( key, value ) {
		var title =  jQuery(value).find('[data-col="title"]').find('.content').clone().children().remove().end().text();
		var album =  jQuery(value).find('[data-col="album"]').find('.content').find('.text').text();
		var artist =  jQuery(value).find('[data-col="artist"]').find('.text').clone().children().remove().end().text();
		if(_.findIndex(values, {title: title, artist:artist,album:album}) === -1){
			$.get("https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=453b53a3e4a54335490c26d32a071201&artist=" + artist + "&track=" + title + "&format=json", function(data) {
				if(data && data.track){
					values.push(
					{
						artist: artist,
						album: album,
						title: title,
						value: data.track.playcount,
						element: value
					}
					);
				}else{
					values.push(
					{
						artist: artist,
						album: album,
						title: title,
						value: 0,
						element: value
					}
					);
				}
				apply(numberOfEl);
			});
		}else{
			apply(numberOfEl);
		}
	});

}, 100, {leading: false, trailing: true});

tableBindingDone = false;
tableBinding = function(){
	if(!tableBindingDone){
		tableBindingDone = true;
		$('.song-table').find('tbody').bind('DOMSubtreeModified', function(e) {

		});
	}

}
$('body').bind('DOMSubtreeModified', function(e) {
	if($('body').find('.song-table').length){
		if(!$('button[data-id="lf"]').length){
			$('button#extra-links-container').before('<button class="button" data-id="lf"><div class="icon"></div></button>');
			$('button[data-id="lf"]').click(function(){
				tableBinding();
				fetchAll();
			});
			//$('body').unbind('DOMSubtreeModified');
		}
	}
});