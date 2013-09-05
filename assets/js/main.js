---
---

$(document).ready(function() {
    getPageOnLoad();
    setupNavLinks();
    setupResumeFormValidation();
    JotForm.init(); // set up resume form emailing
});

/* SET-UP MAIN PAGE SWITCHING
 * ------------------------------------------------------------------------- */

// show the given page content
function showContentPage(page) {
    $(".nav li.active").removeClass("active");
    $(".nav a[href='" + page + "']").parent().addClass("active");
    document.title = "{{ site.name }} | " + capitalize(page.slice(1));
    $(".content-page.active").fadeOut(250, function() {
        $(this).removeClass("active");
        $(page + "-page").addClass("active").fadeIn(250);
        $("#resume-success").hide();
    });
}

// show the page given by the URL hash on site load
function getPageOnLoad() {
    var page = window.location.hash;
    switch (page) {
        case "#home":
        case "#projects":
        case "#blog":
        case "#resume":
        case "#contact":
            break;
        case "#resume-requested":
            $("#resume-success").show();
            page = "#resume";
            break;
        default:
            page = "#home";
            break;
    }
    $(".nav a[href='" + page + "']").parent().addClass("active");
    $(page + "-page").addClass("active").fadeIn(500);
    document.title = "{{ site.name }} | " + capitalize(page.slice(1));
}

// make same-page links trigger site content change
function setupNavLinks() {
    $('a[href^="#"]').each(function() {
        var page = $(this).attr("href");
        $(this).click(function(e) {
            e.preventDefault();
            window.location.hash = page;
            showContentPage(page);
        });
    });
}

/* VALIDATE RESUME FORM INPUT
 * ------------------------------------------------------------------------- */

 // bind events to form change
function setupResumeFormValidation() {
    $("#resumeContactName").on("input", validateResume);
    $("#resumeContactEmail").on("input", validateResume);
    $("#resumeContactMessage").on("input", highlightMessage);
}

// check name and email fields on form change, alter submit button state
function validateResume() {
    var valid = validateResumeName();
    valid = validateResumeEmail() && valid;

    if (valid) {
        $("#resumeSubmit").prop("disabled", "");
    } else {
        $("#resumeSubmit").prop("disabled", "disabled");
    }
}
 
// check name field
function validateResumeName() {
    var nameField = $("#resumeContactName");
    var name = trim(nameField.prop("value"));
    
    if (!name.length) {
        nameField.parent().removeClass("has-success");
        return false;
    }
    
    nameField.parent().addClass("has-success");
    return true;
}

// check password field
function validateResumeEmail() {
    var emailField = $("#resumeContactEmail");
    var email = trim(emailField.prop("value"));
    var emailFilter = /^[^@]+@[^@.]+\.[^@]*\w\w$/;
    
    if (!emailFilter.test(email)) {
        emailField.parent().removeClass("has-success");
        return false;
    }

    emailField.parent().addClass("has-success");
    return true;
}

// highlight message box if text in it
function highlightMessage() {
    var messageField = $("#resumeContactMessage");
    var message = trim(messageField.prop("value"));
    
    if (!message.length) {
        messageField.parent().removeClass("has-success");
    } else {
        messageField.parent().addClass("has-success");
    }
}

/* UTILITY FUNCTIONS
 * ------------------------------------------------------------------------- */

// trim whitespace off ends of string
function trim(s) {
    var b = 0, e = s.length-1;
    while (s[b] == ' ') b++;
    while (e > b && s[e] == ' ') e--;
    return s.substring(b, e + 1);
}

// capitalize the first letter of the string
function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}