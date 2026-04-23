$(window).on("load", function () {
  console.log("MCQ js activated");
  const times = [60, 120, 180];
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
  if (video.getAttribute("title") !== "L5_Action_Potential_FvW_2025.mp4") {
    console.log("video title not found, returning..."); 
    return;
  }
  console.log("all checks passed, starting MQC logic..."); 
  
  const videoPlayer = document.getElementsByClassName("video-js")[0];
  // Ensure parent is positioned
  const wrapper = videoPlayer.parentNode;
  wrapper.style.position = "relative";
  
  let previousTime = 0;
  //let questionOpen = false;
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
    /*
    if (qId >= 0) {
      for (let i = 0; i < qId; i++) shown[i] = true;
    }

    if (qId >= 0 && currentTime > previousTime + 2) {
      shown[qId] = true;
    }

    if (qId >= 0 && currentTime < previousTime) {
      shown[qId] = true;
      for (let i = qId + 1; i < times.length; i++) shown[i] = false;
    }
    */
    
    return qId;
    
    /*
    for (let i = times.length - 1; i >= 0; i--) {
      if (currentTime >= times[i]) {
        console.log("getQuestionIndex: ", i);
        return i;
      }
    }
    console.log("getQuestionIndex: ", -1);
    return -1;
    */
  }

  function showQuestion() {
    //if (questionOpen) return;
    const tNow = video.currentTime;
    qId = getQuestionIndex(tNow);
    if (qId >= 0) {
      if (q_shown[qId] == false) {
        q_shown[qId] = true;
        openQuestion(qId);
      }
    }
    //const currentTime = video.currentTime;
    /* If user moved backwards, re-enable all later questions
    if (tNow < previousTime) {
      for (let i = 0; i < times.length; i++) {
        if (times[i] > tNow) {
          shown[i] = false;
        }
      }
    }
    */

    /* Show the first unseen question whose timestamp has been reached
    for (let i = 0; i < times.length; i++) {
      if (!shown[i] && tNow >= times[i]) {
        shown[i] = true;
        questionOpen = true;
        openQuestion(i);
        break;
      }
    }
    */
    
    previousTime = tNow;

    //const qId = getQuestionIndex(currentTime);
    /*
    if (qId >= 0) {
      for (let i = 0; i < qId; i++) shown[i] = true;
    }

    if (qId >= 0 && currentTime > previousTime + 2) {
      shown[qId] = true;
    }

    if (qId >= 0 && currentTime < previousTime) {
      shown[qId] = true;
      for (let i = qId + 1; i < times.length; i++) shown[i] = false;
    }

    if (qId >= 0 && !shown[qId]) {
      shown[qId] = true;
      openQuestion(qId);
    }
    
    previousTime = currentTime;
    */

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

    // Inner container
    const container = document.createElement("div");
    Object.assign(container.style, {
      padding: "20px",
      margin: "auto",
      width: "100%",
      backgroundColor: "rgba(250,250,250,0.95)"
    });

    // Title
    const h1 = document.createElement("h1");
    h1.textContent = "Quick check";
    container.appendChild(h1);

    // Instruction
    const p1 = document.createElement("p");
    p1.textContent = "Select the correct statements!";
    container.appendChild(p1);

    // Answers
    const answersWrapper = document.createElement("div");

    const inputs = [];
    const feedbacks = [];

    answerTexts[qId].forEach((text, i) => {
      const letter = String.fromCharCode(65 + i); // A, B, C...

      const row = document.createElement("div");

      const input = document.createElement("input");
      input.type = "checkbox";
      input.id = `q${qId}_${letter}`;

      const label = document.createElement("label");
      label.htmlFor = input.id;
      label.textContent = " " + text;

      const feedback = document.createElement("div");
      feedback.style.color = "blue";
      feedback.style.fontStyle = "italic";

      row.appendChild(input);
      row.appendChild(label);
      row.appendChild(feedback);

      answersWrapper.appendChild(row);

      inputs.push(input);
      feedbacks.push(feedback);
    });

    container.appendChild(answersWrapper);

    // Buttons container
    const buttonRow = document.createElement("div");
    buttonRow.style.marginTop = "15px";

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";

    // Continue button
    const continueBtn = document.createElement("button");
    continueBtn.textContent = "Skip";
    continueBtn.style.marginLeft = "10px";

    submitBtn.addEventListener("click", () => {
      inputs.forEach((input, i) => {
        const letter = String.fromCharCode(65 + i);
        feedbacks[i].innerHTML = getFeedback(qId, input.checked, letter);
      });
      continueBtn.textContent = "Continue";
    });

    continueBtn.addEventListener("click", () => {
      mcqDiv.remove();   // clean removal
      video.play();
    });

    buttonRow.appendChild(submitBtn);
    buttonRow.appendChild(continueBtn);

    container.appendChild(buttonRow);
    mcqDiv.appendChild(container);

    // Insert into DOM
    //videoPlayer.parentNode.insertBefore(mcqDiv, videoPlayer.nextSibling);
    wrapper.appendChild(mcqDiv);

    // Pause video
    video.pause();
  }
});
