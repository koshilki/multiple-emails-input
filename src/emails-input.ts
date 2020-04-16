const PROCESS_EMAIL_ON_KEY = [",", "Enter"];
const filterChars = {
  "<": "&lt;",
  ">": "&gt;",
};

class MultipleEmailsInput {
  emails: string[];
  el: HTMLElement;
  input: HTMLElement;

  constructor() {
    this.el = document.createElement("div");
    this.setAttributes(this.el, {
      class: "emails-input",
      role: "textbox",
    });
    this.input = this.createInputEl();
    this.el.appendChild(this.input);
    this.el.addEventListener("click", (ev) => {
      if ((ev.target as HTMLElement).className === "remove") {
        this.removeEmailBlock((ev.target as HTMLElement).parentElement);
      }
      this.input.focus();
    });
    return this;
  }

  createInputEl(): HTMLInputElement {
    const input = document.createElement("input");
    this.setAttributes(input, {
      type: "text",
      placeholder: "add more people...",
    });
    input.addEventListener("keydown", (evt) => {
      if (PROCESS_EMAIL_ON_KEY.indexOf(evt.key) > -1) {
        this.addEmailToList(this.trimValue(input.value));
        input.value = "";
        evt.preventDefault();
      }
      if (evt.key === "Backspace" && input.value === "") {
        this.removeEmailBlock(input.previousSibling as Element);
      }
    });
    input.addEventListener("blur", () => {
      this.addEmailToList(input.value);
      input.value = "";
    });
    input.addEventListener("paste", (evt) => {
      const pastedString = evt.clipboardData.getData("Text");
      pastedString.split(/[,\s;]/).forEach(this.addEmailToList.bind(this));
      event.preventDefault();
      input.value = "";
    });
    return input;
  }

  createEmailBlock(value: string): HTMLElement {
    const block = document.createElement("span");
    const sanitized = this.filterInput(value);
    this.setAttributes(block, {
      class: `email ${this.isValidEmail(value) ? "valid" : "invalid"}`,
      "data-value": sanitized,
    });
    const removeBtn = document.createElement("button");
    this.setAttributes(removeBtn, {
      class: "remove",
    });
    removeBtn.innerHTML = "&times;";
    block.innerHTML = sanitized;
    block.appendChild(removeBtn);
    return block;
  }

  removeEmailBlock(el: Element): void {
    this.el.removeChild(el);
  }

  getEmailBlocks(): Element[] {
    return Array.from(this.el.children).filter(
      (node: HTMLElement) =>
        node.ELEMENT_NODE === 1 && (node as HTMLElement).tagName !== "INPUT"
    );
  }

  isValidEmail(value: string): boolean {
    return /^[^@]+@[^\.]+\..+$/.test(value);
  }

  setAttributes(el: HTMLElement, attrs: object): void {
    Object.entries(attrs).map(([key, value]) => el.setAttribute(key, value));
  }

  trimValue(value: string): string {
    return value.trim().replace(/,$/, "");
  }

  addEmailToList(content: string): void {
    if (content.length === 0) {
      return;
    }
    // this.el.appendChild(this.createEmailBlock(content));
    this.el.insertBefore(this.createEmailBlock(content), this.input);
    this.input.focus();
    this.input.scrollIntoView();
    this.el.dispatchEvent(new Event("change"));
  }

  getEmails(): string[] {
    const emails: string[] = [];
    this.el.childNodes.forEach((node) => {
      if (
        node.ELEMENT_NODE === 1 &&
        (node as HTMLElement).tagName !== "INPUT"
      ) {
        emails.push((node as HTMLElement).getAttribute("data-value"));
      }
    });
    return emails;
  }

  replaceEmails(value: string | string[]): void {
    const emails = !Array.isArray(value) ? (value as string).split(",") : value;
    this.getEmailBlocks().forEach((el) => this.removeEmailBlock(el));
    emails.forEach(this.addEmailToList.bind(this));
  }

  filterInput(value: string): string {
    let str = value;
    Object.entries(filterChars).forEach(
      ([char, sub]) => (str = str.replace(RegExp(char, "g"), sub))
    );
    return str;
  }
}

function EmailsInput(
  container: HTMLElement,
  { ...options }
): MultipleEmailsInput {
  const input = new MultipleEmailsInput();
  container.appendChild(input.el);
  return input;
}
