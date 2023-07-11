# Multiple emails input

Input element for multiple emails.

![Multiple emails input screenshot](https://koshilki.github.io/multiple-emails-input/assets/example.png)

[live demo](https://koshilki.github.io/multiple-emails-input/index.html)

## Usage

#### Load script

```html
<script src="dist/emails-input.js"></script>
```

#### Instantiate

```html
<div id="emails-input"></div>
<script>
  const emailsInput = EmailsInput(document.getElementById("emails-input"));
</script>
```

#### Subscribe to changes

```js
document
  .getElementById("emails-input")
  .addEventListener("change", function (ev) {
    console.log(emailsInput.getEmails());
  });
```

#### Programmatically add email to the list

```js
emailsInput.addEmail("someone@somewhere.com");
```

#### Get all valid emails

```js
const validEmails = emailsInput.getEmails(true);
```

#### Get all invalid entries

```js
const invalidEmails = emailsInput.getEmails(false);
```

#### Get all entries - both valid and invalid

```js
const allEntries = emailsInput.getEmails();
```

#### Replace all the entries in the input

```js
emailsInput.replaceEmails([
  "someone@somewhere.com",
  "someone.else@somewhere.com",
]);
// or
emailsInput.replaceEmails("someone@somewhere.com,someone.else@somewhere.com");
```
