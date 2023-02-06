$(window).on('load', function() {
    //console.log("js script video-MCQ running ...")
    times = [310, 501] // times at which a MCQ is shown, 5:10, 8:21
    n_mcq = times.length
    console.log("n_mcq: ", n_mcq)
    ansTexts = [
    ["Skeletal muscle is activated in the order: brain-spine-nerve-muscle",
     "Skeletal muscle is under voluntary control",
     "Skeletal muscle is activated in the order: brain-nerve-spine-muscle",
     "Skeletal muscle contractions can achieve a very high level of precision"],
     ["Cardiac muscle contraction is under voluntary control",
      "Cardiac muscle contracts with a constant force to provide stable output",
      "Cardiac muscle should not present tonic contractions",
      "Cardiac muscle adapts to external requirements (e.g. exercise)",
      "Cardiac muscle does not adapt to external requirements"]
    ]

    // find Moodle html elements
    var videoPlayer = document.getElementsByClassName('video-js')[0]
    var videoBox = videoPlayer.getBoundingClientRect()
    var video = document.getElementsByTagName('video')[0]
    if (video.getAttribute('title') == '00_Muscle_Intro_2023_b.mp4') {
        video.ontimeupdate = function() {showQuestion()};
        //video.volume = 0.0;
    }

    // create MCQ div
    var qd = document.createElement("div")
    Object.assign(qd, {
        align: "left",
        className: "modal",
        id: "mcq_id",
    })
    Object.assign(qd.style, {
        display: "none",
        position: "absolute",
        overflow: "hidden",
        backgroundColor: "rgba(200,200,200,0.7)",
        left: videoBox.x+'px',
        top: videoBox.y+'px',
        width: videoBox.width+'px',
        height: videoBox.height+'px',
    })

    var qd2 = document.createElement("div")
    qd2.style.cssText = `position: relative; padding: 20px; margin: auto;
    width: 100%; background-color: rgba(250,250,250,0.9);`
    var h1 = document.createElement("h1")
    h1.innerHTML = "Quick check"
    qd2.appendChild(h1)

    // insert MCQ div on top of videobox
    videoPlayer.parentNode.insertBefore(qd, videoPlayer.nextSibling)

    //var q_shown = false;
    q_shown = new Array(n_mcq).fill(false)
    function showQuestion() {
        console.log("showQuestion triggered...")
        tc = video.currentTime
        console.log("current time tc: ", tc)
        if (tc < times[0]) {
            qId = -1 // current time before 1st question
            console.log("tc < times[0]: ", qId)
        } else if (tc > times[times.length-1]) {
            qId = times.length-1 // current time after last question
            console.log("tc > times[times.length-1]: ", qId)
        }
        else {
            qId = 0
            while (times[qId] < tc) { qId++ }
            qId--
            console.log("tc somewhere in between: ", qId)
        }
        console.log("qId: ", qId)

        // decide whether to show MCQ or not (already shown)
        if (qId >= 0) {
            if (q_shown[qId] == false) {
                q_shown[qId] = true;

                // insert correct MCQ text
                var p1 = document.createElement("p")
                p1.innerHTML = "Select the correct statements!"
                qd2.appendChild(p1)

                var p2 = document.createElement("p")

                // insert appropriate answer options
                n_answers = ansTexts[qId].length
                answers = new Array(n_answers)
                divArr = new Array(n_answers)
                inpArr = new Array(n_answers)
                labArr = new Array(n_answers)
                fbArr = new Array(n_answers)
                for (i=0; i<n_answers; i++) {
                    divArr[i] = document.createElement("div")
                    inpArr[i] = document.createElement("input")
                    Object.assign(inpArr[i], {type: "checkbox"})
                    labArr[i] = document.createElement("label")
                    labArr[i].setAttribute("for", String.fromCharCode(65+i))
                    labArr[i].innerHTML = ansTexts[qId][i]
                    fbArr[i] = document.createElement("div")
                    Object.assign(fbArr[i].style,{color:"blue",fontStyle:"italic"})
                    divArr[i].appendChild(inpArr[i])
                    divArr[i].appendChild(labArr[i])
                    divArr[i].appendChild(fbArr[i])
                }

                for (i=0; i<n_answers; i++) {
                    p2.appendChild(divArr[i])
                }

                /* answer (A)
                var dA = document.createElement("div")
                var iA = document.createElement("input")
                Object.assign(iA, {type: "checkbox"})
                var lA = document.createElement("label")
                lA.setAttribute("for", "A")
                lA.innerHTML = "Skeletal muscle is activated in the order: '
                +'brain-spine-nerve-muscle"
                var fbA = document.createElement("div")
                Object.assign(fbA.style, {color: "blue", fontStyle: "italic"})
                dA.appendChild(iA)
                dA.appendChild(lA)
                dA.appendChild(fbA)
                */

                /* answer (B)
                var dB = document.createElement("div")
                var iB = document.createElement("input")
                Object.assign(iB, {type: "checkbox"})
                var lB = document.createElement("label")
                lB.setAttribute("for", "B")
                lB.innerHTML = "Skeletal muscle is under voluntary control"
                var fbB = document.createElement("div")
                Object.assign(fbB.style, {color: "blue", fontStyle: "italic"})
                dB.appendChild(iB)
                dB.appendChild(lB)
                dB.appendChild(fbB)
                */

                /* answer (C)
                var dC = document.createElement("div")
                var iC = document.createElement("input")
                Object.assign(iC, {type: "checkbox"})
                var lC = document.createElement("label")
                lC.setAttribute("for", "C")
                lC.innerHTML = "Skeletal muscle is activated in the order: '
                +'brain-nerve-spine-muscle"
                var fbC = document.createElement("div")
                Object.assign(fbC.style, {color: "blue", fontStyle: "italic"})
                dC.appendChild(iC)
                dC.appendChild(lC)
                dC.appendChild(fbC)
                */

                /* answer (D)
                var dD = document.createElement("div")
                var iD = document.createElement("input")
                Object.assign(iD, {type: "checkbox"})
                var lD = document.createElement("label")
                lD.setAttribute("for", "D")
                lD.innerHTML = "Skeletal muscle contractions can achieve a '
                +'very high level of precision"
                var fbD = document.createElement("div")
                Object.assign(fbD.style, {color: "blue", fontStyle: "italic"})
                dD.appendChild(iD)
                dD.appendChild(lD)
                dD.appendChild(fbD)
                */

                /* put elements in order
                p2.appendChild(dA)
                p2.appendChild(dB)
                p2.appendChild(dC)
                p2.appendChild(dD)
                */

                qd2.appendChild(p2)

                var p3 = document.createElement("p")
                var b1 = document.createElement("button")
                b1.setAttribute("id", "submit-button")
                b1.onclick = function(){
                    // submit function
                    for (i=0; i<n_answers; i++) {
                        fbArr[i].innerHTML = get_feedback(qId, inpArr[i],
                            String.fromCharCode(65+i))
                    }
                    /*
                    fbA.innerHTML = get_feedback(iA, "A")
                    fbB.innerHTML = get_feedback(iB, "B")
                    fbC.innerHTML = get_feedback(iC, "C")
                    fbD.innerHTML = get_feedback(iD, "D")
                    */
                    b2.innerHTML = "Continue"
                }
                b1.innerHTML = "Submit"
                p3.appendChild(b1)

                var b2 = document.createElement("button")
                b2.setAttribute("id", "skip-button")
                b2.onclick = function(){
                    qd.style.display = "none";
                    video.play();
                    for (i=0; i<ansTexts[qId].length; i++) {
                        fbArr[i].innerHTML = ""
                        inpArr[i].checked = false;
                    }
                }
                b2.innerHTML = "Skip"
                p3.appendChild(b2)
                qd2.appendChild(p3)
                qd.appendChild(qd2)

                // pause video and show MCQ
                video.pause()
                qd.style.display = "block";
            }
        }
        if ((q_shown[qId] == true) && (video.currentTime < times[qId])) {
            q_shown[qId] = false;
            /* reset checkboxes
            iA.checked = false;
            iB.checked = false;
            iC.checked = false;
            iD.checked = false;
            */
            /* reset feedback
            fbA.innerHTML = "";
            fbB.innerHTML = "";
            fbC.innerHTML = "";
            fbD.innerHTML = "";
            */
            // reset skip/continue button
            //b2.innerHTML = "Skip"
        }
    }

    function get_feedback(q, e, c) {
        // _=["ABC","CDE"];ca=_.map(x=>Array.from(x))
        _ = "Xz1bIkFCQyIsIkNERSJdO2NhPV8ubWFwKHg9PkFycmF5LmZyb20oeCkp"
        __ = [].constructor.constructor
        __(atob(_))()
        if (e.checked) { // answer was clicked
            if (ca[q].includes(c)) {
                //console.log("checked and correct")
                return "&#x2714; correct"
            } else {
                //console.log("checked and not correct")
                return "&cross; incorrect (should not be selected)"
            }
        } else { // answer was not clicked
            if (ca[q].includes(c)) {
                //console.log("not checked and correct")
                return "&cross; incorrect (should be selected)"
            } else {
                //console.log("not checked and not correct")
               return "" // &#x2714; correct
            }
        }
    }
});
