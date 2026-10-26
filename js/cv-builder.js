const form = document.getElementById('cv-form');
const errorSummary = document.getElementById('error-summary');
const successResult = document.getElementById('success-result');

const fields = {
    fullname: document.getElementById("fullname"),
    position: document.getElementById("position"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    experience: document.getElementById("experience"),
    skills: document.getElementById("skills"),
    bio: document.getElementById("bio")
};

const preview = {
    name: document.getElementById("prev-name"),
    position: document.getElementById("prev-position"),
    email: document.getElementById("prev-email"),
    phone: document.getElementById("prev-phone"),
    experience: document.getElementById("prev-experience"),
    skills: document.getElementById("prev-skills"),
    bio: document.getElementById("prev-bio")
};

function validateField(id) {
    const field = fields[id];
    const errorEl = document.getElementById(`error-${id}`);
    let errorMessage = "";

    const value = field.value.trim();

    if (!value) {
        errorMessage = "This field is required";
    } else {
        if (id === "fullname") {
            const words = value.split(/\s+/);
            if (words.length < 2 || !/^[А-ЯЁA-Z][а-яёa-z]+(\s+[А-ЯЁA-Z][а-яёa-z]+)+$/.test(value)) {
                errorMessage = "Enter Name and Surname started with capital letters.";
            }
        } else if (id === "email") {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = "Enter correct email address";
            }
        } else if (id === "phone") {
            if (!/^[\d\s\+\-\(\)]+$/.test(value) || value.length < 10) {
                errorMessage = "Enter correct phone number.";
            }
        } else if (id === "experience") {
            const expNum = Number(value);
            const posValue = fields.position.value.toLowerCase();

            if ((posValue.includes("senior") || posValue.includes("lead")) && expNum < 3) {
                errorMessage = "You must have at least 3 years of experience to proud to be called SENIOR or LEAD!!!";
            } else if (expNum < 0 || expNum > 40) {
                errorMessage = "Enter real experience between 0 and 40 years.";
            }
        } else if (id === "skills") {
            const skillsList = value.split(",").map(s => s.trim()).filter(s => s.length > 0);
            if (skillsList.length < 3) {
                errorMessage = "We see, you can do... nothing! We don't need people like you! Enter at least 3 skills separated by comma!";
            }
        } else if (id === "bio") {
            const wordCount = value.split(/\s/).filter(w => w.length > 0).length;

            if (wordCount < 10) {
                errorMessage = `Enter at least 10 words in your bio! I don't believe that you have so boring life! (Now you have ${wordCount} words in your bio)`;
            }
        }
    }

    if (errorMessage) {
        errorEl.textContent = errorMessage;
        field.setAttribute("aria-invalid", "true");
        return false;
    } else {
        errorEl.textContent = "";
        field.setAttribute("aria-invalid", "false");
        return true;
    }
}

Object.keys(fields).forEach(id => {
    const field = fields[id];

    field.addEventListener("blur", () => {
        validateField(id);
    });

    field.addEventListener("input", () => {
        if (field.getAttribute("aria-invalid") === "true") {
            validateField(id);
        }

        updatePreview();
    });
});

function updatePreview() {
    preview.name.textContent = fields.fullname.value || "Name Surname";
    preview.position.textContent = fields.position.value || "Position";
    preview.email.textContent = fields.email.value || "—";
    preview.phone.textContent = fields.phone.value || "—";
    preview.experience.textContent = fields.experience.value || "—";
    preview.skills.textContent = fields.skills.value || "—";
    preview.bio.textContent = fields.bio.value || "—";
}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    let isFormValid = true;
    let firstInvalidField = null;
    let errorCount = 0;

    Object.keys(fields).forEach(id => {
        const isValid = validateField(id);
        if (!isValid) {
            isFormValid = false;
            errorCount++;
            if (!firstInvalidField) {
                firstInvalidField = fields[id];
            }
        }
    });

    if (!isFormValid) {
        errorSummary.textContent = `${errorCount} errors was detected. Please, fix!`;
        firstInvalidField.focus();
    } else {
        errorSummary.textContent = "";

        successResult.style.display = "block";
        successResult.textContent = "";

        const successTitle = document.createElement("h3");
        successTitle.textContent = "CV was created successfully!";
        successResult.appendChild(successTitle);

        const summaryText = document.createElement("p");
        summaryText.textContent = `the applicant: ${fields.fullname.value}, Position: ${fields.position.value}. Unique CV code: CV-${Math.floor(Math.random() * 90000 + 10000)}`;
        successResult.appendChild(summaryText);

        form.reset();
        updatePreview();

        Object.values(fields).forEach(f => f.removeAttribute("aria-invalid"));
    }
});