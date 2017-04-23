/* global downloadPromise uploadPromise resetPromise updatePromise */
/* see http://eslint.org/docs/rules/no-undef */

/************************************************************** */
/* constants */
/************************************************************** */

const base_url = "http://lifap5.univ-lyon1.fr/index.php/photos/";
const base_img = "http://lifap5.univ-lyon1.fr/images/";

const all_albums_id = "all-albums";
const album_prefix_id = "album-";

var selectedPhoto;
var photos;


/************************************************************** */
/* event managers */
/************************************************************** */
/* albums_onclick */
let albums_onclick = state => id => {
  $("#" + id).toggleClass("active");
  
  var selectedMenus = new Array();
  $('#panel-menu li.active').each(function(menu){selectedMenus.push($(this).html())})

  $('#panel-gallery .row .col-sm-2 img').each(function( image ) {
  var $that = $(this);
  if(selectedMenus.length === 0){
    $(this).parent('.col-sm-2').hide();
  }
  if(selectedMenus.indexOf("All photos") === -1)
  {
    var shouldBeDisplayed = false;
    selectedMenus.forEach(function(menu){
      if($that[0].title.indexOf(menu) !== -1)
        shouldBeDisplayed = true;
      });
    if(shouldBeDisplayed)
      $that.parent('.col-sm-2').show();
    else
      $that.parent('.col-sm-2').hide();
  }
  else
    $(this).parent('.col-sm-2').show();
});
  return state; 
}
/************************************************************** */
/** MAIN PROGRAM */
/************************************************************** */

//jquery call for ready
$(document).ready(function(){


  downloadPromise(base_url)
  
  let state = {};
  
  function lignes (coll){
	  
	  coll.forEach( x => 
	  $("#" + x._id.$id).click(function(){
		  console.log(x);
		  console.log('Dans on click');
	  affiche_gallerie(this.id, coll);
		  
	  }));
  }

  // associate an update function to each album in the menu
  $("#" + all_albums_id).click(function(){
    albums_onclick(state)(this.id); //this.id is the selected album's identifier
  });
  $("#" + album_prefix_id + "all").click(function() {
      albums_onclick(state)(this.id); //bind a closure to the handler
    });

  $('#reset-button').click(function() {
    console.log('reset');
    let formElt = $('#reset-form');
    resetPromise(base_url, formElt)
      .catch(reason => console.error(reason));
  });
//Images cliquables dans la gallerie


$("#panel-gallery").on("click", ".gallery", function(element){// Utilisation de onclick car récupération des images après le chargement de la page
    var identifier = $("#"+ element.target.id).data("identifier");
    var photosFiltered = photos.filter(function( obj ) {return obj._id.$id == identifier;});
    selectedPhoto = photosFiltered[0];
    showSelectedImage(selectedPhoto);
  });

function showSelectedImage(photo){
    $('#panel-photo').empty();
    var photoName = photo.desc.split('#');
    var number = photoName[1];
    $('#panel-photo').append('<img src="http://134.214.200.137/images/' + photo._id.$id + '/' + photo.name +'"  class="img-responsive" alt="Photo '+ number +'"><h4>'+ photo.name +'</h4><span class="text-muted">Photo '+ number +'</span><br><span class="text-muted">'+ photo.desc +'</span><br><button type="button" id="edit-modal" class="btn btn-info btn-lg">Edit</button>');
}

$(".container-fluid").on("click","#edit-modal", function(element){
  $('#photoModal').modal();

  $('.modal-title').html(selectedPhoto.name);
  $('#new-desc').val(selectedPhoto.desc);
  $('#new-albums').val(selectedPhoto.albums);
});

$('#photo-edit').on("click", function(){
  var photoToUpload = selectedPhoto;
  photoToUpload.desc = $('#new-desc').val();
  photoToUpload.albums = $('#new-albums').val().split(",");
  updatePromise(base_url, photoToUpload).then(selectedPhoto = photoToUpload).then(downloadPromise(base_url)).then(showSelectedImage(selectedPhoto)).catch(reason => console.error(reason));
});

$('#width-picker li').click(function(element){
  var id = element.target.id;
  $('#panel-gallery > div > div').removeClass();
  if(id == "2"){
    $('#panel-gallery > div > div').addClass("col-sm-6 gallery");
  }
  if(id == "3"){
    $('#panel-gallery > div > div').addClass("col-sm-4 gallery");
  }
  if(id == "4"){
    $('#panel-gallery > div > div').addClass("col-sm-3 gallery");
  }
  if(id == "6"){
    $('#panel-gallery > div > div').addClass("col-sm-2 gallery");
  }
  if(id == "12"){
    $('#panel-gallery > div > div').addClass("col-sm-1 gallery");
  }
});

  $("#upload-button").click(function() {
    let formElt = document.getElementById("upload-form"); //$("#upload-form")[0];
    uploadPromise(base_url,formElt)
      .catch(reason => console.error(reason));
  });

  $("#photo-edit").click(function() {
    //get values from the modal modal box
    let desc = $("#new-desc").val();
    let albums = $("#new-albums").val();
    console.log(desc, albums);
    //update then reload based on new collection
    let new_coll = state.collection;
	
	updatePromise(base_url, {})
      .catch(reason => console.error(reason));
  });



  //the collection is propagated in all calls and on the handlers generated by render functions
  //use downloadPromise(base_url) for online development
  //staticPromise()
    downloadPromise(base_url)
  .then(coll => {
	var i = 1;
  var tags = new Array();
  photos = coll;
  showSelectedImage(photos[0]);
	coll.forEach(function(image) {
		var albums = "Albums:"; 
		image.albums.forEach(function(album){
				albums += " '" + album + "';"
        if(tags.indexOf(album) === -1)
          tags.push(album);
			});
  		  $('#panel-gallery .row').append('<div class="col-sm-2 gallery"><img src="http://134.214.200.137/images/' + image._id.$id + '/' + image.name +'" class="img-thumbnail" data-name="'+image.name+'" data-identifier="' +  image._id.$id + '" data-toggle="tooltip" title="' + albums + '" id="photo-' + i +'" alt="' + image.desc + '"><h4>' + image.name +'</h4><span class="text-muted">' + image.desc + '</span></div>');
		i++;
});
    tags.forEach(function(tag){
      $('#panel-menu').append('<li id="album-'+ tag +'" class="list-group-item">' + tag +'</li>');
      $("#" + album_prefix_id + tag).click(function() {
        albums_onclick(state)(this.id); //bind a closure to the handler
      });
    });
  	return coll;})
  .catch(reason => console.error(reason));
});

