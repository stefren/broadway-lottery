chrome.storage.sync.get(["profile"], function(result) {
	var profile = result.profile;
  if (profile) {
		console.log(profile);
    var firstName = document.getElementById("dlslot_name_first");
    var lastName = document.getElementById("dlslot_name_last");
    var ticketNum = document.getElementById("dlslot_ticket_qty");
    var email = document.getElementById("dlslot_email");
    var month = document.getElementById("dlslot_dob_month");
    var day = document.getElementById("dlslot_dob_day");
    var year = document.getElementById("dlslot_dob_year");
    var zip = document.getElementById("dlslot_zip");
    var country = document.getElementById("dlslot_country");
    var agree = document.getElementById("dlslot_agree");

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
      agree.checked = true;
    } catch (e) {
      console.log("Error ", e.toString());
    }
  }
});