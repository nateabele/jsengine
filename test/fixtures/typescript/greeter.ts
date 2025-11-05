// TypeScript file with type annotations
interface Person {
  firstName: string;
  lastName: string;
}

function greet(person: Person): string {
  return `Hello, ${person.firstName} ${person.lastName}!`;
}

// Export to global scope for testing
globalThis.greet = greet;

// Test with a typed object
const john: Person = { firstName: "John", lastName: "Doe" };
globalThis.testGreeting = greet(john);
