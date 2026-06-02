$(window).on("load", function () {
  let verbose = false;
  if (verbose) console.log("MCQ js activated");

  const videoTitle = "L03_EEG";
  const times = [1021,1635,1895,3018];
  const stems = [
  "Select the correct statements about action potentials (AP) and postsynaptic potentials (PSP).",
  "Quick recap - what do you remember about volume conduction?",
  "Recap - what do you remember about EEG oscillations?",
  "Let's review EEG and pathologies. Select the correct statements:"
];
  const answerTexts = [
  [
    "APs can be excitatory or inhibitory",
    "APs: short duration, high amplitude; PSP: long duration, low amplitude",
    "PSPs reach the EEG electrodes, APs are filtered out",
    "Neurons that generate EPSPs do not generate APs"
  ],
  [
    "It's a physiological mechanism that helps deep neuronal signals reach the surface",
    "It's a mechanism that spreads & blurs point sources (like a light cone)",
    "Makes fast oscillations (beta) appear as slow oscillations (alpha) on the surface",
    "It happens to action potentials, but not to postsynaptic potentials"
  ],
  [
    "Theta oscillations are the hallmark of relaxed wakefulness",
    "Beta oscillations are a 'working rhythm' of the brain",
    "Relaxed wakefulness is characterized by occipital beta frequencies",
    "The alpha band is the slowest EEG frequency band"
  ],
  [
    "PD is routinely diagnosed with EEG, demonstrating pathological beta oscillations",
    "AD is associated with significant slowing of EEG oscillations",
    "Stroke is characterized by hyperexcitability which can be demonstrated by EEG",
    "Epilepsy can be associated with focal or generalized epileptiform discharges on EEG"
  ]
];
  const correctAnswers = [
  [
    "B",
    "C"
  ],
  [
    "B"
  ],
  [
    "B"
  ],
  [
    "B",
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
      textAlign: "left",
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