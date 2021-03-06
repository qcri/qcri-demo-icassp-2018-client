//var ASR_SERVER = "qcri-alt-asr-ar.northeurope.cloudapp.azure.com:7778";
//var ASR_SERVER = "asr.qcri.org:7778";
//var ASR_SERVER = "qatslive4520.cloudapp.net:8888";
//var ASR_SERVER = "localhost:8888";
// var ASR_SERVER = "dialectid.xyz:8888";
var ASR_SERVER = "dialectid.qcri.org:8888";
var MIN_VOL = -100;
var MAX_VOL = -50;
//var ASR_SERVER = "icassp-demo-2018.qcri.org:8888";
var dialectHistory = [];

var num_workers_available = 0;
var isAllowToggle = false;

function toggleImage() {
    $("#micrecording").toggle();
    $("#fake-mic").toggle();
    $("#asr-partial").toggle();
    $("#start").toggle();
    $("#stop").toggle();
}

function __serverStatus(msg) {
    //TODO: We send notification of server status from here
    console.log("[STATUS]");
    console.log(msg);
}

// Private methods (called from the callbacks)
function __message(code, data) {
    // if(code==8) {
    //     var myobj = JSON.parse(data);
    // //     alert(data["status"])
    //     if(data["status"]== 9)
    //     alert("No decoder available, try again later");
    // }
    console.log("[msg]: " + code + ": " + (data || ''));
}

function __error(code, data) {
    console.log("[err]: " + code + ": " + (data || ''));
}

function __status(msg) {
    console.log("[status]: " + msg);
}

var dictate = new Dictate({
    server: "wss://" + ASR_SERVER + "/client/ws/speech",
    serverStatus: "wss://" + ASR_SERVER + "/client/ws/status",
    recorderWorkerPath: '../static/did/asr/examples/static-webapp-example/recorderWorker.js',
    onReadyForSpeech: function () {
        __message("READY FOR SPEECH");
        __status("Kuulan ja transkribeerin...");
        if (isAllowToggle) {
            toggleImage();
            stopwatch.restart();
        }
    },
    onEndOfSpeech: function () {
        __message("END OF SPEECH");
        __status("Transkribeerin...");
    },
    onEndOfSession: function () {
        __message("END OF SESSION");
        __status("");
        if (isAllowToggle) {
            toggleImage();
            stopwatch.stop();

        }
    },
    onServerStatus: function (json) {
        // if(json.num_workers_available == 0){
        //     alert("No workers");
        // }
        num_workers_available = json.num_workers_available;
        __serverStatus(json.num_workers_available + ':' + json.num_requests_processed);
    },
    onPartialResults: function (hypos, segmentid) {
        console.log("[PARTIAL] " + hypos[0]['transcript']);
        document.getElementById("asr-partial").innerHTML = hypos[0]['transcript'];
    },
    onResults: function (hypos, segmentid) {
        console.log("[FINAL] " + hypos[0]['transcript']);
        document.getElementById("transcripts").innerHTML = document.getElementById("transcripts").innerHTML + hypos[0]['transcript'] + " \n ";

        var sortable = [];
        for (var vehicle in hypos[1]) {
            sortable.push([vehicle, hypos[1][vehicle]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        color_code = {"MSA": "success", "EGY": "danger", "GLF": "info", "NOR": "warning", "LEV": "active"};
        // document.getElementById("dialects").innerHTML = "<tr class=\""+ color_code[sortable[0][0]] +"\"><td>"+ sortable[0][0] +"</td><td>"+ sortable[0][1] +"</td><td>False</td></tr>" +
        //     "<tr class=\""+ color_code[sortable[1][0]] +"\"><td>"+ sortable[1][0] +"</td><td>"+ sortable[1][1] +"</td><td>False</td></tr>" +
        //     "<tr class=\""+ color_code[sortable[2][0]] +"\"><td>"+ sortable[2][0] +"</td><td>"+ sortable[2][1] +"</td><td>False</td></tr>" +
        //     "<tr class=\""+ color_code[sortable[3][0]] +"\"><td>"+ sortable[3][0] +"</td><td>"+ sortable[3][1] +"</td><td>False</td></tr>" +
        //     "<tr class=\""+ color_code[sortable[4][0]] +"\"><td>"+ sortable[4][0] +"</td><td>"+ sortable[4][1] +"</td><td>False</td></tr>";
        //document.getElementById("dialects").innerHTML + "<br/> " + sortable;


        // function setDefColor(element, index, array) {
        //
        //
        // }

        var updatedOptions = {'areas': {}};

        // for (var property in $("#map").data("mapael").areas) {
        //     console.log(property);
        // }

        var countriesOfDialect = {
            "EGY": ["eg"],
            "MSA": [""],
            //"eg","sa", "qa", "om", "kw", "ae","eh", "ma", "dz", "tn", "ly","sy", "jo", "ps", "lb","sd","ye", "iq", "mr", "so", "xs", "dj"
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


        var $map = $('#map');

        Object.keys($map.data("mapael").areas).forEach(function (key, index) {
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
                        fill: "#343434"
                    }
                };
            } else {
                updatedOptions.areas[key] = {
                    attrs: {
                        fill: "#343434"
                    }
                };
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
        $("#map").trigger('update', [{
            mapOptions: updatedOptions,
            animDuration: 1000
        }]);

    },
    onError: function (code, data) {
        console.log("ERROR " + code + " " + data);
        dictate.cancel();
    },
    onEvent: function (code, data) {
        __message(code, data);
    },
    audioProcessor: function () {
        var array = new Float32Array(window.userSpeechAnalyser.frequencyBinCount);
        window.userSpeechAnalyser.getFloatFrequencyData(array);
        var values = 0;
        var average;

        var length = array.length;

        // get all the frequency amplitudes
        for (var i = 0; i < length; i++) {
            values += array[i];
        }

        average = values / length;

        // if(DEBUG) console.log("[VOL] " + average);

        // Perform clipping
        if (average < MIN_VOL)
            average = MIN_VOL;
        if (average > MAX_VOL)
            average = MAX_VOL;

        average += 100;
        average *= 100 / (MAX_VOL - MIN_VOL);
        if (average == 100)
            average = 99;

        // if(DEBUG) console.log("[VOL-CORRECTED] " + average);
        $("#volume").prop('value', average);
        // $("#volume").css("margin-left", "-" + (99 - average) + "%");
    }
});

window.onload = function () {
    // document.getElementById("transcripts").innerHTML = document.getElementById("transcripts").innerHTML + "Ready";

    dictate.init();
};


function start_listening() {
    console.log("################################################");
    console.log("############# Start Button Pressed #############");
    console.log("################################################");

    if (num_workers_available < 1) {
        alert("Sorry! server is busy (0 workers) .. max workers has been reached  .. Please check in few minutes :)");
        isAllowToggle = false;

    } else {
        isAllowToggle = true;
    }

    dictate.startListening();
}

function stop_listening() {
    console.log("################################################");
    console.log("############# Stop Button Pressed #############");
    console.log("################################################");
    dictate.stopListening();


}
