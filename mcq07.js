$(window).on("load", function () {
  let verbose = false;
  if (verbose) console.log("MCQ js activated");
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

  // Find video element, make sure it's the right file name
  const video = document.querySelector("video");
  if (!video) {
    console.log("no video found, returning..."); 
    return;
  }
  if (video.getAttribute("title") !== "PPA.mp4") {
    console.log("video title not found, returning..."); 
    return;
  }
  if (verbose) console.log("all checks passed, starting MQC logic..."); 
  // attach MCQ trigger
  video.addEventListener("timeupdate", triggerQuestion);

  // find video player to adjust MCQ element coordinates (exact overlay)
  const videoPlayer = document.getElementsByClassName("video-js")[0];
  const wrapper = videoPlayer.parentNode;
  wrapper.style.position = "relative";

  // time tracking
  let t0 = 0;
  let t1 = 0;
  let q0 = 0; // question index at t0
  let q1 = 0; // question index at t1
  
  function getQuestionIndex(t) {
    /*
    Gives the index of first question after t
    Note: returns n+1 if t after last question, so don't use as question index directly
    0 - [0,1) before 1st question
    1 - [1,2) after 1st, before 2nd
    ...
    */
    for (i=0; i<times.length; i++) {
      if (t <= times[i]) {
        return i;
      }
    }
    return i;
  }

  function triggerQuestion() {
    t1 = video.currentTime;
    q1 = getQuestionIndex(t1);
    //console.log("q1: ", q1);
    let jump = t1 - t0 > 2;
    if (jump === false && q1 === q0+1) {
      openQuestion(q0);
    }
    // update tracker
    t0 = t1;
    q0 = q1;
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
    wrapper.appendChild(mcqDiv);

    // Pause video
    video.pause();
  }
});
