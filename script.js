$(document).ready(function () {
    let tasks = [
        "Find the computer science program",
        "Locate the primary address",
        "Locate the counseling page"
    ];
    let currentTaskIndex = 0;
    let results = [];
    let taskStart = null;
    let taskDuration = null;

    function startTimer() {
        taskStart = Date.now();
    }

    function stopTimer() {
        taskDuration = Math.round((Date.now() - taskStart) / 1000);
        taskStart = null;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return m + ':' + String(s).padStart(2, '0');
    }

    function showTask() {
        if (currentTaskIndex >= tasks.length) {
            showSummary();
            return;
        }
        $("#task-text").text(tasks[currentTaskIndex]);
        startTimer();
    }

    function getBadgeClass(rating) {
        if (rating === "Skipped") return "summary-badge--skipped";
        const score = parseInt(rating);
        if (score <= 2) return "summary-badge--low";
        if (score <= 4) return "summary-badge--mid";
        return "summary-badge--high";
    }

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

    $("#start-test").click(function () {
        $("#intro-screen, #overlay").fadeOut(300);
        $("#testing-area").removeClass("hidden");
        showTask();
    });

    $("#skip-task").click(function () {
        stopTimer();
        results.push({ task: tasks[currentTaskIndex], rating: "Skipped", duration: taskDuration });
        currentTaskIndex++;
        showTask();
    });

    $("#task-complete").click(function () {
        stopTimer();
        $("#rating-popup").fadeIn(300);
        $("#overlay").fadeIn(300);
    });

    $(".rate-btn").click(function () {
        results.push({ task: tasks[currentTaskIndex], rating: $(this).data("rating"), duration: taskDuration });
        $("#rating-popup").fadeOut(300);
        $("#overlay").fadeOut(300);
        currentTaskIndex++;
        showTask();
    });
});
