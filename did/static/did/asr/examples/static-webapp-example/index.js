//var ASR_SERVER = "qcri-alt-asr-ar.northeurope.cloudapp.azure.com:7778";
//var ASR_SERVER = "asr.qcri.org:7778";
//var ASR_SERVER = "qatslive4520.cloudapp.net:8888";
//var ASR_SERVER = "localhost:8888";
var ASR_SERVER = "dialectid.xyz:8888";

//var ASR_SERVER = "icassp-demo-2018.qcri.org:8888";


function __serverStatus(msg) {
    console.log("[STATUS]");
    console.log(msg);
}

// Private methods (called from the callbacks)
function __message(code, data) {
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
    },
    onEndOfSpeech: function () {
        __message("END OF SPEECH");
        __status("Transkribeerin...");
    },
    onEndOfSession: function () {
        __message("END OF SESSION");
        __status("");
    },
    onServerStatus: function (json) {

        __serverStatus(json.num_workers_available + ':disooqi:' + json.num_requests_processed);
    },
    onPartialResults: function (hypos, segmentid) {
        console.log("[PARTIAL] " + hypos[0]['transcript']);
        document.getElementById("asr-partial").innerHTML =  hypos[0]['transcript'];
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
            "MSA": ["sd"],
            "GLF": ["sa", "qa", "om", "kw", "ae"],
            "NOR": ["eh", "ma", "dz", "tn", "ly"],
            "LAV": ["sy", "jo", "ps", "lb"]
        };
        $("#"+sortable[0][0].toLowerCase()).css("width", parseFloat(sortable[0][1])*100+"%");
        $("#"+sortable[1][0].toLowerCase()).css("width", parseFloat(sortable[1][1])*100+"%");
        $("#"+sortable[2][0].toLowerCase()).css("width", parseFloat(sortable[2][1])*100+"%");
        $("#"+sortable[3][0].toLowerCase()).css("width", parseFloat(sortable[3][1])*100+"%");
        $("#"+sortable[4][0].toLowerCase()).css("width", parseFloat(sortable[4][1])*100+"%");//percent-egy

        $("#percent-"+sortable[0][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[0][1])*100));
        $("#percent-"+sortable[1][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[1][1])*100));
        $("#percent-"+sortable[2][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[2][1])*100));
        $("#percent-"+sortable[3][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[3][1])*100));
        $("#percent-"+sortable[4][0].toLowerCase()).text(Math.ceil(parseFloat(sortable[4][1])*100));

        var $map = $('#map');

        Object.keys($map.data("mapael").areas).forEach(function (key, index) {
            // console.log(sortable[0][0]);
            if (countriesOfDialect[sortable[0][0]].indexOf(key) > -1) {

                updatedOptions.areas[key] = {
                    attrs: {
                        fill: "#f38a03"
                    }
                };
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
    }
});

window.onload = function () {
    // document.getElementById("transcripts").innerHTML = document.getElementById("transcripts").innerHTML + "Ready";

    dictate.init();
};

function start_listening() {
    dictate.startListening();
}

function stop_listening() {
    dictate.stopListening();
}
