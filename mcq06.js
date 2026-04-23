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
  if (video.getAttribute("title") !== "L5_Action_Potential_FvW_2025") {
    console.log("video title not found, returning..."); 
    return;
  }

  console.log("all checks passed, starting MQC logic..."); 
  let previousTime = 0;
  const shown = new Array(times.length).fill(false);

  video.addEventListener("timeupdate", showQuestion);

  function getQuestionIndex(currentTime) {
    for (let i = times.length - 1; i >= 0; i--) {
      if (currentTime >= times[i]) return i;
    }
    return -1;
  }

  function showQuestion() {
    const currentTime = video.currentTime;
    const qId = getQuestionIndex(currentTime);

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
  }

  function getFeedback(qId, checked, letter) {
    const isCorrect = correctAnswers[qId].includes(letter);
    if (checked && isCorrect) return "✔ correct";
    if (checked && !isCorrect) return "✘ incorrect (should not be selected)";
    if (!checked && isCorrect) return "✘ incorrect (should be selected)";
    return "";
  }

  function openQuestion(qId) {
    // build modal here
  }
});
