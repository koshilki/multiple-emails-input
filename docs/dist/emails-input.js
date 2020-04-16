var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var PROCESS_EMAIL_ON_KEY = [",", "Enter"];
var filterChars = {
    "<": "&lt;",
    ">": "&gt;",
};
var MultipleEmailsInput = /** @class */ (function () {
    function MultipleEmailsInput() {
        var _this = this;
        this.el = document.createElement("div");
        this.setAttributes(this.el, {
            class: "emails-input",
            role: "textbox",
        });
        this.input = this.createInputEl();
        this.el.appendChild(this.input);
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
        this.setAttributes(input, {
            type: "text",
            placeholder: "add more people...",
        });
        input.addEventListener("keydown", function (evt) {
            if (PROCESS_EMAIL_ON_KEY.indexOf(evt.key) > -1) {
                _this.addEmailToList(_this.trimValue(input.value));
                input.value = "";
                evt.preventDefault();
            }
            if (evt.key === "Backspace" && input.value === "") {
                _this.removeEmailBlock(input.previousSibling);
            }
        });
        input.addEventListener("blur", function () {
            _this.addEmailToList(input.value);
            input.value = "";
        });
        input.addEventListener("paste", function (evt) {
            var pastedString = evt.clipboardData.getData("Text");
            pastedString.split(/[,\s;]/).forEach(_this.addEmailToList.bind(_this));
            event.preventDefault();
            input.value = "";
        });
        return input;
    };
    MultipleEmailsInput.prototype.createEmailBlock = function (value) {
        var block = document.createElement("span");
        var sanitized = this.filterInput(value);
        this.setAttributes(block, {
            class: "email " + (this.isValidEmail(value) ? "valid" : "invalid"),
            "data-value": sanitized,
        });
        var removeBtn = document.createElement("button");
        this.setAttributes(removeBtn, {
            class: "remove",
        });
        removeBtn.innerHTML = "&times;";
        block.innerHTML = sanitized;
        block.appendChild(removeBtn);
        return block;
    };
    MultipleEmailsInput.prototype.removeEmailBlock = function (el) {
        this.el.removeChild(el);
    };
    MultipleEmailsInput.prototype.getEmailBlocks = function () {
        return Array.from(this.el.children).filter(function (node) {
            return node.ELEMENT_NODE === 1 && node.tagName !== "INPUT";
        });
    };
    MultipleEmailsInput.prototype.isValidEmail = function (value) {
        return /^[^@]+@[^\.]+\..+$/.test(value);
    };
    MultipleEmailsInput.prototype.setAttributes = function (el, attrs) {
        Object.entries(attrs).map(function (_a) {
            var key = _a[0], value = _a[1];
            return el.setAttribute(key, value);
        });
    };
    MultipleEmailsInput.prototype.trimValue = function (value) {
        return value.trim().replace(/,$/, "");
    };
    MultipleEmailsInput.prototype.addEmailToList = function (content) {
        if (content.length === 0) {
            return;
        }
        // this.el.appendChild(this.createEmailBlock(content));
        this.el.insertBefore(this.createEmailBlock(content), this.input);
        this.input.focus();
        this.input.scrollIntoView();
        this.el.dispatchEvent(new Event("change"));
    };
    MultipleEmailsInput.prototype.getEmails = function () {
        var emails = [];
        this.el.childNodes.forEach(function (node) {
            if (node.ELEMENT_NODE === 1 &&
                node.tagName !== "INPUT") {
                emails.push(node.getAttribute("data-value"));
            }
        });
        return emails;
    };
    MultipleEmailsInput.prototype.replaceEmails = function (value) {
        var _this = this;
        var emails = !Array.isArray(value) ? value.split(",") : value;
        this.getEmailBlocks().forEach(function (el) { return _this.removeEmailBlock(el); });
        emails.forEach(this.addEmailToList.bind(this));
    };
    MultipleEmailsInput.prototype.filterInput = function (value) {
        var str = value;
        Object.entries(filterChars).forEach(function (_a) {
            var char = _a[0], sub = _a[1];
            return (str = str.replace(RegExp(char, "g"), sub));
        });
        return str;
    };
    return MultipleEmailsInput;
}());
function EmailsInput(container, _a) {
    var options = __rest(_a, []);
    var input = new MultipleEmailsInput();
    container.appendChild(input.el);
    return input;
}
//# sourceMappingURL=emails-input.js.map