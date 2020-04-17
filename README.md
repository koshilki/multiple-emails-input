# Multiple emails input

Input element for multiple emails.

![Multiple emails input screenshot](https://koshilki.github.com/multiple-emails-input/assets/example.png)

[live demo](https://koshilki.github.io/multiple-emails-input/index.html)

## Usage

```html
<div id="emails-input"></div>

<script src="dist/emails-input.js"></script>
<script>
  // instantiate
  const emailsInput = EmailsInput(document.getElementById("emails-input"));

  // subscribe for changes
  document
    .getElementById("emails-input")
    .addEventListener("change", function (ev) {
      console.log(emailsInput.getEmails());
    });

  // programmatically add email to the list
  emailsInput.addEmail("someone@somewhere.com");

  // get all valid emails
  console.log(emailsInput.getEmails(true));

  // get all invalid entries
  console.log(emailsInput.getEmails(false));

  // or all entries - both valid and invalid
  console.log(emailsInput.getEmails());

  // replace all the entries in the input
  emailsInput.replaceEmails([
    "someone@somewhere.com",
    "someone.else@somewhere.com",
  ]);
  // or
  emailsInput.replaceEmails("someone@somewhere.com,someone.else@somewhere.com");
</script>
```
