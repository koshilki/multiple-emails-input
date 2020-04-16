"use strict";
var PROCESS_EMAIL_ON_KEY = [",", "Enter"];
var filterChars = {
    "<": "&lt;",
    ">": "&gt;",
};
var MultipleEmailsInput = /** @class */ (function () {
    function MultipleEmailsInput(container) {
        var _this = this;
        this.el = container;
        MultipleEmailsInput.setAttributes(this.el, {
            role: "textbox",
            "aria-multiline": "true",
        });
        this.el.className = this.el.className + " emails-input";
        // text input
        this.input = this.createInputEl();
        this.el.appendChild(this.input);
        // remove click listener
        this.el.addEventListener("click", function (ev) {
            if (ev.target.className === "remove") {
                _this.removeEmailBlock(ev.target.parentElement);
            }
            _this.input.focus();
        });
        return this;
    }
    MultipleEmailsInput.prototype.createInputEl = function () {
        var _this = this;
        var input = document.createElement("input");
        MultipleEmailsInput.setAttributes(input, {
            type: "text",
            placeholder: "add more people...",
        });
        // text input event listeners
        input.addEventListener("keydown", function (evt) {
            if (PROCESS_EMAIL_ON_KEY.indexOf(evt.key) > -1) {
                _this.addEmail(MultipleEmailsInput.trimValue(input.value));
                input.value = "";
                evt.preventDefault();
            }
            if (evt.key === "Backspace" && input.value === "") {
                _this.removeEmailBlock(input.previousSibling);
            }
        });
        input.addEventListener("blur", function () {
            _this.addEmail(input.value);
            input.value = "";
        });
        input.addEventListener("paste", function (evt) {
            var pastedString = evt.clipboardData.getData("Text");
            pastedString.split(/[,\s;]/).forEach(_this.addEmail.bind(_this));
            event.preventDefault();
            input.value = "";
        });
        return input;
    };
    MultipleEmailsInput.prototype.createEmailBlock = function (value) {
        // block element
        var block = document.createElement("span");
        var sanitized = MultipleEmailsInput.filterInput(value);
        MultipleEmailsInput.setAttributes(block, {
            class: "email",
            "data-value": sanitized,
            valid: MultipleEmailsInput.isValidEmail(value),
        });
        // remove button
        var removeBtn = document.createElement("button");
        MultipleEmailsInput.setAttributes(removeBtn, {
            class: "remove",
            "aria-label": "remove",
        });
        removeBtn.innerHTML = "&times;";
        block.innerHTML = sanitized;
        block.appendChild(removeBtn);
        return block;
    };
    MultipleEmailsInput.prototype.removeEmailBlock = function (el) {
        this.el.removeChild(el);
        this.el.dispatchEvent(new Event("change"));
    };
    MultipleEmailsInput.prototype.getEmailBlocks = function () {
        return Array.from(this.el.children).filter(function (node) {
            return node.ELEMENT_NODE === 1 && node.tagName !== "INPUT";
        });
    };
    MultipleEmailsInput.prototype.addEmail = function (content) {
        if (content.length === 0) {
            return;
        }
        this.el.insertBefore(this.createEmailBlock(content), this.input);
        this.input.focus();
        this.input.scrollIntoView();
        this.el.dispatchEvent(new Event("change"));
    };
    MultipleEmailsInput.prototype.getEmails = function (validity) {
        var emails = [];
        // get all email blocks (which match optional validity arg)
        // and extract email addresses
        this.el.childNodes.forEach(function (node) {
            if (node.ELEMENT_NODE === 1 &&
                node.tagName !== "INPUT" &&
                MultipleEmailsInput.matchValidity(validity, node)) {
                emails.push(node.getAttribute("data-value"));
            }
        });
        return emails;
    };
    MultipleEmailsInput.prototype.replaceEmails = function (value) {
        var _this = this;
        var emails = !Array.isArray(value) ? value.split(",") : value;
        this.getEmailBlocks().forEach(function (el) { return _this.removeEmailBlock(el); });
        emails.forEach(this.addEmail.bind(this));
    };
    MultipleEmailsInput.matchValidity = function (validity, el) {
        if (validity === undefined) {
            return true;
        }
        return el.getAttribute("valid") === String(validity);
    };
    // Utility methods
    MultipleEmailsInput.isValidEmail = function (value) {
        // very basic validation, but should be sufficient in this case
        return /^[^@]+@[^\.]+\..+$/.test(value);
    };
    MultipleEmailsInput.setAttributes = function (el, attrs) {
        // convenience method to set multiple attributes at once
        Object.entries(attrs).map(function (_a) {
            var key = _a[0], value = _a[1];
            return el.setAttribute(key, value);
        });
    };
    MultipleEmailsInput.trimValue = function (value) {
        return value.trim().replace(/,$/, "");
    };
    MultipleEmailsInput.filterInput = function (value) {
        var str = value;
        Object.entries(filterChars).forEach(function (_a) {
            var char = _a[0], sub = _a[1];
            return (str = str.replace(RegExp(char, "g"), sub));
        });
        return str;
    };
    return MultipleEmailsInput;
}());
function EmailsInput(container) {
    return new MultipleEmailsInput(container);
}
module.exports = {
    EmailsInput: EmailsInput,
    MultipleEmailsInput: MultipleEmailsInput,
};
//# sourceMappingURL=emails-input.js.map