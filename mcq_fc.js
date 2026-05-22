$(window).on("load", function () {
  console.log("MCQ js activated");
  const times = [30, 60, 90];
  const answerTexts = [
    [
      "option-A",
      "option-B",
      "option-C",
      "option-D"
    ],
    [
      "option-1",
      "option-2",
      "option-3",
      "option-4"
    ],
    [
      "option-a)",
      "option-b)",
      "option-c)",
      "option-d)"
    ]
  ];

  const correctAnswers = [
    ["A", "B", "D"],
    ["C", "D"],
    ["B", "C", "D"]
  ];

  const video = document.querySelector("video");
  if (!video) {
    console.log("no video found, returning..."); 
    return;
  }
  if (video.getAttribute("title") !== "PPA.mp4") {
    console.log("video title not found, returning..."); 
    return;
  }
  console.log("all checks passed, starting MQC logic..."); 
  
  const videoPlayer = document.getElementsByClassName("video-js")[0];
  // Ensure parent is positioned
  const wrapper = videoPlayer.parentNode;
  wrapper.style.position = "relative";
  
  let previousTime = 0;
  const shown = new Array(times.length).fill(false);

  video.addEventListener("timeupdate", showQuestion);

  function getQuestionIndex(t_now) {
    if (t_now < times[0]) {
      qId = -1; // current time before 1st question
    } else if (t_now > times[times.length-1]) {
      qId = times.length-1; // current time after last question
    }
    else {
      qId = 0;
      while (times[qId] < t_now) { qId++; }
      qId--; // decrement 1 to get the right MCQ
    }
    
    // whereever you land, set the previous Qs to 'shown'
    if (qId > 0) {
      for (i=0; i<qId; i++) { shown[i] = true; }
    }
    console.log('qId = ', qId)
    
    // is this a forward jump? -> don't show the MCQ of the section you jumped into
    if (t_now > previousTime + 2) { shown[qId] = true; }
    
    // is this a backward jump?
    if (t_now < previousTime) {
      shown[qId] = true; // don't show the MCQ of the section you jumped into
      for (i=qId+1; i<times.length; i++) {
        shown[i] = false; // reset all subsequent MCQs to "not shown"
      }
    }    
    return qId;
  }

  function showQuestion() {
    const tNow = video.currentTime;
    qId = getQuestionIndex(tNow);
    if (qId >= 0) {
      if (shown[qId] == false) {
        shown[qId] = true;
        openQuestion(qId);
      }
    }    
    previousTime = tNow;
  }

  function getFeedback(qId, checked, letter) {
    const isCorrect = correctAnswers[qId].includes(letter);
    if (checked && isCorrect) return "✔ correct";
    if (checked && !isCorrect) return "✘ incorrect (should not be selected)";
    if (!checked && isCorrect) return "✘ incorrect (should be selected)";
    return "";
  }

  function openQuestion(qId) {
    console.log("Open question: ", qId);
    const videoPlayer = document.getElementsByClassName("video-js")[0];
    const videoBox = videoPlayer.getBoundingClientRect();

    // Create overlay
    const mcqDiv = document.createElement("div");
    mcqDiv.className = "mcq-modal";
    Object.assign(mcqDiv.style, {
      position: "absolute",
      left: "0",
      top: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(200,200,200,0.7)",
      overflowY: "auto",
      zIndex: 9999
    });

    // Inner container (FLASHCARD ENABLED)
    const container = document.createElement("div");

    // Outer perspective wrapper (keeps your logic intact)
    const cardWrapper = document.createElement("div");
    Object.assign(cardWrapper.style, {
      perspective: "1000px",
      width: "100%",
      margin: "auto"
    });

    // The flipping card
    Object.assign(container.style, {
      position: "relative",
      width: "100%",
      transformStyle: "preserve-3d",
      transition: "transform 0.6s",
      cursor: "pointer"
    });

    // Front + back faces
    const frontFace = document.createElement("div");
    const backFace = document.createElement("div");

    [frontFace, backFace].forEach(face => {
      Object.assign(face.style, {
        position: "absolute",
        width: "100%",
        backfaceVisibility: "hidden",
        padding: "20px",
        backgroundColor: "rgba(250,250,250,0.95)"
      });
    });

    // Back is rotated
    backFace.style.transform = "rotateY(180deg)";

    // Flip state
    let flipped = false;
    container.addEventListener("click", () => {
      flipped = !flipped;
      container.style.transform = flipped ? "rotateY(180deg)" : "rotateY(0deg)";
    });

    // Append structure
    container.appendChild(frontFace);
    container.appendChild(backFace);
    cardWrapper.appendChild(container);
    
    // Card content

    // FRONT: title
    const h1 = document.createElement("h1");
    h1.textContent = "Quick check";
    frontFace.appendChild(h1);

    // FRONT: text
    const p1 = document.createElement("p");
    p1.textContent = "Explain how X causes Y";
    frontFace.appendChild(p1);

    // BACK: title
    const h2 = document.createElement("h1");
    h2.textContent = "Suggested answer";
    backFace.appendChild(h2);

    // BACK: text
    const p2 = document.createElement("p");
    p2.textContent = "X is the direct cause of U, and U causes Y.";
    backFace.appendChild(p2);

    mcqDiv.appendChild(container);

    // Insert into DOM
    //videoPlayer.parentNode.insertBefore(mcqDiv, videoPlayer.nextSibling);
    wrapper.appendChild(mcqDiv);

    // Pause video
    video.pause();
  }
});
