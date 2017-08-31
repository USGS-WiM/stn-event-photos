$(document).ready(function () {


	// Get list of events
	var eventList = $.parseJSON($.ajax({
		url: "https://stn.wim.usgs.gov/STNServices/Events.json",
		dataType: "json",
		async: false
	}).responseText);

	// Get list of Agencies
	var agencyList = $.parseJSON($.ajax({
		url: "https://stn.wim.usgs.gov/STNServices/Agencies.json",
		dataType: "json",
		async: false
	}).responseText);

	// Fill event selector
	for (var i = 0, l = eventList.length; i < l; i++) {
		var eventName = eventList[i].event_name;
		var eventId = eventList[i].event_id;
		$("#eventSelector").append($("<option></option>").attr("value", eventId).text(eventName));
	}

	// Select Event
	$("#eventSelector").on('change', function () {
		loadEventImages(this.value);
		$("#eventName").text($("#eventSelector option:selected").text());
	})

	// Event button override
	presetName = function (eventName) {
		$("#eventName").text(eventName);
	}

	// Change Event
	toggleEventPicker = function () {
		$(".event-controls").slideDown(150);
	}

	// Show error if no results
	showEmptySet = function () {
		$(".empty-set").slideDown(150);
		$(".event-controls").slideDown(150);
	}


	// Load LEAFLET Map
	// Leaflet
	// var map = L.map('mapDiv').setView([51.505, -0.09], 13);
	// L.tileLayer('http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
	//     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, Tiles courtesy of <a href="http://hot.openstreetmap.org/" target="_blank">Humanitarian OpenStreetMap Team</a>'
	// }).addTo(map);
	// L.marker([51.5, -0.09]).addTo(map);



	var photoArray = [];


	// Load Event Images
	// FILE PATH https://stn.wim.usgs.gov/STNServices/Files/[[FILENUMBER]]/Item
	loadEventImages = function (event_id) {

		$(".welcome").slideUp(150);
		$(".app-header").css("display", "flex").hide().fadeIn(150);

		$(".photo-grid").html('');

		var eventImages = $.parseJSON($.ajax({
			url: "https://stn.wim.usgs.gov/STNServices/Events/" + event_id + "/Files.json",
			dataType: "json",
			async: false
		}).responseText);

		console.log(eventImages);

		// Load Site Information
		var eventSites = $.parseJSON($.ajax({
			url: "https://stn.wim.usgs.gov/STNServices/Events/" + event_id + "/Sites.json",
			dataType: "json",
			async: false
		}).responseText);

		// 
		// Populate Photo Array
		// 

		photoArray = [];

		// If no files, notify user
		if (eventImages.length == 0) {
			showEmptySet();
		} else { // Else populate Array
			for (var i = 0, l = eventImages.length; i < l; i++) {
				// Check if file is image. Only add if image
				if (eventImages[i].filetype_id == 1) {
					// Load Source Information
					/* var fileSource = $.parseJSON($.ajax({
					  url: "https://stn.wim.usgs.gov/STNServices/Files/"+file_id+"/Source.json", 
					  dataType: "json",
					  async: false,
					  success: success,
					})); */

					$.ajax({
						type: "GET",
						url: "https://stn.wim.usgs.gov/STNServices/Sources/" + eventImages[i].source_id + ".json",
						dataType: 'json',
						async: false,
						success: function (fileSource) {
							var fileData = {};

							fileData.fileId = eventImages[i].file_id;
							fileData.fileURL = "https://stn.wim.usgs.gov/STNServices/Files/" + fileData.fileId + "/Item";
							fileData.fileType = eventImages[i].filetype_id;
							var agencyName = agencyList.filter(function (agency) {
								return agency.agency_id == fileSource.agency_id;
							})[0].agency_name;

							var fileSite = eventSites.filter(function (site) {
								return site.site_id == eventImages[i].site_id;
							})[0];

							var siteDesc = fileSite.site_description ? fileSite.site_description : "SITE DESCRIPTION";
							var photoDate = "";
							if (eventImages[i].photo_date) {
								var dateSplit1 = eventImages[i].photo_date.substring(0, eventImages[i].photo_date.indexOf('T'));
								var dateSplit2 = dateSplit1.split('-');
								var formattedDate = dateSplit2[1] + '/' + dateSplit2[2] + "/" + dateSplit2[0];
								photoDate = formattedDate;
							} else {
								photoDate = "PHOTO DATE";
							}
							var cap = "Photo of " + eventImages[i].description + " at " + siteDesc + ", " + fileSite.county + ", " + fileSite.state + ", " + photoDate + ". " +
								"Photograph by " + fileSource.source_name + ", " + agencyName + ".";

							fileData.fileDescription = cap;
							fileData.fileDate = eventImages[i].file_date;
							fileData.fileLat = eventImages[i].latitude_dd;
							fileData.fileLong = eventImages[i].longitude_dd;

							
							photoArray.push(fileData);
							console.log(photoArray);
						},
						error: function (e) {

						}
					});
				}
				// Done loading array, populate photo grid
				populatePhotoGrid();
			}
		}
	}

	// 
	// Populate Photo Grid
	// 
	populatePhotoGrid = function () {
		console.log("Populating Photos")
		if (photoArray.length == 0) {
			showEmptySet();
		} else {
			$(".event-controls").slideUp(150);
			$(".empty-set").slideUp(100);
			for (var i = 0, l = photoArray.length; i < l; i++) {
				$("#photoGrid").append($("<div class='grid-item' onclick='showPhotoDetails(" + i + ")' style='background-image: url(" + photoArray[i].fileURL + ");'></div>"));
			}
		}
	}

	// 
	// Click Photo, Show details
	// 
	// 
	
	showPhotoDetails = function (i) {
		$("#fullImage").attr("src", photoArray[i].fileURL);
		$("#imageDescription").text(photoArray[i].fileDescription);
		/* $("#imageURL").attr("href", photoArray[i].fileURL) */

		// Date Formatting from OG Format (EX 2016-10-05T22:37:01.819)
		/* var dateSplit1 = photoArray[i].fileDate.substring(0, photoArray[i].fileDate.indexOf('.'));
		var dateSplit2 = dateSplit1.split('T');
		var formattedDate = dateSplit2[0] + ' ' + dateSplit2[1];
		$("#imageDate").text(formattedDate.slice(0, -3)); */

		// Center Map
		// map.setView([photoArray[i].fileLat, photoArray[i].fileLong], 13);

		$(".photo-info").css("display", "flex").hide().fadeIn(150);
	}


	// Close Photo Info
	$(".close-info, .close-photo-info").click(function () {
		$(".photo-info").fadeOut(150);
	});







});
