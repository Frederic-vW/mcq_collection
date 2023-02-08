$(window).on('load', function() {
    //console.log("js script video-MCQ running ...")
    times = [310, 501, 945] // times at which a MCQ is shown, 5:10, 8:21
    n_mcq = times.length
    ansTexts = [
    ["Skeletal muscle is activated in the order: brain-spine-nerve-muscle",
     "Skeletal muscle is under voluntary control",
     "Skeletal muscle is activated in the order: brain-nerve-spine-muscle",
     "Skeletal muscle contractions can achieve a very high level of precision"],
    ["Cardiac muscle contraction is under voluntary control",
     "Cardiac muscle contracts with a constant force to provide stable output",
     "Cardiac muscle should not present tonic contractions",
     "Cardiac muscle adapts to external requirements (e.g. exercise)",
     "Cardiac muscle does not adapt to external requirements"],
    ["Smooth muscle contraction is under voluntary control",
     "Smooth muscle is involved in pupil contraction",
     "Smooth muscle produces a wide range of forces",
     "Smooth muscle can contract continuously for hours"]
    ]
    blank = String.fromCharCode(160)

    // find Moodle html elements
    video = document.getElementsByTagName('video')[0]
    if (video.getAttribute('title') == '00_Muscle_Intro_2023_b.mp4') {
        video.ontimeupdate = function() {showQuestion()};
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
            qId-- // don't go too far
        }

        // whereever you land, set the previous Qs to 'shown'
        if (qId > 0) {
            for (i=0; i<qId; i++) {
                q_shown[i] = true
            }
        }

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

        // decide whether to show MCQ or not (already shown)
        if (qId >= 0) {
            if (q_shown[qId] == false) {
                q_shown[qId] = true;
                // find attachment element
                videoPlayer = document.getElementsByClassName('video-js')[0]
                videoBox = videoPlayer.getBoundingClientRect()
                //videoBox = video.getBoundingClientRect()

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
                width: 100%; background-color: rgba(250,250,250,0.9); overflow: scroll`
                var h1 = document.createElement("h1")
                h1.innerHTML = "Quick check"
                qd2.appendChild(h1)

                // insert correct MCQ text
                var p1 = document.createElement("p")
                p1.innerHTML = "Select the correct statements!"
                qd2.appendChild(p1)

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
                qd2.appendChild(p2)
                /*
                for (i=0; i<n_answers; i++) {
                    p2.appendChild(divArr[i])
                }
                */

                // SUBMIT BUTTON
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

                // SKIP/CONTINUE BUTTON
                var b2 = document.createElement("button")
                b2.setAttribute("id", "skip-button")
                b2.onclick = function(){
                    qd.style.display = "none";
                    p1.parentNode.removeChild(p1)
                    p2.parentNode.removeChild(p2)
                    p3.parentNode.removeChild(p3)
                    video.play();
                }
                b2.innerHTML = "Skip"
                p3.appendChild(b2)
                qd2.appendChild(p3)
                qd.appendChild(qd2)

                // insert MCQ div on top of videobox
                videoPlayer.parentNode.insertBefore(qd, videoPlayer.nextSibling)

                // pause video and show MCQ
                video.pause()
                qd.style.display = "block";
            }
        }

        /* react to rewind
        if ( (qId < times.length-1) && (q_shown[qId+1] == true) ) {
            // not after last MCQ and next MCQ has already been shown
            for (i=qId+1; i<times.length; i++) {
                q_shown[i] = false; // reset all subsequent MCQs to "not shown"
            }
        }
        */

        t_prev = t_now  // update previous time
    }

    function get_feedback(q, e, c) {
        _ = "Xz1bIkFCQyIsIkNERSIsIkJDRCJdO2NhPV8ubWFwKF9fPT5BcnJheS5mcm9tKF9fKSk="
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
