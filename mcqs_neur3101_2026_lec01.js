$(window).on("load", function () {
  let verbose = false;
  if (verbose) console.log("MCQ js activated");

  const videoTitle = "L01_CNE";
  const times = [576,1557,1840,2967,3330,3555];
  const stems = [
  "Parkinsonism is defined as a complex that includes (among others): fatigue, tremor, and postural instability. Select the correct mapping of these characteristics to symptom, sign, and syndrome.",
  "Which of the following are considered higher mental functions?",
  "Select the correct statements about the cranial nerve exam.",
  "Select the correct statements about neurological examination of the motor system.",
  "What do we understand by stereognosis?",
  "Which statements about coordination are correct?"
];
  const answerTexts = [
  [
    "fatigue: symptom; tremor: symptom; postural instability: syndrome",
    "fatigue: symptom; tremor: sign; Parkinsonism: syndrome",
    "fatigue: sign; postural instability: symptom; Parkinsonism: sign",
    "optiofatigue: syndrome; postural instability: sign; Parkinsonism: signn-D",
    "fatigue: symptom; tremor: symptom; Parkinsonism: syndrome"
  ],
  [
    "Stable gait",
    "Short-term memory",
    "Knee-jerk reflex",
    "Speech comprehension",
    "Attention to external stimuli"
  ],
  [
    "Cranial nerves mainly represent the function of the cerebral cortex.",
    "Each cranial nerve innervates a defined set of muscles.",
    "All special senses except olfaction are conveyed by cranial nerves.",
    "Facial muscles are controlled by CN VII.",
    "The cranial nerve exam yields critical information about brainstem function."
  ],
  [
    "Atrophy is a sign of lower motor dysfunction.",
    "Muscle mass asymmetry left vs right is considered pathological.",
    "Increased muscle tone is indicated by the synonyms spasticity and rigidity.",
    "The basic rule for reflexes is: the stronger, the better.",
    "A clonus response indicates a lesion of upper motor neurons."
  ],
  [
    "Warm - cold discrimination",
    "Spatial localization of sounds (stereo hearing)",
    "Two-point discrimination better than 5 mm",
    "Tactile recognition of 3D objects",
    "Recognition of numbers written on the skin"
  ],
  [
    "Intact coordination means there is no lack of force.",
    "Functionally, we localize coordination in the cerebellum.",
    "The finger-nose and heel-shin tests reflect coordination.",
    "Reduced tendon jerk reflexes are documented under coordination.",
    "Coordination is considered a higher mental function."
  ]
];
  const correctAnswers = [
  [
    "B"
  ],
  [
    "B",
    "D",
    "E"
  ],
  [
    "D",
    "E"
  ],
  [
    "A",
    "B",
    "E"
  ],
  [
    "D"
  ],
  [
    "B",
    "C"
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

    if (stems[qId]) {
      const p0 = document.createElement("p");
      p0.textContent = stems[qId];
      container.appendChild(p0);
    }

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