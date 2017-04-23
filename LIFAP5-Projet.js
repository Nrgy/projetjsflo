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
var selectedWidth=6;

/************************************************************** */
/* event managers */
/************************************************************** */
/* albums_onclick */
let albums_onclick = state => id => {
  $("#" + id).toggleClass("active");
  filterOnTags();
  return state; 
}

function filterOnTags(){// Filtrage des photos par tag et gestion des menus
  var selectedMenus = new Array();
  $('#panel-menu li.active').each(function(menu){selectedMenus.push($(this).html())})

  var selectedYears = new Array();
  $('#date-menu li.active').each(function(menu){selectedYears.push($(this).html())});

  $('#panel-gallery .row .gallery img').each(function( image ) {
  var id = $(this)[0].getAttribute('data-identifier');
  var currentPhotoTable = photos.filter(function( obj ) {return obj._id.$id == id});
  var currentPhoto = currentPhotoTable[0];
  var date = new Date(currentPhoto.date);
  var year = date.getFullYear();
  year = year.toString();

  var $that = $(this);
  if(selectedMenus.length === 0){
    $(this).parent('.gallery').hide();
  }
  if(selectedMenus.indexOf("All photos") === -1)
  {
    var shouldBeDisplayed = false;
    selectedMenus.forEach(function(menu){
      if($that[0].title.indexOf(menu) !== -1)
        shouldBeDisplayed = true;
      });
    if(shouldBeDisplayed){
        if(selectedYears.indexOf("All dates") === -1)
        {
          if(selectedYears.indexOf(year) !== -1)
            $that.parent('.gallery').show();
          else
            $that.parent('.gallery').hide();
        }
        else{
          $that.parent('.gallery').show();
        }
    }
    else
      $that.parent('.gallery').hide();
  }
  else
  {
    if(selectedYears.indexOf("All dates") === -1)
    {
      if(selectedYears.indexOf(year) !== -1)
        $that.parent('.gallery').show();
      else
        $that.parent('.gallery').hide();
    }
    else{
      $that.parent('.gallery').show();
    }
  }
  });
};

let date_filter_onclick = state => id => {
  $("#" + id).toggleClass("active");
  filterOnTags();
  return state; 
}
/************************************************************** */
/** MAIN PROGRAM */
/************************************************************** */

//jquery call for ready
$(document).ready(function(){


  downloadPromise(base_url)
  
  let state = {};
  
<<<<<<< HEAD
 /* function lignes (coll){
	  
	  coll.forEach( x => 
	  $("#" + x._id.$id).click(function(){
		  console.log(x);
		  console.log('Dans on click');
	  affiche_gallerie(this.id, coll);
		  
	  }));
  }*/

=======
>>>>>>> 9dd6f08a20f352cb7c75f2a2c7a611f28b6fe13f
  // associate an update function to each album in the menu
  $("#" + all_albums_id).click(function(){
    albums_onclick(state)(this.id); //this.id is the selected album's identifier
  });
  $("#" + album_prefix_id + "all").click(function() {
      albums_onclick(state)(this.id); //bind a closure to the handler
    });

  $("#date-menu li").click(function(){
    date_filter_onclick(state)(this.id); //this.id is the selected album's identifier
  });

  $('#reset-button').click(function() {// Reset de la galerie de la photo ici appelle de updatePhotos pour mettre à jour l'interface
    console.log('reset');
    let formElt = $('#reset-form');
    resetPromise(base_url, formElt).then(retour => 
    {
      downloadPromise(base_url).then(coll => {updatePhotos(coll);})
      return retour;
    }).catch(reason => console.error(reason));
  });
//Images cliquables dans la gallerie


$("#panel-gallery").on("click", ".gallery", function(element){// Utilisation de onclick car récupération des images après le chargement de la page
    var identifier = $("#"+ element.target.id).data("identifier");
    var photosFiltered = photos.filter(function( obj ) {return obj._id.$id == identifier;});
    selectedPhoto = photosFiltered[0];
    showSelectedImage(selectedPhoto);
  });

function showSelectedImage(photo){ // Afficher image cliquée dans la gallerie, Update photo met à jour la page 
    $('.modal-title').html(selectedPhoto.name);
    $('#new-desc').val(selectedPhoto.desc);
    $('#new-albums').val(selectedPhoto.albums);
    $('#panel-photo').empty();
    var photoName = photo.desc.split('#');
    var number = photoName[1];
    $('#panel-photo').append('<img src="http://134.214.200.137/images/' + photo._id.$id + '/' + photo.name +'"  class="img-responsive" alt="Photo '+ number +'"><h4>'+ photo.name +'</h4><span class="text-muted">Photo '+ number +'</span><br><span class="text-muted">'+ photo.desc +'</span><br><button type="button" id="edit-modal" class="btn btn-info btn-lg">Edit</button>');
}

$(".container-fluid").on("click","#edit-modal", function(element){
  $('#photoModal').modal();
});

$('#photo-edit').on("click", function(){// Edition de la photo et de ses tags
  var photoToUpload = selectedPhoto;
  photoToUpload.desc = $('#new-desc').val();// On reprend les données qu'on veut met à jour et avc l'update on l'envoie en PUT qui fera la modification sur le serveur
  photoToUpload.albums = $('#new-albums').val().split(",");

  updatePromise(base_url, photoToUpload).then(retour => 
  {
    downloadPromise(base_url).then(coll => {updatePhotos(coll);})
    return retour;
  }).catch(reason => console.error(reason));
});

$('#filter-date-increase').click(function(e){
  sortCollection(true);
});

$('#filter-date-decrease').click(function(e){
  sortCollection(false);
});

function sortCollection(ascending){
  photos.sort(function(a, b) {
    a = new Date(a.date);
    b = new Date(b.date);
    if(ascending)
      return a<b ? -1 : a>b ? 1 : 0;
    return a>b ? -1 : a<b ? 1 : 0;
});
  updateGallery();
  filterOnTags();
}

function updateGallery(){
  var i = 1;
  removeGalleryPhotos();
  photos.forEach(function(photo){
    displayGallery(photo, i);
    i++;
  });
  changeGalleryWidth();
}

function updateGalleryPromise(){
  return new Promise(function(resolve, reject){
    resolve(updateGallery());
  });
}

$('#width-picker li').click(function(element){
  var id = element.target.id;
  selectedWidth = id;
  changeGalleryWidth();
});

function changeGalleryWidth(){
  $('#panel-gallery > div > div').removeClass();
  if(selectedWidth == "2"){
    $('#panel-gallery > div > div').addClass("col-sm-6 gallery");
  }
  if(selectedWidth == "3"){
    $('#panel-gallery > div > div').addClass("col-sm-4 gallery");
  }
  if(selectedWidth == "4"){
    $('#panel-gallery > div > div').addClass("col-sm-3 gallery");
  }
  if(selectedWidth == "6"){
    $('#panel-gallery > div > div').addClass("col-sm-2 gallery");
  }
  if(selectedWidth == "12"){
    $('#panel-gallery > div > div').addClass("col-sm-1 gallery");
  }
};

  $("#upload-button").click(function() {// Upload d'une nouvelle photo
    let formElt = document.getElementById("upload-form");
    uploadPromise(base_url,formElt).then(retour => 
      {
        downloadPromise(base_url).then(coll => {updatePhotos(coll);})
        return retour;
      }).catch(reason => console.error(reason));
  });

  $("#photo-edit").click(function() {
    //get values from the modal modal box
    let desc = $("#new-desc").val();
    let albums = $("#new-albums").val();
    //update then reload based on new collection
    let new_coll = state.collection;
	
    updatePromise(base_url, {}).then(retour => 
    {
      downloadPromise(base_url).then(coll => {updatePhotos(coll);})
      return retour;
    }).catch(reason => console.error(reason));
  });

  function removeGalleryPhotos(){
    $('#panel-gallery .row').html("");
  };

  function displayGallery(photo, num){
    var albums = "Albums:"; 
    photo.albums.forEach(function(album){
        albums += " '" + album + "';"
      });
    $('#panel-gallery .row').append('<div class="col-sm-2 gallery"><img src="http://134.214.200.137/images/' + photo._id.$id + '/' + photo.name +'" class="img-thumbnail" data-name="'+ photo.name+'" data-identifier="' +  photo._id.$id + '" data-toggle="tooltip" title="' + albums + '" id="photo-' + num +'" alt="' + photo.desc + '"><h4>' + photo.name +'</h4><span class="text-muted">' + photo.desc + '</span></div>');
  };

  //the collection is propagated in all calls and on the handlers generated by render functions
  //use downloadPromise(base_url) for online development
  //staticPromise()

  function updatePhotos(coll){// Mise à jour de la page
  var i = 1;
  var tags = new Array();
  var years = new Array();
  photos = coll;
  if(selectedPhoto == undefined)
    selectedPhoto = photos[0];
  showSelectedImage(selectedPhoto);
  removeGalleryPhotos();
  coll.forEach(function(image) {
    var albums = "Albums:";
    var date = new Date(image.date);
    var year = date.getFullYear();
    if(years.indexOf(year) === -1)
      years.push(year); 
    image.albums.forEach(function(album){
        albums += " '" + album + "';"
        if(tags.indexOf(album) === -1)
          tags.push(album);
      });
    displayGallery(image, i);
    i++;
    });
    $('#panel-menu li.item-added').remove();
    tags.forEach(function(tag){
      $('#panel-menu').append('<li id="album-'+ tag +'" class="list-group-item item-added">' + tag +'</li>');
      $("#" + album_prefix_id + tag).click(function() {
        albums_onclick(state)(this.id); //bind a closure to the handler
      });
    });

    $('#date-menu li.year-added').remove();
    years.forEach(function(year){
       $('#date-menu').append('<li id=' + year + ' class="list-group-item year-added">' + year +'</li>');
       $("#" + year).click(function() {
          date_filter_onclick(state)(this.id);
       });
    });
  };
  downloadPromise(base_url)
  .then(coll => {
	  updatePhotos(coll);
  	return coll;})
  .catch(reason => console.error(reason));
});

