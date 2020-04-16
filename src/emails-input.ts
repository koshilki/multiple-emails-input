const PROCESS_EMAIL_ON_KEY = [",", "Enter"];
const filterChars: { [key: string]: string } = {
  "<": "&lt;",
  ">": "&gt;",
};

type Attributes = { [key: string]: string };

class MultipleEmailsInput {
  emails: string[];
  el: HTMLElement;
  input: HTMLInputElement;

  constructor(container: HTMLElement) {
    this.el = container;
    MultipleEmailsInput.setAttributes(this.el, {
      role: "textbox",
      "aria-multiline": "true",
    });
    this.el.className = this.el.className + " emails-input";

    // text input
    this.input = this.createInputEl();
    this.el.appendChild(this.input);

    this.addEventListeners();

    return this;
  }

  private createInputEl(): HTMLInputElement {
    const input = document.createElement("input");
    MultipleEmailsInput.setAttributes(input, {
      type: "text",
      placeholder: "add more people...",
    });
    return input;
  }

  private addEventListeners(): void {
    // remove click listener
    this.el.addEventListener("click", (ev) => {
      if ((ev.target as HTMLElement).className === "remove") {
        this.removeEmailBlock((ev.target as HTMLElement).parentElement);
      }
      this.input.focus();
    });

    // text input event listeners
    this.input.addEventListener("keydown", (evt) => {
      if (PROCESS_EMAIL_ON_KEY.indexOf(evt.key) > -1) {
        this.addEmail(MultipleEmailsInput.trimValue(this.input.value));
        this.input.value = "";
        evt.preventDefault();
      }
      if (evt.key === "Backspace" && this.input.value === "") {
        this.removeEmailBlock(this.input.previousSibling as Element);
      }
    });

    this.input.addEventListener("blur", () => {
      this.addEmail(this.input.value);
      this.input.value = "";
    });

    this.input.addEventListener("paste", (evt) => {
      const pastedString = evt.clipboardData.getData("Text");
      pastedString.split(/[,\s;]/).forEach(this.addEmail.bind(this));
      event.preventDefault();
      this.input.value = "";
    });
  }

  private createEmailBlock(value: string): HTMLElement {
    // block element
    const block = document.createElement("span");
    const sanitized = MultipleEmailsInput.filterInput(value);
    MultipleEmailsInput.setAttributes(block, {
      class: "email",
      "data-value": sanitized,
      valid: MultipleEmailsInput.isValidEmail(value).toString(),
    });

    // remove button
    const removeBtn = document.createElement("button");
    MultipleEmailsInput.setAttributes(removeBtn, {
      class: "remove",
      "aria-label": "remove",
    });
    removeBtn.innerHTML = "&times;";
    block.innerHTML = sanitized;
    block.appendChild(removeBtn);

    return block;
  }

  private removeEmailBlock(el: Element): void {
    this.el.removeChild(el);
    let event;
    if (typeof Event === "function") {
      event = new Event("change");
    } else {
      event = document.createEvent("Event");
      event.initEvent("change", true, true);
    }

    this.el.dispatchEvent(event);
  }

  private getEmailBlocks(): Element[] {
    return Array.prototype.slice
      .call(this.el.children, 0)
      .filter(
        (node: HTMLElement) =>
          node.ELEMENT_NODE === 1 && (node as HTMLElement).tagName !== "INPUT"
      );
  }

  addEmail(content: string): void {
    if (content.length === 0) {
      return;
    }
    this.el.insertBefore(this.createEmailBlock(content), this.input);
    this.input.focus();
    this.input.scrollIntoView(false);

    let event;
    if (typeof Event === "function") {
      event = new Event("change");
    } else {
      event = document.createEvent("Event");
      event.initEvent("change", true, true);
    }
    this.el.dispatchEvent(event);
  }

  getEmails(validity: boolean | undefined): string[] {
    const emails: string[] = [];
    // get all email blocks (which match optional validity arg)
    // and extract email addresses
    Array.prototype.slice.call(this.el.childNodes, 0).forEach((node: Node) => {
      if (
        node.ELEMENT_NODE === 1 &&
        (node as HTMLElement).tagName !== "INPUT" &&
        MultipleEmailsInput.matchValidity(validity, node as HTMLElement)
      ) {
        emails.push((node as HTMLElement).getAttribute("data-value"));
      }
    });
    return emails;
  }

  replaceEmails(value: string | string[]): void {
    const emails = !Array.isArray(value) ? (value as string).split(",") : value;
    this.getEmailBlocks().forEach((el) => this.removeEmailBlock(el));
    emails.forEach(this.addEmail.bind(this));
  }

  private static matchValidity(
    validity: boolean | undefined,
    el: HTMLElement
  ): boolean {
    if (validity === undefined) {
      return true;
    }
    return el.getAttribute("valid") === String(validity);
  }

  // Utility methods
  private static isValidEmail(value: string): boolean {
    // very basic validation, but should be sufficient in this case
    return /^[^@]+@[^\.]+\..+$/.test(value);
  }

  private static setAttributes(el: HTMLElement, attrs: Attributes): void {
    // convenience method to set multiple attributes at once
    Object.keys(attrs).map((key) => el.setAttribute(key, attrs[key]));
  }

  private static trimValue(value: string): string {
    return value.trim().replace(/,$/, "");
  }

  private static filterInput(value: string): string {
    let str = value;
    Object.keys(filterChars).forEach(
      (char) => (str = str.replace(RegExp(char, "g"), filterChars[char]))
    );
    return str;
  }
}

function EmailsInput(container: HTMLElement): MultipleEmailsInput {
  return new MultipleEmailsInput(container);
}
