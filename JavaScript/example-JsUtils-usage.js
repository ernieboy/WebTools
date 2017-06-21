'use strict';
$(function () {


    //Disbable cache for all jQuery AJAX requests
    $.ajaxSetup({ cache: false });

    $('#loadingImageContainer').hide();
    var feedbackPanel = $('#feedbackPanel');
    var feedback = $('#feedback');
    feedbackPanel.hide();
    $('#saveOrCancelOptions').hide();


    $('#feedbackToggler').hide();

    var typeOfSection = $('#Section');

    var countriesDdl = $("#Country");
    var regionsDdl = $("#Region");
    var countiesDdl = $("#County");
    var countySectionsDdl = $("#CountySection");
    var districtsDdl = $("#District");
    var districtSectionsDdl = $("#DistrictSection");
    var scoutGroupsDdl = $("#ScoutGroup");
    var scoutGroupSectionsDdl = $("#ScoutGroupSection");
    ensureRequiredDomElementsExistOnPage();

    var selectAdvisoryMenuCommand = 'Please select';    
    hideUploadButton();
    initDropDownMenus();
    addGoToTopLink();
    populateSections();
    countriesDdl.change(function () {

        if (this.value !== '') {
            populateRegionsByCountryId(this.value);
            JSLib.setElementEnabledState(regionsDdl, true);
            JSLib.setElementEnabledState(countiesDdl, false);
            JSLib.setElementEnabledState(countySectionsDdl, false);
            JSLib.setElementEnabledState(districtsDdl, false);
            JSLib.setElementEnabledState(districtSectionsDdl, false);
            JSLib.setElementEnabledState(scoutGroupsDdl, false);
            JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);
            JSLib.clearSelectItemsExceptFirstItem(countiesDdl);
            JSLib.clearSelectItemsExceptFirstItem(countySectionsDdl);
            JSLib.clearSelectItemsExceptFirstItem(districtsDdl);
            JSLib.clearSelectItemsExceptFirstItem(districtSectionsDdl);
            JSLib.clearSelectItemsExceptFirstItem(scoutGroupsDdl);
            JSLib.clearSelectItemsExceptFirstItem(scoutGroupSectionsDdl);
        }
    });

    regionsDdl.change(function () {
        if (this.value !== '') {
            populateCountiesByRegionId(this.value);
            JSLib.setElementEnabledState(countiesDdl, true);
            JSLib.setElementEnabledState(districtsDdl, false);
            JSLib.setElementEnabledState(districtSectionsDdl, false);
            JSLib.setElementEnabledState(scoutGroupsDdl, false);
            JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);
            JSLib.clearSelectItemsExceptFirstItem(districtsDdl);
            JSLib.clearSelectItemsExceptFirstItem(districtSectionsDdl);
            JSLib.clearSelectItemsExceptFirstItem(scoutGroupsDdl);
            JSLib.clearSelectItemsExceptFirstItem(scoutGroupSectionsDdl);
        }
    });

    countiesDdl.change(function () {
        if (this.value !== '') {
            populateDistrictsByCountyId(this.value);
            populateCountySectionsByCountyId(this.value);
            JSLib.setElementEnabledState(countySectionsDdl, true);
            JSLib.setElementEnabledState(districtsDdl, true);
            JSLib.setElementEnabledState(districtSectionsDdl, true);
            JSLib.clearSelectItemsExceptFirstItem(scoutGroupsDdl);
            JSLib.setElementEnabledState(scoutGroupsDdl, false);
            JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);
        }
    });

    countySectionsDdl.change(function () {
        if (this.value !== '') {
            showUploadButton();
        } else {
            hideUploadButton();
        }
    });

    districtsDdl.change(function () {
        if (this.value !== '') {
            populateScoutGroupsByDistrictId(this.value);
            populateDistrictSectionsByDistrictId(this.value);
            JSLib.setElementEnabledState(districtSectionsDdl, true);
            JSLib.setElementEnabledState(scoutGroupsDdl, true);
            JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);
        }
    });

    districtSectionsDdl.change(function () {
        if (this.value !== '') {
            showUploadButton();
        } else {
            hideUploadButton();
        }
    });

    scoutGroupsDdl.change(function () {
        if (this.value !== '') {
            populateScoutGroupSectionsByScoutGroupId(this.value);
            JSLib.setElementEnabledState(scoutGroupSectionsDdl, true);
        }
    });

    scoutGroupSectionsDdl.change(function () {
        if (this.value !== '') {
            showUploadButton();
        } else {
            hideUploadButton();
        }
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    JSLib.setElementEnabledState(countriesDdl, false);
    JSLib.setElementEnabledState(regionsDdl, false);
    JSLib.setElementEnabledState(countiesDdl, false);
    JSLib.setElementEnabledState(countySectionsDdl, false);
    JSLib.setElementEnabledState(districtsDdl, false);
    JSLib.setElementEnabledState(districtSectionsDdl, false);
    JSLib.setElementEnabledState(scoutGroupsDdl, false);
    JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);

    $('#CountySectionsInputContainer').hide();
    $('#DistrictSectionsInputContainer').hide();


    /*
    $('#orgDialog').dialog({
    title: "Please select your section",
    width: 600,
    height : 450,
    autoOpen: false
    });
    */
    $('#showOrgHierachy').click(function (evt) {
        evt.preventDefault();
        $('#orgDialog').dialog('open');
    });

    function populateSections() {
        if (typeOfSection == null) return;
        $('#loadingImageContainer').show();
        typeOfSection.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(typeOfSection, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/SectionsListing",
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (sections) {
            if (sections != null) {
                for (var i = 0; i < sections.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(typeOfSection, sections[i].value, sections[i].key);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateCountries() {
        if (countriesDdl == null) return;
        $('#loadingImageContainer').show();
        countriesDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(countriesDdl, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/CountriesListing" + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (countries) {
            if (countries != null) {
                for (var i = 0; i < countries.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(countriesDdl, countries[i].countryId, countries[i].name);
                }
            }            
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateRegionsByCountryId(countryId) {
        if (regionsDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        regionsDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(regionsDdl, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/RegionsListing/" + countryId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(regionsDdl, data[i].regionId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateCountiesByRegionId(regionId) {
        if (countiesDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        countiesDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(countiesDdl, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/CountiesListing/" + regionId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(countiesDdl, data[i].countyId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateCountySectionsByCountyId(countyId) {
        if (countySectionsDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        countySectionsDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(countySectionsDdl, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/CountySectionsListing/" + countyId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(countySectionsDdl, data[i].countySectionId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateDistrictsByCountyId(countyId) {
        if (districtsDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        districtsDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(districtsDdl, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/DistrictsListing/" + countyId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(districtsDdl, data[i].districtId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateDistrictSectionsByDistrictId(districtId) {
        if (districtSectionsDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        districtSectionsDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(districtSectionsDdl, '', selectAdvisoryMenuCommand);

        $.ajax({
            url: getAppRoot() + "/api/v1/DistrictSectionsListing/" + districtId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(districtSectionsDdl, data[i].districtSectionId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateScoutGroupsByDistrictId(districtId) {
        if (scoutGroupsDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        JSLib.clearSelectItemsExceptFirstItem(scoutGroupsDdl);

        $.ajax({
            url: getAppRoot() + "/api/v1/ScoutGroupsListing/" + districtId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(scoutGroupsDdl, data[i].scoutGroupId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function populateScoutGroupSectionsByScoutGroupId(scoutGroupId) {
        if (scoutGroupSectionsDdl.length !== 1) return;
        $('#loadingImageContainer').show();
        JSLib.clearSelectItemsExceptFirstItem(scoutGroupSectionsDdl);

        $.ajax({
            url: getAppRoot() + "/api/v1/ScoutGroupsSectionsListing/" + scoutGroupId + "/" + typeOfSection.val(),
            method: "GET",
            headers: {
                "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()   
            }
        }).success(function (data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    JSLib.appendOptionElementToDropDownOptions(scoutGroupSectionsDdl, data[i].scoutGroupSectionId, data[i].name);
                }
            }
        }
        ).complete(function () {
            $('#loadingImageContainer').hide();
        });
    }

    function getSelectedHierachyInfo() {
        var sectionTypeCode = $('#SectionTypeCode').val();
        var info = '';
        switch (sectionTypeCode) {
            case "SSID":
                info = $("#Country option:selected").text() + '/' + $("#Region option:selected").text() +
                '/' + $("#County option:selected").text() + '/' + $("#District option:selected").text() +
                '/' + $("#ScoutGroup option:selected").text() + '/' + $("#ScoutGroupSection option:selected").text();
                break;
            case "DSID":
                info = $("#Country option:selected").text() + '/' + $("#Region option:selected").text() +
                '/' + $("#County option:selected").text() + '/' + $("#District option:selected").text() +
                '/' + $("#DistrictSection option:selected").text();
                break;
            case "CSID":
                info = $("#Country option:selected").text() + '/' + $("#Region option:selected").text() + '/' +
                $("#County option:selected").text() + '/' + $("#CountySection option:selected").text();
                break;
            default:
                break;
        }
        return info;
    }

    function getSelectedSectionTypeName() {
        return $("#Section option:selected").text();
    }

    function getSelectedSectionTypeCode() {
        return $("#SectionTypeCode").val();
    }

    function initDropDownMenus() {        
        countriesDdl.find("option").remove();
        regionsDdl.find("option").remove();
        countiesDdl.find("option").remove();
        countySectionsDdl.find("option").remove();
        districtsDdl.find("option").remove();
        districtSectionsDdl.find("option").remove();
        scoutGroupsDdl.find("option").remove();
        scoutGroupSectionsDdl.find("option").remove();
        JSLib.appendOptionElementToDropDownOptions(countriesDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(regionsDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(countiesDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(countySectionsDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(districtsDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(districtSectionsDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(scoutGroupsDdl, '', selectAdvisoryMenuCommand);
        JSLib.appendOptionElementToDropDownOptions(scoutGroupSectionsDdl, '', selectAdvisoryMenuCommand);        
    }

    function ensureRequiredDomElementsExistOnPage() {
        if (countriesDdl.length !== 1) {
            throw new Error("Countries drop down menu is missing!");
        }
        if (regionsDdl.length !== 1) {
            throw new Error("Regions drop down menu is missing!");
        }
        if (countiesDdl.length !== 1) {
            throw new Error("Counties drop down menu is missing!");
        }
        if (countySectionsDdl.length !== 1) {
            throw new Error("County sections drop down menu is missing!");
        }
        if (districtsDdl.length !== 1) {
            throw new Error("Districts drop down menu is missing!");
        }
        if (districtSectionsDdl.length !== 1) {
            throw new Error("District sections drop down menu is missing!");
        }
        if (scoutGroupsDdl.length !== 1) {
            throw new Error("Scout groups drop down menu is missing!");
        }

        if (scoutGroupSectionsDdl.length !== 1) {
            throw new Error("Scout group sections drop down menu is missing!");
        }
    }

        typeOfSection.change(function () {
            var itsValue = this.value;

            if (itsValue !== '') {
                initDropDownMenus();
                JSLib.setElementEnabledState(regionsDdl, false);
                JSLib.setElementEnabledState(countiesDdl, false);
                JSLib.setElementEnabledState(countySectionsDdl, false);
                JSLib.setElementEnabledState(districtsDdl, false);
                JSLib.setElementEnabledState(districtSectionsDdl, false);
                JSLib.setElementEnabledState(scoutGroupsDdl, false);
                JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);
                populateCountries();
                JSLib.setElementEnabledState(countriesDdl, true);
            } else {
                JSLib.setElementEnabledState(countriesDdl, false);
                hideUploadButton();
            }
            switch (itsValue) {
                case "E":
                case "ND":
                    $('#DistrictInputContainer').show();
                    $('#DistrictSectionsInputContainer').show();
                    $('#ScoutGroupInputContainer').hide();
                    $('#SectionTypeCode').val('DSID');
                    $('#CountySectionsInputContainer').hide();
                    break;
                case "B":
                case "C":
                case "S":
                    $('#ScoutGroupInputContainer').show();
                    $('#DistrictInputContainer').show();
                    $('#DistrictSectionsInputContainer').hide();
                    $('#SectionTypeCode').val('SSID');
                    $('#CountySectionsInputContainer').hide();
                    break;
                case "NC":
                    $('#DistrictInputContainer').hide();
                    $('#DistrictSectionsInputContainer').hide();
                    $('#ScoutGroupInputContainer').hide();
                    $('#CountySectionsInputContainer').show();
                    $('#SectionTypeCode').val('CSID');
                    break;
                default:
                    scoutGroupSectionsDdl.val('');
                    scoutGroupsDdl.val('');
                    districtSectionsDdl.val('');
                    districtsDdl.val('');
                    countySectionsDdl.val('');
                    countiesDdl.val('');
                    regionsDdl.val('');
                    countriesDdl.val('');
                    JSLib.setElementEnabledState(regionsDdl, false);
                    JSLib.setElementEnabledState(countiesDdl, false);
                    JSLib.setElementEnabledState(countySectionsDdl, false);
                    JSLib.setElementEnabledState(districtsDdl, false);
                    JSLib.setElementEnabledState(districtSectionsDdl, false);
                    JSLib.setElementEnabledState(scoutGroupsDdl, false);
                    JSLib.setElementEnabledState(scoutGroupSectionsDdl, false);
            }
        });


        // Initialize the jQuery File Upload widget:
        $('#fileupload').fileupload({
            disableImageResize: false,
            // Uncomment the following to send cross-domain cookies:
            //xhrFields: {withCredentials: true},
            url: getAppRoot() + '/FileUploadHandler.ashx',
           // maxFileSize: 20971520,
            maxFileSize: 200,
            progressInterval: 100,
            acceptFileTypes: /(xlsx)$/i
        });

        // Enable iframe cross-domain access via redirect option:
        $('#fileupload').fileupload(
            'option',
            'redirect',
            window.location.href.replace(
                /\/[^\/]*$/,
                '/cors/result.html?%s'
            )
        );

        $('#listFiles').load(getFiles());

        $(document).on('click', '#linkDeleteFile', function (e, data) {
            var fileName = $('#linkDeleteFile').data('filename');
            $(".modal-body").html("<p>Please confirm if you would like to delete file <strong>" + fileName + "</strong></p>");
        });

        $('#fileupload').bind('fileuploadsubmit', function (e, data) {
            var fileName = data.files[0].name;
            var size = data.files[0].size;
            var extensions = /((.xls)|(.xlsx)|(.csv))/;
            if (size > 1048576) {
                feedback.html("<p class=\"text-danger\">Sorry, file exceeds the limit 1 MB!</p>");
                feedbackPanel.show();
                e.preventDefault();
            }
            if (!(extensions.test(fileName))) {
                feedback.html("<p class=\"text-danger\">Sorry, file must be in Excel format with the .xls, .xlsx or .csv extension!</p>");
                feedbackPanel.show();
                //$('#readyToSave').hide();
                e.preventDefault();
            }
        });


        $('#fileupload').bind('fileuploaddone', function (e, data) {
            feedback.html("Finished uploading file name: <strong>" + data.files[0].name + "</strong>");
            if (data._response != null && data._response.result != null && data._response.result.files != null && data._response.result.files.length > 0 && data._response.result.files[0] != null) {
                $('#UploadedFileName').val(data._response.result.files[0].name);
            }            
            feedbackPanel.show();
            $('#uploadStatus').hide();
            $('.bar').hide();           
            hideUploadButton();
            var dataToSend = {
                fileName: $('#UploadedFileName').val(), //checkCsvExtensions($('#UploadedFileName').val()),
                typeOfSectionCode: $('#SectionTypeCode').val(),
                typeOfSectionName: $("#Section option:selected").text(),
                countryId: $('#Country').val(),
                regionId: $('#Region').val(),
                countyId: $('#County').val() !== "" ? $('#County').val() : -1,
                districtId: $('#District').val() !== "" ? $('#District').val() : -1,
                districtSectionId: getSelectedSectionTypeCode() === 'CSID' ? ($('#CountySection').val() !== "" ? $('#CountySection').val() : -1) : ($('#DistrictSection').val() !== "" ? $('#DistrictSection').val() : -1),
                // districtSectionId: getSelectedSectionTypeCode() === 'CSID' ? 12345 : ($('#DistrictSection').val() !== "" ? $('#DistrictSection').val() : -1),
                scoutGroupId: $('#ScoutGroup').val() !== "" ? $('#ScoutGroup').val() : -1,
                scoutGroupSectionId: $('#ScoutGroupSection').val() !== "" ? $('#ScoutGroupSection').val() : -1,
                sectionName: $("#ScoutGroupSection option:selected").text(),
                clientId: "processResultsTable",
                userFullname: $('#userName').val(),
                userMembershipNumber: $('#membershipNumber').val()
            };

            $.ajax({
                type: "POST",
                url: getAppRoot() +"/api/v1/youthData",
                headers: {
                    "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
                },
                data: dataToSend
            }).done(function (result) {
                $('#fileContents').show();
                $('#fileContents').html(result.htmlTableData);
                $('#feedbackToggler').show();
                $('#feedbackToggler').html('<i class="glyphicon glyphicon-chevron-up"></i><strong>Hide feedback</strong>');

                var alreadyUploaded = (result.alreadyUploadedInfo && result.alreadyUploadedInfo != '' && result.alreadyUploadedInfo != null);
                var canReplaceExisting = (result.replaceUploadedInfo && result.replaceUploadedInfo != '' && result.replaceUploadedInfo != null);

                feedback.append("<br />Number of records in your file: <strong>" + result.numberOfRecordsInFile + "</strong>");
                feedback.append("<br />Number of errors detected: <strong>" + result.numberOfErrorsInFile + "</strong>");

                var numberOfRecordsInFile = parseInt(result.numberOfRecordsInFile, 10);
                var numberOfErrors = parseInt(result.numberOfErrorsInFile, 10);
                $('#saveOrCancelOptions').show();
                if (numberOfErrors > 0 || alreadyUploaded) {
                    if (canReplaceExisting)
                        feedback.append("<br />After you fix the errors: <strong>" + result.replaceUploadedInfo + "</strong>");

                    if (alreadyUploaded) feedback.append("<br /><strong><span class='text-danger'>" + result.alreadyUploadedInfo + "</span></strong>");

                    $('#validationFail').show();
                    $('#validationSuccess').hide();
                    $('#saveData').hide();
                } else {
                    if (numberOfRecordsInFile > 0) {

                        if (canReplaceExisting)
                            feedback.append("<br /><strong><span class='text-danger'>Important:</span>" + result.replaceUploadedInfo + "</strong>");

                        $('#validationFail').hide();
                        $('#validationSuccess').show();
                        $('#saveData').show();
                    } else {
                        feedbackPanel.hide();
                    }
                }
                $('#uploadDataMessage').remove();
                $('<div id="uploadDataMessage"><br /><p class="text-danger">You are uploading data for the <strong>' + getSelectedSectionTypeName() + ' section </strong> at the location <strong>' + getSelectedHierachyInfo() + '</strong></p></div>').insertBefore('#saveCancelButtons');
                $('#cancelSave').show();
            }).error(function (result) {
                var responseObject = JSON.parse(result.responseText);
                var msg = responseObject !== 'undefined' ? responseObject.message : '';
                feedback.append('<p class="danger">Sorry, there was a problem processing your file: <strong>' + msg + '</strong></p>');
                $('#saveOrCancelOptions').show();
                $('#cancelSave').show();                
                $('#loadingImageContainer').hide();
            }).always(function (result) {
                $('#loadingImageContainer').hide();
                addGoToTopLink();
            });
        });


        $('#fileupload').bind('fileuploaddestroy', function (e, data) {
            var deleteButton = data.context.context.id;
            $("#" + deleteButton).parents('tr').first().remove();
        });

        $('#fileupload').bind('fileuploadstart', function (e, data) {
            $('#loadingImageContainer').show();
        });


        $('#fileupload').bind('fileuploadprogress', function (e, data) {
            var percentageLoaded = (data.loaded / data.total) * 100;
            $('.bar').width(percentageLoaded).height(30);
            $('#uploadStatus').html(Math.floor(percentageLoaded) + '% uploaded.');
        });


        $('#feedbackToggler').click(function () {
            if ($('#fileContents').is(':hidden')) {
                $('#fileContents').show();
                $('#feedbackToggler').html('<i class="glyphicon glyphicon-chevron-up"></i><strong>Hide feedback</strong>');
            } else {
                $('#fileContents').hide();
                $('#feedbackToggler').html('<i class="glyphicon glyphicon-chevron-down"></i><strong>Show feedback</strong>');
            }

        });

        $('#confirmSaveData').click(function () {
            if (getSelectedSectionTypeName() === 'undefined' || getSelectedSectionTypeName() === '') {
                return;
            }

            $('#loadingImageContainer').show();

            var dataToSend = null;
            var sectionTypeCode = getSelectedSectionTypeCode();

            if (sectionTypeCode === 'SSID') {
                //Scout group level
                dataToSend = {
                    fileName: $('#UploadedFileName').val(),
                    typeOfSectionCode: sectionTypeCode,
                    typeOfSectionName: $("#Section option:selected").text(),
                    countryId: $('#Country').val(),
                    regionId: $('#Region').val(),
                    countyId: $('#County').val() !== "" ? $('#County').val() : -1,
                    districtId: $('#District').val() !== "" ? $('#District').val() : -1,
                    scoutGroupId: $('#ScoutGroup').val() !== "" ? $('#ScoutGroup').val() : -1,
                    scoutGroupSectionId: $('#ScoutGroupSection').val() !== "" ? $('#ScoutGroupSection').val() : -1,
                    sectionName: $("#ScoutGroupSection option:selected").text(),
                    userFullname: $('#userName').val(),
                    userMembershipNumber: $('#membershipNumber').val()
                };
            }
            if (sectionTypeCode === 'DSID') {
                //District level
                dataToSend = {
                    fileName: $('#UploadedFileName').val(),
                    typeOfSectionCode: sectionTypeCode,
                    typeOfSectionName: $("#Section option:selected").text(),
                    countryId: $('#Country').val(),
                    regionId: $('#Region').val(),
                    countyId: $('#County').val() !== "" ? $('#County').val() : -1,
                    districtId: $('#District').val() !== "" ? $('#District').val() : -1,
                    districtSectionId: $('#DistrictSection').val() !== "" ? $('#DistrictSection').val() : -1,
                    sectionName: $("#DistrictSection option:selected").text(),
                    userFullname: $('#userName').val(),
                    userMembershipNumber: $('#membershipNumber').val()
                };
            }

            if (sectionTypeCode === 'CSID') {
                //County level
                dataToSend = {
                    fileName: $('#UploadedFileName').val(),
                    typeOfSectionCode: sectionTypeCode,
                    typeOfSectionName: $("#Section option:selected").text(),
                    countryId: $('#Country').val(),
                    regionId: $('#Region').val(),
                    countyId: $('#County').val() !== "" ? $('#County').val() : -1,
                    districtSectionId: $('#CountySection').val() !== "" ? $('#CountySection').val() : -1,
                    sectionName: $("#CountySection option:selected").text(),
                    userFullname: $('#userName').val(),
                    userMembershipNumber: $('#membershipNumber').val()
                };
            }

            $.ajax({
                type: "POST",
                url: getAppRoot() +"/api/v1/youthDataUpload",
                headers: {
                    "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
                },
                data: dataToSend
            }).error(function (result) {
                var responseObject = JSON.parse(result.responseText);
                var msg = responseObject !== 'undefined' ? responseObject.message : '';
                feedback.append('<p class="danger">Sorry, there was a problem processing your file: <strong>' + msg + '</strong></p>');
                //Delete if from the server
                $.get(getAppRoot() + "/FileUploadHandler.ashx?delete=1&fileName=" + $('#UploadedFileName').val() + "&v=" + getRandomInt(1, 100000), function () {

                    //TODO: This does not delete the file in IE 9
                    // feedback.append('<p class="danger">Your file has been removed from the server.</strong></p>');
                });
                $('#saveData').hide();
                $('#loadingImageContainer').hide();
            }).success(function (result) {
                $('#loadingImageContainer').hide();
                if (result.errors.length > 0)
                {
                    $('#saveData').hide();
                    var msg;
                    for (var i = 0; i < result.errors.length; i++) {
                        msg += result.errors[i];
                    }
                    feedback.append('<p class="danger">Sorry, there was a problem uploading your file: <strong>' + msg + '</strong></p>');
                }
                else
                {
                    getFiles();                    
                    $('#alertUploadFileMessage').show();
                    feedbackPanel.hide();
                    $('#fileContents').hide();
                    $('#saveOrCancelOptions').hide();
                    $('#feedbackToggler').hide();
                    $('#uploadStatus').hide();
                    $('.bar').hide();
                    $('#accordion #collapseTwo').collapse('hide');
                    $('#accordion #collapseOne').collapse('show');
                    hideUploadButton();
                    initDropDownMenus();
                    typeOfSection.val("");
                }
            });
        });

        $('#confirmDeleteData').click(function () {
            $('#loadingImageContainer').show();
            var fileName = $('#linkDeleteFile').data('filename');
            var fileId = $('#linkDeleteFile').data('fileid');
            $.ajax({
                type: "DELETE",
                url: getAppRoot() +"/api/v1/youthData/" + fileId,
                headers: {
                    "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
                }
            }).error(function (result) {
                $('#loadingImageContainer').hide();
                $('#deleteFileMessage').html("<p class='danger'>Sorry, there was a problem deleting your file: <strong>" + fileName + "</strong></p>");
                $('#alertDeleteFileMessage').show();
            }).success(function () {
                getFiles();
                $('#loadingImageContainer').hide();
                $('#deleteFileMessage').html("<p class='warning'><strong>" + fileName + "</strong> been deleted</p>");
                $('#alertDeleteFileMessage').show();
            });
        });

        $('#cancelSave').click(function () {
            $.get(getAppRoot() + "/FileUploadHandler.ashx?delete=1&fileName=" + $('#UploadedFileName').val() + "&v=" + getRandomInt(1, 100000), function () {
                location.reload(true);
            });
        });

        function getFiles() {
            $('#loadingFilesContainer').removeClass("hidden");
            $.ajax({
                type: "GET",
                url: getAppRoot() +"/api/v1/youthData/" + $('#membershipNumber').val(),
                headers: {
                    "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
                }
            }).complete(function (result) {
                if (result.responseJSON.length > 0) {
                    var htmlBuilder = "";
                    for (var i = 0; i < result.responseJSON.length; i++) {
                        var fileName = result.responseJSON[i].fileName;
                        var fileId = result.responseJSON[i].fileId;
                        var uploadedDate = result.responseJSON[i].formattedUploadedDate;

                        var html1 = "<li class=list-group-item col-sm-2'><a id='linkDeleteFile' data-fileid='";
                        var html2 = "' data-filename='";
                        var html3 = "' style='cursor:pointer' data-toggle='modal' data-target='#confirmDeleteModal'><span class='btn-sm btn-danger'><i class='glyphicon glyphicon-remove'></i></span></a><span class='col-sm-12'>";
                        var html4 = "</span><span class='badge'>";
                        var html5 = "</span></li>";
                        htmlBuilder = htmlBuilder + html1 + fileId + html2 + fileName + html3 + fileName + html4 + uploadedDate + html5;
                    }                    
                    $('#listFiles').html(htmlBuilder);
                }
                else {
                    var html1 = "<li class=list-group-item col-sm-2'>";
                    var html2 = "</li>";
                    $('#listFiles').html(html1 + "No files exist" + html2);
                }
                $('#loadingFilesContainer').addClass("hidden");
            });
        }

        $('.alert .close').on('click', function (e) {
            $(this).parent().hide();
        });

        function showUploadButton() {
            if (getSelectedSectionTypeName() !== 'undefined' && getSelectedSectionTypeName() !== '') {
                $('.fileupload-buttonbar').show();
            }
        }

        function hideUploadButton() {
            $('.fileupload-buttonbar').hide();
        }

        /**
        * Returns a random integer between min and max 
        * Using Math.round() will give you a non-uniform distribution!
        Thanks to http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
        */

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function getAppRoot()
        {
            var path = window.location.protocol + "//" + window.location.hostname;
            if (window.location.port.length > 0)
            {
                path = path + ":" + window.location.port;
            }
            path = path + window.location.pathname;
            path = path.replace("/DataUpload", "");
            return path;
        }

        function addGoToTopLink() {
            // Only enable if the document has a long scroll bar
            // Note the window height + offset
            if (($(window).height() + 100) < $(document).height()) {
                $('#top-link-block').removeClass('hidden').affix({
                    // how far to scroll down before link "slides" into view
                    offset: { top: 100 }
                });
            }
        }    
});