/* =====================================================
   PROMPTLAB
   Main JavaScript
===================================================== */


/* =====================================================
   GLOBAL STATE
===================================================== */

let xp = Number(localStorage.getItem("promptlabXP")) || 0;

let activities =
    Number(localStorage.getItem("promptlabActivities")) || 0;

let achievements =
    JSON.parse(
        localStorage.getItem("promptlabAchievements")
    ) || {
        builder: false,
        detective: false,
        battle: false,
        reflection: false
    };


/* =====================================================
   NAVIGATION
===================================================== */

function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".section");

    sections.forEach(section => {

        section.classList.add("hidden");

    });


    const selected =
        document.getElementById(sectionId);

    if (selected) {

        selected.classList.remove("hidden");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /*
       The post-assessment and usability sections are
       intentionally available through the learning flow.
    */

}


/* =====================================================
   XP SYSTEM
===================================================== */

function addXP(amount) {

    const oldXP = xp;

    xp += amount;

    if (xp > 100) {

        xp = 100;

    }


    localStorage.setItem(
        "promptlabXP",
        xp
    );


    updateProgress();


    /*
       Only increase activity count if XP actually
       increased.
    */

    if (xp > oldXP) {

        activities++;

        localStorage.setItem(
            "promptlabActivities",
            activities
        );

    }


    updateDashboard();

}


function updateProgress() {

    const xpText =
        document.getElementById("xpText");

    const progressFill =
        document.getElementById("progressFill");

    const levelText =
        document.getElementById("levelText");


    if (xpText) {

        xpText.innerText =
            `XP: ${xp} / 100`;

    }


    if (progressFill) {

        progressFill.style.width =
            `${xp}%`;

    }


    let level =
        "AI Explorer";


    if (xp >= 25) {

        level =
            "Prompt Builder";

    }

    if (xp >= 50) {

        level =
            "AI Detective";

    }

    if (xp >= 75) {

        level =
            "Critical AI Thinker";

    }

    if (xp >= 100) {

        level =
            "AI Literacy Champion";

    }


    if (levelText) {

        levelText.innerText =
            level;

    }

}


/* =====================================================
   ACHIEVEMENTS
===================================================== */

function unlockAchievement(name) {

    achievements[name] = true;


    localStorage.setItem(
        "promptlabAchievements",
        JSON.stringify(achievements)
    );


    updateDashboard();

}


function updateDashboard() {

    const dashboardXP =
        document.getElementById("dashboardXP");

    const activitiesCompleted =
        document.getElementById("activitiesCompleted");

    const currentLevel =
        document.getElementById("currentLevel");


    if (dashboardXP) {

        dashboardXP.innerText =
            xp;

    }


    if (activitiesCompleted) {

        activitiesCompleted.innerText =
            activities;

    }


    if (currentLevel) {

        let level = "AI Explorer";

        if (xp >= 25)
            level = "Prompt Builder";

        if (xp >= 50)
            level = "AI Detective";

        if (xp >= 75)
            level = "Critical AI Thinker";

        if (xp >= 100)
            level = "AI Literacy Champion";

        currentLevel.innerText =
            level;

    }


    updateAchievement(
        "achievementBuilder",
        achievements.builder
    );

    updateAchievement(
        "achievementDetective",
        achievements.detective
    );

    updateAchievement(
        "achievementBattle",
        achievements.battle
    );

    updateAchievement(
        "achievementReflection",
        achievements.reflection
    );


    const master =
        achievements.builder &&
        achievements.detective &&
        achievements.battle &&
        achievements.reflection;


    updateAchievement(
        "achievementMaster",
        master
    );

}


function updateAchievement(
    elementId,
    unlocked
) {

    const element =
        document.getElementById(elementId);

    if (!element)
        return;


    if (unlocked) {

        element.classList.remove(
            "locked"
        );

        element.classList.add(
            "unlocked"
        );

    }

}


/* =====================================================
   PRE-ASSESSMENT
===================================================== */

function submitPreAssessment() {

    const q1 =
        document.querySelector(
            'input[name="q1"]:checked'
        );

    const q2 =
        document.querySelector(
            'input[name="q2"]:checked'
        );

    const q3 =
        document.querySelector(
            'input[name="q3"]:checked'
        );


    const result =
        document.getElementById(
            "assessmentResult"
        );


    if (!q1 || !q2 || !q3) {

        result.innerHTML =
            "<strong>Please answer all three questions.</strong>";

        result.classList.add(
            "visible"
        );

        return;

    }


    localStorage.setItem(
        "preAssessment",
        JSON.stringify({
            confidence: q1.value,
            prompting: q2.value,
            verification: q3.value
        })
    );


    result.innerHTML = `
        <h3>Assessment saved ✓</h3>

        <p>
            Your baseline has been recorded locally.
            Now move to the interactive learning activities.
        </p>

        <br>

        <button
            class="primary-button"
            onclick="showSection('builder')">
            Start Prompt Builder →
        </button>
    `;


    result.classList.add(
        "visible"
    );

}


/* =====================================================
   PROMPT BUILDER
===================================================== */

function buildPrompt() {

    const context =
        document.getElementById(
            "context"
        ).value;

    const task =
        document.getElementById(
            "task"
        ).value;

    const audience =
        document.getElementById(
            "audience"
        ).value;

    const constraints =
        document.getElementById(
            "constraints"
        ).value;


    const result =
        document.getElementById(
            "builderResult"
        );


    if (
        !context ||
        !task ||
        !audience ||
        !constraints
    ) {

        result.innerHTML =
            "<strong>Please select all four components.</strong>";

        result.classList.add(
            "visible"
        );

        return;

    }


    const prompt = `
${context}.

Your task is to ${task.toLowerCase()}.

${audience}.

${constraints}.
    `;


    result.innerHTML = `

        <h3>Your Structured Prompt ✓</h3>

        <p>
            ${prompt}
        </p>

        <br>

        <strong>
            Prompt structure: 4 / 4 components
        </strong>

        <p>
            Reflection:
            Which component do you think had the
            greatest influence on the expected response?
        </p>

    `;


    result.classList.add(
        "visible"
    );


    if (!achievements.builder) {

        addXP(25);

        unlockAchievement(
            "builder"
        );

    }

}


/* =====================================================
   AI DETECTIVE SCENARIOS
===================================================== */

const detectiveScenarios = [

    {
        title:
            "University Scenario",

        text:
            "The University of Tübingen was founded in 1477 and is therefore one of Germany's oldest universities. Students who study there automatically receive permanent residence after graduation."
    },


    {
        title:
            "Science Scenario",

        text:
            "A fictional AI response claims that drinking coffee always improves long-term memory because caffeine permanently strengthens the brain's memory circuits."
    },


    {
        title:
            "History Scenario",

        text:
            "A fictional AI response claims that a historical event had one single cause and that historians universally agree about its interpretation."
    },


    {
        title:
            "Social Science Scenario",

        text:
            "A fictional AI response claims that a survey of 100 students proves that all university students have the same attitude toward generative AI."
    }

];


let currentDetectiveScenario = 0;


function loadDetectiveScenario(index) {

    currentDetectiveScenario =
        index;


    const scenario =
        detectiveScenarios[index];


    document.getElementById(
        "detectiveTitle"
    ).innerText =
        scenario.title;


    document.getElementById(
        "aiOutput"
    ).innerText =
        scenario.text;


    document.getElementById(
        "detectiveResult"
    ).classList.remove(
        "visible"
    );

}


function detectiveAnswer(answer) {

    const result =
        document.getElementById(
            "detectiveResult"
        );


    if (answer === 2) {

        result.innerHTML = `

            <h3>Correct ✓</h3>

            <p>
                AI-generated text can sound confident while
                containing inaccurate, exaggerated or unsupported
                information.
            </p>

            <br>

            <strong>
                Key principle: Generate ≠ Verify.
            </strong>

            <p>
                Important claims should be checked against
                appropriate evidence or reliable sources.
            </p>

        `;


        if (!achievements.detective) {

            addXP(25);

            unlockAchievement(
                "detective"
            );

        }

    }

    else {

        result.innerHTML = `

            <h3>Not quite.</h3>

            <p>
                Confidence and fluency do not guarantee
                factual accuracy.
            </p>

            <p>
                Try identifying which claims should be
                independently verified.
            </p>

        `;

    }


    result.classList.add(
        "visible"
    );

}


/* =====================================================
   PROMPT BATTLE
===================================================== */

function battleAnswer(answer) {

    const result =
        document.getElementById(
            "battleResult"
        );


    if (answer === 2) {

        result.innerHTML = `

            <h3>Strong choice ✓</h3>

            <p>
                Prompt B provides more information about:
            </p>

            <ul>

                <li>Context</li>
                <li>Task</li>
                <li>Audience</li>
                <li>Output structure</li>
                <li>Constraints</li>

            </ul>

            <br>

            <p>
                The important lesson is not that longer prompts
                are always better. The goal is to communicate
                relevant information clearly.
            </p>

        `;


        if (!achievements.battle) {

            addXP(25);

            unlockAchievement(
                "battle"
            );

        }

    }

    else {

        result.innerHTML = `

            <h3>Try again.</h3>

            <p>
                Prompt A is understandable, but it provides
                little information about the context, audience
                or desired output.
            </p>

        `;

    }


    result.classList.add(
        "visible"
    );

}


/* =====================================================
   REFLECTION
===================================================== */

function submitReflection() {

    const reflection =
        document.getElementById(
            "reflection"
        ).value;


    const result =
        document.getElementById(
            "reflectionResult"
        );


    if (
        reflection.trim() === ""
    ) {

        result.innerHTML =
            "<strong>Please write a short reflection.</strong>";

        result.classList.add(
            "visible"
        );

        return;

    }


    localStorage.setItem(
        "reflection",
        reflection
    );


    result.innerHTML = `

        <h3>Reflection recorded ✓</h3>

        <p>
            You identified an important relationship between
            your interaction with AI and your own learning.
        </p>

        <br>

        <button
            class="primary-button"
            onclick="showSection('postassessment')">
            Continue to Post-Assessment →
        </button>

    `;


    result.classList.add(
        "visible"
    );


    if (!achievements.reflection) {

        addXP(25);

        unlockAchievement(
            "reflection"
        );

    }

}


/* =====================================================
   POST-ASSESSMENT
===================================================== */

function submitPostAssessment() {

    const q1 =
        document.querySelector(
            'input[name="post1"]:checked'
        );

    const q2 =
        document.querySelector(
            'input[name="post2"]:checked'
        );

    const q3 =
        document.querySelector(
            'input[name="post3"]:checked'
        );


    const result =
        document.getElementById(
            "postResult"
        );


    if (!q1 || !q2 || !q3) {

        result.innerHTML =
            "<strong>Please answer all questions.</strong>";

        result.classList.add(
            "visible"
        );

        return;

    }


    localStorage.setItem(
        "postAssessment",
        JSON.stringify({
            confidence: q1.value,
            prompting: q2.value,
            detective: q3.value
        })
    );


    result.innerHTML = `

        <h3>Post-assessment recorded ✓</h3>

        <p>
            Your responses have been saved locally.
        </p>

        <p>
            In a real research study, these responses could
            be compared with the pre-assessment to examine
            changes in confidence and understanding.
        </p>

        <br>

        <button
            class="primary-button"
            onclick="showSection('usability')">
            Give Usability Feedback →
        </button>

    `;


    result.classList.add(
        "visible"
    );

}


/* =====================================================
   USABILITY SURVEY
===================================================== */

function submitUsability() {

    const u1 =
        document.getElementById(
            "usability1"
        ).value;

    const u2 =
        document.getElementById(
            "usability2"
        ).value;

    const u3 =
        document.getElementById(
            "usability3"
        ).value;

    const u4 =
        document.getElementById(
            "usability4"
        ).value;

    const comment =
        document.getElementById(
            "usabilityComment"
        ).value;


    const result =
        document.getElementById(
            "usabilityResult"
        );


    if (
        !u1 ||
        !u2 ||
        !u3 ||
        !u4
    ) {

        result.innerHTML =
            "<strong>Please answer all rating questions.</strong>";

        result.classList.add(
            "visible"
        );

        return;

    }


    localStorage.setItem(
        "usability",
        JSON.stringify({
            clarity: u1,
            engagement: u2,
            understanding: u3,
            reuse: u4,
            comment: comment
        })
    );


    result.innerHTML = `

        <h3>Thank you ✓</h3>

        <p>
            Your feedback has been recorded locally.
            In a real deployment, these responses could
            support iterative redesign of the learning activities.
        </p>

    `;


    result.classList.add(
        "visible"
    );

}


/* =====================================================
   RESET
===================================================== */

function resetProgress() {

    const confirmation =
        confirm(
            "Reset all PromptLab prototype progress?"
        );


    if (!confirmation)
        return;


    localStorage.removeItem(
        "promptlabXP"
    );

    localStorage.removeItem(
        "promptlabActivities"
    );

    localStorage.removeItem(
        "promptlabAchievements"
    );

    localStorage.removeItem(
        "preAssessment"
    );

    localStorage.removeItem(
        "postAssessment"
    );

    localStorage.removeItem(
        "reflection"
    );

    localStorage.removeItem(
        "usability"
    );


    xp = 0;

    activities = 0;

    achievements = {
        builder: false,
        detective: false,
        battle: false,
        reflection: false
    };


    updateProgress();

    updateDashboard();


    alert(
        "PromptLab progress has been reset."
    );

}


/* =====================================================
   INITIALISE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateProgress();

        updateDashboard();

        loadDetectiveScenario(0);

    }
);