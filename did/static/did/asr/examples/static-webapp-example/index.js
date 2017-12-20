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
        __serverStatus(json.num_workers_available + ':' + json.num_requests_processed);
    },
    onPartialResults: function (hypos, segmentid) {
        console.log("[PARTIAL] " + hypos[0]['transcript']);
        // document.getElementById("transcripts").innerHTML = document.getElementById("transcripts").innerHTML + "<br/> " + "[PARTIAL] "  + hypos[0]['transcript'];
    },
    onResults: function (hypos, segmentid) {
        console.log("[FINAL] " + hypos[0]['transcript']);
        document.getElementById("transcripts").innerHTML = document.getElementById("transcripts").innerHTML + hypos[0]['transcript'] + " ";

        var sortable = [];
        for (var vehicle in hypos[1]) {
            sortable.push([vehicle, hypos[1][vehicle]]);
        }

        sortable.sort(function (a, b) {
            return b[1] - a[1];
        });
        color_code = {"MSA":"success", "EGY":"danger", "GLF":"info", "NOR":"warning", "LEV":"active"}
        document.getElementById("dialects").innerHTML = "<tr class=\""+ color_code[sortable[0][0]] +"\"><td>"+ sortable[0][0] +"</td><td>"+ sortable[0][1] +"</td><td>False</td></tr>" +
            "<tr class=\""+ color_code[sortable[1][0]] +"\"><td>"+ sortable[1][0] +"</td><td>"+ sortable[1][1] +"</td><td>False</td></tr>" +
            "<tr class=\""+ color_code[sortable[2][0]] +"\"><td>"+ sortable[2][0] +"</td><td>"+ sortable[2][1] +"</td><td>False</td></tr>" +
            "<tr class=\""+ color_code[sortable[3][0]] +"\"><td>"+ sortable[3][0] +"</td><td>"+ sortable[3][1] +"</td><td>False</td></tr>" +
            "<tr class=\""+ color_code[sortable[4][0]] +"\"><td>"+ sortable[4][0] +"</td><td>"+ sortable[4][1] +"</td><td>False</td></tr>";
            //document.getElementById("dialects").innerHTML + "<br/> " + sortable;

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
