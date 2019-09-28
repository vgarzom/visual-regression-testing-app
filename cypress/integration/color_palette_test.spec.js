describe('color-palett', function () {
  it('Visits color-palette and generates colors twice', function () {
    cy.visit('https://vgarzom.github.io/color-generator/')
    cy.get('#generate_btn').click();
    cy.wait(500)
    cy.screenshot("first");
    cy.wait(500)
    cy.get('#generate_btn').click();
    cy.wait(500)
    cy.screenshot("second");
    cy.get('#clean_btn').click().end();
  })
})
