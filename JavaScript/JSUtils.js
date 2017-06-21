var JSLib = {};

/**
 * Appends an OPTION item to a SELECT list.
 * @param domElement - the DOM element which is the SELECT, not its id
 * @param optionValue - the value of the item
 * @param optionText -  the text display for the item
 * Dependencies - jQuery 1.7+
*/
JSLib.appendOptionElementToDropDownOptions = function(domElement, optionValue, optionText) {
    if (domElement === undefined || domElement === null) return;
    var elementId = domElement.prop('id');
    var itemAlreadyExists = $("#" + elementId + " option[value='" + optionValue + "']").length > 0;

    if (!itemAlreadyExists) {
        $('<option>', {
            value: optionValue,
            text: value = optionText
        }).appendTo(domElement);
    } else {
        //console.log("Did not add duplicate item with Id " + optionValue);
    }
};

/**
* Sets the enabled/disabled state of a DOM element
* @param domElement the DOM element to modify, not an id
* @state - a boolean value. The element is enabled if true, false otherwise 
* Dependencies - jQuery
*/
JSLib.setElementEnabledState = function(domElement, state) {
    if (domElement === undefined || domElement === null) return;
    if (state === false) {
        domElement.prop('disabled', 'disabled');
    } else {
        domElement.prop('disabled', false);
    }
};

/**
* Removes all items form a SELECT DOM element except for the first item
*@param domElement the DOM element to modify, not an id
* Dependencies - jQuery
*/
JSLib.clearSelectItemsExceptFirstItem = function clearSelectItemsExceptFirstItem(domElement) {
    domElement.find('option:gt(0)').remove();
};

JSLib.makeAjaxRequest = function (uri, formMethod, postData, successCallback, failureCallback) {
    $.ajax({
        url: ScoutLoginApplication.rootPath + uri,
        method: formMethod,
        dataType: 'json',
        data: postData,
        headers: {
            "X-RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
        },
        success: function (data) {
            successCallback(data);
        },
        error: function (xhr, textStatus, errorThrown) {
            failureCallback(xhr, textStatus, errorThrown);
        }

    });
}

/**
 * Checks if a string can be parsed as JSON.
 * Borrpwed from http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
 * @param {} str 
 * @returns {} 
 */
JSLib.IsJsonString = function (str) {
    var isValidJson;
    try {
        //Try using native JSON parser 
        JSON.parse(str);
        isValidJson = true;
    } catch (e) {
        try {
            //Try using JQuery
            $.parseJSON(str);
            isValidJson = true;
        } catch (ex) {
            isValidJson = false;
        }
    }
    return isValidJson;
}

JSLib.stringAsJson = function (str) {
    var toReturn = {};
    if (!JSLib.IsJsonString(str)) return toReturn;
    try {
        //Try using native JSON parser 
        toReturn = JSON.parse(str);
    } catch (e) {
        try {
            //Try using JQuery
            toReturn = $.parseJSON(str);
        } catch (ex) {
        }
    }
    return toReturn;
}