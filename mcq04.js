$(window).on('load', function() {
    //console.log("js script video-MCQ running ...")
    times = [380, 636, 1117] // 6:20, 10:36, 18:37
    n_mcq = times.length
    ansTexts = [
    ["Pacemaker cells are specialized nerve cells",
     "Pacemaker cells have an unstable resting membrane potential",
     "A syncytium is a multinucleated single muscle cell (myocyte)",
     "Gap junctions mediate Ca2+ currents from extra- to intracellular space"],
    ["The repolarization of the cardiac AP is due to a Cl- current",
     "The initial depolarization of the cardiac AP is due to a Na+ current",
     "The plateau phase of the cardiac AP is due to a Ca2+ current",
     "The plateau phase facilitates formation of the cardiac tetanus"],
    ["The cardiac AP travels along the t-tubule",
     "The cardiac voltage sensor (DHPR) is identical to the skeletal DHPR",
     "Calcium-induced calcium release is mediated by ryanodine receptors",
     "The Na+/Ca2+ exchanger is a primary active transporter (ATPase)"]
    ]
    blank = String.fromCharCode(160)

    // find Moodle html elements
    video = document.getElementsByTagName('video')[0]
    if (video.getAttribute('title') == '04_Cardiac_ECcoupling_2023') {
        video.ontimeupdate = function() {showQuestion()};
        //console.log('showQuestion triggered')
    }

    t_prev = 0  // record previous time stamp
    q_shown = new Array(n_mcq).fill(false)
    function showQuestion() {
        t_now = video.currentTime
        if (t_now < times[0]) {
            qId = -1 // current time before 1st question
        } else if (t_now > times[times.length-1]) {
            qId = times.length-1 // current time after last question
        }
        else {
            qId = 0
            while (times[qId] < t_now) { qId++ }
            qId-- // decrement 1 to get the right MCQ
        }

        // whereever you land, set the previous Qs to 'shown'
        if (qId > 0) {
            for (i=0; i<qId; i++) {
                q_shown[i] = true
            }
        }
        //console.log('qId = ', qId)

        // is this a forward jump?
        if (t_now > t_prev + 2.0) {
            q_shown[qId] = true; // don't show the MCQ of the section you jumped into
        }

        // is this a backward jump?
        if (t_now < t_prev) {
            q_shown[qId] = true; // don't show the MCQ of the section you jumped into
            for (i=qId+1; i<times.length; i++) {
                q_shown[i] = false; // reset all subsequent MCQs to "not shown"
            }
        }

        // find attachment element
        videoPlayer = document.getElementsByClassName('video-js')[0]
        videoBox = videoPlayer.getBoundingClientRect()

        // decide whether to show MCQ or not (already shown)
        if (qId >= 0) {
            if (q_shown[qId] == false) {
                q_shown[qId] = true;

                // create MCQ div
                var mcqDiv = document.createElement("div")
                Object.assign(mcqDiv, {
                    align: "left",
                    className: "modal",
                    id: "mcq_id",
                })
                Object.assign(mcqDiv.style, {
                    display: "none",
                    position: "absolute",
                    overflowX: "hidden",
                    overflowY: "auto",
                    backgroundColor: "rgba(200,200,200,0.7)",
                    left: 0+'px',
                    top: 0+'px',
                    width: videoBox.width+'px',
                    height: videoBox.height+'px',
                })

                var mcqHeaderDiv = document.createElement("div")
                mcqHeaderDiv.style.cssText = `position: relative; padding: 20px;
                margin: auto; width: 100%; background-color: rgba(250,250,250,0.9);`
                var h1 = document.createElement("h1")
                h1.innerHTML = "Quick check"
                mcqHeaderDiv.appendChild(h1)

                // insert correct MCQ text
                var p1 = document.createElement("p")
                p1.innerHTML = "Select the correct statements!"
                mcqHeaderDiv.appendChild(p1)

                // insert appropriate answer options
                var p2 = document.createElement("p")
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
                    labArr[i].innerHTML = blank + ansTexts[qId][i]
                    fbArr[i] = document.createElement("div")
                    Object.assign(fbArr[i].style,{color:"blue",fontStyle:"italic"})
                    divArr[i].appendChild(inpArr[i])
                    divArr[i].appendChild(labArr[i])
                    divArr[i].appendChild(fbArr[i])
                    p2.appendChild(divArr[i])
                }
                mcqHeaderDiv.appendChild(p2)

                // submit button
                var p3 = document.createElement("p")
                var b1 = document.createElement("button")
                b1.setAttribute("id", "submit-button")
                b1.onclick = function(){
                    // submit function
                    for (i=0; i<n_answers; i++) {
                        fbArr[i].innerHTML = get_feedback(qId, inpArr[i],
                            String.fromCharCode(65+i))
                    }
                    b2.innerHTML = "Continue"
                }
                b1.innerHTML = "Submit"
                p3.appendChild(b1)

                // skip/continue button
                var b2 = document.createElement("button")
                b2.setAttribute("id", "skip-button")
                b2.onclick = function(){
                    mcqDiv.style.display = "none";
                    p1.parentNode.removeChild(p1)
                    p2.parentNode.removeChild(p2)
                    p3.parentNode.removeChild(p3)
                    video.play();
                }
                b2.innerHTML = "Skip"
                p3.appendChild(b2)
                mcqHeaderDiv.appendChild(p3)
                mcqDiv.appendChild(mcqHeaderDiv)

                // insert MCQ div on top of videobox
                videoPlayer.parentNode.insertBefore(mcqDiv, videoPlayer.nextSibling)

                // pause video and show MCQ
                video.pause()
                mcqDiv.style.display = "block";
            }
        }
        t_prev = t_now  // update previous time
    }

    function get_feedback(q, e, c) {
        _ = "Xz1bIkIiLCJCQyIsIkFDIl07Y2E9Xy5tYXAoX189PkFycmF5LmZyb20oX18pKQ=="
        ___ = [].constructor.constructor
        ___(atob(_))()
        if (e.checked) { // answer was clicked
            if (ca[q].includes(c)) {
                return "&#x2714; correct"
            } else {
                return "&cross; incorrect (should not be selected)"
            }
        } else { // answer was not clicked
            if (ca[q].includes(c)) {
                return "&cross; incorrect (should be selected)"
            } else {
               return "" // &#x2714; correct
            }
        }
    }
});