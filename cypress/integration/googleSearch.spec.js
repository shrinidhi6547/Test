import "cypress-file-upload";

describe("google search", () => {
  before(() => {
    cy.fixture("googleData.json")
      .as("gd")
      .then((googleData) => {
        cy.visit("/");
        cy.url().should("include", googleData.url);
        cy.get('button[id="hpcta"]').should("be.visible");
      });
  });
  afterEach(() => {
    cy.go(-1);
  });
  it("search input verfication", () => {
    cy.fixture("googleData.json")
      .then((googleData) => {
        cy.get('[role="combobox"]')
          .should("be.empty")
          .type(googleData.searchKey)
          .type("{backspace}")
          .should("have.value", googleData.backSpaceCheck);
        cy.get('[aria-label="Clear"]').should("be.visible");
        cy.get('[role="combobox"]').clear();
        cy.get('[role="combobox"]')
          .should("be.empty")
          .type(googleData.searchKey, { timeout: 3000 })
          .then(() => {
            cy.get("li", { timeout: 3000 })
              .contains(googleData.searchKey)
              .click();
            cy.wait(3000);
          });
      });
  });
  it("Gmail", () => {
    cy.get("a")
      .contains("Gmail")
      .should("have.attr", "href", "https://mail.google.com/mail/&ogbl")
      .click();
    cy.url().should("include", "intl/en-GB/gmail/about/#");
  });
  it("image search by url", () => {
    cy.get('[id="gb"]')
      .contains("Images")
      .should("have.attr", "href", "https://www.google.co.in/imghp?hl=en&ogbl")
      .click();
    cy.location("pathname", { timeout: 60000 }).should("include", "/imghp");
    cy.get('[id="searchform"]').within(() => {
      cy.get('[role="combobox"]', { timeout: 3000 }).should("be.empty");
      cy.get('[aria-label="Search by voice"][role="button"]').should(
        "be.visible"
      );
      cy.get('[role="button"][aria-label="Search by image"]')
        .should("be.visible")
        .click()
        .then(() => {
          cy.get('[id="QDMvGf"]').within(() => {
            cy.get('input[id="Ycyxxc"]')
              .should("be.empty")
              .type(
                "https://www.google.com/doodles/first-day-of-school-2021-september-2"
              );
            cy.get('input[type="submit"]').click();
          });
        });
    });
  });
  it("upload image and search", () => {
    const image = "googledoodle.jpg";
    cy.get('[id="searchform"]').within(() => {
      cy.get('[role="combobox"]', { timeout: 3000 }).should("be.empty");
      cy.get('[aria-label="Search by voice"][role="button"]').should(
        "be.visible"
      );
      cy.get('[role="button"][aria-label="Search by image"]')
        .should("be.visible")
        .click()
        .then(() => {
          cy.get('[id="QDMvGf"]', { timeout: 3000 }).within(() => {
            cy.get("a", { timeout: 3000 })
              .contains("Upload an image")
              .should("have.attr", "href", "about:invalid#zClosurez")
              .click();
            cy.get('input[id="awyMjb"]', { timeout: 3000 }).attachFile(image, {
              timeout: 3000,
            });
            cy.wait(2000);
          });
          cy.url().should("include", "/search?tbs");
        });
    });
  });
});
