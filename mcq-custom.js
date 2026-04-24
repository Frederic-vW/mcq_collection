$(window).on("load", function () {
  let verbose = false;
  if (verbose) console.log("MCQ js activated");

  const videoTitle = "PPA.mp4";
  const times = [45,77,93];
  const answerTexts = [
  [
    "option-1A",
    "option-1B",
    "option-1C",
    "option-1D",
    "option-1E",
    "option-1F"
  ],
  [
    "AAAA",
    "BBBB",
    "CCCC"
  ],
  [
    "option-a)",
    "option-b)",
    "option-c)",
    "option-d)"
  ]
];
  const correctAnswers = [
  [
    "D",
    "E",
    "F"
  ],
  [
    "C"
  ],
  [
    "B",
    "C",
    "D"
  ]
];

  const video = document.querySelector("video");
  if (!video) {
    console.log("no video found, returning...");
    return;
  }

  if (video.getAttribute("title") !== videoTitle) {
    console.log("video title not found, returning...");
    return;
  }

  if (verbose) console.log("all checks passed, starting MQC logic...");

  video.addEventListener("timeupdate", triggerQuestion);

  const videoPlayer = document.getElementsByClassName("video-js")[0];
  const wrapper = videoPlayer.parentNode;
  wrapper.style.position = "relative";

  let t0 = 0;
  let t1 = 0;
  let q0 = 0;
  let q1 = 0;

  function getQuestionIndex(t) {
    for (i = 0; i < times.length; i++) {
      if (t < times[i]) return i;
    }
    return times.length;
  }

  function triggerQuestion() {
    t1 = video.currentTime;
    q1 = getQuestionIndex(t1);
    const jump = t1 - t0 > 2;

    if (jump === false && q1 === q0 + 1) {
      openQuestion(q0);
    }

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
    if (verbose) console.log("Open question: ", qId);

    const videoPlayer = document.getElementsByClassName("video-js")[0];
    videoPlayer.getBoundingClientRect();

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

    const container = document.createElement("div");
    Object.assign(container.style, {
      padding: "20px",
      margin: "auto",
      width: "100%",
      backgroundColor: "rgba(250,250,250,0.95)"
    });

    const h1 = document.createElement("h1");
    h1.textContent = "Quick check";
    container.appendChild(h1);

    const p1 = document.createElement("p");
    p1.textContent = "Select the correct statements!";
    container.appendChild(p1);

    const answersWrapper = document.createElement("div");
    const inputs = [];
    const feedbacks = [];

    answerTexts[qId].forEach((text, i) => {
      const letter = String.fromCharCode(65 + i);
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

    const buttonRow = document.createElement("div");
    buttonRow.style.marginTop = "15px";

    const submitBtn = document.createElement("button");
    submitBtn.textContent = "Submit";

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
      mcqDiv.remove();
      video.play();
    });

    buttonRow.appendChild(submitBtn);
    buttonRow.appendChild(continueBtn);
    container.appendChild(buttonRow);

    mcqDiv.appendChild(container);
    wrapper.appendChild(mcqDiv);
    video.pause();
  }
});
