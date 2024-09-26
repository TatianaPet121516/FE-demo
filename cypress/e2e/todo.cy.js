const pageUrl = "https://todolist.james.am/"

describe('Website loads elements correctly', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  // 1.1 Check that Registration title is displayed
    it('Display To Do List on load', () => {
      cy.get('h1').should('have.text', 'To Do List')
    });

  // Check page load and UI elements
  describe('Todo List App', () => {
    it('should load the app and display key elements', () => {
      // Verify input field is visible
      cy.get('input.new-todo').should('be.visible');
    });
  });
});

// Add a new To-Do item
describe('Add new todo', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  it('should add a new task to the list', () => {
    const newTask = 'Buy groceries';

    // Type a new task in the input field and press Enter
    cy.get('input.new-todo').type(`${newTask}{enter}`);
    
    // Verify the new task is displayed in the list
    cy.get('.todo-list').should('contain', newTask);
  });
});

// Mark To-Do item as completed
describe('Complete a todo item', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })
  it('should mark a task as completed', () => {
    const newTask = 'Wash the dishes';

    // Add a new task
    cy.get('input.new-todo').type(`${newTask}{enter}`);
    
    // Mark the task as completed
    cy.get('.todo-list li').first().find('.toggle').click();
    
    // Verify that the task is marked as completed (check the class or strikethrough style)
    cy.get('.todo-list li.completed').should('contain', newTask);
  });


});

// Delete a To-Do item
describe('Delete a todo item', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  it('should delete a task from the list', () => {
    const newTask = 'Go for a walk';

    // Add a new task
    cy.get('input.new-todo').type(`${newTask}{enter}`);
    
    // Delete the task
    cy.get('.todo-list li').first(newTask).find('.destroy').click({ force: true });
    
    // Verify the task is removed from the list
    cy.get('.todo-list li').should('have.length', 0);
  });
});

// Edit an existing To-Do item
describe('Edit a todo item', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  it('should edit an existing task', () => {
    const oldTask = 'Read a book';
    const updatedTask = 'Read a novel';

    // Add a new task
    cy.get('input.new-todo').type(`${oldTask}{enter}`);
    
    // Double-click to edit the task
    cy.get('.todo-list li').contains(oldTask).dblclick();
    
    // Edit the task
    cy.get('.edit').clear().type(`${updatedTask}{enter}`);
    
    // Verify the updated task is displayed
    cy.get('.todo-list').should('contain', updatedTask);
  });

   it('should clear a todo item', () => {
    // Add a 2 new task 
    const task1 = 'Read a book';
    const task2 = 'Read a novel';
    cy.get('input.new-todo').type(`${task1}{enter}`);
    cy.get('input.new-todo').type(`${task2}{enter}`);

    // Verify the tasks is displayed in the list
    cy.get('.todo-list li').should('have.length', 2);
    
    // Press the Clear button
    cy.contains('Clear').click();
    
    // Verify the tasks still is displayed in the list
    cy.get('.todo-list li').should('have.length', 2);
  });
});

// Check task persistence
describe('Check task persistence', () => {
  beforeEach(() =>{
    cy.visit(pageUrl)
  })

  it('should persist tasks after reloading the page', () => {
    const persistentTask = 'Do laundry';

    // Add a new task
    cy.get('input.new-todo').type(`${persistentTask}{enter}`);
    
    // Reload the page
    cy.reload();
    
    // Verify the task is still there after reload
    cy.get('.todo-list').should('contain', persistentTask);
  });
});