const style = document.createElement("style");
style.innerHTML = `@font-face {
    font-family: "Material Design Icons";
    src: url("${chrome.runtime.getURL("fonts/materialdesignicons-webfont.eot?v=6.9.96")}");
    src: url("${chrome.runtime.getURL("fonts/materialdesignicons-webfont.eot?#iefix&v=6.9.96")}") format("embedded-opentype"),
        url("${chrome.runtime.getURL("fonts/materialdesignicons-webfont.woff2?v=6.9.96")}") format("woff2"),
        url("${chrome.runtime.getURL("fonts/materialdesignicons-webfont.woff?v=6.9.96")}") format("woff"),
        url("${chrome.runtime.getURL("fonts/materialdesignicons-webfont.ttf?v=6.9.96")}") format("truetype");
    font-weight: normal;
    font-style: normal;
}

@font-face {
    font-family: "Roboto";
    src: url("${chrome.runtime.getURL("fonts/Roboto-Regular.ttf")}");
    font-weight: normal;
    font-style: normal;
}
`;
document.body.appendChild(style);
const audio = new Audio(chrome.runtime.getURL("sounds/click.mp3"));
audio.volume = 0.2;
var keyboard_mode = false;
var keyboard_shift = false;
fetch(chrome.runtime.getURL("keyboard.html"))
    .then((response) => response.text())
    .then((text) => {
    const keyboard = document.createElement("div");
    keyboard.innerHTML = text;
    document.body.appendChild(keyboard);
})
    .then(() => console.log("TouchKeyboard Injected"))
    .then(() => {
    const keyboard = document.getElementById("keyboard");
    const input = document.getElementById("keyboard-input");
    var targetInput = undefined;
    for (const key of document.querySelectorAll(".keyboard .row .key")) {
        key.addEventListener("click", () => {
            const input = document.getElementById("keyboard-input");
            const position = input.selectionEnd;
            input.focus();
            input.value = [
                input.value.slice(0, position),
                keyboard_shift ? key.innerHTML.toLocaleUpperCase() : key.innerHTML.toLocaleLowerCase(),
                input.value.slice(position),
            ].join("");
            input.setSelectionRange(position + 1, position + 1);
            if (targetInput) {
                fakeInput(targetInput, input.value);
            }
            audio.play();
        }, true);
    }
    for (const key of document.querySelectorAll(".keyboard .row .special-key")) {
        key.addEventListener("click", () => {
            const input = document.getElementById("keyboard-input");
            const position = input.selectionEnd;
            input.focus();
            const action = key.getAttribute("data-action");
            if (action == "backspace") {
                if (position == 0)
                    return;
                input.value = [input.value.slice(0, position - 1), input.value.slice(position)].join("");
                input.setSelectionRange(position - 1, position - 1);
                if (targetInput) {
                    fakeInput(targetInput, input.value);
                }
            }
            if (action == "close") {
                keyboard.classList.remove("active");
            }
            if (action == "space") {
                input.value = [input.value.slice(0, position), " ", input.value.slice(position)].join("");
                input.setSelectionRange(position + 1, position + 1);
                if (targetInput) {
                    fakeInput(targetInput, input.value);
                }
            }
            if (action == "submit") {
                if (input) {
                    keyboard.classList.remove("active");
                    targetInput.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
                    targetInput.dispatchEvent(new KeyboardEvent("keypress", { key: "Enter" }));
                    targetInput.dispatchEvent(new KeyboardEvent("keyup", { key: "Enter" }));
                }
            }
            if (action == "switch") {
                keyboard_mode = !keyboard_mode;
                if (keyboard_mode) {
                    keyboard.classList.add("special");
                }
                else {
                    keyboard.classList.remove("special");
                }
            }
            if (action == "shift") {
                keyboard_shift = !keyboard_shift;
                if (keyboard_shift) {
                    keyboard.classList.add("shift");
                }
                else {
                    keyboard.classList.remove("shift");
                }
            }
            audio.play();
        }, true);
    }
    document.addEventListener("click", (event) => {
        const element = event.target;
        if (element.tagName.toLowerCase() == "input" && ["text", "password"].includes(element.getAttribute("type"))) {
            if (!keyboard.classList.contains("active"))
                keyboard.classList.add("active");
            targetInput = element;
            input.value = targetInput.value;
        }
    }, true);
    document.getElementById("keyboard-clear").addEventListener("click", () => {
        if (targetInput) {
            fakeInput(targetInput, null);
        }
        input.value = null;
        audio.play();
    }, true);
});
function fakeInput(targetInput, value) {
    targetInput.value = value;
    targetInput.setAttribute("value", value);
    targetInput.dispatchEvent(new InputEvent("input", { data: value, bubbles: true }));
}
