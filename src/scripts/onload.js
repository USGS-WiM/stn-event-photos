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

		// Show page loader --- DISABLED... too slow for now
		// $(".page-loader").css("display", "flex").hide().fadeIn(150);
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



	// FILE PATH https://stn.wim.usgs.gov/STNServices/Files/[[FILENUMBER]]/Item
	loadEventImages = function (event_id) {

		$(".welcome").slideUp(150);
		$(".app-header").css("display", "flex").hide().fadeIn(150);
		$("#loadMorePhotos").show();
		$(".photoCount").show();


		$(".photo-grid").html('');
		photosLoaded = 1;

		// Load Event Images
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
				// Check if file is image. Only add if image. Need to check, if only a site ID is present then it is not event specific
				if (eventImages[i].filetype_id == 1) {
					if (eventImages[i].hwm_id > 0 || eventImages[i].instrument_id > 0) {

						var fileData = {};

						fileData.source_id = eventImages[i].source_id;
						fileData.fileId = eventImages[i].file_id;
						fileData.fileURL = "https://stn.wim.usgs.gov/STNServices/Files/" + fileData.fileId + "/Item";
						fileData.fileType = eventImages[i].filetype_id;

						// Matching Site ID with the Event Image
						var fileSite = eventSites.filter(function (site) {
							return site.site_id == eventImages[i].site_id;
						})[0];


						// Formating the photo date
						var photoDate = "";
						if (eventImages[i].photo_date) {
							var dateSplit1 = eventImages[i].photo_date.substring(0, eventImages[i].photo_date.indexOf('T'));
							var dateSplit2 = dateSplit1.split('-');
							var formattedDate = dateSplit2[1] + '/' + dateSplit2[2] + "/" + dateSplit2[0];
							photoDate = formattedDate;
						} else {
							photoDate = "PHOTO DATE";
						}

						// Handling the site description
						if (fileSite != undefined) {
							var siteDesc = fileSite.site_description ? fileSite.site_description : "SITE DESCRIPTION";
							var siteCounty = fileSite.county;
							var siteState = fileSite.state;
							var siteNo = fileSite.site_no;
						} else {
							siteDesc = "Site Description Unknown";
							siteCounty = "County Unknown";
							siteState = "State Unknown";
							siteNo = "Site Number Unknown";
						}

						var cap = "Photo of " + eventImages[i].description + " at " + siteDesc + ", " + siteCounty + ", " + siteState + ", " + photoDate + ". " +
							"Photograph by ";

						


						// Puting the the whole caption into the file descripton
						fileData.fileDescription = cap;
						fileData.siteNumber = siteNo;
						/* fileData.fileDate = eventImages[i].file_date;
						fileData.fileLat = eventImages[i].latitude_dd;
						fileData.fileLong = eventImages[i].longitude_dd; */


						photoArray.push(fileData);
					}

				}
			}
			// Done loading array, populate photo grid
			populatePhotoGrid();
		}
	}

	// 
	// Populate Photo Grid
	// 
	populatePhotoGrid = function () {
		console.log("Populating Photos");
		if (photoArray.length == 0) {
			showEmptySet();
		} else {
			$(".event-controls").slideUp(150);
			$(".empty-set").slideUp(100);

			for (var i = 0, l = photoArray.length; i < l; i++) {
				if (i <= (12 * photosLoaded) && i > + (12 * (photosLoaded - 1))) {
					$("#photoGrid").append($("<div class='grid-item' onclick='showPhotoDetails(" + i + ")' style='background-image: url(" + photoArray[i].fileURL + ");'></div>"));
				}
			}

			$(".photoTotal").text((12 * photosLoaded) + '/' + photoArray.length);
			// $(".page-loader").fadeOut(150);

		}
	}

	//
	// Load More Photos Button
	//
	var photosLoaded = 1;
	$("#loadMorePhotos").click(function () {
		photosLoaded++;
		populatePhotoGrid();

		// If end of array, hide button
		if ((photosLoaded * 12) >= photoArray.length) {
			$("#loadMorePhotos").hide();
			$(".photoTotal").text(photoArray.length + '/' + photoArray.length);

		}
	});

	// 
	// Click Photo, Show details
	// 

	showPhotoDetails = function (i) {
		$("#fullImage").attr("src", photoArray[i].fileURL);
		$("#imageURL").attr("href", photoArray[i].fileURL);
		$("#siteNo").text("Site Number: " + photoArray[i].siteNumber);

		$.ajax({
			type: "GET",
			url: "https://stn.wim.usgs.gov/STNServices/Sources/" + photoArray[i].source_id + ".json",
			dataType: 'json',
			async: false,
			success: function (fileSource) {

				// Matching Agency Name with the File Source
				var agencyName = agencyList.filter(function (agency) {
					return agency.agency_id == fileSource.agency_id;
				})[0].agency_name;

				$("#imageDescription").text(photoArray[i].fileDescription + fileSource.source_name + ", " + agencyName + ".");

			},
			error: function (e) { //update image description for the text of it to be "unknown source/agency" 
				$("#imageDescription").text(photoArray[i].fileDescription + " Source Name Unknown, Agency Name Unknown.");
			}
		});


		$("#footer").hide();
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
		$("#footer").show();
	});







});