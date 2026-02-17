import { test, expect } from "@playwright/test";

//Locate fields and inputs to be used for test cases
test.describe("Inputs page tests", () => {
  let displayButton,
    clearButton,
    numberInput,
    numberOutput,
    textInput,
    textOutput,
    passwordInput,
    passwordOutput,
    dateInput,
    dateOutput;

  test.beforeEach(async ({ page }) => {
    await page.goto("https://practice.expandtesting.com/inputs");

    displayButton = page.locator("#btn-display-inputs");
    clearButton = page.locator("#btn-clear-inputs");

    numberInput = page.locator("#input-number");
    numberOutput = page.locator("#output-number");

    textInput = page.locator("#input-text");
    textOutput = page.locator("#output-text");

    passwordInput = page.locator("#input-password");
    passwordOutput = page.locator("#output-password");

    dateInput = page.locator("#input-date");
    dateOutput = page.locator("#output-date");
  });

  //Helper functions
  //Input testing function
  async function checkInputField(inputElement, outputElement, value) {
    await inputElement.fill(value);
    await displayButton.click();
    await expect(outputElement).toHaveText(value);
  }

  //Validate Input type function
  async function validateInputType(inputElement, expectedInputType) {
    await expect(inputElement).toHaveAttribute("type", expectedInputType);
  }

  //FE Overflow function checker for div fields
  async function checkOverflow(element, name) {
    const scrollWidth = await element.evaluate((el) => el.scrollWidth);
    const clientWidth = await element.evaluate((el) => el.clientWidth);
    if (scrollWidth > clientWidth) {
      console.warn(
        `${name} overflows the visible area, this is causing a FE issue where text is not properly wrapped on ${name}`,
      );
    }
  }

  //Test Cases
  //Fields array
  const fields = [
    {
      name: "Number field",
      input: () => numberInput,
      output: () => numberOutput,
      type: "number",
      value: "12345678910",
      longValue: "1231231231231232123123123123123123123123123123",
    },
    {
      name: "Text field",
      input: () => textInput,
      output: () => textOutput,
      type: "text",
      value: "ABCDEFGHIJKL",
      longValue: "ABCDEFGHIJKLABCDEFGHIJKLABCDEFGHIJKLABCDEFGHIJKL",
    },
    {
      name: "Password field",
      input: () => passwordInput,
      output: () => passwordOutput,
      type: "password",
      value: "SecurePassw0rd123!",
      longValue: "SecurePassw0rd123!SecurePassw0rd123!SecurePassw0rd123!",
    },
    {
      name: "Date field",
      input: () => dateInput,
      output: () => dateOutput,
      type: "date",
      value: "2003-06-19",
    },
  ];

  //Test Case #1 - Input type validation and entry tests
  test.describe("Input Fields - Entry & Validation", () => {
    fields.forEach((field) => {
      test(`[${field.name}]`, async () => {
        await checkInputField(field.input(), field.output(), field.value);
        await validateInputType(field.input(), field.type);
      });
    });
  });

  //Test Case #2 - FE Overflow check
  test.describe("Input Fields - Long Input / Overflow", () => {
    fields
      .filter((field) => field.longValue)
      .forEach((field) => {
        test(`[${field.name}]`, async () => {
          await field.input().fill(field.longValue);
          await displayButton.click();
          await expect(field.output()).toHaveText(field.longValue);

          await checkOverflow(field.output(), `${field.name} output`);
        });
      });
  });
});
