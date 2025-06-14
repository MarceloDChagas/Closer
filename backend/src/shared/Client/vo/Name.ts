export class Name {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string
  ) {
    if (!firstName || !lastName) {
      throw new Error("First name and last name cannot be empty");
    }
    if (firstName.length < 2 || lastName.length < 2) {
      throw new Error(
        "First name and last name must have at least 2 characters"
      );
    }
    if (firstName.length > 50 || lastName.length > 50) {
      throw new Error(
        "First name and last name must have at most 50 characters"
      );
    }
    if (
      !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(firstName) ||
      !/^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/.test(lastName)
    ) {
      throw new Error(
        "Names must contain only letters, spaces, apostrophes or hyphens"
      );
    }
  }
} 