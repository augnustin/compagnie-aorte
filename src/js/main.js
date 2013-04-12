var myGetJSON = function(jsonFile, shower) {
	$.getJSON('json/'+jsonFile+'.json', shower);
};

window.onload=function(){

	window.onpopstate = function (e) {
		if (e.state) {
			showContentWithPage(e.state.page);
		}
	};
	var page = window.location.href.split('#!')[1];
	if(page) {
		remIntro(page);
	} else {
		// $('#intro').one('click',remIntro); // REMOVE WHEN WEBSITE READY !
	}

	myGetJSON('prochaines_dates', appendProchainesDates);
	myGetJSON('spectacles', appendSpectacles);
	myGetJSON('photos', appendPhotos);
	myGetJSON('videos', appendVideos);

	$(document).on('click', '.link', showContent);

	$('.menu_list').hover(function() {
		$(this).find('.sub_menu').slideToggle(500);
	});

};

var remIntro = function(page) {
	if(typeof(page) !== 'string') {
		page = 'en_ce_moment';
	}
	if( $('.link[data-link='+page+']').length > 0) {
		$('#intro').fadeOut(1000, function() {
			$(this).remove();
		});
		showContentWithPage(page);
	} else {
		setTimeout(function() {
			remIntro(page);
		}, 1000);
	}
};

var showContentWithPage = function(page) {
	($.proxy(showContent, $('.link[data-link='+page+']')))();
};

var showContent = function() {
	page = $(this).attr('data-link');

	if($('section.content#'+page).length === 0) {
		page = '404';
	}

	$('.link').removeClass('active');
	$(this).addClass('active');
	$('section.content').stop().fadeOut(1000);
	$('section.content#'+page).stop().fadeIn(1000);

	if($('section.content#'+page).hasClass('lazy')) {
		loadPictures($('section.content#'+page));
	}

	if (!history.state || history.state.page !== page) {
		history.pushState({
			page: page
		}, 'Compagnie Aorte - '+page, '#!'+page);
		document.title = 'Compagnie Aorte - '+page;
	}
};

var loadPictures = function (section) {
	section.find('img').each(function(i, img) {
		img.src = $(img).attr('src-lazy');
	});
};


// var appendMembreEquipe = function(e) {
// 	var that = $(this);
// 	// $('body').append('<div id="picView"><div id="picContent"><img class="cv-image" src="'+$(this).find('img').attr('src')+'" /><img class="cv-video" src="'+$(this).find('img').attr('src')+'" /><div class="description">'+$(this).find('.title').text()+'</div><div class="close"></div></div></div>');
// 	$('body').append('<div id="picView"><div id="picContent"><div id="cv-image" class="cv"><div class="card front"><img src="'+$(this).find('img').attr('src')+'" /><div class="description">'+$(this).find('.nom').text()+'</div></div><div class="card back"><a href="'+$(this).find('img').attr('data-src-cv')+'" target="_blank"><img src="'+$(this).find('img').attr('data-src2')+'" /></a></div></div><div id="cv-video" class="cv"><div class="card front"><img src="'+$(this).find('img').attr('data-video-img')+'" /><div class="description">'+$(this).find('.nom').attr('data-nom-perso')+'</div></div><div class="card back"><iframe src="http://player.vimeo.com/video/'+$(this).find('img').attr('data-video-id')+'" width="300" height="200" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen ></iframe><div class="description">Vidéo lors de la représentation au Théâtre de la Reine Blanche</div></div></div><div class="close"></div></div></div>');

// 	$('#picView').fadeIn(1000);

// 	$('#picContent').click(function(e) {
// 		e.preventDefault();
// 		return false;
// 	});

// 	$('.close').one('click', function() {
// 		$('#picView').fadeOut(1000, function(){
// 			$(this).remove();
// 		});
// 	});

// 	e.preventDefault();
// 	return false;
// };


// var appendNotes = function(notes) {
// 	var i;
// 	var el = $('<ul class="bordered"></ul>');

// 	for(i=0; i< notes.length; i++) {
// 		el.append('<li>'+notes[i]+'</li>');
// 	}

// 	$('#bloc-note').append(el);

// };

var appendProchainesDates = function(prochaines_dates) {
	var i, j, k;
	var el = $('<ul id="slides"></ul>');

	for(i=0; i< prochaines_dates.length; i++) {
		el.append('<li class="dates_list" ><a href="#!'+prochaines_dates[i].id_piece+'" data-link="'+prochaines_dates[i].id_piece+'" class="link piece_nom">'+prochaines_dates[i].nom_piece+'</a><ul id="representations-'+prochaines_dates[i].id_piece+'"></ul></li>');
		for(k=0; k<prochaines_dates[i].representations.length; k++) {
			el.find('#representations-'+prochaines_dates[i].id_piece).append('<li>'+prochaines_dates[i].representations[k].lieu+'<ul id="dates-'+prochaines_dates[i].id_piece+'-'+k+'"></ul></li>');
			for(j=0; j<prochaines_dates[i].representations[k].dates.length; j++) {
				el.find('#dates-'+prochaines_dates[i].id_piece+'-'+k).append('<li>'+prochaines_dates[i].representations[k].dates[j]+'</li>');
			}
		}
	}

	el.append('<a class="slidesjs-previous slidesjs-navigation">&lt;</a>');
	el.append('<a class="slidesjs-next slidesjs-navigation">&gt;</a>');
	$('#prochaines_dates').append(el);

	$("#slides").slidesjs({
		width: 400,
		height: 400,
		navigation: {
			active: false,
			effect: "slide"
		},
		pagination: {
			active: false,
			effect: "slide"
		},
		play: {
			active: false,
			effect: "slide",
			interval: 5000,
			auto: true,
			swap: false
		},
		effect: {
			slide: {
				speed: 500
			}
		}
	});

};

var appendPhotos = function(data) {
	var i, j;
	var spectacle;
	var section, ul;
	var ul_photos = $('<ul></ul>');

	for(i=0; i<data.length; i++) {
		spectacle = data[i];
		ul_photos.append('<li><a  class="link" data-link="photos-'+spectacle['spectacle-id']+'">'+spectacle['spectacle-nom']+'</a></li>');

		section = $('<section id="photos-'+spectacle['spectacle-id']+'" class="content photos lazy"></section>');
		section.append('<h2>'+spectacle['spectacle-nom']+'</h2>');

		ul = $('<ul></ul>');
		for(j=0; j<spectacle.photos.length; j++) {
			ul.append('<li><img class="thumb" src-lazy="spectacles/'+spectacle['spectacle-id']+'/photos/'+spectacle.photos[j].src+'" title="'+spectacle.photos[j].title+'"/></li>');
		}
		section.append(ul);

		$('#content-right').append(section);

	}

	$('#photos').append(ul_photos);

	$('.thumb').click(function() {

		if($('#picView').length > 0) {
			$('#picView').remove();
		}

		$('body').append('<div id="picView"><img class="picBig" src="'+$(this).attr('src')+'" title="'+$(this).attr('title')+'"/><div class="close"></div></div>');
		$('#picView').fadeIn(1000);
		$('#picView').focus();

		$('.picBig').click(function(e) {
			e.preventDefault();
			return false;
		});

		function remPic() {
			$('#picView').fadeOut(1000, function(){
				$(this).remove();
			});
		}

		$('#picView').one('click', remPic);

		$(document).one('keydown', function(e) {
			if(e.keyCode === 27) {
				remPic();
				e.preventDefault();
				return false;
			}
		});
	});
};
var appendVideos = function(data) {
	var i, j;
	var spectacle;
	var section, ul;
	var ul_videos = $('<ul></ul>');

	for(i=0; i<data.length; i++) {
		spectacle = data[i];
		ul_videos.append('<li><a class="link" data-link="videos-'+spectacle['spectacle-id']+'">'+spectacle['spectacle-nom']+'</a></li>');

		section = $('<section id="videos-'+spectacle['spectacle-id']+'" class="content videos lazy"></section>');
		section.append('<h2>'+spectacle['spectacle-nom']+'</h2>');

		ul = $('<ul></ul>');
		for(j=0; j<spectacle.videos.length; j++) {
			ul.append('<li><img class="thumb" src-lazy="spectacles/'+spectacle['spectacle-id']+'/photos/'+spectacle.videos[j].src+'" title="'+spectacle.photos[j].title+'"/></li>');
		}
		section.append(ul);

		$('#content-right').append(section);

	}

	$('#videos').append(ul_videos);

	$('.thumb').click(function() {
		$('body').append('<div id="picView"><img class="picBig" src="'+$(this).attr('src')+'" title="'+$(this).attr('title')+'"/><div class="close"></div></div>');
		$('#picView').fadeIn(1000);
		$('.picBig').click(function(e) {
			e.preventDefault();
			return false;
		});

		$('#picView').one('click', function() {
			$('#picView').fadeOut(1000, function(){
				$(this).remove();
			});
		});


	});
};

var appendSpectacles = function(data) {
	var i, j, k;
	var el, col, div, flip;

	var categories = data.categories;
	var spectacles = data.spectacles;

	for(i=0; i<categories.length; i++) {
		el = $('<li class="menu_sublist"></li>');
		el.append('<div><span class="white-bg">'+categories[i].libelle+'</span></div>');
		ul = $('<ul class="sub_sub_menu"></ul>');
		for(j=0; j< categories[i].spectacles.length; j++) {
			ul.append('<li class="menu_sub_sublist"><div class="link" data-link="'+categories[i].spectacles[j].id+'">'+categories[i].spectacles[j].nom+'</div></li>');
		}
		el.append(ul);
		$('#spectacles-sub-list').append(el);
	}

	for(i=0; i<spectacles.length; i++) {


		el = $('<section id="'+spectacles[i].id+'" class="content spectacle"></section>');

		col = $('<div class="col"></div>');
		col.append('<h3 id="equipe-liste-titre">L\'équipe</h3>');
		flip = $('<ul class="flip"></ul>');


		for(j=0; j< spectacles[i].equipe.length; j++) {
			flip.append('<li class="membre-equipe"><img src="'+spectacles[i].equipe[j]['image-perso']+'" data-src2="'+spectacles[i].equipe[j]['cv-image']+'" data-src-cv="'+spectacles[i].equipe[j]['cv-pdf']+'" data-video-img= "'+spectacles[i].equipe[j]['image-comedien']+'" data-video-id="'+spectacles[i].equipe[j]['cv-video-id']+'"/><span class="title"><span class="nom" data-nom-perso="'+spectacles[i].equipe[j]['nom-perso']+'">'+spectacles[i].equipe[j]['nom']+'</span><br /> '+spectacles[i].equipe[j]['role']+'</span></li>');
		}

		col.append(flip);
		div = $('<div class="center"></div>');
		div.append('<a class="telecharger" href="'+spectacles[i].dossier+'" target="_blank">Dossier de présentation</a><br /><br />');
		div.append('<a class="telecharger link" data-link="photos-'+spectacles[i].id+'">Photos du spectacle</a><br /><br />');
		div.append('<a class="telecharger link" data-link="videos-'+spectacles[i].id+'">Vidéos du spectacle</a>');
		col.append(div);
		col.append('<h2>'+spectacles[i].nom+'</h2>');
		col.append('<p class="alinea">'+spectacles[i].auteur+'<br />'+spectacles[i]['mise-en-scene']+'</p>');
		el.append(col);

		col = $('<div class="col right"></div>');
		col.append('<img src="'+spectacles[i].affiche+'" title="'+spectacles[i].nom+'" />');

		el.append(col);
		el.append('<p class="description">'+spectacles[i].description+'</p>');

		$('#content-right').append(el);

		$('.flip').jcoverflip();
	}

	$(document).on('click', '.currentFlip', function(e) {
		$.proxy(showMembreEquipe, $(this))(e);
	});

	$('.menu_sublist').hover(function() {
		// $(this).find('.sub_sub_menu').slideToggle(500);
		$(this).find('.sub_sub_menu').animate({width: 'toggle'});
	});

};