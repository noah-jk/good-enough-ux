$(document).ready(function () {

    // --- Config ---
    // Edit this array to change the tasks shown to the participant.
    let tasks = [
        "Find the computer science program",
        "Locate the primary address",
        "Locate the counseling page"
    ];

    // --- State ---
    let currentTaskIndex = 0; // which task is currently active
    let results = [];         // accumulated { task, rating, duration } for each completed/skipped task
    let taskStart = null;     // timestamp (ms) when the current task began
    let taskDuration = null;  // elapsed seconds for the most recently stopped task

    // --- Timer ---

    // Called when a new task is displayed; marks the start time.
    function startTimer() {
        taskStart = Date.now();
    }

    // Called when the participant signals completion or skips.
    // Captures elapsed seconds and clears the start timestamp.
    // Timer stops here so time in the rating popup isn't counted.
    function stopTimer() {
        taskDuration = Math.round((Date.now() - taskStart) / 1000);
        taskStart = null;
    }

    // Formats a raw second count into m:ss (e.g. 75 → "1:15").
    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ':' + String(s).padStart(2, '0');
    }

    // --- Task flow ---

    // Advances to the next task, or triggers the summary when all tasks are done.
    function showTask() {
        if (currentTaskIndex >= tasks.length) {
            showSummary();
            return;
        }
        $("#task-text").text(tasks[currentTaskIndex]);
        startTimer();
    }

    // Maps a SEQ rating (1–7 or "Skipped") to a CSS badge modifier class.
    // Score ranges: 1–2 = low, 3–4 = mid, 5–7 = high.
    function getBadgeClass(rating) {
        if (rating === "Skipped") return "summary-badge--skipped";
        const score = parseInt(rating);
        if (score <= 2) return "summary-badge--low";
        if (score <= 4) return "summary-badge--mid";
        return "summary-badge--high";
    }

    // Builds and displays the end-of-session summary table from the results array.
    function showSummary() {
        $("#testing-area").hide();
        const $list = $("#summary-list").empty();
        results.forEach(function (r) {
            $list.append(
                $("<div>").addClass("summary-row").append(
                    $("<span>").addClass("summary-task").text(r.task),
                    $("<span>").addClass("summary-time").text(formatTime(r.duration)),
                    $("<span>").addClass("summary-badge " + getBadgeClass(r.rating)).text(r.rating)
                )
            );
        });
        $("#end-screen").removeClass("hidden");
    }

    // --- Event handlers ---

    // Dismiss the intro modal and begin the first task.
    $("#start-test").click(function () {
        $("#intro-screen, #overlay").fadeOut(300);
        $("#testing-area").removeClass("hidden");
        showTask();
    });

    // Record a skipped task (no rating) and move to the next one.
    $("#skip-task").click(function () {
        stopTimer();
        results.push({ task: tasks[currentTaskIndex], rating: "Skipped", duration: taskDuration });
        currentTaskIndex++;
        showTask();
    });

    // Stop the task timer and show the SEQ rating popup.
    $("#task-complete").click(function () {
        stopTimer();
        $("#rating-popup").fadeIn(300);
        $("#overlay").fadeIn(300);
    });

    // Record the rating + duration, dismiss the popup, and advance to the next task.
    $(".rate-btn").click(function () {
        results.push({ task: tasks[currentTaskIndex], rating: $(this).data("rating"), duration: taskDuration });
        $("#rating-popup").fadeOut(300);
        $("#overlay").fadeOut(300);
        currentTaskIndex++;
        showTask();
    });
});
