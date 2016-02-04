function toggleLinks(className, visible) {

	var ctls = $(className);
	if (visible) { ctls.show(); } else { ctls.hide(); }

}

function showLinks() {
	if (this.type === "radio")
	{
		var ctls = $("input[name='" + this.name + "']:not(:checked)");
		ctls.each(function (i, o) {
			toggleLinks(".link-" + o.value, false);
			$.cookie("link-by-book-" + o.value, "0", 1000);
		});
	}

	toggleLinks(".link-" + this.value, this.checked);
	$.cookie("link-by-book-" + this.value, this.checked ? "1" : "0", 1000);

	return true;
}

function idChallengeRatings(status, level, cr) {

	if (status) {
		$(".link-cr-" + cr.replace("/", "-") + " > a").addClass("cr-" + level);
	} else {
		$("#monster-index-wrapper li > a").removeClass("cr-easy cr-average cr-challenging cr-hard cr-epic");
	}

}

function setupLinkByBook() {
	$(".link-by-book").each(function (i, o) {
		var visible = !($.cookie(".link-by-book-" + o.value) === "0");

		o.checked = visible;
		toggleLinks(".link-" + o.value, visible);
	}).change(showLinks);
}

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

function setupAPL() {

	var challengeRatings = [
		"1/8", "1/6", "1/4", "1/3", "1/2",	// 0, 1, 2, 3, 4, 5
		"1", "2", "3", "4", "5", 	// 6,  7,  8,  9,  10
		"6", "7", "8", "9", "10",	// 11,  12,  13,  14,  15
		"11", "12", "13", "14", "15", 	// 16,  17,  18,  19,  20
		"16", "17", "18", "19", "20", 	// 21,  22,  23,  24,  25
		"21", "22", "23", "24", "25", 	// 26,  27,  28,  29,  30
		"26", "27", "28", "29", "30"	// 31, 32, 33, 34, 25
	];

	var APL = challengeRatings.indexOf($("#apl-text").val());
	var easyCR = APL - 1;
	var challengingCR = APL + 1;
	var hardCR = APL + 2;
	var epicCR = APL + 3;

	$("#easy-text").attr("value", challengeRatings[easyCR]);
	$("#average-text").attr("value", challengeRatings[APL]);
	$("#challenging-text").attr("value", challengeRatings[challengingCR]);
	$("#hard-text").attr("value", challengeRatings[hardCR]);
	$("#epic-text").attr("value", challengeRatings[epicCR]);

}

function setupBestiary() {

	var subtypes = [];
	var climates = [];
	var terrains = [];
	var creatureSizes = [];
	var challengeRatings = [];
	var results = 0;

	// creatures only have one book
	$(".link-by-book").each(function(i,o){

		if(o.id.search("-checkbox")!=-1) {

			if(o.checked) {
				toggleLinks(".link-book-" + o.value, true);
			} else {
				toggleLinks(".link-book-" + o.value, false);
			}

		}

	});

	// and one type
	$(".link-by-type").each(function(i,o){

		if(o.id.search("-type-checkbox")!=-1) {
			if(o.checked) {
				toggleLinks(".link-type-" + o.value + ":visible", true);
			} else {
				toggleLinks(".link-type-" + o.value + ":visible", false);
			}
		}

	});

	// but some creatures have multiple CRs
	idChallengeRatings(false);
	$("#monster-index-wrapper li").removeData("checked");
	$("#monster-index-wrapper li").removeData("unchecked");

	$(".link-by-cr").each(function(i,o){

		if(o.id.search("-checkbox")!=-1) {

			if(o.checked) {
				$(".link-cr-" + o.value + ":visible").data("checked", "yes");
				challengeRatings.push(o.value);
			} else {
				$(".link-cr-" + o.value + ":visible").data("unchecked", "yes");
				toggleLinks(".link-cr-" + o.value + ":visible", false);
			}

		}

	});

	if(challengeRatings.length>-1) {

		for (i = 0; i < challengeRatings.length; i++) {

			$(".link-cr-" + challengeRatings[i]).data("checked", "yes");

			if(challengeRatings[i].localeCompare($("#epic-text").val().replace("/", "-"))==0) {
				idChallengeRatings(true, 'epic', challengeRatings[i]);
			}
			if(challengeRatings[i].localeCompare($("#hard-text").val().replace("/", "-"))==0) {
				idChallengeRatings(true, 'hard', challengeRatings[i]);
			}
			if(challengeRatings[i].localeCompare($("#challenging-text").val().replace("/", "-"))==0) {
				idChallengeRatings(true, 'challenging', challengeRatings[i]);
			}
			if(challengeRatings[i].localeCompare($("#average-text").val().replace("/", "-"))==0) {
				idChallengeRatings(true, 'average', challengeRatings[i]);
			}
			if(challengeRatings[i].localeCompare($("#easy-text").val().replace("/", "-"))==0) {
				idChallengeRatings(true, 'easy', challengeRatings[i]);
			}

		}

	}

	$("#monster-index-wrapper li").each(function(){
		if($(this).data("checked")==="yes") {
			if($(this).data("unchecked")==="yes") { $(this).show(); }
		}
	});


	// and have multiple subtypes
	$("#monster-index-wrapper li").removeData("checked");
	$("#monster-index-wrapper li").removeData("unchecked");

	$(".link-by-subtype").each(function(i,o){

		if(o.id.search("-subtype-checkbox")!=-1) {

			if(o.checked) {
				$(".link-subtype-" + o.value + ":visible").data("checked", "yes");
				subtypes.push(o.value);
			} else {
				$(".link-subtype-" + o.value + ":visible").data("unchecked", "yes");
				toggleLinks(".link-subtype-" + o.value + ":visible", false);
			}

		}

	});

	if(subtypes.length>-1) {

		for (i = 0; i < subtypes.length; i++) {

			$(".link-subtype-" + subtypes[i]).data("checked", "yes");

		}

	}

	$("#monster-index-wrapper li").each(function(){
		if($(this).data("checked")==="yes") {
			if($(this).data("unchecked")==="yes") { $(this).show(); }
		}
	});

	// and multiple climates
	$("#monster-index-wrapper li").removeData("checked");
	$("#monster-index-wrapper li").removeData("unchecked");

	$(".link-by-climate").each(function(i,o){

		if(o.id.search("-climate-checkbox")!=-1) {

			if(o.checked) {
				$(".link-climate-" + o.value + ":visible").data("checked", "yes");
				climates.push(o.value);
			} else {
				$(".link-climate-" + o.value + ":visible").data("unchecked", "yes");
				toggleLinks(".link-climate-" + o.value + ":visible", false);
			}

		}

	});

	if(climates.length>-1) {

		for (i = 0; i < climates.length; i++) {

			$(".link-climate-" + climates[i]).data("checked", "yes");

		}

	}

	$("#monster-index-wrapper li").each(function(){
		if($(this).data("checked")==="yes") {
			if($(this).data("unchecked")==="yes") { $(this).show(); }
		}
	});

	// and multiple terrains
	$("#monster-index-wrapper li").removeData("checked");
	$("#monster-index-wrapper li").removeData("unchecked");

	$(".link-by-terrain").each(function(i,o){

		if(o.id.search("-terrain-checkbox")!=-1) {

			if(o.checked) {
				$(".link-terrain-" + o.value + ":visible").data("checked", "yes");
				terrains.push(o.value);
			} else {
				$(".link-terrain-" + o.value + ":visible").data("unchecked", "yes");
				toggleLinks(".link-terrain-" + o.value + ":visible", false);
			}

		}

	});

	if(terrains.length>-1) {

		for (i = 0; i < terrains.length; i++) {

			$(".link-terrain-" + terrains[i]).data("checked", "yes");

		}

	}

	$("#monster-index-wrapper li").each(function(){
		if($(this).data("checked")==="yes") {
			if($(this).data("unchecked")==="yes") { $(this).show(); }
		}
	});

	// and multiple sizes
	$("#monster-index-wrapper li").removeData("checked");
	$("#monster-index-wrapper li").removeData("unchecked");

	$(".link-by-size").each(function(i,o){

		if(o.id.search("-size-checkbox")!=-1) {

			if(o.checked) {
				$(".link-size-" + o.value + ":visible").data("checked", "yes");
				creatureSizes.push(o.value);
			} else {
				$(".link-size-" + o.value + ":visible").data("unchecked", "yes");
				toggleLinks(".link-size-" + o.value + ":visible", false);
			}

		}

	});

	if(creatureSizes.length>-1) {

		for (i = 0; i < creatureSizes.length; i++) {

			$(".link-size-" + creatureSizes[i]).data("checked", "yes");

		}

	}

	$("#monster-index-wrapper li").each(function(){
		if($(this).data("checked")==="yes") {
			if($(this).data("unchecked")==="yes") { $(this).show(); }
		}
	});

	$("#monster-index-wrapper li").removeData("checked");
	$("#monster-index-wrapper li").removeData("unchecked");

	$("#menu-bestiary span#results").html($("#monster-index-wrapper li:visible").length + " results");

}

function setupBestiaryCRs() {

	var challengeRatings = [];

	challengeRatings.push($("#easy-text").val().replace("/", "-"));
	challengeRatings.push($("#average-text").val().replace("/", "-"));
	challengeRatings.push($("#challenging-text").val().replace("/", "-"));
	challengeRatings.push($("#hard-text").val().replace("/", "-"));
	challengeRatings.push($("#epic-text").val().replace("/", "-"));

	$(".link-by-cr").each(function(i,o){

		if(challengeRatings.indexOf(o.value)==-1) {

			$("#cr-" + o.value + "-checkbox").attr("checked", false);

		} else {

			$("#cr-" + o.value + "-checkbox").prop("checked", true);

		}

	});

	setupBestiary();

}

function setupFeats() {

	var featTypes = [];

	//assumption: each feat only has one sourcebook

	$(".link-by-book").each(function(i,o){

		if(o.checked) {
			toggleLinks(".link-book-" + o.value, true);
		} else {
			toggleLinks(".link-book-" + o.value, false);
		}

	});

	//feats can have multiple types

	// clear out any potential existing data
	$("#feat-index-wrapper tr").removeData("checked");
	$("#feat-index-wrapper tr").removeData("unchecked");

	$(".link-by-type").each(function(i,o){

		if(o.checked) {
			$(".link-type-" + o.value + ":visible").data("checked", "yes");
			if(o.value=="untyped") {
				$("tr[class^='link-book-']:visible").not("[class*='link-type-']").data("checked", "yes");
			}
			featTypes.push(o.value);
		} else {
			$(".link-type-" + o.value + ":visible").data("unchecked", "yes");
			toggleLinks(".link-type-" + o.value + ":visible", false);
			if(o.value=="untyped") {
				$("tr[class^='link-book-']:visible").not("[class*='link-type-']").data("unchecked", "yes");
				toggleLinks($("tr[class^='link-book-']:visible").not("[class*='link-type-']"), false);
			}
		}

	});

	if(featTypes.length>-1) {

		for (i = 0; i < featTypes.length; i++) {

			$(".link-type-" + featTypes[i]).data("checked", "yes");

			if(featTypes[i]=="untyped") {
				$("tr[class^='link-book-']").not("[class*='link-type-']").data("checked", "yes");
			}

		}

	}

	$("#feat-index-wrapper li").each(function(){
		if($(this).data("checked")==="yes") {
			if($(this).data("unchecked")==="yes") { $(this).show(); }
		}
	});

	$("#feat-index-wrapper tr").removeData("checked");
	$("#feat-index-wrapper tr").removeData("unchecked");

	$("#menu-feats span#results").html($("#feats-index-table tr:visible").length-2 + " results");

}


function setupSpellLists() {

	var pcClass = "";
	var spellLevel = [];
	var sourcebooks = [];

	$(".link-by-book").each(function(i, o){

		if(o.name=="class") { toggleLinks("ul.link-" + o.value, false); }
		if(o.id.search("-level-checkbox")!=-1) { toggleLinks("ul.link-" + o.value.substr(0,1) + "-level", false); } else {
			if(o.id.search("-checkbox")!=-1) { toggleLinks("li.link-" + o.value, false); }
		}

		if(o.checked) {
			if(o.name=="class") { pcClass = o.value; }
			if(o.id.search("-level-checkbox")!=-1) { spellLevel.push(o.value.substr(0,1)); } else {
				if(o.id.search("-checkbox")!=-1) { sourcebooks.push(o.value); }
			}
		}


	});

	if(pcClass!=="") {
		if(spellLevel.length>0) {
			for (i = 0; i < spellLevel.length; i++) {
				if(spellLevel[i]=="0") { toggleLinks("#" + spellLevel[i] + "-level-" + pcClass + "-spells", true); } else {
					toggleLinks("#" + ordinal_suffix_of(spellLevel[i]) + "-level-" + pcClass + "-spells", true);
				}
			}
		}
	} else {
		if(spellLevel.length>0) {
			for (i = 0; i < spellLevel.length; i++) {
				toggleLinks("ul.link-" + spellLevel[i] + "-level", true);
			}
		}
	}

	if(sourcebooks.length>0) {
		for (i = 0; i < sourcebooks.length; i++) {
			toggleLinks("li.link-" + sourcebooks[i], true);
		}
	}

	$(".link-by-school").each(function(i,o){

		if(o.id.search("-school-checkbox")!=-1) {

			if(o.checked) {

				toggleLinks(".link-school-" + o.value + ":visible", true);

			} else {

				toggleLinks(".link-school-" + o.value + ":visible", false);

			}

		}

	});

}

function setupTemplates() {

	$(".link-by-book").each(function(i,o){

		if(o.id.search("-checkbox")!=-1) {

			if(o.checked) {
				toggleLinks(".link-book-" + o.value, true);
			} else {
				toggleLinks(".link-book-" + o.value, false);
			}

		}

	});

}

$(function() {

	switch(document.title) {

		case "Bestiary Index":

			$("#menu-bestiary > ul > li > .shortcut-bar").hide();
			$("#menu-bestiary > ul > li > .nav").click(function(){
				$(this).next(".shortcut-bar").toggle();
			});

			setupAPL();
			setupBestiary();

			$("#calculateCR").on("click", function(){
				setupAPL();
			});

			$("#displayCharacters").on("click", function(){
				setupBestiary();
				toggleLinks("#monster-index-wrapper li:visible:not(.link-sup-character)", false);
			});
			$("#displayCohorts").on("click", function(){
				setupBestiary();
				toggleLinks("#monster-index-wrapper li:visible:not(.link-sup-cohort)", false)
			});
			$("#displayCompanions").on("click", function(){
				setupBestiary();
				toggleLinks("#monster-index-wrapper li:visible:not(.link-sup-companion)", false)
			});
			$("#displayFamiliars").on("click", function(){
				setupBestiary();
				toggleLinks("#monster-index-wrapper li:visible:not(.link-sup-familiar)", false)
			});

			$("#resetFilters").on("click", function(){
				$(".link-by-book").prop("checked", true);
				$(".link-by-type").prop("checked", true);
				$(".link-by-subtype").prop("checked", true);
				$(".link-by-climate").prop("checked", true)
				$(".link-by-terrain").prop("checked", true);
				$(".link-by-cr").prop("checked", true);
				$(".link-by-size").prop("checked", true);
				setupBestiary();
			});

			$("#setupCRs").on("click", function(){
				setupBestiaryCRs();
			});

			$("#challengeRatings").on("click", function(){
				$(".link-by-cr").attr("checked", false);
				setupBestiary();
			});

			$("#creatureTypes").on("click", function(){
				$(".link-by-type").attr("checked", false);
				setupBestiary();
			});

			$("#creatureSubtypes").on("click", function(){
				$(".link-by-subtype").attr("checked", false);
				setupBestiary();
			});

			$("#climates").on("click", function(){
				$(".link-by-climate").attr("checked", false);
				setupBestiary();
			});

			$("#terrains").on("click", function(){
				$(".link-by-terrain").attr("checked", false);
				setupBestiary();
			});

			$("#creatureSizes").on("click", function(){
				$(".link-by-size").attr("checked", false);
				setupBestiary();
			});

			$("#showPlanarEncounters").on("click", function(){
				$(".link-by-terrain").filter("[value^='planes']").prop("checked", true);
				$(".link-by-terrain").filter("[value^='planes']").show();
				$("label").filter("[for^='planes']").show();
				setupBestiary();
			});
			$("#hidePlanarEncounters").on("click", function(){
				$(".link-by-terrain").filter("[value^='planes']").attr("checked", false);
				$(".link-by-terrain").filter("[value^='planes']").hide();
				$("label").filter("[for^='planes']").hide();
				setupBestiary();
			});

			$("input:checkbox").on("click", function(){
				setupBestiary()
			});

			break;
		case "Feat Index":

			$("#menu-feats > ul > li > .shortcut-bar").hide();
			$("#menu-feats > ul > li > .nav").click(function(){
				$(this).next(".shortcut-bar").toggle();
			});

			$("#prereqsHide").on("click", function(){
				$("td[class^='indent-']:visible").each(function(){
					toggleLinks($(this).parent(), false);
				});
				$("#menu-feats span#results").html($("#feat-index-wrapper tr:visible").length-4 + " results");
			});

			$("#prereqsShow").on("click", function(){
				$("td[class^='indent-']:hidden").each(function(){
					toggleLinks($(this).parent(), true);
				});
				$("#menu-feats span#results").html($("#feat-index-wrapper tr:visible").length-4 + " results");
			});

			$("#resetFilters").on("click", function(){
				$(".link-by-book").prop("checked", true);
				$(".link-by-type").prop("checked", true);
				setupFeats();
			});

			setupFeats();

			$("input").on("click", function(){
				setupFeats();
			});

			break;
		case "Spell List Index":

			$("#menu-spelllist > ul > li > .shortcut-bar").hide();
			$("#menu-spelllist > ul > li > .nav").click(function(){
				$(this).next(".shortcut-bar").toggle();
			});

			$("#resetFilters").on("click", function(){
				$(".link-by-book").prop("checked", true);
				$(".link-by-book:radio").prop("checked", false);
				$(".link-by-school").prop("checked", true);
				setupSpellLists();
			});

			$("#resetClassFilters").on("click", function(){
				$(".link-by-book:radio").prop("checked", false);
				setupSpellLists();
			});

			$("#checkAllLevels").on("click", function(){
				$("[id$='-level-checkbox']").prop("checked", true);
				setupSpellLists();
			});
			$("#uncheckAllLevels").on("click", function(){
				$("[id$='-level-checkbox']").prop("checked", false);
				setupSpellLists();
			});

			$("#checkAllSchools").on("click", function(){
				$(".link-by-school").prop("checked", true);
				setupSpellLists();
			});
			$("#uncheckAllSchools").on("click", function(){
				$(".link-by-school").prop("checked", false);
				setupSpellLists();
			});

			setupSpellLists();
			$("input").on("click", function(){
				setupSpellLists();
			});

			break;
		case "Template Index":
				setupTemplates();
			break;
		default:
			setupLinkByBook();
	}

});