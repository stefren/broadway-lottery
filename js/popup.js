var base_xhr = new XMLHttpRequest();
base_xhr.open("GET", "https://lottery.broadwaydirect.com/");
base_xhr.onreadystatechange = function() {
  if (base_xhr.readyState == 4) {
		var resp = base_xhr.responseText;
		html = $.parseHTML(resp, false);
		cards = $(html).find(".content-card-content");
		shows = [];
		$.each(cards, function(i, card) {
			shows.push(card);
		});
		chrome.storage.sync.set({"shows": shows}, function() {
      console.log('Value is set to ' +  shows);
    });
		var showIndex = 0;
		var activeDiv = document.getElementById("open-shows-wrapper");
		var upcomingDiv = document.getElementById("upcoming-shows");
		$.each(shows, function(i, card) {
			a = $(card).find("a");
			show = a[0].href;
			var xhr = new XMLHttpRequest();
			xhr.open("GET", show);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					var resp = xhr.responseText;
					html = $.parseHTML(resp, false);
					dup_lotteries = $(html).find(".lotteries-row").filter(".show-for-desktop");
					lotteries = [];
					ids = [];
					$.each(dup_lotteries, function(i, lottery) {
				    if ($.inArray($(lottery).attr("id"), ids) == -1) {
				        ids.push($(lottery).attr("id"));
				        lotteries.push(lottery);
				    }
					});
					$.each(lotteries, function(i, lottery) {
						isActive = $(lottery).find(".active");
						if (isActive.length > 0) {
							var lotteryDiv = document.createElement("div");
							lotteryDiv.className = "active-lottery-entry";
							var newDiv = document.createElement("div");
							newDiv.className = "active-lottery-details";
							var nameDiv = document.createElement("div");
							var header = document.createElement("h2");
							$(header).html($(card).find("a")[0].innerText);
							nameDiv.append(header);
							newDiv.append(nameDiv);
							newDiv.append(lottery);
							var checkboxDiv = document.createElement("div");
							var checkbox = document.createElement("input");
							checkbox.type = "checkbox";
							checkbox.id = showIndex;
							checkbox.className = "lottery-direct-checkbox";
							var label = document.createElement("label");
							label.setAttribute("for", showIndex);
							label.className = "checkbox-label";
							var checkboxImage = document.createElement("div");
							checkboxImage.innerHTML = "<img src='assets/check.svg'></img>";
							checkboxImage.className = "checkbox-image";
							label.append(checkboxImage);
							checkboxDiv.className = "active-checkbox";
							checkboxDiv.append(checkbox);
							checkboxDiv.append(label);
							lotteryDiv.append(newDiv);
							lotteryDiv.append(checkboxDiv);
							activeDiv.before(lotteryDiv);
							showIndex++;
						}

						isUpcoming = $(lottery).find(".pending");
						if (isUpcoming.length > 0) {
							var lotteryDiv = document.createElement("div");
							lotteryDiv.className = "upcoming-lottery-entry";
							var header = document.createElement("h2");
							$(header).html($(card).find("a")[0].innerText);
							lotteryDiv.append(header);
							lotteryDiv.append(lottery);
							lotteryDiv.append(document.createElement("br"));
							upcomingDiv.append(lotteryDiv);
						}
					});
				}
			};
			xhr.send();
  	});
  }
}
base_xhr.send();

$("#save-button").click(function () {
	var inputs = {
	  "firstName" : $("#firstName"),
	  "lastName" : $("#lastName"),
	  "ticketNum" : $("#ticketNum"),
	  "email" : $("#email"),
	  "month" : $("#month"),
	  "day" : $("#day"),
	  "year" : $("#year"),
	  "zip" : $("#zip"),
	  "country" : $("#country")
	};
	console.log(inputs.zip.val());
	if (inputs.ticketNum[0].selectedIndex === -1){
    inputs.ticketNum[0].selectedIndex = 2;
  }
  if (inputs.country[0].selectedIndex === -1){
    inputs.country[0].selectedIndex = 2;
  }
  var profile = {
    "firstname": inputs.firstName.val(),
    "lastname": inputs.lastName.val(),
    "ticketnum": inputs.ticketNum.prop("selectedIndex"),
    "email": inputs.email.val(),
    "month": inputs.month.val(),
    "day": inputs.day.val(),
    "year": inputs.year.val(),
    "zip": inputs.zip.val(),
    "country": inputs.country.prop("selectedIndex")
  };

	chrome.storage.sync.set({ "profile" : profile }, function() {
		console.log("saved profile");
  });
});

$("#edit-profile").click(function () {
	$("#active-shows-container").hide();
	$("#upcoming-shows-container").hide();
	$("#profile-container").show();
	$("#see-active-shows").removeClass("active-tab");
	$("#see-upcoming-shows").removeClass("active-tab");
	$("#edit-profile").addClass("active-tab");
	chrome.storage.sync.get(["profile"], function(result) {
		var profile = result.profile;
	  if (profile) {
			console.log(profile);
	    var firstName = document.getElementById("firstName");
	    var lastName = document.getElementById("lastName");
	    var ticketNum = document.getElementById("ticketNum");
	    var email = document.getElementById("email");
	    var month = document.getElementById("month");
	    var day = document.getElementById("day");
	    var year = document.getElementById("year");
	    var zip = document.getElementById("zip");
	    var country = document.getElementById("country");

	    try {
	      firstName.value = profile.firstname;
	      lastName.value = profile.lastname;
	      ticketNum.options.selectedIndex = profile.ticketnum;
	      email.value = profile.email;
	      month.value = profile.month;
	      day.value = profile.day;
	      year.value = profile.year;
	      zip.value = profile.zip;
	      country.options.selectedIndex = profile.country;
	    } catch (e) {
	      console.log("Error ", e.toString());
	    }
	  }
	});
});

$("#see-active-shows").click(function () {
	$("#active-shows-container").show();
	$("#upcoming-shows-container").hide();
	$("#profile-container").hide();
	$("#see-active-shows").addClass("active-tab");
	$("#see-upcoming-shows").removeClass("active-tab");
	$("#edit-profile").removeClass("active-tab");
});

$("#see-upcoming-shows").click(function () {
	$("#active-shows-container").hide();
	$("#upcoming-shows-container").show();
	$("#profile-container").hide();
	$("#see-active-shows").removeClass("active-tab");
	$("#see-upcoming-shows").addClass("active-tab");
	$("#edit-profile").removeClass("active-tab");
});

$("#open-shows").click(function () {
	var selected = [];
  $(".lottery-direct-checkbox").each(function (i, checkbox) {
    if (checkbox.checked) selected.push($(checkbox.parentNode.parentNode).find("a")[0].href);
  });
	console.log(selected);
  selected.forEach(function(show_url) {
    chrome.tabs.create({
      url: show_url,
      active: false
    });
  });
});
