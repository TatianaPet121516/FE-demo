const pageUrl = "http://127.0.0.1:8080"

function successfullSubmit(name, email, phone, dateOfBirth){
  cy.get('#name').type(name);
    cy.get('#email').type(email);
    cy.get('#dateOfBirth').type(dateOfBirth);
    cy.get('#phone').type(phone);
    
    cy.contains('button', 'Submit').click();
}

describe('Website loads elements correctly', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  describe('Form loading', () => {
    // 1.1 Check that Registration title is displayed
    it('Display Registration form on load', () => {
      cy.get('h2').should('have.text', 'Registration Form')
    });

    // 1.2 Check that form is visible and empty
    it('Form is visible and fields are empty', () => {
      cy.get('#name').should('be.visible').should('have.value', '');
      cy.get('#email').should('be.visible').should('have.value', '');
      cy.get('#dateOfBirth').should('be.visible').should('have.value', '');
      cy.get('#gender').should('be.visible').should('have.value', 'Male');  // default value
    });

    // 1.2.1 Check that the "phone" line is visible and not empty
    it('"Phone" line is visible and not empty', () => {
      cy.get('#phone').should('be.visible').should('not.have.value', '');
    });

    // 1.3 Check that the Submit button is visible
    it('Display submit button on load', () => {
      cy.get('button').should('have.text', 'Submit')
      cy.contains('button', 'Submit')
    });

    // 1.4 The table is visible and empty
    it('The submitted info table is visible and empty initially', () => {
      cy.get('#infoTable').should('be.visible');
      cy.get('#infoTable tbody tr').should('have.length', 0);               // Table should be empty initially
    });
  });

})

describe('Submit functionality', () => {
  const name = 'Tanya';
  const email = 'tanya@gmail.com';
  let phone = '12345678';
  const dateOfBirth = '1990-01-01';
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  // 2. Happy path functionality
  it('Allows to fill data, submit and shows up in the table', () => {
    cy.get('#gender').select('Female');
    successfullSubmit(name, email, phone, dateOfBirth)

    // 2.2 The table contains the data I have sent
    cy.get('#infoTable tbody tr').should('have.length', 1);
    cy.get('#infoTable tbody tr td').eq(0).should('contain', name);
    cy.get('#infoTable tbody tr td').eq(1).should('contain', email);
    cy.get('#infoTable tbody tr td').eq(2).should('contain', phone);
    cy.get('#infoTable tbody tr td').eq(3).should('contain', dateOfBirth);
    cy.get('#infoTable tbody tr td').eq(4).should('contain', 'Female');
    cy.get('#infoTable tbody tr td').eq(5).should('contain', '34');
  });

    // 2.3 After submitting, the registration form gets emptied
  it('After submitting, the registration form gets emptied', () => {
    cy.get('#name').should('have.value', '');
    cy.get('#email').should('have.value', '');
    cy.get('#phone').should('not.have.value', '');
    cy.get('#dateOfBirth').should('have.value', '');
    cy.get('#gender').should('have.value', 'Male'); // default value
  });

  // 1.2.1 After submitting, the "phone" line is visible and not empty
   it('"Phone" line is visible and not empty', () => {
    cy.get('#phone').should('be.visible').should('not.have.value', '');
  });

  // 3. Edge cases
  it('Prevents submission with empty fields', () => {
    cy.get('button').click(); // Try to submit with empty fields
    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contains('Please fill out all fields.');
    });
  });

  it('Prevents submission with non-numeric phone number', () => {
    let phone = 'abc12345';
    successfullSubmit(name, email, phone, dateOfBirth);
    cy.get('#gender').select('Female');
    cy.get('button').click();

    cy.on('window:alert', (alertText) => {
      expect(alertText).to.contains('Phone number must just be numbers.');
    });
  });

  it('Highlights underage users with red background', () => {
    cy.get('#name').type('Jenny');
    cy.get('#email').type('jenny@gmail.com');
    cy.get('#phone').clear().type('98765432');
    cy.get('#dateOfBirth').type('2010-07-16'); // User under 18
    cy.get('#gender').select('Female');
    cy.get('button').click();

    // The table contains the data and the row is highlighted
    cy.get('#infoTable tbody tr').should('have.length', 1);
    cy.get('#infoTable tbody tr').should('have.class', 'underage');
  });
})