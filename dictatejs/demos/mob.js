// Global UI elements:
//  - log: event log
//  - trans: transcription window

// Global objects:
//  - isConnected: true iff we are connected to a worker
//  - tt: simple structure for managing the list of hypotheses
//  - dictate: dictate object with control methods 'init', 'startListening', ...
//       and event callbacks onResults, onError, ...
var isConnected = false;

var tt = new Transcription();

var startPosition = 0;
var endPosition = 0;
var doUpper = false;
var doPrependSpace = true;

var MIN_VOL = -100;
var MAX_VOL = -50;
var dialectHistory = [];

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettyfyHyp(text, doCapFirst, doPrependSpace) {
    if (doCapFirst) {
        text = capitaliseFirstLetter(text);
    }
    tokens = text.split(" ");
    text = "";
    if (doPrependSpace) {
        text = " ";
    }
    doCapitalizeNext = false;
    tokens.map(function (token) {
        if (text.trim().length > 0) {
            text = text + " ";
        }
        if (doCapitalizeNext) {
            text = text + capitaliseFirstLetter(token);
        } else {
            text = text + token;
        }
        if (token == "." || /\n$/.test(token)) {
            doCapitalizeNext = true;
        } else {
            doCapitalizeNext = false;
        }
    });

    text = text.replace(/ ([,.!?:;])/g, "\$1");
    text = text.replace(/ ?\n ?/g, "\n");
    return text;
}


var dictate = new Dictate({
    server: $("#servers").val().split('|')[0],
    serverStatus: $("#servers").val().split('|')[1],
    recorderWorkerPath: 'dictatejs/lib/recorderWorker.js',
    onReadyForSpeech: function () {
        isConnected = true;
        __message("READY FOR SPEECH");
        $("#buttonToggleListening").html('Stop');
        stopwatch.start();
        $("#buttonToggleListening").addClass('highlight');
        $("#buttonToggleListening").prop("disabled", false);
        $("#buttonCancel").prop("disabled", false);
        startPosition = $("#trans").prop("selectionStart");
        endPosition = startPosition;
        var textBeforeCaret = $("#trans").val().slice(0, startPosition);
        if ((textBeforeCaret.length == 0) || /\. *$/.test(textBeforeCaret) || /\n *$/.test(textBeforeCaret)) {
            doUpper = true;
        } else {
            doUpper = false;
        }
        doPrependSpace = (textBeforeCaret.length > 0) && !(/\n *$/.test(textBeforeCaret));
    },
    onEndOfSpeech: function () {
        __message("END OF SPEECH");
        $("#buttonToggleListening").html('Stopping...');
        stopwatch.stop();
        $("#buttonToggleListening").prop("disabled", true);
    },
    onEndOfSession: function () {
        isConnected = false;
        __message("END OF SESSION");
        $("#buttonToggleListening").html('Start');
        stopwatch.stop();
        $("#buttonToggleListening").removeClass('highlight');
        $("#buttonToggleListening").prop("disabled", false);
        $("#buttonCancel").prop("disabled", true);
    },
    onServerStatus: function (json) {
        __serverStatus(json.num_workers_available);
        $("#serverStatusBar").toggleClass("highlight", json.num_workers_available == 0);
        // If there are no workers and we are currently not connected
        // then disable the Start/Stop button.
        if (json.num_workers_available == 0 && !isConnected) {
            $("#buttonToggleListening").prop("disabled", true);
        } else {
            $("#buttonToggleListening").prop("disabled", false);
        }
    },
    onPartialResults: function (hypos) {
        hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
        val = $("#trans").val();
        $("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
        endPosition = startPosition + hypText.length;
        $("#trans").prop("selectionStart", endPosition);
    },
    onResults: function (hypos) {
        hypText = prettyfyHyp(hypos[0].transcript, doUpper, doPrependSpace);
        val = $("#trans").val();
        $("#trans").val(val.slice(0, startPosition) + hypText + val.slice(endPosition));
        startPosition = startPosition + hypText.length;
        endPosition = startPosition;
        $("#trans").prop("selectionStart", endPosition);
        if (/\. *$/.test(hypText) || /\n *$/.test(hypText)) {
            doUpper = true;
        } else {
            doUpper = false;
        }
        doPrependSpace = (hypText.length > 0) && !(/\n *$/.test(hypText));
        $("#trans").scrollTop = $("#trans").scrollHeight

        var sortable = [];
        for (var dialect in hypos[1]) {
            sortable.push([dialect, hypos[1][dialect]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });

        var updatedOptions = {'areas': {}};

        // for (var property in $("#map").data("mapael").areas) {
        //     console.log(property);
        // }
        var arabCountries = ["xs", "dj", "so", "eg", "sa", "qa", "om", "kw", "ae", "eh", "ma", "dz", "tn", "ly", "sy", "jo", "ps", "lb", "sd", "ye", "iq", "mr", "so", "xs", "dj"];

        var countriesOfDialect = {
            "EGY": ["eg"],
            "MSA": [""],
            "GLF": ["sa", "qa", "om", "kw", "ae"],
            "NOR": ["eh", "ma", "dz", "tn", "ly"],
            "LAV": ["sy", "jo", "ps", "lb"]
        };

        var DialectLabels = {
            "EGY": "Egyptain dialect",
            "MSA": "Modern Standard Arabic (MSA)",
            "GLF": "Gulf dialect",
            "NOR": "Moroccan dialect",
            "LAV": "Levantine dialect"
        };

        dialectHistory.push(sortable[0][0]);

        var dialectFreq = (function () {

            /* Below is a regular expression that finds alphanumeric characters
               Next is a string that could easily be replaced with a reference to a form control
               Lastly, we have an array that will hold any words matching our pattern */
            // var pattern = /\w+/g,
            //     string = "I I am am am yes yes.",
            //     matchedWords = string.match( pattern );

            /* The Array.prototype.reduce method assists us in producing a single value from an
               array. In this case, we're going to use it to output an object with results. */
            var counts = dialectHistory.reduce(function (stats, word) {

                /* `stats` is the object that we'll be building up over time.
                   `word` is each individual entry in the `dialectHistory` array */
                if (stats.hasOwnProperty(word)) {
                    /* `stats` already has an entry for the current `word`.
                       As a result, let's increment the count for that `word`. */
                    stats[word] = stats[word] + 1;
                } else {
                    /* `stats` does not yet have an entry for the current `word`.
                       As a result, let's add a new entry, and set count to 1. */
                    stats[word] = 1;
                }

                /* Because we are building up `stats` over numerous iterations,
                   we need to return it for the next pass to modify it. */
                return stats;

            }, {});

            /* Now that `counts` has our object, we can log it. */
            console.log(counts);
            return counts;

        }());

        var max_freq = 0;
        var dialectWithHighestFreq = "";
        Object.keys(dialectFreq).forEach(function (key, index) {
            console.log(key, dialectFreq[key]);
            if (dialectFreq[key] > max_freq) {
                max_freq = dialectFreq[key];
                dialectWithHighestFreq = key;
            }

            // key: the name of the object key
            // index: the ordinal position of the key within the object
        });

        var probabilityOfMainDialect = max_freq / dialectHistory.length * 100;

        console.log("The main dialect is mostly: " + dialectWithHighestFreq + ", with a probability of: " + probabilityOfMainDialect + "%");

        $("#main-dialect").text(DialectLabels[dialectWithHighestFreq]);
        $("#main-dialect-prob").text(Math.ceil(probabilityOfMainDialect) + "%");
        // $("#main-dialect-diff").text(Math.ceil(probabilityOfMainDialect - parseFloat(sortable[1][1]) * 100) + "%");


        $("#" + sortable[0][0].toLowerCase()).css("width", parseFloat(sortable[0][1]) * 100 + "%");
        $("#" + sortable[1][0].toLowerCase()).css("width", parseFloat(sortable[1][1]) * 100 + "%");
        $("#" + sortable[2][0].toLowerCase()).css("width", parseFloat(sortable[2][1]) * 100 + "%");
        $("#" + sortable[3][0].toLowerCase()).css("width", parseFloat(sortable[3][1]) * 100 + "%");
        $("#" + sortable[4][0].toLowerCase()).css("width", parseFloat(sortable[4][1]) * 100 + "%");//percent-egy

        $("#percent-" + sortable[0][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[0][1]) * 100));
        $("#percent-" + sortable[1][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[1][1]) * 100));
        $("#percent-" + sortable[2][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[2][1]) * 100));
        $("#percent-" + sortable[3][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[3][1]) * 100));
        $("#percent-" + sortable[4][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[4][1]) * 100));

        var $map = $mapcontainer;

        Object.keys($mapcontainer.data("mapael").areas).forEach(function (key, index) {
            // console.log(sortable[0][0]);
            if (countriesOfDialect[sortable[0][0]].indexOf(key) > -1) {
                //
                if (sortable[0][0] == "MSA") {
                    updatedOptions.areas[key] = {
                        attrs: {
                            fill: "#4d9c58"
                        }
                    }
                } else {
                    updatedOptions.areas[key] = {
                        attrs: {
                            fill: "#f38a03"
                        }
                    }
                }
                ;
            } else if (countriesOfDialect[sortable[1][0]].indexOf(key) > -1) {
                // $("#egy").css("width", parseFloat(sortable[1][1])*100+"%");
                updatedOptions.areas[key] = {
                    attrs: {
                        fill: "#915201"
                    }
                };
            } else if (countriesOfDialect[sortable[2][0]].indexOf(key) > -1) {
                // $("#egy").css("width", parseFloat(sortable[2][1])*100+"%");
                updatedOptions.areas[key] = {
                    attrs: {
                        fill: "#482900"
                    }
                };
            } else if (countriesOfDialect[sortable[3][0]].indexOf(key) > -1) {
                // $("#egy").css("width", parseFloat(sortable[3][1])*100+"%");
                updatedOptions.areas[key] = {
                    attrs: {
                        fill: "#646464"
                    }
                };
            } else {

                var isArab = arabCountries.includes(key);
                if (isArab) {
                    updatedOptions.areas[key] = {
                        attrs: {
                            fill: "#646464"
                        }
                    };
                }
                // block of code to be executed if the condition1 is false and condition2 is false
            }


        });


        // updatedOptions.areas["sa"] = {
        //     attrs: {
        //         fill: "#ff0000"
        //     }
        // };
        // updatedOptions.areas["qa"] = {
        //     attrs: {
        //         fill: "#00ff00"
        //     }
        // };
        // updatedOptions.areas["om"] = {
        //     attrs: {
        //         fill: "#00ff00"
        //     }
        // };
        // updatedOptions.areas["ae"] = {
        //     attrs: {
        //         fill: "#00ff00"
        //     }
        // };
        // updatedOptions.areas["kw"] = {
        //     attrs: {
        //         fill: "#00ff00"
        //     }
        // };
        $mapcontainer.trigger('update', [{
            mapOptions: updatedOptions,
            animDuration: 1000
        }]);


    },
    onError: function (code, data) {
        dictate.cancel();
        __error(code, data);
        // TODO: show error in the GUI
    },
    onEvent: function (code, data) {
        __message(code, data);
    }
});

// Private methods (called from the callbacks)
function __message(code, data) {
    log.innerHTML = "msg: " + code + ": " + (data || '') + "\n" + log.innerHTML;
}

function __error(code, data) {
    log.innerHTML = "ERR: " + code + ": " + (data || '') + "\n" + log.innerHTML;
}

function __serverStatus(msg) {
    serverStatusBar.innerHTML = msg;
}

function __updateTranscript(text) {
    $("#trans").val(text);
}

// Public methods (called from the GUI)
function toggleListening() {
    if (isConnected) {
        dictate.stopListening();
    } else {
        dictate.startListening();

    }
}

function cancel() {
    dictate.cancel();
}

function clearTranscription() {
    $("#trans").val("");
    // needed, otherwise selectionStart will retain its old value
    $("#trans").prop("selectionStart", 0);
    $("#trans").prop("selectionEnd", 0);
}

$(document).ready(function () {
    dictate.init();

    $("#servers").change(function () {
        dictate.cancel();
        var servers = $("#servers").val().split('|');
        dictate.setServer(servers[0]);
        dictate.setServerStatus(servers[1]);
    });

});