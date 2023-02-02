$(window).on('load', function() {
    //console.log("js script video-MCQ running ...")
    videoPlayer = document.getElementsByClassName('video-js')[0]
    videoBox = videoPlayer.getBoundingClientRect()
    video = document.getElementsByTagName('video')[0]
    if (video.getAttribute('title') == '00_Muscle_Intro_2023_b.mp4') {
        video.ontimeupdate = function() {showQuestion()};
        //video.volume = 0.0;
    }
    // create MCQ div
    qd = document.createElement("div")
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

    qd2 = document.createElement("div")
    qd2.style.cssText = `position: relative; padding: 20px; margin: auto;
    width: 100%; background-color: rgba(250,250,250,0.9);`
    h1 = document.createElement("h1")
    h1.innerHTML = "Quick check"
    qd2.appendChild(h1)

    p1 = document.createElement("p")
    p1.innerHTML = "Select the correct statements!"
    qd2.appendChild(p1)

    p2 = document.createElement("p")

    // answer (A)
    dA = document.createElement("div")
    iA = document.createElement("input")
    Object.assign(iA, {type: "checkbox"})
    lA = document.createElement("label")
    lA.setAttribute("for", "A")
    lA.innerHTML = "Skeletal muscle is activated in the order: brain-spine-nerve-muscle"
    fbA = document.createElement("div")
    Object.assign(fbA.style, {color: "blue", fontStyle: "italic"})
    dA.appendChild(iA)
    dA.appendChild(lA)
    dA.appendChild(fbA)

    // answer (B)
    dB = document.createElement("div")
    iB = document.createElement("input")
    Object.assign(iB, {type: "checkbox"})
    lB = document.createElement("label")
    lB.setAttribute("for", "B")
    lB.innerHTML = "Skeletal muscle is under voluntary control"
    fbB = document.createElement("div")
    Object.assign(fbB.style, {color: "blue", fontStyle: "italic"})
    dB.appendChild(iB)
    dB.appendChild(lB)
    dB.appendChild(fbB)

    // answer (C)
    dC = document.createElement("div")
    iC = document.createElement("input")
    Object.assign(iC, {type: "checkbox"})
    lC = document.createElement("label")
    lC.setAttribute("for", "C")
    lC.innerHTML = "Skeletal muscle is activated in the order: brain-nerve-spine-muscle"
    fbC = document.createElement("div")
    Object.assign(fbC.style, {color: "blue", fontStyle: "italic"})
    dC.appendChild(iC)
    dC.appendChild(lC)
    dC.appendChild(fbC)

    // answer (D)
    dD = document.createElement("div")
    iD = document.createElement("input")
    Object.assign(iD, {type: "checkbox"})
    lD = document.createElement("label")
    lD.setAttribute("for", "D")
    lD.innerHTML = "Skeletal muscle contractions can achieve a very high level of precision"
    fbD = document.createElement("div")
    Object.assign(fbD.style, {color: "blue", fontStyle: "italic"})
    dD.appendChild(iD)
    dD.appendChild(lD)
    dD.appendChild(fbD)

    // put elements in order
    p2.appendChild(dA)
    p2.appendChild(dB)
    p2.appendChild(dC)
    p2.appendChild(dD)

    qd2.appendChild(p2)

    p3 = document.createElement("p")
    b1 = document.createElement("button")
    b1.setAttribute("id", "submit-button")
    b1.onclick = function(){
        // submit function
        fbA.innerHTML = get_feedback(iA, "A")
        fbB.innerHTML = get_feedback(iB, "B")
        fbC.innerHTML = get_feedback(iC, "C")
        fbD.innerHTML = get_feedback(iD, "D")
        b2.innerHTML = "Continue"
    }
    b1.innerHTML = "Submit"
    p3.appendChild(b1)

    b2 = document.createElement("button")
    b2.setAttribute("id", "skip-button")
    b2.onclick = function(){
        qd.style.display = "none";
        video.play();
    }
    b2.innerHTML = "Skip"
    p3.appendChild(b2)
    qd2.appendChild(p3)
    qd.appendChild(qd2)
    // insert MCQ div on top of videobox
    videoPlayer.parentNode.insertBefore(qd, videoPlayer.nextSibling)

    var q1_shown = false;
    function showQuestion() {
        if ((!q1_shown) && (video.currentTime > 5.1)) {
            q1_shown = true;
            video.pause()
            qd.style.display = "block";
        }
        if (q1_shown && (video.currentTime < 1.0)) {
            q1_shown = false;
            // reset checkboxes
            iA.checked = false;
            iB.checked = false;
            iC.checked = false;
            iD.checked = false;
            // reset feedback
            fbA.innerHTML = "";
            fbB.innerHTML = "";
            fbC.innerHTML = "";
            fbD.innerHTML = "";
            // reset skip/continue button
            b2.innerHTML = "Skip"
        }
    }

    function get_feedback(e, c) {
        // e: input element, c: answer label A..D
        // _=btoa("ABD");ca=Array.from(atob(_))
        _ = "Xz1idG9hKCJBQkQiKTtjYT1BcnJheS5mcm9tKGF0b2IoXykp"
        __ = [].constructor.constructor
        __(atob(_))()
        if (e.checked) { // answer was clicked
            if (ca.includes(c)) {
                //console.log("checked and correct")
                return "&#x2714; correct"
            } else {
                //console.log("checked and not correct")
                return "&cross; incorrect (should not be selected)"
            }
        } else { // answer was not clicked
            if (ca.includes(c)) {
                //console.log("not checked and correct")
                return "&cross; incorrect (should be selected)"
            } else {
                //console.log("not checked and not correct")
                return "" // &#x2714; correct
            }
        }
    }
});
